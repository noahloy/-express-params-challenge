const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;
const { uniqueId } = require("lodash");

// IN-MEMORY STORAGE (with one dummy student for testing, so I don't have to create a new student each time to test routes that depend on a student.)
const students = {
  1337: { id: 1337, name: "James", city: "Boulder, CO", grades: [] },
};

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES

// GET /students
app.get("/students", (req, res) => {
  const studentList = Object.values(students);
  if (req.query.search) {
    // GET /students?search=_____
    const filteredStudentList = studentList.filter((student) =>
      student.name.includes(req.query.search)
    );
    res.status(200).send(filteredStudentList);
  } else {
    res.status(200).send(studentList);
  }
});

// GET /students/:studentId
app.get("/students/:studentId", (req, res) => {
  const { studentId } = req.params;
  if (!students[studentId]) {
    res.status(404).send(`Student ${studentId} not found!`);
  } else {
    res.status(200).send(students);
  }
});

// GET /grades/:studentId
app.get("/grades/:studentId", (req, res) => {
  const { studentId } = req.params;
  if (!students[studentId]) {
    res.status(404).send(`Student ${studentId} not found!`);
  } else {
    res.status(200).send(students[studentId].grades);
  }
});

// POST /grades
app.post("/grades", (req, res) => {
  const { studentId, grade } = req.body;
  if (!students[studentId]) {
    res.status(404).send(`Student ${studentId} not found!`);
  } else {
    students[studentId].grades.push(grade);
    res.status(200).send(`Grades updated for student ${studentId}`);
  }
});

// POST /register
app.post("/register", (req, res) => {
  const newId = uniqueId();
  const student = req.body;
  student.id = newId;
  student.grades = [];
  students[newId] = student;
  res.status(201).send(`Student saved and assigned id: ${newId}`);
});

// LISTEN
app.listen(port, () =>
  console.log(`Server is listening at http://localhost:${port}`)
);
