const express = require('express');
const app = express()
require("dotenv").config();
const PORT = process.env.PORT || 4000;
const bodyParser = require('body-parser')
const { Pool, Client } = require('pg')
const {check, validationResult} = require('express-validator');
const urlencodedParser = bodyParser.urlencoded({ extended: false })

var session = require('express-session')
var passport = require('passport')
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "passwordkeeper",
    password: process.env.p,
    port: 5432
});


const bcrypt = require('bcrypt');
const saltRounds = 10;
app.use(express.static(`${__dirname}/../frontend`));
app.use(session({
  secret: 'pbdydjswbswiws',
  resave: false,
  saveUninitialized: false,
  //cookie: { secure: true }
}))
app.use(passport.initialize());
app.use(passport.session());
app.get('/', function (req, res) {
   res.sendFile("login.html", { root: `${__dirname}/../frontend/` });
})
app.post('/register',urlencodedParser, (req, res) => {
let {full_name,email,password,password2}=req.body;
const salt = bcrypt.genSaltSync(saltRounds);
const myhashpass = bcrypt.hashSync(password, salt);
console.log(myhashpass);
let values = [full_name, email, myhashpass]
let quer = 'INSERT INTO register(full_name,email, password)values($1, $2, $3)';
pool.query(quer, values, (err, res) => {
console.log(err, res)
//pool.end();
})
res.sendFile("login.html", { root: `${__dirname}/../frontend/` });
})


app.post('/login', urlencodedParser, (req, res) => {
let email = req.body.email;
let password = req.body.password;
let values =[email]
var myhashpass;
let quer = 'SELECT password,id from register where email = $1';
pool.query(quer,values,(err,result) =>{
console.log(err,"f")
console.log("result",result)
myhashpass = result.rows[0].password
const user_id = result.rows[0].id
const matches = bcrypt.compareSync(password, myhashpass);
if (matches) {
res.sendFile("dashboard.html", { root: `${__dirname}/../frontend/` } );
console.log(req.user);
console.log(req.isAuthenticated());
} else {
res.send('error');
}
//pool.end();
  })
})

passport.serializeUser(function(user_id, done) {
  done(null, user_id);
});
passport.deserializeUser(function(user_id, done) {
  done(null, user_id);
});


app.listen(PORT, function(){
  console.log("server is listening");
});
