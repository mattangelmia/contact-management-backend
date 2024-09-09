require("dotenv").config();

const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

// const password = process.env.MONGO_PASSWORD || process.argv[2];

// if (!password) {
//   console.log("Password not provided");
//   process.exit(1);
// }

const url = process.env.MONGODB_URI;

console.log(`connecting to ${url}`);
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
    minLength: 7,
  },
});

contactSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

// const Contact = mongoose.model("contacts", contactSchema);

module.exports = mongoose.model("contacts", contactSchema);
