const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const questionsRoutes = require('./routes/questions');
const articleRoutes = require('./routes/articles');
const scheduleRoutes = require('./routes/schedule');
const searchIndexRoutes = require('./routes/searchIndex');

const port = process.env.PORT || 3000;
mongoose.connect(`mongodb://${process.env.ANTIVAX_SERVER_DB_USER}:${process.env.ANTIVAX_SERVER_DB_PASS}@${process.env.ANTIVAX_SERVER_DB_HOST}/${process.env.ANTIVAX_SERVER_DB_NAME}`, {
  useMongoClient: true
});

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// use morgan to log requests to the console
app.use(morgan('dev'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token')
  res.header('Access-Control-Allow-Methods', 'GET, HEAD, POST, PUT, DELETE, OPTIONS')
  res.header('Allow', 'GET, HEAD, POST, PUT, DELETE, OPTIONS')
  next()
});

app.get(`${process.env.ANTIVAX_SERVER_API_PREFIX}/`, (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'working'
    }
  });
});

app.use(`${process.env.ANTIVAX_SERVER_API_PREFIX}/auth`, authRoutes);
app.use(`${process.env.ANTIVAX_SERVER_API_PREFIX}/users`, usersRoutes);
app.use(`${process.env.ANTIVAX_SERVER_API_PREFIX}/questions`, questionsRoutes);
app.use(`${process.env.ANTIVAX_SERVER_API_PREFIX}/articles`, articleRoutes);
app.use(`${process.env.ANTIVAX_SERVER_API_PREFIX}/schedule`, scheduleRoutes);
app.use(`${process.env.ANTIVAX_SERVER_API_PREFIX}/searchIndex`, searchIndexRoutes);

app.listen(port, () => console.log(`Vaccine Answers Server is now active on port ${port}`));