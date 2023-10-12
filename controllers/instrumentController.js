const Manufacturer = require("../models/manufacturer");
const Department = require("../models/department");
const Instrument = require("../models/instrument");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
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
  const instrument = await Promise.all([
    Instrument.findById(req.params.id).populate("manufacturer").exec(),
  ]);
  if (instrument === null) {
    const err = new Error("Instrument not found");
    err.status = 404;
    return next(err);
  }

  res.render("instrument_detail", {
    name: instrument.name,
    instrument: instrument,
  });
});
