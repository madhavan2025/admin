import mysql from "mysql2/promise";
import { parse } from "url";

const dbUrl = parse(process.env.DATABASE_URL!);

// Throw if critical values are missing
if (!dbUrl.hostname || !dbUrl.pathname || !dbUrl.auth) {
  throw new Error("Invalid DATABASE_URL");
}

const [user, password] = dbUrl.auth.split(":");

export const db = mysql.createPool({
  host: dbUrl.hostname,                    // guaranteed string now
  port: dbUrl.port ? parseInt(dbUrl.port) : 3306,
  user,                                    // guaranteed string
  password,                                // guaranteed string
  database: dbUrl.pathname.slice(1),       // remove leading '/'
  waitForConnections: true,
  connectionLimit: 10,
  ssl: {
    rejectUnauthorized: true,
  },
});