const express = require('express');
const res = require('express/lib/response');
const app = express();
const port = 9001;
const multer = require('multer');
const upload = multer();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

//middleware 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())


//serve the HTML from your server, you won't have the CORS issues then as the origins are the same.
//you could add routes for /gangs and server gangs.html etc ...  
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

//to prevent getting API endpoints mixed up with pages prexis your API with /api/<your route here>
//you can then extend out your API without clashing with other routes for serving pages.
// get : /api/gang -> list gangs
// get: /api/gang/:id -> get specific gang details 
// post : /api/gang -> create gang
// put : /api/gang/:id -> update a gang
// delete : /api/gang/:id -> delete a gang
app.post('/api/gangform', upload.none(), (req, res) => {
  console.log(req.body);
  res.json({ message: 'Form submitted successfully', data: req.body });
  res.sendFile(__dirname + '/thankyou.html')
});

// bcrypt.hash(password, saltRounds, (err, hash)=>{
//   if(err){
//     console.error('Error hashing password:' , err);
//     res.status(500).send('Internal Server Error');
//     return;
//   }
// })

//sends form into database
app.post('/api/gangform', (req, res)=>{
  const {gangName, email, password} = req.body;
  const query = 'INSERT INTO users (name, email, hashed_password) VALUES (?, ?, ?)';
  connection.query(query, [gangName, email, password], (err, results)=>{
    if (err){
      console.log('Error inserting data into database:', err.stack);
      res.status(500).send('Internal Server Error');
      return;
    }
    console.log('Data inserted successfully:', results);
    res.send('Form data submitted successfully');
  });

});

//SQL DATABASE HANDLING BELOW & START SERVER

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Replace with your MySQL root password
  database: 'gtaform' //replace with database name
});

// Connect to the MySQL server
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the MySQL server.');

  // Create the database if it does not exist
  connection.query('CREATE DATABASE IF NOT EXISTS gtaform', (err, result) => {
    if (err) throw err;
    console.log('Database created or already exists.');

    // Switch to the new database
    connection.changeUser({database : 'gtaForm'}, (err) => {
      if (err) throw err;

      // Create a new table if it does not exist
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
        
        const checkColumnQuery = 
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'hashed_password'`;

        connection.query(checkColumnQuery, (err, result)=>{
          if (err) throw err;

          if(result.length === 0){
           //add new column here
           const addColumnQuery = `ALTER TABLE users ADD COLUMN
           hashed_password VARCHAR(255) NOT NULL`;

           connection.query(addColumnQuery, (err, result)=>{
            if (err) throw err;
            console.log('hashed_password column added.');
           });
          }else {
            console.log('hashed_password column already exits')
          }

        })
        
        // connection.end();
      });
    });
  });
});



// start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});