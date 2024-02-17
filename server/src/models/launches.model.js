const launchesDataBase = require ('./launches.mongo');

const launches = new Map ();

let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: 'Kepler Exploration X',
  rocket: 'Explorer IS1',
  launchDate: new Date ('December 27, 2023'),
  target: 'Kepler-442 b',
  customers: ['ZTM', 'NASA'],
  upcoming: true,
  success: true,
};

saveLaunche (launch);

launches.set (launch.flightNumber, launch);

function existLaunchWithID (id) {
  return launches.has (id);
}

function getAllLaunches () {
  return launchesDataBase.find (
    {},
    {
      _id: 0,
      __v: 0,
    }
  );
}

async function saveLaunche (launch) {
  try {
    await launchesDataBase.updateOne (
      {
        flightNumber: launch.flightNumber,
      },
      launch,
      {
        upsert: true,
      }
    );
  } catch (err) {
    console.error (`Couldn't save launch ${err}`);
  }
}

function addNewLaunches (launch) {
  latestFlightNumber++;
  launches.set (
    latestFlightNumber,
    Object.assign (launch, {
      success: true,
      upcoming: true,
      customers: ['ZTM', 'NASA'],
      flightNumber: latestFlightNumber,
    })
  );
}

function abortLaunchByID (launchID) {
  const aborted = launches.get (launchID);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;
}

module.exports = {
  existLaunchWithID,
  getAllLaunches,
  addNewLaunches,
  abortLaunchByID,
};
