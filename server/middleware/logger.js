function logger(req, res, next) {
  const { method, url, headers, body } = req;
  console.log({ method, url, headers, body: JSON.stringify(body) });
  next();
}

export default logger;
