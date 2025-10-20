const request = require('supertest');
const express = require('express');
const routes = require('../src/routes');
const db = require('../src/db');
const initDatabase = require('../src/database');

const app = express();
app.use(express.json());
app.use('/api', routes);

describe('POST /api/bookings/reserve', () => {
  beforeAll(async () => {
    await initDatabase();
  });

  beforeEach(async () => {
    // Clear the bookings table before each test
    await db.query('TRUNCATE TABLE bookings RESTART IDENTITY');
  });

  afterAll(async () => {
    // Clear the bookings and events tables after all tests
    await db.query('TRUNCATE TABLE bookings, events RESTART IDENTITY');
    // Close the database connection
    const pool = db.getPool();
    await pool.end();
  });

  it('should book a seat for a user', async () => {
    const res = await request(app)
      .post('/api/bookings/reserve')
      .send({
        event_id: 1,
        user_id: 'user1',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.event_id).toEqual(1);
    expect(res.body.user_id).toEqual('user1');
  });

  it('should not book a seat for the same user twice', async () => {
    await request(app)
      .post('/api/bookings/reserve')
      .send({
        event_id: 1,
        user_id: 'user2',
      });

    const res = await request(app)
      .post('/api/bookings/reserve')
      .send({
        event_id: 1,
        user_id: 'user2',
      });
    expect(res.statusCode).toEqual(409);
    expect(res.body).toHaveProperty('error', 'User has already booked for this event');
  });

  it('should not book a seat if the event is full', async () => {
    // Book all seats for event 2
    await request(app).post('/api/bookings/reserve').send({ event_id: 2, user_id: 'user3' });

    const res = await request(app)
      .post('/api/bookings/reserve')
      .send({
        event_id: 2,
        user_id: 'user4',
      });
    expect(res.statusCode).toEqual(409);
    expect(res.body).toHaveProperty('error', 'No available seats for this event');
  });

  it('should return a 404 error if the event does not exist', async () => {
    const res = await request(app)
      .post('/api/bookings/reserve')
      .send({
        event_id: 999,
        user_id: 'user5',
      });
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error', 'Event not found');
  });

  it('should return a 400 error if event_id is missing', async () => {
    const res = await request(app)
      .post('/api/bookings/reserve')
      .send({
        user_id: 'user6',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error', 'event_id and user_id are required');
  });

  it('should return a 400 error if user_id is missing', async () => {
    const res = await request(app)
      .post('/api/bookings/reserve')
      .send({
        event_id: 1,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error', 'event_id and user_id are required');
  });
});