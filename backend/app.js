const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const postsRoutes = require('./routes/post');
const userRoutes = require('./routes/user');

mongoose.connect("mongodb+srv://andreja5:" + process.env.MONGO_ATLAS_PW + "@cluster0-snyh1.mongodb.net/test", {useNewUrlParser: true})
  .then(() => {
    console.log('Konektovano na bazu!');
  })
  .catch(error => {
    console.log(error);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/slike', express.static(path.join('slike')));
app.use('/', express.static(path.join('angular')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  next();
})

app.use("/posts", postsRoutes);
app.use('/user', userRoutes);
app.use((req, res, next) => {
  res.sendFile(__dirname, path.join("angular", "index.html"));
})

module.exports = app;