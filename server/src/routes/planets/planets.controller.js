const {getAllPlanets} = require ('../../models/planets.model');

function httpGetAllPlanets (req, res) {
  console.log (req);
  return res.status (200).json (getAllPlanets ()); // using the return to make sure that our function stops executing and only one response is ever set.
}

module.exports = {
  httpGetAllPlanets,
};
