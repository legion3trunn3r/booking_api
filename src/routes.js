const { Router } = require('express');
const bookingController = require('./controllers/bookingController');

const router = new Router();

router.post('/bookings/reserve', bookingController.reserveBooking);

module.exports = router;