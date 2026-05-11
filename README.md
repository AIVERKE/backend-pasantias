# 🚀 Sistema de Pasantías

Bienvenido al repositorio del **Sistema de Pasantías**. Este proyecto está estructurado como un monorepo que contiene tanto el backend como el frontend de la aplicación.

## 📁 Estructura del Proyecto

El proyecto está dividido en dos carpetas principales:

- **`backend/`**: API REST construida con **NestJS**, **TypeORM** y **PostgreSQL**.
- **`frontend/`**: Aplicación de cliente construida con **Vue 3**, **Vite** y **Tailwind CSS**.

---

## 🛠️ Cómo correr el proyecto completo

Para ejecutar la aplicación completa en tu entorno local, debés levantar ambos servicios (backend y frontend) en terminales separadas.

### 1. Levantar el Backend (API)

El backend maneja la lógica de negocio y la conexión con la base de datos PostgreSQL.

1. Abrí una terminal y movete a la carpeta del backend:
   ```bash
   cd backend
   ```
2. Instalá las dependencias:
   ```bash
   npm install
   ```
3. Configurá las variables de entorno:
   - Creá un archivo `.env` basado en el `.env.example`.
   - Asegurate de tener una base de datos PostgreSQL creada y poné las credenciales correctas.
4. Corré las migraciones para crear las tablas en la base de datos:
   ```bash
   npm run migration:run
   ```
5. Iniciá el servidor en modo desarrollo:
   ```bash
   npm run start:dev
   ```
   *El backend correrá por defecto en `http://localhost:3000` (o el puerto que tengas configurado).*

> [!IMPORTANT]
> Asegurate de que tu servidor PostgreSQL esté corriendo antes de ejecutar las migraciones o iniciar el servidor.

---

### 2. Levantar el Frontend (Cliente)

El frontend es la interfaz de usuario interactiva.

1. Abrí **otra** terminal y movete a la carpeta del frontend:
   ```bash
   cd frontend
   ```
2. Instalá las dependencias:
   ```bash
   npm install
   ```
3. Configurá las variables de entorno:
   - Creá un archivo `.env` basado en el `.env.example`.
   - Por defecto, `VITE_API_URL` apunta a `/api` o a la URL de tu backend.
4. Iniciá el servidor de desarrollo de Vite:
   ```bash
   npm run dev
   ```
   *El frontend correrá por defecto en `http://localhost:5173`.*

---

## 📖 Documentación Detallada

Si necesitás más detalles sobre comandos específicos, base de datos o estructura interna, revisá los READMEs específicos de cada carpeta:
- [README del Backend](file:///c:/Users/lenovo/Documents/Proyectos/266-Taller%20de%20t%C3%A9cnico%20Superior/Pasantias/backend/README.md)
- [README del Frontend](file:///c:/Users/lenovo/Documents/Proyectos/266-Taller%20de%20t%C3%A9cnico%20Superior/Pasantias/frontend/README.md)
