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

// compress all responses
const compression = require('compression');
app.use(compression());

// body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




// declare API methods
require('./API/authAPI')(app);
require('./API/usersAPI')(app);
require('./API/tilsAPI')(app);
require('./API/tagsAPI')(app);
require('./API/statisticsAPI')(app);


// run server listener
const options = {
    key: fs.readFileSync(`${process.env.CERT_PATH}/private.key`),
    cert: fs.readFileSync(`${process.env.CERT_PATH}/certificate.crt`),
    ca: fs.readFileSync(`${process.env.CERT_PATH}/ca_bundle.crt`)
};
const httpsServer = https.createServer(options, app);
const listener = httpsServer.listen(process.env.PORT, () => {
    console.log(`Server is listening on the port ${listener.address().port}`);
});