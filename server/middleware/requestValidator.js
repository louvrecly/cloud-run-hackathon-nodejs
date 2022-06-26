function requestValidator(req, res, next) {
  if (req.headers['user-agent'] !== 'AHC/2.1') {
    console.log('Blocked unauthorized request!');

    res.status(401);
    return res.send('Unauthorized requests!');
  }

  next();
}

export default requestValidator;
