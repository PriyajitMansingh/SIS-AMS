import express from "express";

import { getEmployeeCount,getNextEmployeeId,createEmployee,getAllEmployees,searchEmployees, updateEmployee, deleteEmployee, createRegularization } from "../controllers/employee.controller.js";

const router = express.Router();

router.get("/employee/next-id", getNextEmployeeId);
router.post("/employee/create", createEmployee);
router.get("/user/get-employees-count", getEmployeeCount);
router.get("/user/get-all-employees", getAllEmployees);
router.get("/user/get-employee", searchEmployees);
router.put("/user/update-employee",updateEmployee);
router.delete("/user/delete-employee",deleteEmployee);
router.post("/user/attendance-entry",createRegularization)

export default router;
