const mongoose = require('mongoose');
const isEmaill = require('validator/lib/isEmail');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmaill(v),
      message: 'неправельный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    selector: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

module.exports =mongoose.model('user', userSchema);
