<!-- Based on -->
<!--
*** https://github.com/othneildrew/Best-README-Template/blob/master/BLANK_README.md
-->

<a id="readme-top"></a>

<h3 align="center">SDC - Sistema de curriculums</h3>
<h4 align="center">Stack - MERN</h3>

  <p align="center">
    Proyecto que permite la creación de curriculums a usuarios para diferentes puesto laborales
    <br />
    <a href="http://129.80.112.63:4000">Ver demo</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details open>
  <summary>Tabla de contenido</summary>
  <ol>
    <li>
      <a href="#requisitos">Requisitos</a>
    </li>
    <li>
      <a href="#instalación-del-proyecto">Instalación del proyecto</a>
    </li>
    <li>
      <a href="#documentación-oficial">Documentación oficial</a>
    </li>
    <li>
      <a href="#cómo-hacer-un-pull-request">Cómo hacer un Pull Request</a>
    </li>
  </ol>
</details>

<!-- REQUIREMENTS -->

## Requisitos

### Entorno de desarrollo (local)

#### Node.js

Se debe instalar Node.js dependiendo del sistema operativo, version usada para el proyecto v22.7.0 - [enlace instalación](https://nodejs.org/en/download/package-manager)

Para verificar una correcta instalación puede ejecutar en la terminal lo siguiente:

```sh
node -v
```

Si la instalación fue exitosa debería obtener un resultado como este:

```sh
v22.7.0
```

Para verificar una correcta instalación puede ejecutar en la terminal lo siguiente:

```sh
npm -v
```

Si la instalación fue exitosa debería obtener un resultado como este:

```sh
10.8.2
```

<p align="right">(<a href="#readme-top">Volver al inicio</a>)</p>

#### Mongodb

Se debe instalar MongoDb dependiendo del sistema operativo, version usada para el proyecto v7.0 [enlace instalación](https://www.mongodb.com/docs/manual/administration/install-community/).

Para verificar una correcta instalación puede ejecutar en la terminal lo siguiente:

```sh
mongod --version
```

Si la instalación fue exitosa debería obtener un resultado como este:

```sh
db version v7.0
```

<p align="right">(<a href="#readme-top">Volver al inicio</a>)</p>

<!-- APP CREATION -->

## Instalación del proyecto

## Development

Para utilizar este repositorio, ejecute:

```sh
git clone https://github.com/Jaaq5/sdc-mern-app.git
```

### Clonar el archivo .env.example

En la carpeta /server clone el archivo .env.example, cambie su nombre a .env.development,

cambie los valores de CHANGEMYNAME por los de su entorno de desarrollo

En la carpeta /client clone el archivo .env.example, cambie su nombre a .env.development,

cambie los valores de CHANGEMYNAME por los de su entorno de desarrollo

### Ejecución del proyecto

Para listar todos los scripts disponibles, ejecute

```sh
npm run
```

Para instalar Express, React y otras dependencias , dentro de la carpeta del proyecto, ejecute:

```sh
npm run install-dev
```

Para ejecutar el proyecto en modo desarrollador, ejecute:

```sh
npm run start-dev
```

Abra en el navegador: [http://localhost:3000](http://localhost:3000):

Para hacer una version para el modo producción , ejecute:

```sh
npm run build
```

El folder estará en /client/build

## Production

Para utilizar este repositorio, ejecute:

```sh
git clone https://github.com/Jaaq5/sdc-mern-app.git
```

### Clonar el archivo .env.example

En la carpeta /server clone el archivo .env.example, cambie su nombre a .env.production,

cambie los valores de CHANGEMYNAME por los de su entorno de producción

En la carpeta /client clone el archivo .env.example, cambie su nombre a .env.production,

cambie los valores de CHANGEMYNAME por los de su entorno de producción

### Ejecución del proyecto

Para listar todos los scripts disponibles, ejecute

```sh
npm run
```

Para instalar Express, React y otras dependencias , dentro de la carpeta del proyecto, ejecute:

```sh
npm run install-pro
```

Para ejecutar el proyecto en modo producción, ejecute:

```sh
npm run start-pro
```

Para controlar el servidor de producción, ejecute:

```sh
npm run server-list
```

Para reiniciar el servidor de producción, ejecute:

```sh
npm run server-restart
```

Para detener el servidor de producción, ejecute:

```sh
npm run server-stop
```

Para eliminar el servidor de producción, ejecute:

```sh
npm run server-delete
```

Abra en el navegador: [http://ip-publica:puerto](#)

### Otro scripts

Para aplicar formato, ejecute:

```sh
npm run format
```

Para revisar errores de codigo, ejecute:

```sh
npm run lint
```

<p align="right">(<a href="#readme-top">Volver al inicio</a>)</p>

## Documentación oficial

### Node.js

[Documentación](https://nodejs.org/docs/latest/api/) - [Guía](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs/)

### Express

[Documentación](https://expressjs.com/en/starter/installing.html) - [Guía](https://expressjs.com/en/guide/routing.html)

### MongoDb

[Guía](https://www.mongodb.com/docs/manual/introduction/) - [Crud](https://www.mongodb.com/docs/guides/crud/install/)

### Create React App

[Guía](https://create-react-app.dev/docs/documentation-intro)

### React

[Documentación](https://react.dev/reference/react) - [Guía](https://react.dev/learn)

## Documentación externa

### Guía MERN

[Digital Ocean: Tutorial MERN](https://www.digitalocean.com/community/tutorials/getting-started-with-the-mern-stack)

[Libro: Pro MERN Stack](https://web.archive.org/web/20180219235500id_/http://dl.farinsoft.ir:80/ebooks/Pro-MERN-Stack-Development-Express.pdf)

## Videos

[Tutorial MERN](https://www.youtube.com/watch?v=8DploTqLstE&list=PL4cUxeGkcC9iJ_KkrkBZWZRHVwnzLIoUE&index=3)

## Jira

[Proyecto Scrum](https://jaaq5.atlassian.net/jira/software/projects/SDC/boards/2)

[Referenciar historias/tareas en los commits](https://support.atlassian.com/jira-software-cloud/docs/reference-issues-in-your-development-work/)

<p align="right">(<a href="#readme-top">Volver al inicio</a>)</p>

## Cómo hacer un Pull Request

Para realizar un Pull Request desde otra rama (por ejemplo, `my-branch`) a la rama `master`, sigue estos pasos:

### 1. **Preparar la Rama Master**

- Cambia a la rama `master` y actualízala:

  ```bash
  git checkout master
  git pull origin master
  ```

### 2. **Crear y Cambiar a una Nueva Rama**

- Crea una nueva rama (`my-branch`) y cámbiate a ella:

  ```bash
  git checkout -b my-branch
  ```

### 3. **Guardar Cambios No Confirmados (Si es Necesario)**

- Si tienes cambios no confirmados, guárdalos:

  ```bash
  git stash
  ```

- Después, asegúrate de que tu rama esté actualizada:

  ```bash
  git pull origin master
  ```

- Si aplicaste `stash`, vuelve a aplicar los cambios guardados:

  ```bash
  git stash apply
  ```

### 4. **Realizar Cambios y Confirmarlos**

- Añade y confirma tus cambios en `my-branch`:

  ```bash
  git add .
  git commit -m "Commit message"
  ```

### 5. **Subir Cambios a la Rama Remota**

- Sube tus cambios a la rama remota `my-branch`:

  ```bash
  git push origin my-branch
  ```

### 6. **Limpiar Stash (Opcional)**

- Si no necesitas los cambios guardados en `stash`, límpialos:

  ```bash
  git stash clear
  ```

### 7 **Crear un Pull Request**

1. Selecciona la rama `my-branch`.
2. Selecciona la opcion `Compare and pull request`.
3. Selecciona la rama `my-branch` y la rama `master`.
4. Haz clic en el botón `Create pull request`.

### 8. **Fusionar Cambios de Master en tu Rama**

- Cambia a `master` para asegurarte de que esté actualizado:

  ```bash
  git checkout master
  git pull origin master
  ```

- Luego, cambia a `my-branch` y fusiona `master`:

  ```bash
  git checkout my-branch
  git merge master
  ```

### Resumen de Comandos

| Comando                          | Acción                                              |
| :------------------------------- | :-------------------------------------------------- |
| `git checkout master`            | Cambia a la rama `master`.                          |
| `git pull origin master`         | Actualiza la rama `master` con los últimos cambios. |
| `git checkout -b my-branch`      | Crea y cambia a la rama `my-branch`.                |
| `git stash`                      | Guarda cambios no confirmados.                      |
| `git stash list`                 | Lista los cambios guardados con `stash`.            |
| `git stash apply`                | Aplica los cambios guardados con `stash`.           |
| `git add .`                      | Añade los cambios a la rama `my-branch`.            |
| `git commit -m "Commit message"` | Confirma los cambios en la rama `my-branch`.        |
| `git push origin my-branch`      | Sube tus cambios a la rama remota `my-branch`.      |
| `git stash clear`                | Borra los cambios guardados con `stash`.            |
| `git merge master`               | Fusiona la rama `master` con la rama `my-branch`.   |

### Notas

- Resuelve conflictos si surgen durante el proceso de fusión.
- Utiliza `git stash list` para ver los cambios guardados en `stash` antes de aplicar o limpiar.

<p align="right">(<a href="#readme-top">Volver al inicio</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
