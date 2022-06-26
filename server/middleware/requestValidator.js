function requestValidator(req, res, next) {
  const { headers } = req;

  if (
    headers['user-agent'] !== 'AHC/2.1' ||
    headers['x-forwarded-for'] !== '34.132.127.197' ||
    headers.forwarded !== 'for="34.132.127.197";proto=https'
  ) {
    console.log('Blocked unauthorized request!');

    res.status(401);
    return res.send('Unauthorized requests!');
  }

  next();
}

export default requestValidator;
