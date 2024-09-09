const http = require("http");
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const Contact = require("./models/contact");
app.use(cors());
app.use(express.json());
// app.use(requestLogger);

app.use(express.static("build"));

let contacts = [
  {
    name: "Arto Hellas",
    number: "65789",
    id: "1",
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: "2",
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: "3",
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: "4",
  },
  {
    id: "3cab",
    name: "mike green",
    number: "12345",
  },
];

const generateId = () => {
  const numericIds = contacts
    .map((n) => Number(n.id))
    .filter((id) => !isNaN(id)); // Filter out non-numeric IDs
  const maxId = numericIds.length > 0 ? Math.max(...numericIds) : 0;
  return String(maxId + 1);
};

/// get a specific contact

app.get("/api/contacts/:id", (request, response) => {
  Contact.findById(request.params.id)
    .then((contact) => {
      if (contact) {
        response.json(contact);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.get("/", (request, response, next) => {
  response.send("<h1>Hi there World!</h1>");
});

app.get("/info", (request, response) => {
  const currentTime = new Date().toLocaleString(); // Get the current date and time

  response.send(
    `<h1>yuhhhh the phone book has info for ${contacts.length} people!</h1><br/> <p> request recieved at${currentTime}</p>`
  );
});

/// get all contacts

app.get("/api/contacts", (request, response) => {
  Contact.find({}).then((contacts) => {
    response.json(contacts);
  });
});

/// delete a contact

app.delete("/api/contacts/:id", (request, response) => {
  const id = request.params.id;
  Contact.findByIdAndDelete(id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

/// add new contact

app.post("/api/contacts", (request, response, next) => {
  const body = request.body;

  // Check if the required fields are provided
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    });
  }

  // Check if the contact already exists (optional)
  const existingContact = contacts.find(
    (contact) => contact.name === body.name
  );

  // Create a new contact object
  const contact = new Contact({
    name: body.name,
    number: body.number,
  });

  contact
    .save()
    .then((savedContact) => {
      console.log(`${contact.name} has been saved to the database`);
      response.json(savedContact);
    })
    .catch((error) => next(error));

  // // Add the new contact to the array
  // contacts = contacts.concat(contact);
  // console.log("contact added");
  // // Respond with the newly created contact
  // response.json(contact);
});

/// edit a contact

app.put("/api/contacts/:id", (request, response) => {
  const body = request.body;

  const id = request.params.id;
  const contact = {
    name: body.name,
    number: body.number,
  };

  Contact.findByIdAndUpdate(id, contact, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

// this has to be the last loaded middleware, also all the routes should be registered before this!
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
