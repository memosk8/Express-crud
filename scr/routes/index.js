const router = require('express').Router();
const session = require('express-session');

router.get('/', (req, res) => {
  const admin = session.admin
  const username = session.username
  res.render('index', { admin, username })
});

router.get('/about', (req, res) => res.render('about'));

module.exports = router;
