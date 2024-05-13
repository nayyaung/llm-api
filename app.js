
const express = require('express');
const cors = require('cors');
const jsonErrorHandler = require('./errorHandler');
const router = require('./routes/routers');
const apiKeyMiddleware = require('./controller/auth-middleware');

require('dotenv').config();
 
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(apiKeyMiddleware);
app.use("/", router);

app.use(jsonErrorHandler);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`LLM API v1.0.0 is running on port ${port}`);
    console.log(`http://localhost:${port}`);
});