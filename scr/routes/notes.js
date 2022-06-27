const res = require('express/lib/response');
const Notes = require('../models/Notes');
const Note = require('../models/Notes');
const router = require('express').Router();
const { isAuthenticated } = require('../helpers/auth')

router.get('/notes/add', isAuthenticated, (req, res) => { //muestra la vista del formulario 
    res.render('notes/new-notes');
});

router.post('/notes/new-notes', isAuthenticated, async (req, res) => {
    //Inicializador el objeto donde 
    /*const obj = JSON.parse(JSON.stringify(req.body));
    console.log(obj);
    res.send('Datos recibidos correctramente');*/
    const { titulo, descripcion } = req.body;
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

router.get('/notes', isAuthenticated, async (req, res) => {
    const notes = await Notes.find({ user: req.user.id }).sort({ fecha: 'desc' }).lean();
    res.render('notes/all-notes', { notes });
});

router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
    //consulta a la base de datos
    const note = await Note.findById(req.params.id).lean();
    res.render('notes/edit-note', { note })
});

//actualizar los datos en la base de datos
router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) => {
    const { titulo, descripcion } = req.body;
    await Note.findByIdAndUpdate(req.params.id, { titulo, descripcion });
    req.flash('success_msg', 'Editado correctamente');
    res.redirect('/notes');
});
//eliminar los datos
router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Eliminada correctamente correctamente');
    res.redirect('/notes');
});

module.exports = router;