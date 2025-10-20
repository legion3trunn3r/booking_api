
require('dotenv').config();

const config = {
  development: {
    database: {
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_DATABASE || 'booking_db',
      password: process.env.DB_PASSWORD || 'password',
      port: process.env.DB_PORT || 5432,
    },
  },
  test: {
    database: {
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_DATABASE || 'booking_db_test',
      password: process.env.DB_PASSWORD || 'password',
      port: process.env.DB_PORT || 5432,
    },
  },
  production: {
    database: {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    },
  },
};

const env = process.env.NODE_ENV || 'development';

module.exports = config[env];
