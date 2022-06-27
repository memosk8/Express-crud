const router = require('express').Router();
const { isAuthenticated } = require('../helpers/auth');
const Category = require('../models/Categories');

router.get('/music', isAuthenticated, async (req, res) => {
   console.log(`\n Solicitud en ${req.url}`)
   const categories = await Category.find({});
   console.log(categories.length)
   res.render('music', { categories});
});
module.exports = router;
