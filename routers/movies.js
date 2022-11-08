const moviesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { LINK_VALID } = require('../constants');

const {
  getMoviesUser,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

moviesRouter.get('/', getMoviesUser);

moviesRouter.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom((value, helpers) => {
      if (LINK_VALID.test(value)) {
        return value;
      }
      return helpers.message('Некорректная ссылка');
    }),
    trailerLink: Joi.string().required().custom((value, helpers) => {
      if (LINK_VALID.test(value)) {
        return value;
      }
      return helpers.message('Некорректная ссылка');
    }),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (LINK_VALID.test(value)) {
        return value;
      }
      return helpers.message('Некорректная ссылка');
    }),
    movieId: Joi.number().required(),
  }),
}), createMovie);

moviesRouter.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().required(),
  }),
}), deleteMovie);

module.exports = moviesRouter;