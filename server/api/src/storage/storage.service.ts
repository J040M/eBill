import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StorageService {

    constructor() { }

    uploadFile(file: any) {
        const acceptedFileTypes = ['image/jpeg', 'image/png', 'image/heif', 'application/pdf', 'application/xml'];

        if (!acceptedFileTypes.includes(file.mimetype)) {
            throw new Error('Invalid file type');
        }
        return { message: 'File uploaded successfully', filePath: file.path };
    }

    storeFile(file: string): void {
        const archivePath = path.join(__dirname, '..', 'archive');
        if (!fs.existsSync(archivePath)) {
            fs.mkdirSync(archivePath, { recursive: true });
        }

        const filePath = path.join(__dirname, '..', 'storage', file);
        if (fs.existsSync(filePath)) {
            const archiveFilePath = path.join(archivePath, file);
            fs.renameSync(filePath, archiveFilePath);
        }
    }

    archiveFiles(files: string[]): void {
        const archivePath = path.join(__dirname, '..', 'archive');
        if (!fs.existsSync(archivePath)) {
            fs.mkdirSync(archivePath, { recursive: true });
        }

        files.forEach((file) => {
            const filePath = path.join(__dirname, '..', 'storage', file);
            if (fs.existsSync(filePath)) {
                const archiveFilePath = path.join(archivePath, file);
                fs.renameSync(filePath, archiveFilePath);
            }
        });
    }
}
