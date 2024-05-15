
const express = require('express');
const cors = require('cors');
const jsonErrorHandler = require('./errorHandler');
const router = require('./routes/routers');
const apiKeyMiddleware = require('./controller/auth-middleware');
const app = express();

require('dotenv').config();

const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
    }
}

app.use(cors(corsOptions));

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