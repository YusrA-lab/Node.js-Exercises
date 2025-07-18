const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json()); // to parse JSON

// Dummy Data
let employees = [
  { id: 1, name: "Farah", role: "Cashier" },
  { id: 2, name: "Cassiem", role: "Supervisor" },
  { id: 3, name: "Yusra", role: "Packer" },
  { id: 4, name: "Zoe", role: "Cleaner" },
  { id: 5, name: "Stacey-lee", role: "Cleaner" }
];

let managers = [
  { id: 1, name: "Mr. Dallas", department: "Operations" }
];

// -------- EMPLOYEE ROUTES --------
// GET all employees
app.get('/employees', (req, res) => {
  res.json(employees);
});

// POST new employee
app.post('/employees', (req, res) => {
  const newEmployee = req.body;
  employees.push(newEmployee);
  res.status(201).json({ message: "Employee added", data: newEmployee });
});

// PATCH (update part of employee)
app.patch('/employees/:id', (req, res) => {
  const id = parseInt(req.params.id, 10); // always specify base 10

  // This is to Check if id is valid
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid employee ID" });
  }

  const updates = req.body;

  // This will make sure employees exist and have .id
  const employee = employees.find(emp => emp && emp.id === id);
  if (employee) {
    Object.assign(employee, updates);
    res.json({ message: "Employee updated", data: employee });
  } else {
    res.status(404).json({ message: "Employee not found" });
  }
});

// DELETE employee
app.delete('/employees/:id', (req, res) => {
  const id = parseInt(req.params.id);
  employees = employees.filter(emp => emp.id !== id);
  res.json({ message: `Employee ${id} deleted` });
});

// -------- MANAGER ROUTES --------
// GET all managers
app.get('/managers', (req, res) => {
  res.json(managers);
});

// POST new manager
app.post('/managers', (req, res) => {
  const newManager = req.body;
  managers.push(newManager);
  res.status(201).json({ message: "Manager added", data: newManager });
});

// PATCH manager
app.patch('/managers/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);

  //  Validate the ID
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid manager ID" });
  }

  const updates = req.body;

  // Safely find the manager
  const manager = managers.find(mgr => mgr && mgr.id === id);
  if (manager) {
    Object.assign(manager, updates);
    res.json({ message: "Manager updated", data: manager });
  } else {
    res.status(404).json({ message: "Manager not found" });
  }
});

// DELETE manager
app.delete('/managers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  managers = managers.filter(mgr => mgr.id !== id);
  res.json({ message: `Manager ${id} deleted` });
});

// -------- SERVER LISTEN --------
app.listen(PORT, () => {
  console.log(`PICK 'n STEAL API running at http://localhost:${PORT}`);
});
