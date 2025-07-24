const express = require('express');
const mysql = require('mysql2');

const session = require('express-session');

const flash = require('connect-flash');

const app = express();

// MySQL config
const db = mysql.createConnection({
  host: 'dddgt5.h.filess.io',
  user: 'C237StudyBuddy_collegedie',
  password: '768f143d94d757f1499c22e82cd2786488a7d407',
  database: 'C237StudyBuddy_collegedie',
  port: 61002
});




// Starting the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});