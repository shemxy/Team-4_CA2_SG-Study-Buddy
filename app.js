const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');

const app = express();

// Multer storage setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images'); // make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

// MySQL connection config with your credentials
const connection = mysql.createConnection({
  host: 'dddgt5.h.filess.io',
  user: 'C237StudyBuddy_collegedie',
  password: '768f143d94d757f1499c22e82cd2786488a7d407',
  database: 'C237StudyBuddy_collegedie',
  port: 61002
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database');
});

// View engine setup
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 61002;

// Root route - test database connection and render status
app.get('/', (req, res) => {
  connection.ping((err) => {
    if (err) {
      console.error('Database connection failed:', err);
      return res.render('index', { status: 'Database connection failed' });
    }
    res.render('index', { status: 'Successfully connected to MySQL database!' });
  });
});

app.get('/exams', (req, res) => {
  const sql = 'SELECT * FROM exams';
  connection.query(sql, (error, results) => {
    if (error) {
      console.error('Database query error:', error.message);
      return res.status(500).send('Error retrieving exams');
    }
    res.render('exams', { exams: results });
  });
});

app.get('/resources', (req, res) => {
  const sql = 'SELECT * FROM resources';
  connection.query(sql, (error, results) => {
    if (error) {
      console.error('Database query error:', error.message);
      return res.status(500).send('Error retrieving resources');
    }
    res.render('resources', { resources: results });
  });
});

app.get('/study_groups', (req, res) => {
  const sql = 'SELECT * FROM study_groups';
  connection.query(sql, (error, results) => {
    if (error) {
      console.error('Database query error:', error.message);
      return res.status(500).send('Error retrieving study_groups');
    }
    res.render('study_groups', { study_groups: results });
  });
});

app.get('/subjects', (req, res) => {
  const sql = 'SELECT * FROM subjects';
  connection.query(sql, (error, results) => {
    if (error) {
      console.error('Database query error:', error.message);
      return res.status(500).send('Error retrieving subjects');
    }
    res.render('subjects', { subjects: results });
  });
});

app.get('/timetable', (req, res) => {
  const sql = 'SELECT * FROM timetable';
  connection.query(sql, (error, results) => {
    if (error) {
      console.error('Database query error:', error.message);
      return res.status(500).send('Error retrieving timetable');
    }
    res.render('timetable', { timetable: results });
  });
});

app.get('/login', (req, res) => {
  const sql = 'SELECT * FROM login';
  connection.query(sql, (error, results) => {
    if (error) {
      console.error('Database query error:', error.message);
      return res.status(500).send('Error retrieving login');
    }
    res.render('login', { login: results });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});