function requestValidator(req, res, next) {
  const { headers } = req;

  if (
    headers['user-agent'] !== 'AHC/2.1' ||
    headers['x-forwarded-for'] !== '35.224.231.117' ||
    headers.forwarded !== 'for="35.224.231.117";proto=https'
  ) {
    console.log('Blocked unauthorized request!');

    res.status(401);
    return res.send('Unauthorized requests!');
  }

  next();
}

export default requestValidator;
