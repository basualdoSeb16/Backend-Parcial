
## Nombre del Proyecto: 

*** Biblioteca Virtual ***

## Tecnologias usadas:

# Para el Backend:

* Node.js (Version 24.15.0)
* Express 
* Prisma (Version 7)
* Nodemon
* Morgan
* MySQL

## Instrucciones de instalacion:

* ACLARACION: Esta guia fue realizada para usuarios del sistema operativo Windows y utilizando npm (Node Package Manager) que es el gestor de paquetes predeterminado para Node.js
(Se va a suponer que el usuario ya tiene instalado Node.js, MySQL, MySQL Workbench y Git en su maquina).
Tambien se debe crear una base de datos vacia utilizando MySQL Workbench.

- Primero se debe clonar el repositorio en una carpeta vacia utilizando el comando 'git clone' seguido de la url del repositorio (ej: git clone https://github.com/username/repositorio.git) en una terminal, o bien descargando el repositorio en formato .zip desde github.

- Una vez que tenemos el clon del repositorio de manera local se debe seguir con la instalacion de las dependencias abriendo una terminal desde Visual Studio Code o posicionando en el repositorio.

- El comando 'npm install' (o su abreviación 'npm i') se utiliza para descargar e instalar las dependencias de un proyecto de Node.js. Su comportamiento cambia según cómo lo ejecutes y los argumentos que incluyas.

- En este caso cuando ejecutas 'npm install' dentro del repositorio clon que contiene un archivo package.json, leerá ese archivo y descargará automáticamente todas las librerías listadas allí en una carpeta llamada node_modules y se crearan otras más dependiendo de las dependecias.

- Se descargaran de manera automatica las dependencias necesarias (Node modules, Express, Prisma, morgan, etc).

- Comandos para ver las versiones de las dependencias en consola dentro de la carpeta del repositorio:

* Prisma & @prisma/client : 'npx prisma version' o 'npx prisma -v'
* Express: 'npm list express'
* Nodemon: 'npx nodemon -v'
* Morgan: 'npm ls morgan'

- Comprobar en consola que todo se haya descargado de manera correcta, de lo contrario se debera instalar de manera manual.

- Configurar las variables de entorno:
Si todo esta instalado de manera correcta, ahora se debe crear un archivo '.env' dentro de la carpeta raíz del repositorio local. Usando el archivo '.env.example' como referencia, se deben crear las mismas variables dentro del archivo .env creado recien pero completando los datos de las variables con los de la base de datos local del usuario (consultar host, usuario, contraseña, nombre de la base de datos en MySQL Workbench para armar la url).

- Comprobar datos en archivo 'db.js':
Dentro del archivo 'db.js' se debe cambiar el valor de las variables port y host con los correspondientes a la base de datos local.

## Instrucciones de ejecución

- Una vez instalado y configurados los archivos correspondientes...