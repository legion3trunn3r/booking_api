
const db = require('./db');

const createTables = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        name VARCHAR,
        total_seats INT
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        event_id INT REFERENCES events(id),
        user_id VARCHAR,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(event_id, user_id)
      );
    `);

    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
};

const seedData = async () => {
  try {
    // Check if events already exist
    const result = await db.query('SELECT * FROM events');
    if (result.rows.length === 0) {
      await db.query(`
        INSERT INTO events (name, total_seats) VALUES
        ('Event 1', 100),
        ('Event 2', 50);
      `);
      console.log('Seed data inserted successfully');
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

const initDatabase = async () => {
  await createTables();
  await seedData();
};

module.exports = initDatabase;
