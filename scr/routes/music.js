const router = require('express').Router();
const { isAuthenticated } = require('../helpers/auth');
const Category = require('../models/Categories');

router.get('/music', isAuthenticated, async (req, res) => {
   console.log(`\n Solicitud en ${req.url}`)
   const categories = await Category.find({}).lean();
   res.render('music/music', { categories });
});

router.get('/music/edit/:id', isAuthenticated, async (req, res) => {
   //consulta a la base de datos
   const category = await Category.findById(req.params.id).lean();
   res.render('music/edit-category', { category })
});

//actualizar las categorias en la base de datos
router.put('/music/edit-category/:id', isAuthenticated, async (req, res) => {
   const { title } = req.body;
   const content = []
   const response = Object.entries(req.body)
   // se omite el metodo de la solicitud
   response.shift();
   // y y el titulo de la seccion
   response.shift();
   response.forEach(element => {
      content.push(element[1])
   });

   await Category.findByIdAndUpdate(req.params.id, { title, content });
   req.flash('success_msg', 'Categoria editada');
   res.redirect('/music');
});

module.exports = router;
