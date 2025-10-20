
const db = require('../db');

const reserveBooking = async (req, res) => {
  const { event_id, user_id } = req.body;

  if (!event_id || !user_id) {
    return res.status(400).json({ error: 'event_id and user_id are required' });
  }

  try {
    // Check if the event exists and get total seats in a single query
    const eventResult = await db.query('SELECT total_seats FROM events WHERE id = $1', [event_id]);

    if (eventResult.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const totalSeats = eventResult.rows[0].total_seats;

    // Use a transaction to ensure atomicity
    const client = await db.getPool().connect();
    try {
      await client.query('BEGIN');

      // Lock the event row to prevent race conditions
      await client.query('SELECT * FROM events WHERE id = $1 FOR UPDATE', [event_id]);

      // Check for existing booking
      const existingBooking = await client.query(
        'SELECT * FROM bookings WHERE event_id = $1 AND user_id = $2',
        [event_id, user_id]
      );

      if (existingBooking.rows.length > 0) {
        await client.query('ROLLBACK');
        return res.status(409).json({ error: 'User has already booked for this event' });
      }

      // Check for available seats
      const bookingCountResult = await client.query('SELECT COUNT(*) FROM bookings WHERE event_id = $1', [event_id]);
      const bookingCount = parseInt(bookingCountResult.rows[0].count, 10);

      if (bookingCount >= totalSeats) {
        await client.query('ROLLBACK');
        return res.status(409).json({ error: 'No available seats for this event' });
      }

      // Create a new booking
      const newBooking = await client.query(
        'INSERT INTO bookings (event_id, user_id) VALUES ($1, $2) RETURNING *',
        [event_id, user_id]
      );

      await client.query('COMMIT');
      res.status(201).json(newBooking.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(error);
    // Check for unique constraint violation
    if (error.code === '23505') {
      return res.status(409).json({ error: 'User has already booked for this event' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  reserveBooking,
};
