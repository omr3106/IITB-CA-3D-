const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/opening', (req, res) => {
  res.sendFile(path.join(__dirname, 'opening.html'));
});

app.get('/exhibitions', (req, res) => {
  res.sendFile(path.join(__dirname, 'exhibitions.html'));
});

app.get('/workshops', (req, res) => {
  res.sendFile(path.join(__dirname, 'workshops.html'));
});

app.get('/schedule', (req, res) => {
  res.sendFile(path.join(__dirname, 'schedule.html'));
});

app.get('/venue', (req, res) => {
  res.sendFile(path.join(__dirname, 'venue.html'));
});

app.listen(PORT, () => {
  console.log(`IITB Techfest site running at http://localhost:${PORT}`);
});
