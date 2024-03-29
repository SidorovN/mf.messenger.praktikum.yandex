const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const { PORT = 80 } = process.env;

const app = express();
const staticPath = path.join(__dirname, 'dist');

app.listen(PORT, () => {
  console.log(`server started at port ${PORT}`);
});

app.use(express.static(staticPath));
app.use('*', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});
