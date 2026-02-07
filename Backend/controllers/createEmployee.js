import { getPool } from "../config/db.js";

export const createEmployee = async (req, res) => {
  try {
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

    // 1) INSERT
    const insertSql =
      "INSERT INTO dbo.EmployeeMaster (external_id, full_name, email, mobile, department, designation, employment_type, hire_date, base_salary, hourly_rate, assigned_shift) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    await pool.promises.query(insertSql, [
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

    //2) READ BACK LATEST
    const selectSql = `
      SELECT employee_id
      FROM dbo.EmployeeMaster
      WHERE external_id = ?
    `;

    const result = await pool.promises.query(selectSql, [external_id]);
    console.log(result.results[0]);

    return res.status(201).json({
      message: "registered",
      employee_id: result.results[0],
    });
  } catch (err) {
    console.error("CREATE EMPLOYEE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
