import path from "path";
import fs from "fs";
import dotenv from 'dotenv';
import { Worker } from "worker_threads";

dotenv.config({ path: '.env.local' });

function watchDirectory(directoryPath: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                console.error("Error reading directory:", err);
                reject(err);
                return;
            }
            const list = files.map(file => path.join(directoryPath, file));
            resolve(list);
        });
    });
}

function runWorkers(listOfFiles: string[], workers: Worker[], poolSize: number): void {
    const ollamaConfig = { host: process.env.OLLAMA_URL, model: process.env.OLLAMA_MODEL };
    const supaConfig = { url: process.env.SUPABASE_URL, apiKey: process.env.SUPABASE_KEY };

    while (listOfFiles.length > 0 && workers.length < poolSize) {
        console.log(`Starting worker for file: ${listOfFiles[0]}`);
        const file = listOfFiles.shift();

        if (!file) {
            console.log("No more files to process. Exiting.");
            break;
        }

        const worker = new Worker('./dist/workers/worker.js', { workerData: { ollamaConfig, supaConfig, file } });
        workers.push(worker);

        worker.on('message', (message: string) => {
            console.log(`Worker ${worker.threadId} finished processing:`, message);
        });

        worker.on('error', (error: string) => {
            console.error(`Worker ${worker.threadId} error:`, error);
            removeWorker()

            runWorkers(listOfFiles, workers, poolSize);
        });

        worker.on('exit', (code: string) => {
            console.log(`Worker ${worker.threadId} exited with code ${code}`);
            removeWorker()

            const fileName = path.basename(file);
            const filePath = path.dirname(file);
            const archivedPath = path.join(filePath, '../archived_files', fileName);

            fs.rename(file, archivedPath, (err) => {
                if (err) {
                    console.error(`Error moving file ${file} to archived_files:`, err);
                } else {
                    console.log(`Moved file ${file} to archived_files`);
                }
            });

            runWorkers(listOfFiles, workers, poolSize);
        });

        const removeWorker = () => {
            const index = workers.indexOf(worker);
            if (index > -1) {
                workers.splice(index, 1);
            }
        }
    }
}

function main(): void {
    const directory = './test_files';
    let listOfFiles: string[] = [];
    console.log("Directory to watch:", directory);

    watchDirectory(directory).then((files) => {
        listOfFiles = files;
        console.log("Initial file list:", listOfFiles);

        const poolSize = 2;
        const workers: Worker[] = [];

        console.log("Starting workers...");
        runWorkers(listOfFiles, workers, poolSize);

    }).catch((error) => {
        console.error("Error:", error);
    });
}

console.log("Starting OCR process...");
main();