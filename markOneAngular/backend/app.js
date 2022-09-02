const express = require('express');
const par = require('body-parser');
const mong = require('mongoose');
const cors = require('cors');

const postsRoute = require('./routes/posts');

const app = express();

app.use(cors());

mong.connect('mongodb+srv://abhi:**bB015954@cluster0.ltkuxpl.mongodb.net/node-angular-app?retryWrites=true&w=majority')
.then(() => {
  console.log("Connected to Mongo....");
})
.catch(() => {
  console.log("Connection failed....");
});

app.use(par.json());
app.use(par.urlencoded({ extended: false }));

// app.use((req, res, next) => {
//   res.setHeader(
//     'Access-Control-Allow-Origin', "*");
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     "Origin, X-Requested-With, Content-Type, Accept");
//   res.setHeader(
//     'Access-Control-Allow-Methods',
//     "GET, POST, PATCH, DELETE, OPTIONS");
//   next();
// })

app.use("/api/posts", postsRoute);

module.exports = app;
