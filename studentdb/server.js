const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "studentdb",
});

db.connect((err) => {
  if (err) {
    console.error("DB connection failed:", err.message);
    return;
  }

  console.log("Connected to MySQL");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/add", (req, res) => {
  const { regno, mark, grade, result } = req.body;

  if (!regno || mark === undefined || !grade || !result) {
    return res.status(400).json({
      message: "regno, mark, grade, and result are required",
    });
  }

  db.query(
    "INSERT INTO students (regno, mark, grade, result) VALUES (?, ?, ?, ?)",
    [regno, mark, grade, result],
    (err) => {
      if (err) {
        console.error("Insert failed:", err.message);
        return res.status(500).json({
          message: err.message,
        });
      }

      res.json({ message: "Student added successfully" });
    },
  );
});

app.get("/students", (req, res) => {
  db.query("SELECT * FROM students ORDER BY id DESC", (err, rows) => {
    if (err) {
      console.error("Fetch failed:", err.message);
      return res.status(500).json({
        message: err.message,
      });
    }

    res.json(rows);
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
