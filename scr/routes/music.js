const router = require('express').Router();
const { isAuthenticated } = require('../helpers/auth');
const Category = require('../models/Categories');
const session = require('express-session');

// listado de categorías tunein
router.get('/music', isAuthenticated, async (req, res) => {
   console.log(`\n Solicitud en ${req.url}`)
   const categories = await Category.find({}).lean();
   categories.forEach((cat) => {
      cat.content.forEach((elem) => {
         if (elem.length > 200) {
            elem = elem.substr(0, 100)
         }
      })
   })
   const admin = session.admin
   const username = session.username
   res.render('music/music', { categories, admin, username });
});

// formulario nueva categoría
router.get('/music/add', isAuthenticated, (req, res) => {
   const admin = session.admin
   const username = session.username
   res.render('music/new-category', { admin, username });
});

// obtención de los datos y creación de una nueva categoría
router.post('/music/new-category', isAuthenticated, async (req, res) => {
   const { title } = req.body;
   const errors = [];
   const content = [];
   const request = Object.entries(req.body)
   // el primer elemento es el tipo de solicitud y se elimina
   request.shift();
   // se obtienen todos los elementos de la nueva categoría 
   request.forEach(element => {
      content.push(element[1])
   });

   if (!title) {
      errors.push({ text: 'Por favor ingrese un valor en el titulo' })
   }
   if (!content) {
      errors.push({ text: 'Favor de ingresar valores' });
   }
   if (errors.length > 0) {
      res.render('music/new-category', {
         errors,
         title,
         content
      });
   } else {
      const category = new Category({ created_at: new Date().toISOString(), updated_at: '', title, content });
      category.date = new Date();
      await category.save();
      req.flash('success_msg', 'Categoría Agregada');
      res.redirect('/music');
   }
});

// vista de edición de categoría
router.get('/music/edit/:id', isAuthenticated, async (req, res) => {
   const category = await Category.findById(req.params.id).lean();
   res.render('music/edit-category', { category })
});

//actualizar la categoria en la base de datos
router.put('/music/edit-category/:id', isAuthenticated, async (req, res) => {
   const { title } = req.body;
   const content = []
   const request = Object.entries(req.body)
   // se omite el metodo de la solicitud
   request.shift();
   // y y el titulo de la seccion
   request.shift();
   request.forEach(element => {
      content.push(element[1])
   });

   await Category.findByIdAndUpdate(req.params.id, { updated_at: new Date().toISOString(), title, content });
   req.flash('success_msg', 'Categoria editada');
   res.redirect('/music');
});

//eliminar los datos
router.delete('/music/delete/:id', isAuthenticated, async (req, res) => {
   await Category.findByIdAndDelete(req.params.id);
   req.flash('success_msg', 'Categoria Eliminada');
   res.redirect('/music');
});

module.exports = router;
