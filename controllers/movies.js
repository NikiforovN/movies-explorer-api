const { NotFound } = require('../errors/NotFoundError');
const { BadRequest } = require('../errors/BadRequestError');
const { Forbidden } = require('../errors/ForbiddenError');
const Movie = require('../models/Movie');

const getMovies = (req, res, next) => {
  const userWhoSavedMovie = req.user._id;
  Movie.find({ owner: userWhoSavedMovie })
    .then((movies) => {
      res.send(movies);
    })
    .catch((err) => next(err));
};

const deleteMovie = (req, res, next) => {
  const id = req.params.movieId;
  const currentUserId = req.user._id;

  Movie.findById(id)
    .then((movie) => {
      if (!movie) {
        throw new NotFound();
      }
      if (movie.owner.toHexString() !== currentUserId) {
        throw new Forbidden();
      }
      return movie.remove().then(() => res.send({ message: 'OK' }));
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new BadRequest('Id is not correct'));
      }
      next(err);
    });
};

const createMovie = (req, res, next) => {
  const id = req.user._id;
  const { name, link } = req.body;

  Movie.create({ name, link, owner: id })
    .then((movie) => {
      res.send({ data: movie });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const fields = Object.keys(err.errors).join(', ');
        return next(new BadRequest(`${fields} is not correct`));
      }
      return next(err);
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
