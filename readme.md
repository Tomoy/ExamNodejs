# Api V1.0.0 Nodepop

Api escrita en nodejs con Express, mongoose y MongoDB para servir anuncios y manejar los usuarios de y hacia la app Nodepop.

### INSTALACION Y ARRANQUE

Dirigirse a la carpeta de MongoDB e inicializarlo:

`$ ./bin/mongo`

Instalar las dependencias de la aplicación:

`$ npm install`

Luego de bajarse el proyecto de git, para crear los anuncios y usuarios por defecto, dirigirse a la carpeta de nodepop y ejecutar:

`$ npm run installDB`

Arrancar la app:

`npm run dev`

### URL

Para acceder a la api, hay que dirigirse a la siguiente url: 

`http://localhost:3000/`

### RUTAS DE LA API

#### CREAR USUARIO

Para crear un usuario nuevo, hacer un request por POST a la siguiente URL:

`POST /apiv1/usuarios` 

@params nombre, password, email
@returns token necesario para futuros requests

### Autenticación

Para logearse a la app con tu usuario y recibir el token necesario para poder utilizar las rutas privadas de la api, hacer un request por POST a la siguiente URL:

`POST /apiv1/usuarios/authenticate`

@params email, password
@returns token necesario para futuros requests 

#### LISTA DE TAGS

Para obtener una lista de los tags existentes en la app, hacer un request por GET a la siguiente URL:

`GET /apiv1/tags` 

@params se debe pasar el token recibido en la query string 'token' o en el header 'x-access-token' al registrarse o autenticarse
@returns lista de tags existentes en la app

#### LISTA DE ANUNCIOS

Para obtener una lista de los anuncios de la app, hacer un request por GET a la siguiente URL:

`GET /apiv1/anuncios`

@params se debe pasar el token recibido en la query string 'token' o en el header 'x-access-token' al registrarse o autenticarse
@returns lista de anuncios 

##### Filtros

Los anuncios se pueden filtrar por:

- Tag = tag por el que se quiera filtrar
- esVenta = true o false , si se quieren ver solo las ventas o solo las búsquedas
- nombre = Como empieza el nombre del anuncio que se busca
- precio = Se puede filtrar por precio, también se puede filtrar con rango inferior ('-precio'), rango superior ('precio-'') o rango definido ('precio-precio')
- start = Se puede establecer desde que anuncio se quiere empezar la búsqueda, util para paginación
- limit = Se puede establecer un límite de anuncios para la búsqueda, util para paginación
- sort = Campo por el que se quiere ordenar los resultados ('-campo') orden descendente
- includeTotal = Si se quiere incluir el total de anuncios sin tener en cuenta los filtros actuales

#### MANEJO DE ERROR E INTERNALIZACION

Los errores se devuelven en el siguiente formato:

' Mensaje: Mensaje del error
  Status: Código del error
  Stack: La pila del error '

  Por defecto los errores vienen en español, pero se pueden recibir en inglés también, hay que agregar un parámetro en la query string o en el header:

  `lang = en`
