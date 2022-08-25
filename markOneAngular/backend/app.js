const express = require('express');

const app = express();

app.use((req, res, next) => {
  console.log("First Middleware...");
  // next();
});

app.use((req, res, next) => {
  res.send("Hello from 2nd use");
});

module.exports = app;
