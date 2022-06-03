
//Modulos
const express = require('express');
const path =require('path');
const exphbs = require('express-handlebars');
const methoOverride = require ('method-override'); // permite utilizar metoso ademos del get y post
const session = require ('express-session'); //es utilizado para guardar variables de sesion
const flash = require('connect-flash');
const res = require('express/lib/response');
const passport = require('passport');

//Inicializar
const app = express();
require('./database');
require('./config/passport');


//configuraciones
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
//Metodo para crear un objeto template
app.engine('.hbs', exphbs.engine({
    defaultLayout:'main',
    layoutsDir:path.join(app.get('views'),'layouts'), // donde vas a crear mas vistas
    partialsDir: path.join(app.get('views'),'partials'),
    extname: '.hbs'
}));
app.set('view engine','.hbs');
//Middlewares funciones que son ejecutadas antes de que lleguen al servidor : intermediaro entre el servido y el usuario
app.use(express.urlencoded({extended:false}))
app.use(methoOverride('_method'));
app.use(session({
    secret:'myappsecret',
    resave: true,
    saveUninitialized:true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
//Agregar el middleware para flash


//variables globales
//agregar variables globales
app.use((req, res, next)=>{
   //Variable global que gaurda mensajes de succes
    res.locals.success_msg = req.flash('success_msg');
    //Variable global que gaurda mensajes de succes
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

//routes
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));
//archivos estaticos
app.use(express.static(path.join(__dirname,'public')));

//servidor arriba!!
app.listen(app.get('port'),()=>{
    console.log('Servidor arriba', app.get('port'));
})