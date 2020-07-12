//require all the external modules
const express = require('express');
const _ = require('lodash');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

const app = express();
const router = require('./routes/index');
//to tell express to make use of the static files in the public directory.
app.use(express.static(__dirname+'/public'));

//to parse the request
app.use(bodyParser.urlencoded({extended: true}));

//view engine ejs used for templating.
app.set('view engine', 'ejs');
app.use('/', router);

app.listen(3000, () => console.log('Server active on port 3000'));