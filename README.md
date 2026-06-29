
# Nombre del Proyecto: 

*** Biblioteca Virtual ***

## Integrantes del Grupo:

* Basualdo Sebastian
* Bulacio Ignacio Tomas
* Cordoba Bruno
* Cordoba Brenda

# Tecnologias & Middlewares usados:

## Para el Backend:

* Node.js (Version 24.15.0)
* Express 
* Prisma (Version 7)
* Nodemon
* Morgan
* Json Web Token
* Bcrypt
* MySQL

## Instrucciones de instalacion:

* ACLARACION: Esta guia fue realizada para usuarios del sistema operativo Windows y utilizando npm (Node Package Manager) que es el gestor de paquetes predeterminado para Node.js
(Se va a suponer que el usuario ya tiene instalado Node.js, MySQL, MySQL Workbench y Git en su maquina).
Tambien se debe crear una base de datos vacia utilizando MySQL Workbench.

- Primero se debe clonar el repositorio en una carpeta vacia utilizando el comando 'git clone' seguido de la url del repositorio (ej: git clone https://github.com/username/repositorio.git) en una terminal, o bien descargando el repositorio en formato .zip desde github.

- Una vez que tenemos el clon del repositorio de manera local se debe seguir con la instalacion de las dependencias abriendo una terminal desde Visual Studio Code o posicionando en el repositorio.

- (Para clonar una rama específica de un repositorio de GitHub directamente en tu computadora, abre tu terminal o consola y utiliza el siguiente comando:
            git clone --branch <nombre-de-la-rama> --single-branch <URL-del-repositorio>
    También puedes usar la versión corta del parámetro utilizando -b en lugar de --branch:
            git clone -b <nombre-de-la-rama> <URL-del-repositorio>).

- El comando 'npm install' (o su abreviación 'npm i') se utiliza para descargar e instalar las dependencias de un proyecto de Node.js. Su comportamiento cambia según cómo lo ejecutes y los argumentos que incluyas.

- En este caso cuando ejecutas 'npm install' dentro del repositorio clon que contiene un archivo package.json, leerá ese archivo y descargará automáticamente todas las librerías listadas allí en una carpeta llamada node_modules y se crearan otras más dependiendo de las dependecias.

- Se descargaran de manera automatica las dependencias necesarias y middlewares:
* Node modules, Express, Prisma, morgan, jsonwebtoken, bcrypt, cors.

- Comandos para ver las versiones de las dependencias en consola dentro de la carpeta del repositorio:

* Prisma & @prisma/client : 'npx prisma version' o 'npx prisma -v'
* Express: 'npm list express'
* Nodemon: 'npx nodemon -v'
* Morgan: 'npm ls morgan'

- Comprobar en consola que todo se haya descargado de manera correcta, de lo contrario se debera instalar de manera manual.

- Configurar las variables de entorno:
Si todo esta instalado de manera correcta, ahora se debe crear un archivo '.env' dentro de la carpeta raíz del repositorio local. Usando el archivo '.env.example' como referencia, completar los datos de las variables con los de la base de datos local del usuario (consultar host, usuario, contraseña, nombre de la base de datos en MySQL Workbench para armar la url. Crear una cadena de caracteres para la JWT_SECRET).

- Comprobar datos en archivo 'db.js':
Dentro del archivo 'db.js' se debe cambiar el valor de las variables port y host con los correspondientes a la base de datos local.

## Instrucciones de ejecucion:

- Se pueden realizar las peticiones http utilizando extensiones como Thunder Client, REST client, etc.

- Tambien puede usar el comando: 'npx prisma studio' para acceder y manipular datos del backend.