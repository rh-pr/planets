const express = require ('server');

const app = express ();

const planetsRouter = require ('./routes/planets/planets.router');

//parse any incomming json
app.use (express.json ());
app.use (planetsRouter);

module.exports = app;
