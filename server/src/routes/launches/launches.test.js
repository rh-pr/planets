const request = require ('supertest');
const app = require ('../../app');

const {mongoConnect, mongoDisconnect} = require ('../../services/mongo');
const { loadPlanetsData } = require('../../models/planets.model');

describe ('Launches API', () => {
  beforeAll (async () => {
    await mongoConnect ();
    await loadPlanetsData ();
  });

  afterAll (async () => {
    await mongoDisconnect ();
  });

  describe ('Test GET launches', () => {
    test ('It should respond with 200 seuccess', async () => {
      const respons = await request (app)
        .get ('/v1/launches')
        .expect ('Content-Type', /json/)
        .expect (200);
    });
  });

  describe ('Test POST launches', () => {
    const launchDataWithoutDate = {
      mission: 'USS Enterprice',
      rocket: 'NCC 1701-D',
      target: 'Kepler-62 f',
    };

    const complateLauchData = {
      mission: 'USS Enterprice',
      rocket: 'NCC 1701-D',
      target: 'Kepler-62 f',
      launchDate: 'January 4, 2024',
    };

    const launchDataWithInvalideDate = {
      mission: 'USS Enterprice',
      rocket: 'NCC 1701-D',
      target: 'Kepler-62 f',
      launchDate: 'opla',
    };

    test ('It should respond with 201 created', async () => {
      const respons = await request (app)
        .post ('/v1/launches')
        .send (complateLauchData)
        .expect ('Content-Type', /json/)
        .expect (201);

      const responsDate = new Date (respons.body.launcDate).valueOf ();
      const requestDate = new Date (complateLauchData.launcDate).valueOf ();

      expect (responsDate).toBe (requestDate);

      expect (respons.body).toMatchObject (launchDataWithoutDate);
    });

    test ('It should be catch missing required properties', async () => {
      const respons = await request (app)
        .post ('/v1/launches')
        .send (launchDataWithoutDate)
        .expect ('Content-Type', /json/)
        .expect (400);

      expect (respons.body).toStrictEqual ({
        error: 'Missing required launch property',
      });
    });

    test ('It should be catch invalied dates', async () => {
      const respons = await request (app)
        .post ('/v1/launches')
        .send (launchDataWithInvalideDate)
        .expect ('Content-Type', /json/)
        .expect (400);

      expect (respons.body).toStrictEqual ({
        error: 'Invalid launch date',
      });
    });
  });
});
