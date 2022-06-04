// modulos 
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')

// incializar 
const app = express();
require('./database');

// configs 
app.set('port', process.env.port || 3000);
app.set('views', path.join(__dirname, 'views'));

// metodo para crear un template
app.engine('.hbs', exphbs.engine({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs'
}));

app.set('view engine', '.hbs');

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(session({
  secret: 'myappsecret',
  resave: true,
  saveUninitialized: true 
}));
app.use(flash()); // mensajes de manera global para todo el projecto
app.use((req, res, next) => {
  // variable global de mensaje de éxito
  res.locals.success_msg = req.flash('success_msg');
  // variable global de mensaje de error
  res.locals.error_msg = req.flash('error_msg');
  next();
})

// variables globales


// rutas 
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/user'));

// archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// servidor arriba
app.listen(app.get('port'), () => console.log("Servidor arriba :: puerto: ", app.get('port')));
