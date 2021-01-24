const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const { PORT = 3000 } = process.env;

const app = express();
const staticPath = path.join(__dirname, 'assets');

app.listen(PORT, () => {
  console.log(`server started at port ${PORT}`);
});

app.use(express.static(staticPath));
//
// router.get('/', (req, res) => {
//   res.sendFile(path.join(staticPath, 'index.html'));
// });
//
// router.get('/profile', (req, res) => {
//   res.sendFile(path.join(staticPath, 'profile.html'));
// });
//
// router.get('/login', (req, res) => {
//   res.sendFile(path.join(staticPath, 'login.html'));
// });
//
// router.get('/signup', (req, res) => {
//   res.sendFile(path.join(staticPath, 'signup.html'));
// });
//
// router.get('/chat', (req, res) => {
//   res.sendFile(path.join(staticPath, 'chat', 'index.html'));
// });
//
// router.get('/chat/:id', (req, res) => {
//   res.sendFile(path.join(staticPath, 'chat', 'id.html'));
// });
//
// router.get('/500', (req, res) => {
//   res.sendFile(path.join(staticPath, '500.html'));
// });
//
// router.get('/404', (req, res) => {
//   res.sendFile(path.join(staticPath, '404.html'));
// });
//
// app.use(router);
