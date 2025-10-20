const { Pool } = require('pg');
const config = require('./config/config');

const pool = new Pool(config.database);

module.exports = {
  query: (text, params) => pool.query(text, params),
  getPool: () => pool,
};