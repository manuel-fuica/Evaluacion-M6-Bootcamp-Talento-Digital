EVALUACION Manuel Fuica:

## Creacion de un servidor con Node, instalacion de paquetes necesarios, consumo de datos desde un archivo json usando postman
## Se pueden ver los animes, crear un anime, actualizar un anime y eliminar, tambien modifica el archivo json
## Se utilizo mocha y chai para realizar dos test, uno para el metodo GET y otro para el metodo POST


Realice dos pruebas para el metodo GET y una para el metodo POST, utilice mocha y chai, le deje una imagen de la preuba en la carpeta test,
ademas para realizar las pruebas en Postman utilice la siguiente sintaxis:

GET : localhost:3000/animes
Muestra todos los animes 

GET: localhost:3000/animes?id=2
Muestra solo el anime con el id 2

GET: localhost:3000/animes?nombre=Dragon+Ball
Muestra solo el anime con el nombre Dragon Ball


--------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Metodo POST:

POST: localhost:3000/animes

En el body enviamos un objeto json :
{
    "nombre": "Slam Dunk",
    "genero": "Shonen",
    "año": "1996",
    "autor": "Takehiko Inoue"
}

se envia a nuestro archivo animes.Json, lo guarda y ademas le crea un id correspondiente

-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Metodo Put:

PUT: localhost:3000/animes?id=2

Enviamos la URL con el ID del anime que queremos modificar, en este caso modificamos el nombre del anime con el ID 2

En el body enviamos lo siguiente:

{
    "nombre": "Nombre cambiado con PUT"
}

y luego con un GET: localhost:3000/animes?id=2   vemos el resultado, ahora el anime con el ID 2 tendra otro nombre

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Metodo DELETE:

DELETE: localhost:3000/animes?id=7

Con el metodo DELETE y pasandole la URL del anime que queremos eliminar eliminamos el anime
En este caso eliminamos el anime con el ID 7 y luego con un GET: localhost:3000/animes podemos ver que ya no existe el anime con el ID 7

