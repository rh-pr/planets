const launchesDataBase = require ('./launches.mongo');
const planets = require ('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;

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

async function existLaunchWithID (id) {
  return await launchesDataBase.findOne ({
    flightNumber: id,
  });
}

async function getLatestFlightNumber () {
  const latestLunch = await launchesDataBase.findOne ().sort ('-flightNumber');
  if (!latestLunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLunch.flightNumber;
}

async function getAllLaunches () {
  return await launchesDataBase.find (
    {},
    {
      _id: 0,
      __v: 0,
    }
  );
}

async function saveLaunche (launch) {
  try {
    const planet = await planets.findOne ({
      keplerName: launch.target,
    });

    if (!planet) {
      throw new Error ("This planet don't exist in the database");
    }

    await launchesDataBase.findOneAndUpdate (
      {
        flightNumber: launch.flightNumber,
      },
      launch,
      {
        upsert: true,
      }
    );
  } catch (err) {
    console.error (`Couldn't save launch ${err} \n ${launch.target}`);
  }
}

async function scheduleNewLaunch (launch) {
  try {
    const newFlightNumber = (await getLatestFlightNumber ()) + 1;

    const newLaunch = Object.assign (launch, {
      success: true,
      upcoming: true,
      customers: ['ZTM', 'NASA'],
      flightNumber: newFlightNumber,
    });

    await saveLaunche (newLaunch);
  } catch (err) {
    console.log (`Couldn't add new launch ${err}`);
  }
}

async function abortLaunchByID (launchID) {
  const aborted = await launchesDataBase.updateOne (
    {
      flightNumber: launchID,
    },
    {
      upcoming: false,
      success: false,
    }
  );

  return aborted.modifiedCount === 1;
  // return aborted.ok === 1 && aborted.nModified === 1;
}

module.exports = {
  existLaunchWithID,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchByID,
};
