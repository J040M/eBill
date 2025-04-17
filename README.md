# eBill
Bill digitalization program.

# Description
The eBill project is a solution for bill digitalization.

- Server
    - Api
    - Models
    - OCR (Data ingestion)
- App
    - Mobile

# Getting started
## Prerequisites
 - Tesseract
 - Ollama
 - Supabase
 - Node.js
 - Nest.JS
 - PostgreSQL

 Tesseract does the Optical Character Recognition. Ollama is used to run the models. The models are used to retrieve and structure the bill data. The quality of the structure results depend on the model and model-size. Run the OCR/Data-ingestion against a test_folder/ to test the results. Supabase for Postgres and Authentication. The migrations can also be run separate from Supabase, and the migrations include a (basic) Users table for those cases.

## TechStach
 - Ollama
 - Tesseract
 - Supabase
 - Node.js
 - React-Native
 - Vue
