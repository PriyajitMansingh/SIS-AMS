// import sql from "msnodesqlv8";
// import dotenv from "dotenv";
// dotenv.config();

// const poolOptions = {
//   connectionString:
//     "Driver={ODBC Driver 18 for SQL Server};" +
//     `Server=${process.env.DB_HOST};` +
//     `Database=${process.env.DB_NAME};` +
//     "Trusted_Connection=yes;" +
//     "Encrypt=yes;" +
//     "TrustServerCertificate=yes;",

//   floor: 2,
//   ceiling: 10,
//   heartbeatSecs: 30,
//   heartbeatSql: "SELECT 1",
//   inactivityTimeoutSecs: 300,
// };

// let pool = null;

// async function initializePool() {
//   if (pool) return pool;

//   try {
//     pool = new sql.Pool(poolOptions);
//     await new Promise((resolve, reject) => {
//       pool.open((err) => {
//         if (err) return reject(err);
//         console.log("Database connected successfully");
//         resolve();
//       });
//     });

//     return pool;
//   } catch (err) {
//     console.error("Failed to connect to database:", err.message);
//     throw err;
//   }
// }

// async function getPool() {
//   if (!pool) {
//     await initializePool();
//   }
//   return pool;
// }

// export { getPool };

import sql from "msnodesqlv8";
import dotenv from "dotenv";
dotenv.config();

const poolOptions = {
  connectionString:
    "Driver={ODBC Driver 18 for SQL Server};" +
    `Server=${process.env.DB_HOST};` +
    `Database=${process.env.DB_NAME};` +
    `UID=${process.env.DB_USER};` +
    `PWD=${process.env.DB_PASSWORD};` +
    "Encrypt=yes;" +
    "TrustServerCertificate=yes;",

  floor: 2,
  ceiling: 10,
  heartbeatSecs: 30,
  heartbeatSql: "SELECT 1",
  inactivityTimeoutSecs: 300,
};

let pool = null;

async function initializePool() {
  if (pool) return pool;

  try {
    pool = new sql.Pool(poolOptions);
    await new Promise((resolve, reject) => {
      pool.open((err) => {
        if (err) return reject(err);
        console.log("Database connected successfully");
        resolve();
      });
    });

     
return pool;
  } catch (err) {
    console.error("Failed to connect to database:", err.message);
    throw err;
  }
}

async function getPool() {
  if (!pool) {
    await initializePool();
  }
  return pool;
}

export { getPool };
