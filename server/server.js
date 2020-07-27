// .env initialize
require('dotenv').config();

// express
const express = require('express');
const app = new express();
const https = require('https');
const fs = require('fs');

// cors
const cors = require('cors');
app.use(cors());
app.options('*', cors());

// secure with helmet
const helmet = require('helmet');
app.use(helmet());

// compress all responses
const compression = require('compression');
app.use(compression());

// body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// logging
const logger = require('./logger');
app.use((req, res, next) => {
    logger.trace(req.originalUrl);
    next();
});




// declare API methods
require('./API/authAPI')(app);
require('./API/usersAPI')(app);
require('./API/tilsAPI')(app);
require('./API/tagsAPI')(app);
require('./API/statisticsAPI')(app);

const isLocal = process.env.ENV == 'local';

// run server listener
if (isLocal) {
    const listener = app.listen(process.env.PORT, () => {
        console.log(`Server is listening on the port ${listener.address().port}`);
        logger.important(`Server is listening on the port ${listener.address().port}`);
    });
} else {
    const options = {
        key: fs.readFileSync(`${process.env.CERT_PATH}/private.key`),
        cert: fs.readFileSync(`${process.env.CERT_PATH}/certificate.crt`),
        ca: fs.readFileSync(`${process.env.CERT_PATH}/ca_bundle.crt`)
    };
    const httpsServer = https.createServer(options, app);
    const listener = httpsServer.listen(process.env.PORT, () => {
        console.log(`Server is listening on the port ${listener.address().port}`);
        logger.important(`Server is listening on the port ${listener.address().port}`);
    });
}

