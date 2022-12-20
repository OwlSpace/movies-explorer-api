const movieModel = require('../models/movie');
const { OK } = require('../constants');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const getMoviesUser = (req, res, next) => {

  const owner = req.res.user._id;

  movieModel.find({ owner })
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);

};

const createMovie = (req, res, next) => {

  const owner = req.res.user._id;

  movieModel.create({ owner, ...req.body })
    .then((movie) => {
      res.status(OK).send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('400 - Некоректные данные'));
      }
      return next(err);
    });
};

const deleteMovie = (req, res, next) => {
  movieModel.findById(req.params.id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Такого фильма нет');
      }
      if (!movie.owner.equals(req.res.user._id)) {
        throw new ForbiddenError('Нельзя удалить фильм который добавили не вы');
      }
      return movie.remove().then(() => res.status(OK).send(movie));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Передан неправельный id фильма'));
      }
      return next(err);
    });
};

module.exports = {
  getMoviesUser,
  createMovie,
  deleteMovie,
}
