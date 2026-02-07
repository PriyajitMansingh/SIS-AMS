import { getPool } from "../config/db.js";

export const getEmployeeCount = async (req, res) => {
  try {
    const pool = await getPool();

    const sql = "SELECT COUNT(*) AS total FROM dbo.EmployeeMaster";

    const result = await pool.promises.query(sql);
    console.log(result.first[0].total)

      res.json({ total: result.first[0].total });
  } catch (err) {
    console.error("COUNT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
 

export const getAllEmployees = async (req, res) => {
  try {
    const pool = await getPool();

    const sql = "SELECT * FROM dbo.EmployeeMaster ORDER BY employee_id DESC";

    const result = await pool.promises.query(sql);
    console.log(result)

    // msnodesqlv8 gives data in result.first
    res.json(result.first);

  } catch (err) {
    console.error("GET EMPLOYEES ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

export const searchEmployees = async (req, res) => {
  try {
    const { q } = req.query; // ?q=anisha
    const pool = await getPool();

    const sql = `
      SELECT * FROM dbo.EmployeeMaster
      WHERE full_name LIKE ?
      ORDER BY employee_id DESC
    `;

    const result = await pool.promises.query(sql, [`%${q}%`]);

    res.json(result.first);
  } catch (err) {
    console.error("SEARCH ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

