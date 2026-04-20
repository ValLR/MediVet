
# 🐾 Sistema de Gestión para Clínica Veterinaria - MediVet

## 📖 Descripción del Proyecto
[cite_start]Este proyecto es un sistema integral diseñado para centralizar la administración de pacientes y propietarios, optimizar el proceso de agendamiento de citas médicas mediante un calendario interactivo y digitalizar los historiales clínicos[cite: 22, 24, 25]. [cite_start]Desarrollado bajo la metodología ágil **Scrum**, el sistema prioriza la seguridad de la información mediante encriptación y protocolos modernos, garantizando una plataforma responsiva y eficiente[cite: 1, 39].

## 👥 Equipo de Desarrollo (Scrum Team)
* **Valentina Lopez**: Scrum Master / Fullstack Developer
* **Morgan Muñoz**: Product Owner / Fullstack Developer

---

## 📂 Estructura del Repositorio

Para cumplir con los estándares de evaluación (especialmente la Épica 0 y Semana 6), el repositorio se organiza de la siguiente manera:

* **`/src`**: Código fuente de la aplicación (Frontend y Backend).
* **`/database`**: Scripts necesarios para reconstruir el motor de base de datos desde cero.
  * `Dump20260420.sql`: Contiene la estructura (DDL) y la carga depurada de datos fidedignos (DML).
* **`/documentation`**: Documentación técnica y diagramas de arquitectura:
  * `Diagrama de Actividad.pdf`
  * `Diagrama de Casos de Uso.pdf`
  * `Diagrama de Clase.pdf`
  * `Planilla_Product_Backlog.xlsx`
* **`docker-compose.yml`**: Configuración para levantar el entorno de desarrollo de forma automatizada.

---

## 🛠️ Stack Tecnológico y Entorno (Épica 0)
* **Control de Versiones:** Git / GitHub
* **Contenedores:** Docker / Docker Desktop
* **Base de Datos:** MySQL 8.0
* **Diseño DB:** MySQL Workbench
* **Backend:** Python con Flask / Java Spring Boot
* **Frontend:** React Native / React js

---

## 🚀 Instrucciones de Levantamiento (Motor de DB)

Este proyecto utiliza **Docker** para garantizar que el motor de la base de datos sea idéntico en desarrollo y producción.

### Requisitos Previos
1. Tener instalado **Docker Desktop**.
2. Clonar este repositorio.

### Pasos para iniciar el motor
1. Abre una terminal en la raíz del proyecto.
2. Ejecuta el siguiente comando:
   ```bash
   docker-compose up -d
   ```
3. El sistema descargará la imagen de MySQL, creará la base de datos `medivet_db` y cargará automáticamente los scripts de la carpeta `/database`.

### Credenciales de Acceso Local
* **Host:** `localhost`
* **Puerto:** `3306`
* **Usuario:** `root`
* **Password:** `password`
* **Base de Datos:** `medivet_db`

---

## 📊 Tabla Resumen: Épicas e Historias de Usuario

| ÉPICA | Historia de Usuario (HU) | Componente / Artefacto |
| :--- | :--- | :--- |
| **0: Infraestructura** | **HU-00:** Configuración de entorno y DB. | **Docker Compose**, Script SQL Initial. |
| **1: Seguridad** | **HU-01:** Autenticación por roles. | [cite_start]API Auth, Middleware de Seguridad (Cifrado)[cite: 41, 44]. |
| **2: Usuarios** | **HU-03/04:** Gestión de Dueños y Pacientes. | [cite_start]CRUD Dueños, CRUD Pacientes[cite: 32, 46]. |
| **3: Agendamiento** | **HU-05:** Calendario de citas. | [cite_start]Módulo de Citas (Agendar/Cancelar)[cite: 61, 66]. |
| **4: Clínica** | **HU-06:** Ficha Clínica y Recetas. | [cite_start]Módulo Historial Médico y Emisión de Recetas[cite: 65, 74]. |

---
*Última actualización: 20 de abril de 2026*