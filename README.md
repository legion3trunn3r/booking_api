
# Booking API

This is a simple API for booking seats at an event.

## Prerequisites

* Node.js
* PostgreSQL

## Setup

1. Clone the repository.
2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root of the project and add the following environment variables:

   ```
   DB_USER=your_username
   DB_HOST=your_host
   DB_DATABASE=your_database
   DB_PASSWORD=your_password
   DB_PORT=5432
   ```

4. Start the application:

   ```bash
   npm start
   ```

   The server will start on port 3000. The database tables will be created and seeded automatically.

## API

### POST /api/bookings/reserve

Reserves a seat for a user at an event.

**Request Body:**

```json
{
  "event_id": 1,
  "user_id": "user123"
}
```

**Responses:**

* **201 Created:** If the booking is successful.
* **400 Bad Request:** If `event_id` or `user_id` are missing from the request body.
* **404 Not Found:** If the event does not exist.
* **409 Conflict:** If the user has already booked for this event or if there are no available seats.
* **500 Internal Server Error:** If there is a server error.
