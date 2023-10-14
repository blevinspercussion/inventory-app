const Manufacturer = require("../models/manufacturer");
const Department = require("../models/department");
const Instrument = require("../models/instrument");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const instrument = require("../models/instrument");
// const instrument = require("../models/instrument");

exports.index = asyncHandler(async (req, res, next) => {
  // Get details of departments, manufacturers, and instruments (in paraller)
  const [numDepartments, numManufacturers, numInstruments] = await Promise.all([
    Department.countDocuments({}).exec(),
    Manufacturer.countDocuments({}).exec(),
    Instrument.countDocuments({}).exec(),
  ]);
  res.render("index", {
    title: "Instrument Store Home",
    department_count: numDepartments,
    manufacturer_count: numManufacturers,
    instrument_count: numInstruments,
  });
});

// Display a list of all instruments
exports.instrument_list = asyncHandler(async (req, res, next) => {
  const allInstruments = await Instrument.find({}, "name description")
    .sort({ title: 1 })
    .populate("manufacturer")
    .exec();

  res.render("instrument_list", {
    title: "Instrument List",
    instrument_list: allInstruments,
  });
});

// Display detail page for specific instrument
exports.instrument_detail = asyncHandler(async (req, res, next) => {
  const instrument = await Instrument.findById(req.params.id)
    .populate("manufacturer")
    .populate("department")
    .exec();

  if (instrument === null) {
    const err = new Error("Instrument not found");
    err.status = 404;
    return next(err);
  }

  res.render("instrument_detail", {
    title: "Instrument",
    instrument: instrument,
  });
});

// Display instrmunent create form on GET
exports.instrument_create_get = (req, res, next) => {
  res.render("instrument_form", { title: "Create Instrument" });
};

// Handle instrument create on POST
exports.instrument_create_post = [
  // Validate and sanitize form data
  body("name", "Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Name must be specified.")
    .isAlphanumeric()
    .withMessage("Name contains non-alphanumeric characters."),
  body("department", "Department must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("manufacturer", "Manufacturer must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    // Create department object with escaped and trimmed data
    const department = new Department({
      name: req.body.name,
    });
    if (!errors.isEmpty()) {
      res.render("instrument_form", {
        name: "Create Instrument",
      });
      return;
    } else {
      await instrument.save();
      res.redirect(department.url);
    }
  }),
];

// Display instrument delete form on GET
exports.instrument_delete_get = asyncHandler(async (req, res, next) => {
  const instrument = await Promise(Instrument.findById(req.params.id).exec());

  if (instrument === null) {
    res.redirect("/catalog/instruments");
  }

  res.render("instrument_delete", {
    title: "Delete Instrument",
    instrument: instrument,
  });
});

// Handle instrument delete on POST
exports.instrument_delete_post = asyncHandler(async (req, nes, next) => {
  const instrument = await Promise(Instrument.findById(req.params.id).exec());

  await Instrument.findByIdAndRemove(req.body.instrumentid);
  res.redirect("/catalog/instruments");
});

// Display instrument update form on GET
exports.instrument_update_get = asyncHandler(async (req, res, next) => {
  const [instrument, allDepartments, allManufacturers] = await Promise.all([
    Instrument.findById(req.params.id),
    Department.find().exec(),
    Manufacturer.find().exec(),
  ]);

  if (instrument === null) {
    const err = new Error("Instrument not found");
    err.status = 404;
    return next(err);
  }

  res.render("instrument_form", {
    title: "Update instrument",
    instrument: instrument,
    departments: allDepartments,
    manufacturers: allManufacturers,
  });
});

// Handle instrument update on POST
exports.instrument_update_post = [
  // Validate and sanitize form data
  body("name", "Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Name must be specified.")
    .isAlphanumeric()
    .withMessage("Name contains non-alphanumeric characters."),
  body("department", "Department must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("manufacturer", "Manufacturer must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .isInt()
    .withMessage("Price must be an integer.")
    .escape(),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Create an Instrument object with escaped/trimmed data and old id
    const instrument = new Instrument({
      name: req.body.name,
      department: req.body.department,
      manufacturer: req.body.manufacturer,
      description: req.body.description,
      price: req.body.price,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      const [allManufacturers, allDepartments] = await Promise.all([
        Manufacturer.find().exec(),
        Department.find().exec(),
      ]);

      res.render("instrument_form", {
        title: "Update Instrument",
        departments: allDepartments,
        manufacturers: allManufacturers,
        instrument: instrument,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record
      const updatedInstrument = await Instrument.findByIdAndUpdate(
        req.params.id,
        instrument,
        {}
      );
      res.redirect(updatedInstrument.url);
    }
  }),
];
