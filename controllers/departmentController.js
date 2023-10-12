const Department = require("../models/department");
const Manufacturer = require("../models/manufacturer");
const Instrument = require("../models/instrument");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display a list of all Departments
exports.department_list = asyncHandler(async (req, res, next) => {
  const allDepartments = await Department.find().exec();
  res.render("department_list", {
    title: "Department List",
    department_list: allDepartments,
  });
});

// Display detail page for a specific department
exports.department_detail = asyncHandler(async (req, res, next) => {
  // Get details of department and all associated instruments
  const [department, instrumentsInDepartment] = await Promise.all([
    Department.findById(req.params.id).exec(),
    Instrument.find({ department: req.params.id }, "name description").exec(),
  ]);
  if (department === null) {
    const err = new Error("Department not found");
    err.status = 404;
    return next(err);
  }

  res.render("department_detail", {
    title: "Department Detail",
    department: department,
    department_instruments: instrumentsInDepartment,
  });
});
