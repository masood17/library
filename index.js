
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const dotenv = require("dotenv");
dotenv.config();

const app = express();

// PostgreSQL connection
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Dummy database
// let books = [];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM books');
    const books = rows;
    res.render('index', { books });
  } catch (err) {
    console.error('Error selecting books', err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/add-book', async (req, res) => {
  const { title, author } = req.body;
  try {
    await pool.query('INSERT INTO books (title, author) VALUES ($1, $2)', [title, author]);
    res.redirect('/');
  } catch (err) {
    console.error('Error adding book', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/delete-book/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM books WHERE id = $1', [id]);
    res.redirect('/');
  } catch (err) {
    console.error('Error deleting book', err);
    res.status(500).send('Internal Server Error');
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
