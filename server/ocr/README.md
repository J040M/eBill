### How it works

- Watch a folder
- Create a pool of workers for multi threads
- Dispatch the files between the workers
- Worker:
    - Read the contents of the file using OCR
    - Get the contents and parse them to defined schema using Ollama
    - Save the parsed bill to DB

## Config

Use .env file to configure the folder to be watched, ollama server, supabase