const express = require('express'); //bring express

const mongoose = require('mongoose'); //bring mongoose

const bodyParser = require('body-parser');

const passport = require('passport');

const users = require('./routes/api/users');

const profile = require('./routes/api/profile');

const posts = require('./routes/api/posts');



const app = express(); //creating object of express

//Body parser middleware

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Database Config

const db = require('./config/config').mongoURI; //mongo URI Object

mongoose
    .connect(db,{ useNewUrlParser: true }) //passing db variable to connect function of mongoose
    .then(() => console.log('MongoDB Connected')) //.then() is called js promiss which is callback function
    .catch(err => console.log(err)); //catch function for catching error of the connection
// Passport Middleware
app.use(passport.initialize());

//Passport config

require('./config/passport')(passport);

//app.get('/', (req,res) => res.send('home page')); //creating home route by calling express class get ,get request

app.use('/api/users', users); //app.use is used create route which points to sub dir files

app.use('/api/profile', profile);

app.use('/api/posts', posts);


const port = process.env.PORT || 5000; //port setup 5000 for localhost || process.env.PORT for Deployment Server

app.listen(port, () => console.log(`Server running on port ${port}`)); //listen to port by using listen() from express.
