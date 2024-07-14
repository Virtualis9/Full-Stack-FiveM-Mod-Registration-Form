const express = require('express');
const app = express();
const port = 9001;
const multer = require('multer');
const upload = multer();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cors = require('cors');

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//to prevent getting API endpoints mixed up with pages prexis your API with /api/<your route here>
//you can then extend out your API without clashing with other routes for serving pages.
// get : /api/gang -> list gangs
// get: /api/gang/:id -> get specific gang details 
// post : /api/gang -> create gang
// put : /api/gang/:id -> update a gang
// delete : /api/gang/:id -> delete a gang

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// SQL connection setup
const connection = mysql.createConnection({
  host: 'localhost', //replace with your database location
  user: 'root', // Replace with your database username its normaly root
  password: '', // Replace with your MySQL root password 
  database: 'qbcoreframework_92deac', // Ensure this database exists
  charset: 'utf8mb4'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the MySQL server.');

  connection.query('CREATE DATABASE IF NOT EXISTS qbcoreframework_92deac', (err, result) => {
    if (err) throw err;
    console.log('Database created or already exists.');

    connection.changeUser({ database: 'qbcoreframework_92deac' }, (err) => {
      if (err) throw err;

      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          gangName VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          hashed_password VARCHAR(255) NOT NULL
        )
      `;
      connection.query(createTableQuery, (err, result) => {
        if (err) throw err;
        console.log('Table created or already exists.');

        const checkColumnQuery = `
          SELECT COLUMN_NAME 
          FROM INFORMATION_SCHEMA.COLUMNS 
          WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'hashed_password'
        `;
        connection.query(checkColumnQuery, (err, result) => {
          if (err) throw err;

          if (result.length === 0) {
            const addColumnQuery = `
              ALTER TABLE users 
              ADD COLUMN hashed_password VARCHAR(255) NOT NULL
            `;
            connection.query(addColumnQuery, (err, result) => {
              if (err) throw err;
              console.log('hashed_password column added.');
            });
          } else {
            console.log('hashed_password column already exists.');
          }
        });
      });
    });
  });
});

// Endpoint to handle form submissions and insert data into the database
app.post('/api/gangform', upload.none(), (req, res) => {
  const { email, gangName, password } = req.body;
  console.log('Received form data:', { email, gangName, password });

  if (!gangName || !email || !password) {
    console.log('Validation failed:', { email, gangName, password });
    return res.status(400).send('Gang name, email, and password are required.');
  }

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.error('Error hashing password:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    const query = 'INSERT INTO users (gangName, email, hashed_password) VALUES (?, ?, ?)';
    console.log('Executing query:', query);

    connection.query(query, [gangName, email, hash], (err, results) => {
      if (err) {
        console.error('Error inserting data into database:', err.stack);
        res.status(500).send('Internal Server Error');
        return;
      }
      console.log('Data inserted successfully:', results);
      res.send('Form data submitted successfully');
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
