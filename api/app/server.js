const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const cookieParser = require('cookie-parser');

const session = require('express-session');
const MongoStore = require('connect-mongo');
const verifyJWT = require('./middlewares/verifyJWT');

// === Setting up port ===
const URI = process.env.URI;
const port = process.env.PORT || 8080;

// === 1 - CREATE APP ===
const app = express();

// View engine configuration
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.disable('x-powered-by');

// === 2 - CREATE DATABASE ===
// Set up mongoose's promise to global promise
mongoose.promise = global.Promise;
mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
  })
  .then(console.log('Connected to database'))
  .catch((err) => console.log(err));

app.use(cookieParser());

// === 4 - CONFIGURE ROUTES ===
// Configure Route
require('./routes/index')(app);

// === 5 - START UP SERVER ===
app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`),
);
