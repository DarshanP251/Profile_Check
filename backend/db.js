require("dotenv").config();
const { Pool } = require("pg");

/*
  DATABASE_URL will be:
  - Local: postgresql://postgres:12345@localhost:5432/profiles_db
  - Render: provided automatically in environment variables
*/

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false
});

module.exports = pool;
