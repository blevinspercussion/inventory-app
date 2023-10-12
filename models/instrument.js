const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const InstrumentSchema = new Schema({
  name: { type: String, required: true },
  Department: {
    type: Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  Manufacturer: {
    type: Schema.Types.ObjectId,
    ref: "Manufacturer",
    required: true,
  },
  Descripton: { type: String, required: true },
  Price: { type: Number, required: true },
});

InstrumentSchema.virtual("url").get(function () {
  return `/catalog/instruments/${this._id}`;
});
