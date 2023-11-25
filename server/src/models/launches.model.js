const launches = new Map ();

let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: 'Kepler Exploration X',
  rocket: 'Explorer IS1',
  launchDate: new Date ('December 27, 2023'),
  destination: 'Kepler-442 b',
  customer: ['ZTM', 'NASA'],
  upcoming: true,
  success: true,
};

launches.set (launch.flightNumber, launch);

function getAllLaunches () {
  return Array.from (launches.values ());
}

function addNewLaunches (launch) {
  latestFlightNumber++;
  launches.set (
    latestFlightNumber,
    Object.assign (launch, {
      success: true,
      upcoming: true,
      customer: ['ZTM', 'NASA'],
      flightNumber: latestFlightNumber,
    })
  );
}
module.exports = {
  getAllLaunches,
  addNewLaunches,
};
