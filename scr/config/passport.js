const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/Users');
const session = require('express-session');

//Estrategia de autenticacion
passport.use(new LocalStrategy(
	{ usernameField: 'email' },
	async (email, password, done) => {
		const user = await User.findOne({ email: email })
		session.admin = user.admin;
		session.email = user.email;
		session.username = user.nombre;
		session.date = user.fecha
		if (!user) return done(null, false, { message: "El usuario no existe" })
		else {
			const match = await user.matchPassword(password)
			if (match) return done(null, user)
			else return done(null, false, { message: "contraseña incorrecta" })
		}
	}
));

//Serializar al usuario
passport.serializeUser((user, done) => done(null, user.id))

//Deseralizar a los usuarios
passport.deserializeUser((id, done) => {
	User.findById(id, (err, user) => done(err, user))
})
