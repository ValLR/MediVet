-- MySQL dump 10.13  Distrib 8.0.46, for Linux (x86_64)
--
-- Host: localhost    Database: medivet_db
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `citas`
--

DROP TABLE IF EXISTS `citas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `citas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_paciente` int NOT NULL,
  `id_veterinario` int NOT NULL,
  `fecha_hora_inicio` datetime NOT NULL,
  `fecha_hora_fin` datetime NOT NULL,
  `motivo` varchar(200) NOT NULL,
  `estado` enum('Programada','Completada','Cancelada') DEFAULT 'Programada',
  PRIMARY KEY (`id`),
  KEY `id_paciente` (`id_paciente`),
  KEY `id_veterinario` (`id_veterinario`),
  CONSTRAINT `citas_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id`),
  CONSTRAINT `citas_ibfk_2` FOREIGN KEY (`id_veterinario`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `citas`
--

LOCK TABLES `citas` WRITE;
/*!40000 ALTER TABLE `citas` DISABLE KEYS */;
INSERT INTO `citas` VALUES (1,1,1,'2026-04-18 09:00:00','2026-04-18 09:30:00','Control de vacunas anual','Completada'),(2,3,2,'2026-04-18 10:30:00','2026-04-18 11:15:00','Cojera en pata trasera izquierda','Completada'),(3,5,1,'2026-04-19 15:00:00','2026-04-19 15:30:00','Limpieza dental profunda','Programada'),(4,2,4,'2026-04-20 11:00:00','2026-04-20 11:30:00','Gato decaído y sin apetito','Completada');
/*!40000 ALTER TABLE `citas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `duenos`
--

DROP TABLE IF EXISTS `duenos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `duenos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rut` varchar(12) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `telefono` varchar(15) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `direccion` varchar(200) DEFAULT NULL,
  `usuario_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `rut` (`rut`),
  KEY `fk_dueno_usuario` (`usuario_id`),
  CONSTRAINT `fk_dueno_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `duenos`
--

LOCK TABLES `duenos` WRITE;
/*!40000 ALTER TABLE `duenos` DISABLE KEYS */;
INSERT INTO `duenos` VALUES (1,'15678901-2','Javiera Alarcón','+56988776655','javi.alarcon@gmail.com','Av. Condell 123, Quillota',5),(2,'12345678-k','Andrés Vicuña','+56911223344','roberto.m@outlook.com','Calle Larga 45, Santiago',NULL),(3,'18990123-4','Pía Montes','+56955443322','c.herrera.vet@yahoo.com','Población Corvi, Quillota',NULL),(4,'10223445-6','Patricio Espinoza','+56977665544','pato.espi@gmail.com','Providencia 890, Santiago',NULL),(5,'20112334-5','Francisca Valdés','+56999008877','fran.valdes@live.cl','San Martín 56, Quillota',NULL);
/*!40000 ALTER TABLE `duenos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fichas_clinicas`
--

DROP TABLE IF EXISTS `fichas_clinicas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fichas_clinicas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_paciente` int NOT NULL,
  `id_veterinario` int NOT NULL,
  `fecha_atencion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `diagnostico` text NOT NULL,
  `tratamiento` text NOT NULL,
  `id_cita` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_paciente` (`id_paciente`),
  KEY `id_veterinario` (`id_veterinario`),
  KEY `fk_ficha_cita` (`id_cita`),
  CONSTRAINT `fichas_clinicas_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id`),
  CONSTRAINT `fichas_clinicas_ibfk_2` FOREIGN KEY (`id_veterinario`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `fk_ficha_cita` FOREIGN KEY (`id_cita`) REFERENCES `citas` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fichas_clinicas`
--

LOCK TABLES `fichas_clinicas` WRITE;
/*!40000 ALTER TABLE `fichas_clinicas` DISABLE KEYS */;
INSERT INTO `fichas_clinicas` VALUES (1,1,1,'2026-04-19 01:37:12','Paciente sano. Esquema de vacunación al día (Sextuple y Antirrábica).','No requiere tratamiento. Próximo control en 12 meses.',1),(2,3,2,'2026-04-19 01:37:12','Dermatitis alérgica por pulgas (DAPP). Se observa eritema y prurito intenso en zona lumbosacra.','Tratamiento con Apoquel y pipeta antiparasitaria. Baño medicado cada 7 días.',2),(3,2,4,'2026-04-19 01:37:12','Deshidratación leve y cuadro febril. Sospecha de infección urinaria.','Hospitalización por 24 horas para hidratación y toma de exámenes de sangre/orina.',4);
/*!40000 ALTER TABLE `fichas_clinicas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pacientes`
--

DROP TABLE IF EXISTS `pacientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pacientes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_dueno` int NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `especie` varchar(50) NOT NULL,
  `raza` varchar(50) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_dueno` (`id_dueno`),
  CONSTRAINT `pacientes_ibfk_1` FOREIGN KEY (`id_dueno`) REFERENCES `duenos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pacientes`
--

LOCK TABLES `pacientes` WRITE;
/*!40000 ALTER TABLE `pacientes` DISABLE KEYS */;
INSERT INTO `pacientes` VALUES (1,1,'Luna','Perro','Quiltro/Mestizo','2020-05-12'),(2,1,'Simba','Gato','Persa','2022-01-10'),(3,2,'Thor','Perro','Pastor Alemán','2019-11-23'),(4,3,'Mimi','Gato','Romana','2021-08-15'),(5,4,'Coco','Perro','Poodle','2023-03-02'),(6,5,'Toby','Perro','Golden Retriever','2018-07-20');
/*!40000 ALTER TABLE `pacientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recetas`
--

DROP TABLE IF EXISTS `recetas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recetas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_ficha` int NOT NULL,
  `medicamentos` text NOT NULL,
  `indicaciones` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_ficha` (`id_ficha`),
  CONSTRAINT `recetas_ibfk_1` FOREIGN KEY (`id_ficha`) REFERENCES `fichas_clinicas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recetas`
--

LOCK TABLES `recetas` WRITE;
/*!40000 ALTER TABLE `recetas` DISABLE KEYS */;
INSERT INTO `recetas` VALUES (1,2,'[{\"medicamento\": \"Meloxicam 0.5mg\", \"indicacion\": \"Dar 3 gotas cada 24 horas por 5 días vía oral después de comer.\"}]','Dar 3 gotas cada 24 horas por 5 días vía oral después de comer.'),(2,3,'[{\"medicamento\": \"Enrofloxacino 50mg\", \"indicacion\": \"1 comprimido cada 12 horas por 7 días. Observar reacciones alérgicas.\"}]','1 comprimido cada 12 horas por 7 días. Observar reacciones alérgicas.');
/*!40000 ALTER TABLE `recetas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(150) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(128) NOT NULL,
  `rol` enum('Administrativo','Veterinario','Dueno') NOT NULL DEFAULT 'Administrativo',
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `first_name` varchar(150) NOT NULL DEFAULT '',
  `last_name` varchar(150) NOT NULL DEFAULT '',
  `is_staff` tinyint(1) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_superuser` tinyint(1) NOT NULL DEFAULT '0',
  `last_login` datetime(6) DEFAULT NULL,
  `date_joined` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Dr. Ricardo Retamales','r.retamales@medivet.cl','$2b$12$K89jbVsd9023asdLK23','Veterinario','2026-04-19 01:37:12','','',0,1,0,NULL,'2026-05-06 06:25:22.748917'),(2,'Dra. Camila Soto','c.soto@medivet.cl','pbkdf2_sha256$1200000$bMpZm4nuUZyb9az3jk2tv8$FFyQvWzPmR9WNowKFTUODXnyovl0V57tN7/EpEVV5F4=','Veterinario','2026-04-19 01:37:12','','',0,1,0,NULL,'2026-05-06 06:25:22.748917'),(3,'Andrés Iturra','a.iturra@medivet.cl','pbkdf2_sha256$1200000$ngSaAw4KBxHpBZ3fyJCk28$WqXGpkHCa6VidEx6qGJBk5AsnVg+0fchzKO+vVi4G9g=','Administrativo','2026-04-19 01:37:12','','',0,1,0,NULL,'2026-05-06 06:25:22.748917'),(4,'Dra. Beatriz Aravena','b.aravena@medivet.cl','pbkdf2_sha256$1200000$7lNztdIQ5Rs3t9AC2hTyy4$ryFOEvSO+ByL/XeSHp9vnQ/UZgmPTXBZ7kHEEm7quWk=','Veterinario','2026-04-19 01:37:12','','',0,1,0,NULL,'2026-05-06 06:25:22.748917'),(5,'Javiera Alarcón','javi.alarcon@gmail.com','pbkdf2_sha256$1200000$48LR1t5iZDQWmBdP2bRUay$HtiEWi0uPnZrVClsoDzDrWAbmzYXmNqQXZGN3A9SxCc=','Dueno','2026-05-06 06:33:03','','',0,1,0,NULL,'2026-05-06 06:33:03.773283');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-07  3:32:47
