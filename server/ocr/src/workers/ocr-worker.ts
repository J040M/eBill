import { createWorker } from "tesseract.js";

async function ocrWorker(filePath: string): Promise<string> {
    console.log(`OCR file: ${filePath}`);

    const ocrWorker = await createWorker('deu')
    const result = await ocrWorker.recognize(filePath)

    console.log('Terminating OCR worker...')
    await ocrWorker.terminate()

    return result.data.text
}

export default ocrWorker