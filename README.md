# 🐾 Sistema de Gestión para Clínica Veterinaria

## 📖 Descripción del Proyecto
Este proyecto es un sistema integral diseñado para centralizar la administración de pacientes y propietarios, optimizar el proceso de agendamiento de citas médicas mediante un calendario interactivo y digitalizar los historiales clínicos. Desarrollado bajo la metodología ágil **Scrum**, el sistema prioriza la seguridad de la información mediante encriptación AES-256 y protocolos HTTPS, garantizando una plataforma responsiva y eficiente.

## 👥 Equipo de Desarrollo (Scrum Team)
* **Valentina López**: Scrum Master / Fullstack Developer
* **Morgan Muñoz**: Product Owner / Fullstack Developer

---

## 📂 Estructura del Repositorio

Para cumplir con los estándares de evaluación, este repositorio se divide en:

* `/src`: Contiene el código fuente de la aplicación (Frontend y Backend).
* `/docs`: Contiene la documentación oficial del proyecto:
  * `Planilla_Product_Backlog.xlsx` (Sprint Backlog y estimaciones en PTS).
  * `Documento_Project_Burndown.docx` (Análisis de métricas y roles).
  * `ERS_Inicial.pdf` (Especificación de Requerimientos de Software).

---

## 📊 Tabla Resumen: Épicas, Historias de Usuario y Componentes

La siguiente tabla traza la relación entre nuestras Épicas (procesos clave), las Historias de Usuario (HU) y los artefactos de software construidos:

| ÉPICA | Historia de Usuario (HU) | Componente / Artefacto |
| :--- | :--- | :--- |
| **0: Infraestructura** | **HU-00:** Configuración de entorno y DB.<br>**HU-09:** Respaldos automáticos de BD. | Servidor, Repo Git y Script de Backup. |
| **1: Seguridad** | **HU-01:** Autenticación por roles.<br>**HU-02:** Cifrado de datos sensibles. | API Auth, Middleware de Seguridad (AES-256). |
| **2: Usuarios** | **HU-03:** Gestión de Dueños.<br>**HU-04:** Registro de Pacientes.<br>**HU-08:** Reportes de gestión clínica. | CRUD Dueños, CRUD Pacientes, Módulo Reportes. |
| **3: Agendamiento** | **HU-05:** Calendario de citas (sin solapamiento).| Calendario Interactivo UI/UX y Lógica. |
| **4: Clínica** | **HU-06:** Ficha Clínica Digital Histórica. | Módulo Historial Médico y Recetas. |
| **5: UX/UI** | **HU-07:** Interfaz responsiva e intuitiva. | Layout Web, Estilos CSS. |

---

## 🛠️ Stack Tecnológico y Entorno (Épica 0)
* **Control de Versiones:** Git / GitHub
* **Metodología:** Scrum (Gestión en Trello)
* **Base de Datos:** MySQL
* **Backend:** Python con Flask
* **Frontend:** React js

---
