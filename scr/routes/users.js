const router = require('express').Router();
const User = require('../models/Users');
const passport = require('passport');

router.get('/users/signin', (req, res) => {
   res.render('users/signin');
});
router.get('/users/signup', (req, res) => {
   res.render('users/signup');
});

router.post('/users/signin', passport.authenticate('local', {
   successRedirect: '/',
   failureRedirect: '/users/signin',
   failureFlash: true
}));

router.post('/users/signup', async (req, res) => {
   const { nombre, email, password, c_password, admin } = req.body;
   const errors = [];
   if (nombre <= 0) {
      errors.push({ text: 'Inserte un nombre' });
   }
   if (email <= 0) {
      errors.push({ text: 'Inserte un correo' });
   }
   if (password <= 0) {
      errors.push({ text: 'Inserte una contraseña' });
   }
   if (password != c_password) {
      errors.push({ text: 'Las contraseñas no coinciden' });
   }
   if (password.length < 8) {
      errors.push({ text: 'La contraseña debe ser mayor a 4 digitos' });
   }
   if (admin < 0 && admin > 1) {
      errors.push({ text: 'Tipo de usuario invalido XD' });
   }
   if (errors.length > 0) {
      res.render('users/signup', { errors, nombre, email, password, c_password });
   } else {
      const correoUser = await User.findOne({ email: email });
      if (correoUser) {
         console.log('!ok');
         req.flash('error_msg', 'El correo ya fue registrado');
         res.redirect('signin');
      }
      const newUser = new User({ nombre, email, password, c_password, admin });
      newUser.password = await newUser.encryptPassword(password);
      await newUser.save();
      console.log('-- New user created --');
      req.flash('success_msg', 'El registro fue exitoso');
      res.redirect('signin');
   }
})

router.get("/users/logout", (req, res) => {
   req.logOut();
   res.redirect('/');
   req.session.destroy();
})

module.exports = router;