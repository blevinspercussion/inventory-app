const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const InstrumentSchema = new Schema({
  name: { type: String, required: true },
  department: {
    type: Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  manufacturer: {
    type: Schema.Types.ObjectId,
    ref: "Manufacturer",
    required: true,
  },
  description: { type: String, required: true },
  price: { type: String, required: true },
});

InstrumentSchema.virtual("url").get(function () {
  return `/catalog/instrument/${this._id}`;
});

module.exports = mongoose.model("Instrument", InstrumentSchema);
