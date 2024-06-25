const jwt = require('jsonwebtoken');

const generarJWT = ( uid, name ) => {

    return new Promise (( resolve, reject ) => {

        const payload = { uid, name };

        //payload : data que va a contener mi token
        //SECRET_JWT_SEED, Palabra secreta para firmar tokens 
        jwt.sign( payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '2h'
        }, ( err, token ) => {

            if( err ) {
                console.log(err);
                reject('No se pudo generar el token');
            }

            resolve( token );
        });
    });
}

module.exports = {
    generarJWT
}