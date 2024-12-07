# Contributin

Contributing explica como configurar los requerimientos del projecto

## Instalación

Antes de desarrollar, es necesario tener instalado:

* [NodeJS y NPM](https://nodejs.org/)
* [MongoDB](https://www.mongodb.com)
  
## Ejecución

### Configuración de entornos

Antes de ejecutar la apliación, es recomendable revisar las variables de entorno para la correcta configuración del proyecto, estas se pueden revisar aquí:

```.env
********* ui/.env *********
REACT_APP_LOCALE=es-ES
REACT_APP_BASE_URI=
REACT_APP_API_URI=http://localhost:4000
SECRET=e89f987sdfs9d879f8798dsf78978
```

* `REACT_APP_LOCALE` configura el idioma local del proyecto.
* `REACT_APP_API_URI` configura la url a la que la API apuntará.
* `REACT_APP_BASE_URI` configura un path extra para la uri si fuera necesario (si se configura con por ejemplo `/extra` la url final será `http://localhost:4000/extra/...`)
* `SECRET` configura el secreto del JWT (para verificación, actualmente no tiene uso)

```.env
********* api/.env *********
#can be 'development' or 'production'
NODE_ENV=development

#your app port
PORT=4000

SECRET=e89f987sdfs9d879f8798dsf78978
```

* `NODE_ENV` configura el entorno para desarrollo o producción
* `PORT` configura el puerto de la aplicación
* `SECRET` configura el secreto del JWT para verificación

### Instalación dependencias

Instalar las dependencias de ambos proyectos, puedes seguir este script

```bash
cd api
npm install
cd ../ui
npm install
```

o simplemente ejecutar `make install-dependencies`

### Ejecución Makefile

Para la ejecución, usamos un **Makefile** con las instrucciones para las dos infraestructuras. Aquí puedes consultar el uso de los [Phony Targets](https://www.gnu.org/software/make/manual/html_node/Phony-Targets.html). Con el fichero Makefile puedes:

1. Instalar las dependencias con `make install-dependencies`

2. Para añadir la información a la bbdd:
   1. **linux** o **macOS**: Ejecuta `make dev-bbdd-start-populate`
   2. **Windows**: Inicia primero **mongoDB** y luego ejectua `make dev-populate-data`

3. Para ejecutar la app:
   1. **linux** o **macOS**: ejecuta `make dev-start`
   2. **Windows**: Inicia primero **mongoDB** y luego ejectua `make dev-api` en una consola y en otra `make dev-ui`

4. La contraseña actual es **patata** que corresponde con el hash de bcrypt `$2b$10$YZ1W1tjiKP3g4j8mGzJAhelx0nlQ4otJIefWXGco8.bk6SOxaunhy`, para cambiar esta contraseña ejecuta `make generate-password -e USERNAME=[CORREO] -e PASS=[CONTRASEÑA]`

### Scripts BBDD

Para inicializar el proyecto con datos iniciales, utilizamos la importación de estrucutras **json** dentro de **MongoDB**. Para ello usamos el comando `mongoimport --jsonArray` con el que importaremos los json creados. El código usado es el siguiente.

```bash
mongoimport --jsonArray --db portfolio_db --collection users --file mockUsername.json
mongoimport --jsonArray --db portfolio_db --collection profile --file mockProfile.json
mongoimport --jsonArray --db portfolio_db --collection projects --file mockProjects.json
```

Como podéis comprobar, los ficheros `mockProfile.json`, `mockProjects.json`y `mockUsername.json`. Cambiando los datos allí, e importando los nuevos ficheros, tendremos los cambios reflejados en nuestro documento.