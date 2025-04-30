import { workerData, parentPort } from "worker_threads";
import ocrWorker from './ocr-worker.js';
import ollamaWorker from './ollama-worker.js';
import supaWorker from './supa-worker.js';

import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const config = workerData as { ollamaConfig: any, supaConfig:any , file: string };

if(!config) {
    throw new Error('No config provided')
}

async function dispatcherWorker(): Promise<void> {
    const ocrResult = await ocrWorker(config.file)
    const ollamaResult = await ollamaWorker(config.ollamaConfig, ocrResult)
    await supaWorker(config.supaConfig, ollamaResult)

    parentPort?.postMessage(`File processed`)
}

dispatcherWorker()
