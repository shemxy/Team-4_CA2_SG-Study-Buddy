const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const flash = require('connect-flash');
const multer = require('multer');
const path = require('path');

const app = express();

// Setup storage for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });

// MySQL config
const db = mysql.createConnection({
  host: 'dddgt5.h.filess.io',
  user: 'C237StudyBuddy_collegedie',
  password: '768f143d94d757f1499c22e82cd2786488a7d407',
  database: 'C237StudyBuddy_collegedie',
  port: 61002
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database');
});

// Middleware setup
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }
}));
app.use(flash());

app.set('view engine', 'ejs');

// ------------------- Routes ------------------- //

// ✅ Login Page
app.get('/', (req, res) => {
  res.render('login', {
    messages: req.flash('success'),
    errors: req.flash('error')
  });
});

// ✅ Login Form Submission
app.post('/', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    req.flash('error', 'All fields are required.');
    return res.redirect('/');
  }

  const sql = 'SELECT * FROM users WHERE email = ? AND password = SHA1(?)';
  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error('Login query error:', err);
      return res.status(500).send('Internal server error');
    }

    if (results.length > 0) {
      req.session.user = results[0];
      return res.redirect('/index');
    } else {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/');
    }
  });
});

app.get('/register', (req, res) => {
    res.render('register', { messages: req.flash('error'), formData: req.flash('formData')[0] });
});

const validateRegistration = (req, res , next) => {
    const { username, email, password, address, contact} = req.body;

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

app.post('/register', validateRegistration, (req, res) => {
    const { username, email, password, address, contact, role } = req.body;

    const sql = 'INSERT INTO users (username, email, password, address, contact, role) VALUES (?, ?, SHA1(?), ?, ?, ?)';
    db.query(sql, [username, email, password, address, contact, role || 'user'], (err, result) => {
        if (err) {
            console.error('Registration error:', err);
            req.flash('error', 'Registration failed. Please try again.');
            return res.redirect('/register');
        }
        console.log(result);
        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/');
    });
});

// ✅ Index Page
app.get('/index', (req, res) => {
  db.ping(err => {
    if (err) {
      return res.render('index', { status: 'Database connection failed' });
    }
    res.render('index', { status: 'Successfully connected to MySQL database!' });
  });
});

// Example protected route
const checkAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  req.flash('error', 'Please log in to view this page');
  res.redirect('/');
};

// logout route //
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// ✅ Start Server
const PORT = process.env.PORT || 61002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});