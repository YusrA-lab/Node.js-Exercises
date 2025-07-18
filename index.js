const express = require('express');
const app = express();

app.use(express.json()); // for parsing JSON bodies

const PORT = 3000;

// === USER ROUTES ===
app.get('/users', (req, res) => {
  res.json({ message: "This is the GET user path" });
});

app.post('/users', (req, res) => {
  res.json({ message: "This is the POST path and a user was added" });
});

app.put('/users', (req, res) => {
  res.json({ message: "This is the PUT path and the user was replaced" });
});

app.patch('/users', (req, res) => {
  res.json({ message: "This is the PATCH path and the user was updated" });
});

app.delete('/users', (req, res) => {
  res.json({ message: "This is the DELETE path and the user was removed" });
});


// === PRODUCT ROUTES ===
app.get('/products', (req, res) => {
  res.json({ message: "This is the GET product path" });
});

app.post('/products', (req, res) => {
  res.json({ message: "This is the POST path and a product was added" });
});

app.put('/products', (req, res) => {
  res.json({ message: "This is the PUT path and the product was replaced" });
});

app.patch('/products', (req, res) => {
  res.json({ message: "This is the PATCH path and the product was updated" });
});

app.delete('/products', (req, res) => {
  res.json({ message: "This is the DELETE path and the product was removed" });
});


// Start the server
app.listen(PORT, () => {
  console.log(`SHOPLEFT API running on http://localhost:${PORT}`);
});