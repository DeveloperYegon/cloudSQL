const express = require('express');
const nodemon = require('nodemon');
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require('dotenv').config();
const mysql = require('mysql2');


// Middleware
app.use(cors());
app.use(bodyParser.json());


// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectTimeout: 10000 // 10 seconds
}); 

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ', err);
        return;
    }
    console.log('Connected to database');
});



// Create a new student
app.post("/api/students", (req, res) => {
    const {
      full_name,
      registration_number,
      fees_paid,
      fees_balance,
      units_registered,
      exam_scores,
      grades,
    } = req.body;
  
    const sql = `
      INSERT INTO students (full_name, registration_number, fees_paid, fees_balance, units_registered, exam_scores, grades)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      full_name,
      registration_number,
      fees_paid,
      fees_balance,
      JSON.stringify(units_registered),
      JSON.stringify(exam_scores),
      JSON.stringify(grades),
    ];
  

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error inserting student:", err);
        return res.status(500).send("Failed to add student");
      }
      res.status(201).send("Student added successfully");
    });
  });


  // Fetch all students
app.get("/api/students", (req, res) => {
    const sql = "SELECT * FROM students";
  
    db.query(sql, (err, results) => {
      if (err) {
        console.error("Error fetching students:", err);
        return res.status(500).send("Failed to fetch students");
      }
      res.json(results);
    });
  });

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
