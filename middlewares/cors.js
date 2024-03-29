module.exports.corsConfig = {
  origin: [
    'http://localhost:3000',
    'https://diplom.efimova.nomoredomains.work',
    'http://diplom.efimova.nomoredomains.work',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'Origin', 'Referer', 'Accept', 'Authorization'],
  credentials: true,
};
