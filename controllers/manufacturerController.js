const Manufacturer = require("../models/manufacturer");
const Instrument = require("../models/instrument");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display a list of all Manufacturers
exports.manufacturer_list = asyncHandler(async (req, res, next) => {
  const allManufacturers = await Manufacturer.find().exec();
  res.render("manufacturers_list", {
    title: "Manufacturers List",
    manufacturers_list: allManufacturers,
  });
});

// Displayer detail page for a specific manufacturer
exports.manufacturer_detail = asyncHandler(async (req, res, next) => {
  // Get details of manufacturer and all associated instruments
  const [manufacturer, instrumentsByManufacturer] = await Promise.all([
    Manufacturer.findById(req.params.id).exec(),
    Instrument.find({ manufacturer: req.params.id }, "name description").exec(),
  ]);

  if (manufacturer === null) {
    const err = new Error("Manufacturer not found");
    err.status = 404;
    return next(err);
  }

  res.render("manufacturer_detail", {
    title: "Manufacturer Detail",
    manufacturer: manufacturer,
    manufacturer_instruments: instrumentsByManufacturer,
  });
});

// Display Manufacturer create form on GET
exports.manufacturer_create_get = (req, res, next) => {
  res.render("manufacturer_form", { title: "Create Manufacturer" });
};

// Handle Manufacturer create on POST
exports.manufacturer_create_post = [
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

    // Create Manufacturer object with escaped and trimmed data
    const manufacturer = new Manufacturer({
      name: req.body.name,
    });
    if (!errors.isEmpty()) {
      res.render("manufacturer_form", {
        title: "Create Manufacturer",
        errors: errors.array(),
      });
      return;
    } else {
      await manufacturer.save();
      res.redirect(manufacturer.url);
    }
  }),
];

// Display Manufacturer delete form on GET
exports.manufacturer_delete_get = asyncHandler(async (req, res, next) => {
  // Get manufacturer and all associated instruments
  const [manufacturer, allInstrumentsByManufacturer] = await Promise.all([
    Manufacturer.findById(req.params.id).exec(),
    Instrument.find({ manufacturer: req.params.id }, "name description").exec(),
  ]);

  if (manufacturer === null) {
    res.redirect("/catalog/manufacturers");
  }

  res.render("manufacturer_delete", {
    title: "Delete Manufacturer",
    manufacturer: manufacturer,
    manufacturer_instruments: allInstrumentsByManufacturer,
  });
});

// Handle Manufacturer delete on POST
exports.manufacturer_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of manufacturer and all associated instruments
  const [manufacturer, allInstrumentsByManufacturer] = await Promise.all([
    Manufacturer.findById(req.params.id).exec(),
    Instrument.find({ manufacturer: req.params.id }).exec(),
  ]);

  if (allInstrumentsByManufacturer > 0) {
    res.render("manufacturer_delete", {
      title: "Delete Manufacturer",
      manufacturer: manufacturer,
      manufacturer_instruments: allInstrumentsByManufacturer,
    });
    return;
  } else {
    await Manufacturer.findByIdAndRemove(req.body.manufacturerid);
    res.redirect("/catalog/manufacturers");
  }
});

// Display Manufacturer update form on GET
exports.manufacturer_update_get = asyncHandler(async (req, res, next) => {
  const [manufacturer, allDepartments, allInstruments] = await Promise.all([
    Manufacturer.findById(req.params.id).exec(),
    Department.find().exec(),
    Instrument.find().exec(),
  ]);

  if (manufacturer === null) {
    const err = new Error("Manufacturer not found");
    err.status = 404;
    return next(err);
  }

  res.render("manufacturer_form", {
    title: "Update Manufacturer",
    instruments: allInstruments,
    departments: allDepartments,
    manufacturer: manufacturer,
  });
});

// Handle Manufacturer update on POST
exports.manufacturer_update_post = [
  // Validate and sanitize fields
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Name must be specified.")
    .isAlphanumeric()
    .withMessage("Name has non-alphanumeric characters."),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Create a Manufacturer object with escaped/trimmed data and old id
    const manufacturer = new Manufacturer({
      name: req.body.name,
      _id: req.params.id, // This is required or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      const [allDepartments, allInstruments] = await Promise.all([
        Department.find().exec(),
        Instrument.find().exec(),
      ]);

      res.render("manufacturer_form", {
        title: "Update Manufacturer",
        manufacturer: manufacturer,
        departments: allDepartments,
        instruments: allInstruments,
        errors: errors.array(),
      });
      return;
    } else {
      const updatedManufacturer = await Manufacturer.findByIdAndUpdate(
        req.params.id,
        department,
        {}
      );
      res.redirect(updatedManufacturer.irl);
    }
  }),
];
