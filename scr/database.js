// conexion a mongodb
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://memosk8:Password123@cluster0.nuhhssx.mongodb.net/tunein?retryWrites=true&w=majority')
  .then(() => console.log("\n-- Base de datos conectada --\n"))
  .catch(err => console.log(err));
