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
  launch.launchDate = new Date (launch.launchDate);
  addNewLaunches (launch);
  return res.status (200).json (launch);
}
module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
};
