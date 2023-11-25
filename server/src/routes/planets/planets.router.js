const express = require ('express');

const {httpGetAllPlanets} = require ('./planets.controller');

const planetsRouter = express.Router ();

// '/' - means that planetRouter get take path from
//       root (app.js)
planetsRouter.get ('/', httpGetAllPlanets);

module.exports = planetsRouter;
