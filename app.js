const express = require('express');
const mongoose = require('mongoose');
const validator = require('validator');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
});


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});