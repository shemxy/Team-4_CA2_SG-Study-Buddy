const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();
const PORT = process.env.PORT || 61002;

// Multer storage setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images'); // ensure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

// MySQL connection config
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

// Session & flash
app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());

// Middleware for flash messages in views
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.formData = req.flash('formData')[0] || {};
  next();
});

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

// Other pages
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
  const sql = 'SELECT * FROM users';
  connection.query(sql, (error, results) => {
    if (error) {
      console.error('Database query error:', error.message);
      return res.status(500).send('Error retrieving login');
    }
    res.render('login', { login: results });
  });
});

app.get('/register', (req, res) => {
  res.render('register'); // Render register form only (no user list)
});

// ======= VALIDATION MIDDLEWARE =======
const validateRegistration = (req, res , next) => {
  const { username, email, password, address, contact } = req.body;

  if (!username || !email || !password || !address || !contact) {
    return res.status(400).send('All fields are required.');
  } 

  if (password.length < 6) {
    req.flash('error', 'Password should be at least 6 or more characters long');
    req.flash('formData', req.body);
    return res.redirect('/register');
  }

  next();
};

// ======= POST /register (FIXED) =======
app.post('/register', validateRegistration, (req, res) => {
  const { username, email, password, address, contact, role } = req.body;

  const sql = 'INSERT INTO users (username, email, password, address, contact, role) VALUES (?, ?, SHA1(?), ?, ?, ?)';

  connection.query(sql, [username, email, password, address, contact, role], (err, result) => {
    if (err) {
      console.error('Registration error:', err.message);
      return res.status(500).send('Database error during registration');
    }

    console.log('User registered:', result);
    req.flash('success', 'Registration successful! Please log in.');
    res.redirect('/login');
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
