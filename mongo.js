// const mongoose = require("mongoose");

// const password = process.env.MONGO_PASSWORD || process.argv[2];

// if (!password) {
//   console.log("Password not provided");
//   process.exit(1);
// }

// const url = `mongodb+srv://23matthewangel:${password}@backend-new.ruace.mongodb.net/phoneApp?retryWrites=true&w=majority&appName=backend-new`;

// mongoose.set("strictQuery", false);

// mongoose
//   .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     console.log("Connected to MongoDB");
//   })
//   .catch((error) => {
//     console.error("Error connecting to MongoDB:", error.message);
//   });

// const contactSchema = new mongoose.Schema({
//   name: String,
//   number: String,
// });

// const Contact = mongoose.model("contacts", contactSchema);

// const contact = new Contact({
//   name: "dan green",
//   number: "7865432211",
// });

// // contact.save().then((result) => {
// //   console.log("contact saved!");
// //   mongoose.connection.close();
// // });

// Contact.find({}).then((result) => {
//   result.forEach((note) => {
//     console.log(note);
//   });
//   mongoose.connection.close();
// });
