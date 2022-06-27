const router = require('express').Router();
const { isAuthenticated } = require('../helpers/auth');
const Category = require('../models/Categories');

router.get('/music', isAuthenticated, async (req, res) => {
   console.log(`\n Solicitud en ${req.url}`)
   const categories = await Category.find({}).lean();
   categories.forEach(section => {
      console.log(section)
   });
   res.render('music/music', { categories});
});

router.get('/music/edit/:id', isAuthenticated, async (req, res) => {
   //consulta a la base de datos
   const categories = await Category.findById(req.params.id).sort(-1).lean();
   categories.forEach(category => {
      category.total = category.content.length
   });
   res.render('music/edit-category', { category })
});
module.exports = router;
