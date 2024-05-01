const http = require ('http');

require ('dotenv').config ();

const app = require ('./app');
const mongoose = require ('mongoose');

const {mongoConnect} = require ('../src/services/mongo');
const {loadPlanetsData} = require ('./models/planets.model');
const {loadLaunchData} = require ('./models/launches.model');
//check if server admiistrator specify port
const PORT = process.env.PORT || 8000;
loadLaunchData;
const server = http.createServer (app);

async function startServer () {
  await mongoConnect ();
  await loadPlanetsData ();
  await loadLaunchData ();
  server.listen (PORT, () => {
    console.log (`Listening on port ${PORT}`);
  });
}

startServer ();
