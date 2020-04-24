// .env initialize
require('dotenv').config();

// express
const express = require('express');
const app = new express();

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

const cookieParser = require("cookie-parser");
app.use(cookieParser());



// declare API methods
require('./api')(app);


// run server listener
const listener = app.listen(process.env.PORT, () => {
    console.log(`Server is listening on the port ${listener.address().port}`);
});