const { Pool } = require("pg");

 const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  // Local development normally doesn't need SSL
  ssl: false,
});

pool.on("error", (error) => {
  console.error(
    "Unexpected PostgreSQL error:",
    error
  );
});


module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
  pool, // Export the pool for direct access if needed
};