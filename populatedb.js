// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Department = require("./models/department");
const Instrument = require("./models/instrument");
const Manufacturer = require("./models/manufacturer");

const departments = [];
const instruments = [];
const manufacturers = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createDepartments();
  await createManufacturers();
  await createInstruments();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.

async function departmentCreate(index, name) {
  const department = new Department({ name: name });
  await department.save();
  departments[index] = department;
  console.log(`Added department: ${name}`);
}

async function manufacturerCreate(index, name) {
  const manufacturer = new Manufacturer({ name: name });
  await manufacturer.save();
  manufacturers[index] = manufacturer;
  console.log(`Added manufacturer: ${name}`);
}

async function instrumentCreate(
  index,
  name,
  department,
  manufacturer,
  description,
  price
) {
  const instrumentdetail = {
    name: name,
    department: department,
    manufacturer: manufacturer,
    description: description,
    price: price,
  };
  const instrument = new Instrument(instrumentdetail);
  await instrument.save();
  instruments[index] = instrument;
  console.log(`Added instrument: ${name}`);
}

async function createDepartments() {
  console.log("Adding departments...");
  await Promise.all([
    departmentCreate(0, "Drums"),
    departmentCreate(1, "Cymbals"),
    departmentCreate(2, "Percussion"),
  ]);
}

async function createManufacturers() {
  console.log("Adding manufacturers...");
  await Promise.all([
    manufacturerCreate(0, "Pearl"),
    manufacturerCreate(1, "DW"),
    manufacturerCreate(2, "Ludwig"),
    manufacturerCreate(3, "Sabian"),
    manufacturerCreate(4, "Zildjian"),
  ]);
}

async function createInstruments() {
  console.log("Adding instruments...");
  await Promise.all([
    instrumentCreate(
      0,
      "Collector's Series Concrete Snare Drum",
      departments[0],
      manufacturers[1],
      `Add the DW Collector's Series Concrete 6.5"x14" snare drum to your kit for a unique accent to your drum sound. With a 5.5mm concrete shell, the Collector's Series Concrete snare has very little decay, and an explosively dry impact.`,
      "900"
    ),
    instrumentCreate(
      1,
      `18" AAX X-Plosion Crash Cymbal`,
      departments[1],
      manufacturers[3],
      `The ultra-fast Sabian 18" AAX X-Plosion Crash Cymbal explodes with the power only thin cymbals can provide. The X-Plosion Crash gives you amazing responsiveness and punchy accents at all volume levels.`,
      "330"
    ),
    instrumentCreate(
      2,
      `Reference One Snare Drum`,
      departments[0],
      manufacturers[0],
      `Pearl’s Reference One series set the standard for modern hybrid drum sets and snare drums, and the company has once again raised the bar with the Reference One Snare Drum.`,
      "985"
    ),
    instrumentCreate(
      3,
      `K 19" Paper thin Crash`,
      departments[1],
      manufacturers[4],
      `Zildjian is celebrating its 400th anniversary in myriad ways, including the grand introduction of these new Zildjian K Paper Thin crash cymbals. They’re the thinnest crashes in the entire K family and the largest paper thin cymbals in Zildjian’s entire history!`,
      "420"
    ),
    instrumentCreate(
      4,
      `Primero Cajon`,
      departments[2],
      manufacturers[0],
      `With its built-in bass port and a set of fixed snare wires, the Pearl Primero Cajon delivers a wider range of percussion sounds than many other cajons.`,
      "140"
    ),
    instrumentCreate(
      5,
      `Black Beauty Snare Drum`,
      departments[0],
      manufacturers[2],
      `The legendary Ludwig Black Beauty snare drum starts with a single sheet of brass. It's machine drawn and spun into a seamless beaded shell, then chrome plated to an exquisite finish.`,
      "900"
    ),
    instrumentCreate(
      0,
      `Collector's Series Purpleheart Wood Snare Drum`,
      departments[0],
      manufacturers[1],
      `The DW Collector's Series Purpleheart snare drum exhibits excellent attack, projection, and sensitivity, and it's versatile enough for nearly any style of music.`,
      "960"
    ),
  ]);
}
