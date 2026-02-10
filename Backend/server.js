import express from "express";
import cors from "cors";
import { getPool } from "./config/db.js";
import employeeRouter from "./routes/employee.routes.js";
import adminRouter from "./routes/admin.routes.js"

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.use("/api/auth",adminRouter);
app.use("/api", employeeRouter);

async function startServer() {
  try {
    await getPool();

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Server startup failed:", err.message);
    process.exit(1);
  }
}

startServer();

app.listen(port, () => {
  console.log(`Server is running on port ${process.env.SERVER_PORT}`);
});
