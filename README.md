# API de notas

API REST para crear y administrar notas. Está construida con Node.js, Express y MySQL. Las notas tienen título, contenido y una categoría; sus operaciones permiten crear, listar, consultar, actualizar y eliminar registros.

## Requisitos

- Node.js compatible con `--env-file` (Node.js 20.6 o posterior).
- MySQL en ejecución.
- Una base de datos y una tabla `notas` disponibles.

La aplicación consulta las columnas `id`, `titulo`, `contenido`, `categoria` y `createdAt`. Si aún no tienes la tabla, puedes crearla con:

```sql
CREATE DATABASE IF NOT EXISTS api_notas_clase;
USE api_notas_clase;

CREATE TABLE IF NOT EXISTS notas (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(60) NOT NULL,
  contenido VARCHAR(280) NOT NULL,
  categoria ENUM('clase', 'tarea', 'idea') NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## Instalación y configuración

Instala las dependencias y prepara las variables de conexión:

```bash
npm install
cp .env.example .env
```

Edita `.env` con los datos de tu MySQL:

```dotenv
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=api_notas_clase
```

Inicia la API:

```bash
npm run dev
```

También puedes iniciarla sin modo de recarga con `npm start`. El servidor usa el puerto `4000` y verifica la conexión con MySQL antes de empezar a escuchar.

## Endpoints

La URL base es `http://localhost:4000`. Las respuestas de la API están en JSON, salvo la eliminación exitosa (que no devuelve contenido).

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/health` | Comprueba que la API esté activa. |
| `GET` | `/api/v1/notas` | Lista las notas, de más reciente a más antigua. |
| `GET` | `/api/v1/notas/:id` | Obtiene una nota por su ID. |
| `POST` | `/api/v1/notas` | Crea una nota. |
| `PATCH` | `/api/v1/notas/:id` | Actualiza uno o varios campos enviados. |
| `DELETE` | `/api/v1/notas/:id` | Elimina una nota. |
| `GET` | `/api/v1/preferencia` | Consulta la última categoría guardada en una cookie. |

Para crear una nota, el cuerpo debe tener los tres campos requeridos. El título acepta entre 3 y 60 caracteres, el contenido entre 1 y 280, y la categoría debe ser `clase`, `tarea` o `idea`.

### Ejemplo de JSON para agregar una nota

Usa este cuerpo en una solicitud `POST` a `http://localhost:4000/api/v1/notas`. En Postman, Bruno o Insomnia selecciona **Body → JSON** (o **raw → JSON**) y agrega el encabezado `Content-Type: application/json`:

```json
{
  "titulo": "Repasar Express",
  "contenido": "Crear una ruta POST y validarla",
  "categoria": "clase"
}
```

Una creación correcta responde con estado `201`, el objeto creado bajo `data` y una cookie `ultimaCategoria` válida durante una hora.

## Pruebas desde la terminal con curl

Con la API ejecutándose, puedes usar estos comandos. El ejemplo guarda la cookie de creación en `cookies.txt` para consultar luego la preferencia:

```bash
# Estado de la API
curl -i http://localhost:4000/health

# Crear una nota
curl -i -X POST http://localhost:4000/api/v1/notas \
  -H 'Content-Type: application/json' \
  -c cookies.txt \
  -d '{"titulo":"Repasar Express","contenido":"Crear una ruta POST y validarla","categoria":"clase"}'

# Listar notas
curl -i http://localhost:4000/api/v1/notas

# Consultar una nota (reemplaza 1 por un ID existente)
curl -i http://localhost:4000/api/v1/notas/1

# Actualizar campos (todos son opcionales en PATCH)
curl -i -X PATCH http://localhost:4000/api/v1/notas/1 \
  -H 'Content-Type: application/json' \
  -d '{"categoria":"tarea"}'

# Consultar la última categoría enviada al crear una nota
curl -i -b cookies.txt http://localhost:4000/api/v1/preferencia

# Eliminar una nota (respuesta 204 sin cuerpo)
curl -i -X DELETE http://localhost:4000/api/v1/notas/1
```

También puedes importar cada comando `curl` en Postman, Bruno o Insomnia. Para una ruta con `:id`, reemplaza `1` por un ID que exista en tu base de datos.

## Respuestas y errores

- `201`: nota creada.
- `200`: consulta o actualización correcta.
- `204`: nota eliminada correctamente.
- `400`: ID inválido o datos que no pasan la validación; el detalle aparece en `errores`.
- `404`: nota o ruta no encontrada.
- `500`: error al procesar la solicitud, por ejemplo, un problema de base de datos.

Cada respuesta incluye el encabezado `X-API-Version: 1.0.0`.
