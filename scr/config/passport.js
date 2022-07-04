const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/Users');
const session = require('express-session');

//Estrategia de autenticacion
passport.use(new LocalStrategy(
	{ usernameField: 'email' },
	async (email, password, done) => {
		const user = await User.findOne({ email: email })
		// se guarda el valor de admin en una variable de sesión
		// para consultarla al momento de mostrar botones para el crud
		// cuando admin == false solo se muestran los registros
		// cuando admin == true se muestra el boton de agregar nueva categoria, editar y eliminar categoría
		session.admin = user.admin;
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
