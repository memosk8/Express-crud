const router = require('express').Router();
const { isAuthenticated } = require('../helpers/auth');
const Category = require('../models/Categories');

Category.CategoriesSchema.add({date: Date})

// listado de categorías tunein
router.get('/music', isAuthenticated, async (req, res) => {
   console.log(`\n Solicitud en ${req.url}`)
   const categories = await Category.find({}).lean();
   res.render('music/music', { categories });
});

// formulario nueva categoría
router.get('/music/add', isAuthenticated, (req, res) => { //muestra la vista del formulario 
   res.render('music/new-category');
});

// obtención de los datos y creación de una nueva categoría
router.post('/music/new-category', isAuthenticated, async (req, res) => {
   const {title} = req.body;
   const errors = [];
   const content = [];
   const request = Object.entries(req.body)
   // se omite el metodo de la solicitud
   request.shift();
   // y y el titulo de la seccion
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
      const category = new Category({ title, content });
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

   await Category.findByIdAndUpdate(req.params.id, { title, content });
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
