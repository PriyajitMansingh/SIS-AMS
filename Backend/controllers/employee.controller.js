import { getPool } from "../config/db.js";

export const getEmployeeCount = async (req, res) => {
  try {
    const pool = await getPool();

    const sql = "SELECT COUNT(*) AS total FROM dbo.EmployeeMaster";

    const result = await pool.promises.query(sql);
    

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


export const generateEmployeeId = async () => {
  const pool = await getPool();

  const sql = `
    SELECT TOP 1 employee_id
    FROM dbo.EmployeeMaster
    ORDER BY employee_id DESC
  `;

  const result = await pool.promises.query(sql);

  let nextNumber = 1;

  if (result.first.length > 0) {
    const lastId = result.first[0].employee_id; // EMP005
    const numeric = parseInt(lastId.replace("EMP", ""));
    nextNumber = numeric + 1;
  }

  const newId = `EMP${String(nextNumber).padStart(3, "0")}`;

  return newId;
};


export const getNextEmployeeId = async (req, res) => {
  try {
    const id = await generateEmployeeId();
    res.json({ employee_id: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


export const createEmployee = async (req, res) => {
  try {
    const employeeId = await generateEmployeeId();

    const {
      external_id,
      full_name,
      email,
      mobile,
      department,
      designation,
      employment_type,
      hire_date,
      base_salary,
      hourly_rate,
      assigned_shift,
    } = req.body;

    const pool = await getPool();

    const sql = `
      INSERT INTO dbo.EmployeeMaster (
        employee_id,
        external_id,
        full_name,
        email,
        mobile,
        department,
        designation,
        employment_type,
        hire_date,
        base_salary,
        hourly_rate,
        assigned_shift
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await pool.promises.query(sql, [
      employeeId,
      external_id,
      full_name,
      email,
      mobile,
      department,
      designation,
      employment_type,
      hire_date,
      base_salary,
      hourly_rate,
      assigned_shift,
    ]);

    res.status(201).json({
      message: "Employee created",
      employee_id: employeeId,
    });
  } catch (err) {
    console.error("CREATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};