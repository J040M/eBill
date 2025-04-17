# Usage
Use model files to modify and customize a model

### Commands

Show the contents of the modelfile of a basic model:
```
$ ollama show <model_name> --modelfile 
```

Create a custom model using your modelfile
```
$ ollama create <model_name> --file your_file.modelfile
```