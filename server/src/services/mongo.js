const mongoose = require ('mongoose');

const MONGO_URL =
  'mongodb+srv://nasa-api:aJLd8EJ6K99jZ1L1@nasacluster.quv3ein.mongodb.net/?retryWrites=true&w=majority';

mongoose.connection.once ('open', () => {
  console.log ('MongoDB connected');
});

mongoose.connection.on ('open', err => {
  console.error (err);
});

async function mongoConnect () {
  await mongoose.connect (MONGO_URL);
}

async function mongoDisconnect () {
  await mongoose.disconnect (MONGO_URL);
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
};
