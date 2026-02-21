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
    const { q } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({ error: "Search query is required" });
    }

    const searchTerm = `%${q.trim()}%`;

    const pool = await getPool();

    const sql = `
      SELECT 
        employee_id, external_id, first_name, middle_name, last_name,
        email, mobile, department, designation, employment_type,
        assigned_shift, hire_date, base_salary, hourly_rate, status
      FROM dbo.EmployeeMaster
      WHERE 
        CONCAT(
          COALESCE(first_name, ''), ' ',
          COALESCE(middle_name, ''), ' ',
          COALESCE(last_name, '')
        ) LIKE ?
        OR mobile LIKE ?
      ORDER BY employee_id DESC
    `;

    const result = await pool.promises.query(sql, [searchTerm, searchTerm]);

    res.json(result.recordset || result.first || []);
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
      first_name,
  middle_name,
  last_name,
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

        const checkSql = `
      SELECT 1 
      FROM dbo.EmployeeMaster
      WHERE mobile = ?
    `;

    const checkResult=await pool.promises.query(checkSql,[mobile]);

    if((checkResult.recordset || []).length>0){
      return res.status(400).json({
        error:"Mobile number already exists",
      })
    }

    const sql = `
      INSERT INTO dbo.EmployeeMaster (
        employee_id,
        external_id,
        first_name,
  middle_name,
  last_name,
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
      VALUES (?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await pool.promises.query(sql, [
      employeeId,
      external_id,
      first_name,
  middle_name,
  last_name,
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


export const updateEmployee = async (req, res) => {
  try {
    const {
      employee_id,
      external_id,
      first_name,
      middle_name,
      last_name,
      email,
      mobile,
      department,
      designation,
      employment_type,
      assigned_shift,
      hire_date,
      base_salary,
      hourly_rate,
      status,
    } = req.body;

    if (!employee_id) {
      return res.status(400).json({ error: "employee_id is required" });
    }

    const pool = await getPool();

    // Step 1: Check if the new external_id is already used by ANOTHER employee
    if (external_id) {
      const checkSql = `
        SELECT employee_id FROM dbo.EmployeeMaster
        WHERE external_id = ? AND employee_id != ?
      `;
      const checkResult = await pool.promises.query(checkSql, [external_id.trim(), employee_id]);

      if (checkResult.recordset && checkResult.recordset.length > 0) {
        return res.status(400).json({ error: "External ID already in use by another employee" });
      }
    }

    // Step 2: Proceed with update (only if no duplicate)
    const sql = `
      UPDATE dbo.EmployeeMaster
      SET 
        external_id = ?,
        first_name = ?,
        middle_name = ?,
        last_name = ?,
        email = ?,
        mobile = ?,
        department = ?,
        designation = ?,
        employment_type = ?,
        assigned_shift = ?,
        hire_date = ?,
        base_salary = ?,
        hourly_rate = ?,
        status = ?
      WHERE employee_id = ?
    `;

    await pool.promises.query(sql, [
      external_id?.trim() || null,
      first_name?.trim() || null,
      middle_name?.trim() || null,
      last_name?.trim() || null,
      email?.trim() || null,
      mobile?.trim() || null,
      department?.trim() || null,
      designation?.trim() || null,
      employment_type || null,
      assigned_shift?.trim() || null,
      hire_date || null,
      base_salary !== undefined && base_salary !== '' ? parseFloat(base_salary) : null,
      hourly_rate !== undefined && hourly_rate !== '' ? parseFloat(hourly_rate) : null,
      status || 'Active',
      employee_id
    ]);

    res.status(200).json({
      message: "Employee updated successfully",
      employee_id,
    });
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
export const deleteEmployee = async (req, res) => {
  try {
    const { employee_id } = req.body;

    if (!employee_id) {
      return res.status(400).json({ error: "employee_id is required" });
    }

    const pool = await getPool();

    const sql = `
      DELETE FROM dbo.EmployeeMaster
      WHERE employee_id = ?
    `;

    await pool.promises.query(sql, [employee_id]);

    res.status(200).json({
      message: "Employee deleted successfully",
      employee_id,
    });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// regularization.controller.js

export const createRegularization = async (req, res) => {
   console.log(req.body)
  try {
    const {
      employee_id,
      from_date,
      to_date,
      from_time,
      to_time,
      total_hours,
      remarks,
    } = req.body;
   

    if (!employee_id || !from_date || !to_date || !remarks?.trim()) {
      return res.status(400).json({ error: "Required fields missing: employee_id, from_date, to_date, remarks" });
    }

   
    if (new Date(from_date) > new Date(to_date)) {
      return res.status(400).json({ error: "From Date cannot be after To Date" });
    }

    const pool = await getPool();

    const sql = `
      INSERT INTO dbo.AttendanceRegularization (
        employee_id,
        from_date,
        to_date,
        from_time,
        to_time,
        total_hours,
        admin_remarks
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await pool.promises.query(sql, [
      employee_id.trim(),
      from_date,
      to_date,
      from_time || null,
      to_time || null,
      total_hours ? parseFloat(total_hours) : null,
      remarks.trim() || '',
    ]);

    res.status(201).json({
      message: "Regularization request submitted successfully",
      request_id: result.recordset?.[0]?.id || null, // if identity is returned
    });
  } catch (err) {
    console.error("CREATE REGULARIZATION ERROR:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};
