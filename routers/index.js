const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const {
  createNewUser,
  authorization,
  signout,
} = require('../controllers/users');

const usersRouter = require('../routers/users');
const moviesRouter = require('../routers/movies');
const errorRouter = require('../routers/error');
const auth = require('../middlewares/auth');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message('Некорректный email');
    }),
    password: Joi.string().required(),
  }),
}), authorization);

  router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message('Некорректный email');
    }),
    password: Joi.string().required(),
  }),
}), createNewUser);

// router.use(auth);

router.use('/users', usersRouter);
router.use('/movies', moviesRouter);
router.post('/signout', signout);
router.use('*', errorRouter);

module.exports = router;
