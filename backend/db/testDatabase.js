const { pool } = require("./connectDB");

const testDatabase = async () => {
    try {
        const result = await pool.query(
            "SELECT NOW() AS current_time"
        );

        console.log("Database connected");
        console.log(result.rows);


        const result1 = await pool.query(`
        SELECT extname, extversion
        FROM pg_extension
        WHERE extname = 'vector'
        `);

        console.log(result1.rows);

    } catch (error) {
        console.error(
            "Database connection failed:",
            error
        );
    }

};

module.exports = {
    testDatabase
};