const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const routes = require('./controllers');
const helpers = require('./utils/helpers'); // Ensure you have this file
const sequelize = require('./config/connection');


const app = express();
const PORT = process.env.PORT || 3001;

// Create the Handlebars.js engine object with custom helper functions and partials directory
const hbs = exphbs.create({
  helpers: require('./utils/helpers'),  // Ensure this file exports an object of helpers
  partialsDir: path.join(__dirname, 'views/partials'), // Register partials directory
  layoutsDir: path.join(__dirname, 'views/layouts'), 
  defaultLayout: 'main' // Register layouts directory
});

// Inform Express.js which template engine we're using
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET, // Replace with a strong secret
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening on http://localhost:${PORT}`));
});