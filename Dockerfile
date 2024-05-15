FROM node:22.1.0-alpine3.19
WORKDIR /app

ENV PORT=3001

# Path to the google application credentials for vertex ai llm model
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/credentials.json
# Path to the cv file to use in RAG
ENV CV_FILE_PATH=/app/NayYaung_CV_2024_JK.docx
# Api key for react client to access this backend api. NOT the api key for google vertex ai
ENV API_KEY=AIzaSyD12

ENV ALLOWED_ORIGINS=https://llm-chat-ui-4z2z62ou5a-as.a.run.app

RUN apk add --update python3 make g++\
   && rm -rf /var/cache/apk/*

RUN chown -R node:node /app

USER node

COPY --chown=node:node package*.json ./

RUN npm install

COPY --chown=node:node . .

RUN chmod -R 777 /app/data

COPY --chown=node:node ./credentials.json ./credentials.json
COPY --chown=node:node ./NayYaung_CV_2024_JK.docx ./NayYaung_CV_2024_JK.docx

EXPOSE 3001

CMD [ "npm", "start" ]