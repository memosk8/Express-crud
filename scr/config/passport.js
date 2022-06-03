//estrategia para autentificar al usuario

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/Users');

//Estrategia de autenticacion
passport.use(new LocalStrategy({
    //renombrar el dato username 
    usernameField:'email'

}, async (email, password, done) =>{
    const user = await User.findOne({email:email});
    if(!user){
        return done(null, false, { message:"El usuario no existe" });
    }
    else{
        const match= await user.matchPassword(password);
        if(match){
            return done(null, user);
        } else{
            return done(null, false, {message:"contraseña incorrecta"});
        }
    }
}));

//Serializar al usuario
passport.serializeUser((user, done)=>{
    done(null, user.id);
})

//Deseralizar a los usuarios
passport.deserializeUser((id, done)=>{
    User.findById(id,(err, user)=>{
        done(err,user);
    })
})
