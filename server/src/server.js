const http = require ('http');
const app = require ('./app');
const mongoose = require ('mongoose');

const {mongoConnect} = require ('../src/services/mongo');
const {loadPlanetsData} = require ('./models/planets.model');

//check if server admiistrator specify port
const PORT = process.env.PORT || 8000;

const server = http.createServer (app);

async function startServer () {
  await mongoConnect ();
  await loadPlanetsData ();
  server.listen (PORT, () => {
    console.log (`Listening on port ${PORT}`);
  });
}

startServer ();
