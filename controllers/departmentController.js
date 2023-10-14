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

// Display Department create form on GET
exports.department_create_get = (req, res, next) => {
  res.render("department_form", { title: "Create Department" });
};

// Handle Department create on POST
exports.department_create_post = [
  // Validate and sanitize form data
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Name must be specified.")
    .isAlphanumeric()
    .withMessage("Name has non-alphanumeric characters."),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    // Create Department object with escaped and trimmed data
    const department = new Department({
      name: req.body.name,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages
      res.render("department_form", {
        name: "Create Department",
      });
      return;
    } else {
      // Data form in value

      // Save department
      await department.save();
      // Redirect to new department record
      res.redirect(department.url);
    }
  }),
];

// Display Department delete form on GET
exports.department_delete_get = asyncHandler(async (req, res, next) => {
  // Get department and all associated instruments (in parallel)
  const [department, allInstrumentsInDepartment] = await Promise.all([
    Department.findById(req.params.id).exec(),
    Instrument.find({ department: req.params.id }, "name description").exec(),
  ]);

  if (department === null) {
    res.redirect("/catalog/departments");
  }

  res.render("department_delete", {
    title: "Delete Department",
    department: department,
    department_instruments: allInstrumentsInDepartment,
  });
});

// Handle Department delete on POST
exports.department_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of department and all associated books (in parallel)
  const [department, allInstrumentsInDepartment] = await Promise.all([
    Department.findById(req.params.id).exec(),
    Instrument.find({ department: req.params.id }, "name description").exec(),
  ]);

  if (allInstrumentsInDepartment > 0) {
    // Department has instruments. Render in same way as GET route
    res.render("department_delete", {
      title: "Delete Department",
      department: department,
      department_instruments: allInstrumentsInDepartment,
    });
    return;
  } else {
    // Department has no instruments. Delete object and redirect to the list of departments
    await Department.findByIdAndRemove(req.body.departmentid);
    res.redirect("/catalog/departments");
  }
});

// Display Department update form on GET
exports.department_update_get = asyncHandler(async (req, res, next) => {
  // Get department, instruments, and manufacturers for form
  const [department, allManufacturers, allInstruments] = await Promise.all([
    Department.findById(req.params.id).exec(),
    Manufacturer.find().exec(),
    Instrument.find().exec(),
  ]);

  if (department === null) {
    const err = new Error("Department not found");
    err.status = 404;
    return next(err);
  }

  res.render("department_form", {
    title: "Update Department",
    instruments: allInstruments,
    manufacturers: allManufacturers,
    department: department,
  });
});

// Handle Department update on POST
exports.department_update_post = [
  // Validate and sanitize fields
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Create a Department object with escaped/trimmed data and old id
    const department = new Department({
      name: req.body.name,
      _id: req.params.id, // This is required or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      const [allManufacturers, allInstruments] = await Promise.all([
        Manufacturer.find().exec(),
        Instrument.find().exec(),
      ]);

      res.render("department_form", {
        title: "Update Department",
        department: department,
        instruments: allInstruments,
        manufacturers: allManufacturers,
        errors: errors.array(),
      });
      return;
    } else {
      // data from form is valid. Update the recond
      const updatedDepartment = await Department.findByIdAndUpdate(
        req.params.id,
        department,
        {}
      );
      res.redirect(updatedDepartment.url);
    }
  }),
];
