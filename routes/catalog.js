const express = require("express");
const router = express.Router();

// Require controller modules
const department_controller = require("../controllers/departmentController");
const manufacturer_controller = require("../controllers/manufacturerController");
const instrument_controller = require("../controllers/instrumentController");
const department = require("../models/department");

// GET catalog home page
router.get("/", instrument_controller.index);

/// DEPARTMENT ROUTES ///

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

// GET request for creating a manufacturer
router.get(
  "/manufacturer/create",
  manufacturer_controller.manufacturer_create_get
);

// POST request for creating a manufacturer
router.post(
  "/manufacturer/create",
  manufacturer_controllel.manufacturer_create_post
);

// GET request for one manufacturer
router.get("/manufacturer/:id", manufacturer_controller.manufacturer_detail);

// GET request for all manufacturers
router.get("/manufacturers", manufacturer_controller.manufacturer_list);

// GET request to delete a manufacturer
router.get(
  "/manufacturer/:id/delete",
  manufacturer_controller.manufacturer_delete_get
);

// POST request to delete a manufacturer
router.post(
  "/manufacturer/:id/delete",
  manufacturer_controller.manufacturer_delete_post
);

// GET request to update a manufacturer
router.get(
  "/manufacturer/:id/update",
  manufacturer_controller.manufacturer_update_get
);

// POST request to update a manufacturer
router.post(
  "/manufacturer/:id/update",
  manufacturer_controller.manufacturer_update_post
);

/// INSTRUMENT ROUTES ///

// GET request for one instrument
router.get("/instrument/:id", instrument_controller.instrument_detail);

// GET request for all instruments
router.get("/instruments", instrument_controller.instrument_list);

module.exports = router;
