const express = require('express');
const app = express();
const port = 3000;
const multer = require('multer');
const upload = multer();

app.get('/', (req, res) => {
  res.send('Express is working!');
});


app.post('/submit', upload.none(), (req, res) => {
  console.log(req.body);
  res.json({ message: 'Form submitted successfully', data: req.body });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
