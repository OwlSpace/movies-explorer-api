const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user');
const { OK, saltRound } = require('../constants');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

const createNewUser = (req, res, next) => {

  const { name, email, password, } = req.body;

  return bcrypt.hash(password, saltRound)
    .then((hash) => userModel.create({
      name, email, password: hash,
    }))
    .then((user) => {
      res.status(OK).send({
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Некоректные данные'));
      }
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с таким email-адресом уже существует'));
      }
      return next(err);
    });
};

const authorization = (req, res, next) => {

  const { email, password } = req.body;

  return userModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' })
        res.cookie('authorization', token, {
          maxAge: 3600000 * 24 * 7,
          sameSite: 'none',
          secure: true,
        });
      res.send( { token });
    })
    .catch(() => {
      next(new  UnauthorizedError('Неправильная почта или пароль'));
    });
};

const signout = (req, res) => res.clearCookie('authorization', { sameSite: 'none', secure: true }).send({ message: 'Выход' });

const getUserInfo = (req, res, next) => {
  userModel.findById(req.res.user._id)
    .then((user) => {

      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return res.status(OK).send({
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => next(err));
};

const updateUserInformation = (req, res, next) => {

  const  { name, email } = req.body;

  userModel.findByIdAndUpdate(req.res.user._id, { name, email }, { returnDocument: 'after', runValidators: true })
    .then((user) => {
      res.send({
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Некоректные данные'));
      }
      return next(err);
    });
}

module.exports = {
  createNewUser,
  authorization,
  signout,
  getUserInfo,
  updateUserInformation,
};
