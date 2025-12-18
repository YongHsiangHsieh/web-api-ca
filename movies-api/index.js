import dotenv from 'dotenv';
import express from 'express';
import usersRouter from './api/users';
import moviesRouter from './api/movies';
import peopleRouter from './api/people';
import './db';
import cors from 'cors';

dotenv.config();

const errHandler = (err, req, res, next) => {
  /* I check if NODE_ENV is set to hide detailed errors,
  otherwise I display the full stack trace for debugging  */
  if(process.env.NODE_ENV === 'production') {
    return res.status(500).send(`Something went wrong!`);
  }
  res.status(500).send(`Error caught 👍👍. Here are the details: ${err.stack} `);
};

const app = express();

// Enable CORS for all requests
app.use(cors());

const port = process.env.PORT;

app.use(express.json());

//Users router
app.use('/api/users', usersRouter);

//Movies router
app.use('/api/movies', moviesRouter);

//People router
app.use('/api/people', peopleRouter);

app.use(errHandler);

app.listen(port, () => {
  console.info(`Server running at ${port}`);
});