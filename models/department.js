const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const DepartmentSchema = new Schema({
  name: { type: String, required: true },
});

DepartmentSchema.virtual("url").get(function () {
  return `/catalog/department/${this._id}`;
});

module.exports = mongoose.model("Department", DepartmentSchema);
