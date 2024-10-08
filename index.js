//importamos los modulos a utilizar
const http = require('http');
const fs = require('fs/promises');
const { URL, URLSearchParams } = require('url');

//creamos el servidor
const server = http.createServer(async (req, res) => {

    //creamos los parametros y rutas 
    const { searchParams, pathname } = new URL(req.url, 'http://${req.headers.host}');
    const params = new URLSearchParams(searchParams);


    //indicamos las acciones a realizar una vez que la ruta sea /animes y el metodo sea GET
    if (pathname === '/animes' && req.method === 'GET') {
        //creamos las variables id y nombre para el metodo GET
        const id = params.get('id');
        const nombre = params.get('nombre');


        //leemos el archivo anime.json, lo parseamos a un JSON y lo guardamos en la variable animes
        const lecturaAnime = await fs.readFile('./anime.json');
        const animes = JSON.parse(lecturaAnime);

        let resultado;

        //si recibimos un id, lo guardamos en la variable resultado
        //si recibimos un nombre, lo guardamos en la variable resultado
        if (id) {
            resultado = animes[id];
        } else if (nombre) {
            resultado = Object.values(animes).find(anime => anime.nombre.toLowerCase() === nombre.toLowerCase());
        } else {
            resultado = Object.values(animes);
        }

        //si el resultado es un array y tiene un elemento, lo guardamos en la variable resultado
        if (Array.isArray(resultado) && resultado.length === 1) {
            resultado = resultado[0];
        }

        //si resultado tiene un valor, lo enviamos al cliente con el status 200 y el formato de JSON si no lo enviamos con el status 404
        if (resultado) {
            res.writeHeader(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(resultado));
        } else {
            res.writeHeader(404, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({ error: 'No se encontró el anime' }));
        }
        res.end();
    }

    //indicamos las acciones a realizar una vez que la ruta sea /animes y el metodo sea POST
    if (pathname === '/animes' && req.method === 'POST') {
        try {
            let animesOriginales = {};
            let datosAnime = [];

            // Verificamos si se envían los datos del anime en el cuerpo de la solicitud
            req.on('data', (data) => {
                datosAnime.push(data);
            });

            req.on('end', async () => {
                if (datosAnime.length === 0) {
                    res.statusCode = 400;
                    res.end('No se enviaron los datos del anime');
                    return;
                }

                // Comprobamos si existe el archivo con una promesa, si existe lo leemos y lo guardamos en la variable animesOriginales
                if (await fs.access('./anime.json').then(() => true).catch(() => false)) {
                    const animeOriginal = await fs.readFile('./anime.json');
                    animesOriginales = JSON.parse(animeOriginal);
                }

                // Creamos un id para el anime y lo agregamos al objeto animesOriginales con ese id
                const id = Object.keys(animesOriginales).length + 1;
                let newId = id;
                while (animesOriginales.hasOwnProperty(newId.toString())) {
                    newId++;
                }
                animesOriginales[newId.toString()] = JSON.parse(Buffer.concat(datosAnime).toString());

                // Escribimos el nuevo anime en el archivo anime.json
                await fs.writeFile('./anime.json', JSON.stringify(animesOriginales, null, 4));

                // Enviamos un mensaje de confirmación al cliente
                res.write('Anime creado con éxito');
                res.end();
            });
        } catch (error) {
            // En caso de error lo mostramos por consola y devolvemos un error 500
            console.error(error);
            res.statusCode = 500;
            res.end('Error interno del servidor');
        }
    }

    //indicamos las acciones a realizar una vez que la ruta sea /animes y el Metodo sea PUT
    if (pathname === '/animes' && req.method === 'PUT') {

        //recibimos el id y lo guardamos en la variable id
        const id = params.get('id');

        //leemos el archivo anime.json, lo parseamos a un JSON y lo guardamos en la variable animesOriginales
        const archivoAnimes = await fs.readFile('./anime.json');

        const animesOriginales = JSON.parse(archivoAnimes);


        let datosParaModificar;

        //recibimos los datos del body y lo guardamos en la variable datosParaModificar
        req.on('data', (data) => {
            datosParaModificar = JSON.parse(data);
        });

        //creamos un id para el anime y lo agrega al objeto animesOriginales con ese id, escribimos el nuevo anime en el archivo anime.json y enviamos un mensaje de confirmacion al cliente
        req.on('end', async () => {

            const animeOriginal = animesOriginales[id];

            const animeaActualizado = {
                ...animeOriginal,
                ...datosParaModificar
            };

            animesOriginales[id] = animeaActualizado;

            await fs.writeFile('./anime.json', JSON.stringify(animesOriginales, null, 4));

            res.write('Anime actualizado con exito');

            res.end();
        });
    }

    //indicamos las acciones a realizar una vez que la ruta sea /animes y el metodo sea DELETE
    if (pathname === '/animes' && req.method === 'DELETE') {

        //recibimos el id y lo guardamos en la variable id
        const id = params.get('id');

        //leemos el archivo anime.json, lo parseamos a un JSON y lo guardamos en la variable animesOriginales
        const archivoAnimes = await fs.readFile('./anime.json');

        const animesOriginales = JSON.parse(archivoAnimes);

        //eliminamos el anime con el id enviado y escribimos el nuevo anime en el archivo anime.json y enviamos un mensaje de confirmacion al cliente
        delete animesOriginales[id];

        await fs.writeFile('./anime.json', JSON.stringify(animesOriginales, null, 4));

        res.write('Anime eliminado con exito');

        res.end();
    }

})//indicamos que en el puerto 3000 ejecute el servidor y muestre un mensaje en consola 
    .listen(3000, function () {
        console.log('servidor escuchando en el puerto 3000');
    });

//exportamos el servidor
module.exports = server;