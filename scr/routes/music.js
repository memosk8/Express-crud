const router = require('express').Router();
const { isAuthenticated } = require('../helpers/auth');
const Category = require('../models/Categories');

router.get('/music', isAuthenticated, async (req, res) => {
   console.log(`\n Solicitud en ${req.url}`)
   const categories = await Category.find({}).lean();
   res.render('music/music', { categories });
});

router.get('/music/add', isAuthenticated, (req, res) => { //muestra la vista del formulario 
   res.render('music/new-category');
});

router.post('/notes/new-category', isAuthenticated, async (req, res) => {

   const { title, content } = req.body;
   const errors = []; // guardar los errores que se generen
   if (!titulo) {
      errors.push({ text: 'Por favor ingrese un valor en el titulo' }); //Verifica si el campo esta vacio manda llamar el error
   }
   if (!descripcion) {
      errors.push({ text: 'Favor de ingresar el valor' }); // verifica si la descripcion esta vacia y manda llamar el error
   }
   if (errors.length > 0) {
      res.render('notes/new-notes', {
         errors,                         // recorre el arreglo para verificar que no haya errores
         titulo,
         descripcion
      });
   } else {
      // res.send('Todo bien, con el futuro de mexico');
      const NewNotes = new Notes({ titulo, descripcion });
      NewNotes.user = req.user.id;
      await NewNotes.save(); //para indicar que esa accion la a¿hara de manera asincrona 
      req.flash('success_msg', 'Agregada correctamente');
      res.redirect('/notes');
   }
});

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
