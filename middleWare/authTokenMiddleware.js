module.exports.authTokenMiddleware = (req, res, next) => {
  if (req.header('X-Auth-Token') && req.header('X-Auth-Token') === 'not_so_secret_key') {
    next();
  } else {
    // return unauthorized
    res.status(401).send('Unauthorized');
  }
};
