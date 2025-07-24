What’s completed:
- connection to database
- able to run render like
- able to use filess.io to host database
- able to share code via github
- able to run all ejs files using app get
What’s still in progress:
- functionalities (add, delete, edit. CRUD features + search)
- design
- user role
- admin role
- user/admin database
Any blockers (e.g., login not working, search incomplete):
- n/a

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