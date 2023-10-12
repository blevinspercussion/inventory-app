const express = require("express");
const router = express.Router();

// Require controller modules
const department_controller = require("../controllers/departmentController");
const manufacturer_controller = require("../controllers/manufacturerController");
const instrument_controller = require("../controllers/instrumentController");

/// DEPARTMENT ROUTES ///

// GET catalog home page
router.get("/", instrument_controller.index);

// GET request for one department
router.get("/department/:id", department_controller.department_detail);

// GET request for all departments
router.get("/departments", department_controller.department_list);

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
