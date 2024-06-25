/*
    Rutas de Usuarios / Events
    host + api/events
*/

const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { check } = require('express-validator');
const { isDate } = require('../helplers/isDate');

const router = Router();

//Cualquier petición que este abajo de esto debe tener el token validado
router.use( validarJWT );

//Obtener eventos
router.get('/', getEventos );

//Crear un evento
router.post(
    '/',[
        check('title','El titulo es obligatorio').not().isEmpty(),
        check('start','Fecha de inicio es obligatoria').custom( isDate ),
        check('end','Fecha de finalizacion es obligatoria').custom( isDate ),
        validarCampos
    ], crearEvento );

//Actualizar evento
router.put('/:id', actualizarEvento );

//Borrar evento
router.delete('/:id', eliminarEvento );

module.exports = router;