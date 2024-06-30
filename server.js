const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Express is working!');
});

app.get('/index', (req, res)=>{
    res.render()
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
