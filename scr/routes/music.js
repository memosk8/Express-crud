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
   const content = Object.entries(req.body)
   content.slice(0,1)
   console.log(content)
   await Category.findByIdAndUpdate(req.params.id, { title });
   req.flash('success_msg', 'Editado correctamente');
   res.redirect('/music');
});

module.exports = router;
