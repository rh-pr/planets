const planets = require ('../../models/planets.model');

function getAllPlanets (req, res) {
  console.log (req);
  return res.status (200).json (planets); // using the return to make sure that our function stops executing and only one response is ever set.
}

module.exports = {
  getAllPlanets,
};
