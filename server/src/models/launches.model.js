const axios = require ('axios');

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

const SPACE_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function populateLaunches () {
  const response = await axios.post (SPACE_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1,
          },
        },
        {
          path: 'payloads',
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.log ('Problem downloading launches...');
    throw new Error ('Launch data download failed...');
  }

  const launchDocs = response.data.docs;

  for (const launchDoc of launchDocs) {
    const payloads = launchDoc['payloads'];

    const customers = payloads.flatMap (payload => {
      return payload['customers'];
    });

    const launch = {
      flightNumber: launchDoc['flight_number'],
      mission: launchDoc['name'],
      rocket: launchDoc['rocket']['name'],
      launchDate: launchDoc['date_local'],
      upcoming: launchDoc['upcoming'],
      success: launchDoc['success'],
      customers: customers,
    };
    console.log (`castomers: ${launch.mission}`);
    saveLaunche (launch);
  }
}

async function loadLaunchData () {
  const firstLaunch = await findLaunch ({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat',
  });
  if (firstLaunch) {
    console.log ('Launch data already loaded');
    return;
  } else {
    await populateLaunches ();
  }
}

async function findLaunch (filter) {
  return await launchesDataBase.findOne (filter);
}

async function existLaunchWithID (launchId) {
  return await findLaunch ({
    flightNumber: launchId,
  });
}

async function getLatestFlightNumber () {
  const latestLunch = await launchesDataBase.findOne ().sort ('-flightNumber');
  if (!latestLunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLunch.flightNumber;
}

async function getAllLaunches (skip, limit) {
  return await launchesDataBase
    .find (
      {},
      {
        _id: 0,
        __v: 0,
      }
    )
    .skip (skip)
    .limit (limit);
}

async function saveLaunche (launch) {
  await launchesDataBase.findOneAndUpdate (
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

async function scheduleNewLaunch (launch) {
  try {
    const planet = await planets.findOne ({
      keplerName: launch.target,
    });

    if (!planet) {
      throw new Error ("This planet don't exist in the database");
    }

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
  loadLaunchData,
  existLaunchWithID,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchByID,
};
