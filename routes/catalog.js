const express = require("express");
const router = express.Router();

// Require controller modules
const department_controller = require("../controllers/departmentController");
const manufacturer_controller = require("../controllers/manufacturerController");
const instrument_controller = require("../controllers/instrumentController");
const department = require("../models/department");

/// DEPARTMENT ROUTES ///

// GET catalog home page
router.get("/", instrument_controller.index);

// GET request for creating a Department. NOTE this must come before routes that display Book (uses ID)
router.get("/department/create", department_controller.department_create_get);

// POST request for creating a department
router.post("/department/create", department_controller.department_create_post);

// GET request for one department
router.get("/department/:id", department_controller.department_detail);

// GET request for all departments
router.get("/departments", department_controller.department_list);

// GET request to delete a department
router.get(
  "/department/:id/delete",
  department_controller.department_delete_get
);

// POST request to delete a department
router.post(
  "/department/:id/delete",
  department_controller.department_delete_post
);

// GET request to update a department
router.get(
  "/department/:id/update",
  department_controller.department_update_get
);

// POST request to upadate a department
router.post(
  "/department/:id/update",
  department_controller.department_update_post
);

/// MANUFACTURER ROUTES ///

// GET request for one manufacturer
router.get("/manufacturer/:id", manufacturer_controller.manufacturer_detail);

// GET request for all manufacturers
router.get("/manufacturers", manufacturer_controller.manufacturer_list);

/// INSTRUMENT ROUTES ///

// GET request for one instrument
router.get("/instrument/:id", instrument_controller.instrument_detail);

// GET request for all instruments
router.get("/instruments", instrument_controller.instrument_list);

module.exports = router;
