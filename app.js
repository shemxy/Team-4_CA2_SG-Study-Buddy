const express = require('express');
const mysql = require('mysql2');
const app = express();

// View engine setup
app.set('view engine', 'ejs');

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

// Database connection
const connection = mysql.createConnection({
  host: 'dddgt5.h.filess.io',
  user: 'C237StudyBuddy_collegedie',
  password: '768f143d94d757f1499c22e82cd2786488a7d407',
  database: 'C237StudyBuddy_collegedie',
  port: 61002
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection failed:', err.message);
  } else {
    console.log('✅ Connected to MySQL database');
  }
});

// Homepage route (DB test)
app.get('/', (req, res) => {
  connection.query('SELECT 1 + 1 AS result', (err, result) => {
    if (err) {
      res.render('index', { status: 'Database connection FAILED ❌' });
    } else {
      res.render('index', { status: 'Database connection SUCCESSFUL ✅' });
    }
  });
});

// Start server
const PORT = process.env.PORT || 61002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});