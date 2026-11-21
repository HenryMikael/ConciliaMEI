
import mysql from "mysql2/promise";
import fs from "node:fs";
import path from "node:path";

const caPath = path.resolve("certs/ca.pem");

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,

    ssl: {
        ca: fs.readFileSync(caPath),
        rejectUnauthorized: true,
    },
});

export default pool;
