import express from 'express';
import pool from './database/connection.js'
import registration from './routes/registration.routes.js'
import bodyParser from 'body-parser';
import cors from 'cors';
const app = express();
app.use(bodyParser.json());
app.use(cors());


// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Failed to connect to the database:', err.message);
  } else {
    console.log('Connected to the database successfully!');
    release();
  }
});

app.use('/registration',registration);


// Start the server
app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
