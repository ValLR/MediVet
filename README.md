# 🐾 Sistema de Gestión para Clínica Veterinaria - MediVet

## 📖 Descripción del Proyecto
Este proyecto es un sistema integral diseñado para centralizar la administración de pacientes y propietarios, optimizar el proceso de agendamiento de citas médicas mediante un calendario interactivo y digitalizar los historiales clínicos. Desarrollado bajo la metodología ágil **Scrum**, el sistema garantiza una plataforma responsiva y eficiente para veterinarios y dueños de mascotas.

---

## 📂 Estructura del Repositorio

* **`Front-End/`**: Aplicación React + Vite + Tailwind CSS.
* **`Back-End/`**: API REST desarrollada con Django y Django REST Framework.
* **`Database/`**: Scripts SQL para reconstruir la base de datos.
  * `Dump_Final_MediVet.sql`: Estructura (DDL) y carga de datos (DML) 100% actualizada con tildes corregidas.
* **`docker-compose.yml`**: Configuración para levantar el motor MySQL 8.0 en contenedores.

---

## 🛠️ Stack Tecnológico
* **Base de Datos:** MySQL 8.0 (Dockerizado)
* **Backend:** Python 3.x + Django + Django REST Framework + SimpleJWT
* **Frontend:** React + Vite + Tailwind CSS + Lucide React
* **Consumo Externo:** API de Mindicador.cl (UF/Dólar)

---

## 🚀 Instrucciones de Levantamiento

### 1. Motor de Base de Datos (Docker)
Este proyecto utiliza **Docker** para la persistencia de datos.
1. Abre una terminal en la raíz del proyecto.
2. Ejecuta: `docker-compose up -d`
3. El motor MySQL estará disponible en `localhost:3306` con la DB `medivet_db`.

### 2. Configuración del Backend (Django)
1. Navega a `Back-End/medivet`.
2. (Opcional) Crea un entorno virtual: `python -m venv venv` y actívalo.
3. Instala las dependencias: `pip install -r requirements.txt` (asegúrate de tener `django`, `djangorestframework`, `django-cors-headers`, `mysqlclient`, `djangorestframework-simplejwt`, `django-filter`).
4. Ejecuta las migraciones: `python manage.py migrate`
5. Inicia el servidor: `python manage.py runserver`
   - La API estará en: `http://localhost:8000/api/`

### 3. Configuración del Frontend (React)
1. Navega a `Front-End`.
2. Instala las dependencias: `npm install`
3. Inicia el modo desarrollo: `npm run dev`
   - La aplicación estará en: `http://localhost:5173`

---

## 🔐 Credenciales de Prueba

Para evaluar el sistema, puedes usar las siguientes cuentas:

| Rol | Usuario (Email) | Contraseña |
| :--- | :--- | :--- |
| **Veterinario** | `b.aravena@medivet.cl` | `vet123` |
| **Dueño de Mascota** | `javi.alarcon@gmail.com` | `user123` |

## 📊 Tabla Resumen: Épicas e Historias de Usuario

| ÉPICA | Historia de Usuario (HU) | Componente / Artefacto |
| :--- | :--- | :--- |
| **0: Infraestructura** | **HU-00:** Configuración de entorno y Repo | **Docker Compose**, Estructura del proyecto. |
| **0: Infraestructura** | **HU-10:** Diseño de Arquitectura y Prototipo | Diagramas en `/documentation` y Figma. |
| **1: Seguridad** | **HU-01:** Autenticación y Roles | Login con JWT y permisos en el Backend. |
| **1: Seguridad** | **HU-02:** Encriptación y Seguridad de Datos | Hasheo de passwords (PBKDF2) y JWT. |
| **1: Seguridad** | **HU-09:** Respaldos de Base de Datos | Archivo `Dump_Final_MediVet.sql`. |
| **2: Usuarios** | **HU-03:** Gestión de Dueños y Contacto | Módulo de búsqueda y registro de Dueños. |
| **2: Usuarios** | **HU-04:** Registro y Perfil de Pacientes | Módulo de ingreso de mascotas vinculadas. |
| **2: Usuarios** | **HU-08:** Reportes de Gestión y Estadísticas | Dashboards con métricas en tiempo real. |
| **3: Agendamiento** | **HU-05:** Calendario Visual de Citas | Sistema de agendamiento y disponibilidad. |
| **4: Clínica** | **HU-06:** Historial Médico y Recetario | Ficha Clínica y Recetas imprimibles. |
| **5: Experiencia** | **HU-07:** Interfaz Intuitiva y Responsiva | Diseño UX/UI Premium (Tailwind CSS). |
| **5: Experiencia** | **HU-11:** Consumo de Indicadores Externos | Widget de UF/Dólar (mindicador.cl). |

---
*Última actualización: Mayo 2026*

