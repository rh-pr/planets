const http = require ('http');
const app = require ('./app');
const mongoose = require ('mongoose');

const {loadPlanetsData} = require ('./models/planets.model');

//check if server admiistrator specify port
const PORT = process.env.PORT || 8000;

const MONGO_URL =
  'mongodb+srv://nasa-api:aJLd8EJ6K99jZ1L1@nasacluster.quv3ein.mongodb.net/?retryWrites=true&w=majority';

const server = http.createServer (app);

mongoose.connection.once ('open', () => {
  console.log ('MongoDB connected');
});

mongoose.connection.on ('open', err => {
  console.error (err);
});

async function startServer () {
  await mongoose.connect (MONGO_URL);
  await loadPlanetsData ();
  server.listen (PORT, () => {
    console.log (`Listening on port ${PORT}`);
  });
}

startServer ();
