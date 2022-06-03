// conexion a mongodb

const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/notes_db_app')
  .then(db => console.log("Base de datos conectada"))
  .catch(err => console.log(err));
