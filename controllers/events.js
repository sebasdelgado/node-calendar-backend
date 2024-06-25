const { response } = require("express");
const Evento = require('../models/Evento');

const getEventos = async ( req, res = response) => {

    const eventos = await Evento.find()
                                .populate('user', 'name' );

    res.json({
        ok: true,
        eventos
    });
}

const crearEvento = async ( req, res = response) => {

    const evento = new Evento( req.body );

    try {

        evento.user = req.uid;
        const eventoGuardado = await evento.save();

        res.json({
            ok: true,
            evento: eventoGuardado
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al crear evento'
        });
    }
}

const actualizarEvento = async ( req, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await  Evento.findById( eventoId );

        if ( !evento ) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe con ese id'
            });
        }

        //Validamos que el usuario que desea editar sea el mismo que creó el evento
        if ( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para editar este evento'
            })
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        //Usamos { new: true } para que retorne los datos actualizados y no el viejo registro
        const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true } );

        res.json({
            ok: true,
            evento: eventoActualizado
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al actualizar evento'
        });
    }
}

const eliminarEvento = async ( req, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await  Evento.findById( eventoId );

        if ( !evento ) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe con ese id'
            });
        }

        //Validamos que el usuario que desea eliminar sea el mismo que creó el evento
        if ( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para eliminar este evento'
            })
        }

        await Evento.findByIdAndDelete( eventoId );

        res.json({
            ok: true
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al actualizar evento'
        });
    }
}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}