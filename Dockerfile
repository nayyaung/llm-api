FROM node:22.1.0-alpine3.19
WORKDIR /app

ENV PORT=3001
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/credentials.json
ENV CV_FILE_PATH=/app/NayYaung_CV_2024_JK.docx

# In a production environment, it would have been a secret (k8s or docker swarm or any cloud secret api such as google secret-manager)
ENV API_KEY=AIzaSyD12

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