const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const cookieParser = require('cookie-parser');

const session = require('express-session');
const MongoStore = require('connect-mongo');

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
    origin: process.env.CLIENT_URL,
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

// === 3 - INITIALIZE SESSION AND PASSPORT MIDDLEWARE ===
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//     autoRemove: 'native',
//     cookie: {
//       httpOnly: true,
//       secure: false,
//       maxAge: 1000 * 60 * 60 * 7,
//     },
//     store: MongoStore.create({
//       mongoUrl: process.env.URI,
//     }),
//   }),
// );
app.use(cookieParser());
// app.use(passport.session());
app.use(passport.initialize());
require('./middlewares/jwt')(passport);

// === 4 - CONFIGURE ROUTES ===
// Configure Route
require('./routes/index')(app);

// === 5 - START UP SERVER ===
app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`),
);
