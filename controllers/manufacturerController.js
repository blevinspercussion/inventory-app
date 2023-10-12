const Manufacturer = require("../models/manufacturer");

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
