// conexion a mongodb
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("\n-- Base de datos conectada --\n"))
  .catch(err => console.log(err));
