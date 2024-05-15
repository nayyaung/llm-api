# llm-api
 Backend API for LLM RAG test

This API demonstrates LLM usage to introduce the author's profession and career history.

This API application uses Google Vertex AI (Gemini) LLM and feed the author's CV as embeddings.

Note: credentials and CV are not included in the codebase. Add or change it accordingly if the application is required to run on your local environment.


### To build
```
make build
```

### To build and push to google cloud artifact registry
```
make push-gcp
```

### To deploy on local OpenShift Cluster
```
make deploy-k8s
```