const express = require("express");

const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");

const app = express();
const port = 3000;


app.use(cors());
app.use(bodyParser.json());


if (!process.env.MONGO_URI) {
  console.error("Error: MONGO_URI is not defined in the .env file");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); 
  });



const studentSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  registration_number: { type: String, required: true },
  fees_paid: { type: Number, required: true },
  fees_balance: { type: Number, required: true },
  units_registered: { type: [String], required: true },
  exam_scores: { type: [Number], required: true },
  grades: { type: [String], required: true },
});

const Student = mongoose.model("Student", studentSchema);


app.post("/api/students", async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.status(201).json({ message: "Student added successfully" });
  } catch (err) {
    console.error("Error adding student:", err);
    res.status(500).json({ error: "Failed to add student" });
  }
});

app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});


app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
