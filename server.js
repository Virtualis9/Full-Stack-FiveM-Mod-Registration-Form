const express = require('express');
const app = express();
const port = 9000;
const multer = require('multer');
const upload = multer();

app.use(express.json());
app.use(express.static('public'))

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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});