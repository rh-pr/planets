const {
  getAllLaunches,
  addNewLaunches,
} = require ('../../models/launches.model');

function httpGetAllLaunches (req, res) {
  return res.status (200).json (getAllLaunches ());
}

function httpAddNewLaunch (req, res) {
  // because in app we have use(express.json()) middleware
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.destination
  ) {
    return res.status (400).json ({
      error: 'Missing required launch property',
    });
  }

  if (isNaN (launch.launchDate)) {
    return res.status (400).json ({
      error: 'Invalid launch date',
    });
  }

  launch.launchDate = new Date (launch.launchDate);
  addNewLaunches (launch);
  return res.status (200).json (launch);
}
module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
};
