module.exports = (app) => {
  app.get('/example-plugin', (req, res) => {
    res.send(200);
  });
};
