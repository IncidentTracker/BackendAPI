const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); // to parse the incoming i/p json data..
const cors = require('cors');
// const cookieParser = require('cookie-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(cookieParser());

const loginRoutes = require('./Routes/login');
const incidentRoutes = require('./Routes/incident');
const signUpRoutes = require('./Routes/signUp');

app.use('/login', loginRoutes);
app.use('/incident', incidentRoutes);
app.use('/signUp', signUpRoutes);
app.use(cors());

mongoose.connect('mongodb://localhost/Rest', { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }, () => {
    console.log("connected to DB");
});

//LISTENING TO THE SERVER
app.listen(8000);