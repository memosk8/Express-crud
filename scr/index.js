const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methoOverride = require('method-override');   // permite utilizar metodos http
const session = require('express-session');
const flash = require('connect-flash');             // es utilizado para guardar variables de sesion
const passport = require('passport');

//Inicializar
const app = express();
require('./database');  // archivo de conexión a mongodb
require('./config/passport');

//configuraciones
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs.engine({                        // Metodo para crear un objeto template
    defaultLayout: 'main',                                // plantilla base principal
    layoutsDir: path.join(app.get('views'), 'layouts'),   // ruta de vistas
    partialsDir: path.join(app.get('views'), 'partials'), // parciales de vistas
    extname: '.hbs'
}));
app.set('view engine', '.hbs');                           // motor de plantillas handlebars
app.use(express.urlencoded({ extended: false }))
app.use(methoOverride('_method'));
app.use(session({
    secret: 'myappsecret',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());   // mensajes por defecto en sesión

//variables globales
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');  // mensaje OK
    res.locals.error_msg = req.flash('error_msg');      // mensaje error
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

//rutas
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));

//archivos estaticos / carpeta pública
app.use(express.static(path.join(__dirname, 'public')));

//servidor arriba!!
app.listen(app.get('port'), () => {
    console.log('Servidor arriba', app.get('port'));
})
