import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';
import querystring from 'querystring';
import session from 'express-session';
import mysql from 'mysql2/promise';
import cors from 'cors';

dotenv.config();
const app = express();
const port = 3001;

// Setup MySQL connection
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Middleware for session handling
app.use(
  session({
    secret: 'spotify_secret',
    resave: false,
    saveUninitialized: true,
  })
);

app.use(
  cors({
    origin: 'http://localhost:3000', // Allow requests from the frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
    credentials: true, // Allow credentials (cookies, headers, etc.)
  })
);

const redirect_uri = 'http://localhost:3001/auth/callback';

// Spotify login route
app.get('/login', (req, res) => {
  const scope = 'streaming user-read-email user-read-private';
  const authUrl =
    'https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: scope,
      redirect_uri: redirect_uri,
    });

  res.redirect(authUrl);
});

app.get('/auth/callback', async (req, res) => {
  const code = req.query.code || null;

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      querystring.stringify({
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code',
      }),
      {
        headers: {
          Authorization:
            'Basic ' +
            Buffer.from(
              `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
            ).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token } = response.data;

    // Redirect to the frontend with the access token
    res.redirect(`http://localhost:3000/game/setup?token=${access_token}`);
  } catch (error) {
    console.error('Error during authentication:', error.response?.data || error.message);
    res.status(500).send('Authentication failed');
  }
});



// Fetch available years
app.get('/years', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT DISTINCT year FROM songs ORDER BY year');
    res.json(rows.map((row) => row.year));
  } catch (error) {
    console.error('Error fetching years:', error);
    res.status(500).send('Failed to fetch years');
  }
});

// Fetch a random song by year
app.get('/songs', async (req, res) => {
  const { year } = req.query;
  try {
    const [rows] = await db.query(
      'SELECT spotify_link FROM songs WHERE year = ? ORDER BY RAND() LIMIT 1',
      [year]
    );

    if (rows.length) {
      const spotifyLink = rows[0].spotify_link;
      const trackId = spotifyLink.split('/track/')[1]?.split('?')[0]; // Extract track ID
      const spotifyUri = `spotify:track:${trackId}`;
      res.json({ spotify_uri: spotifyUri });
    } else {
      res.status(404).send('No songs found for the given year');
    }
  } catch (error) {
    console.error('Error retrieving song:', error);
    res.status(500).send('Error retrieving song');
  }
});



// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

