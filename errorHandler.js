const jsonErrorHandler = (err, req, res, next) => {
    console.error(err);
    console.log('Error Handler');
    res.status(505).send({ error: err });
  }

module.exports = jsonErrorHandler;