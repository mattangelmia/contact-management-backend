const http = require("http");
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

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
  const id = request.params.id;
  const contact = contacts.find((contact) => contact.id === id);
  if (contact) {
    response.json(contact);
  } else {
    response.status(404).end();
    // response.send("<h1>404 Not found dudeee!</h1>");
  }
});

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/info", (request, response) => {
  const currentTime = new Date().toLocaleString(); // Get the current date and time

  response.send(
    `<h1>the phone book has info for ${contacts.length} people!</h1><br/> <p> request recieved at${currentTime}</p>`
  );
});

/// get all contacts

app.get("/api/contacts", (request, response) => {
  response.json(contacts);
});

/// delete a contact

app.delete("/api/contacts/:id", (request, response) => {
  const id = request.params.id;
  contacts = contacts.filter((contact) => contact.id !== id);

  response.status(204).end();
});

/// add new contact

app.post("/api/contacts", (request, response) => {
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

  const existingNumber = contacts.find(
    (contact) => contact.number === body.number
  );
  if (existingContact || existingNumber) {
    return response.status(400).json({
      error: "contact already exists",
    });
  }

  // Create a new contact object
  const contact = {
    name: body.name,
    number: body.number,
    id: generateId(), // Assume you have a function to generate unique IDs
  };

  // Add the new contact to the array
  contacts = contacts.concat(contact);

  // Respond with the newly created contact
  response.json(contact);
});

/// edit a contact

app.put("/api/contacts/:id", (request, response) => {
  const body = request.body;

  const id = request.params.id;

  const contactToEdit = contacts.find((contact) => contact.id === id);

  if (contactToEdit) {
    const updatedContact = { ...contactToEdit, number: body.number };
    contacts = contacts.map((contact) =>
      contact.id === id ? updatedContact : contact
    );
    response.json(updatedContact);
  } else {
    response.status(404).end();
  }
});

const PORT = 3003;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
