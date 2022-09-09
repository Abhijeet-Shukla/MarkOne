const express = require('express');
const par = require('body-parser');
const mong = require('mongoose');
const cors = require('cors');
const path = require("path");

const postsRoute = require('./routes/posts');

const app = express();

app.use(cors());
app.use("/images", express.static(path.join("backend/images")));

mong.connect('<mongo connection url for your cluster>')
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
