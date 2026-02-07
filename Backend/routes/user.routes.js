import express from "express"
import {createEmployee} from "../controllers/createEmployee.js"
import {getEmployeeCount,getAllEmployees,searchEmployees} from "../controllers/getEmployee.js"

const router=express.Router()

router.post("/user/create-employee",createEmployee)
router.get("/user/get-employees-count",getEmployeeCount)
router.get("/user/get-all-employees",getAllEmployees)
router.get("/user/get-employees",searchEmployees)

export default router