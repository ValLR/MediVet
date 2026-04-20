-- MySQL dump 10.13  Distrib 8.0.45, for macos15 (arm64)
--
-- Host: 127.0.0.1    Database: medivet_db
-- ------------------------------------------------------
-- Server version	9.6.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ 'b6f623eb-3b8c-11f1-87de-76de213af561:1-19';

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
INSERT INTO `citas` VALUES (1,1,1,'2026-04-18 09:00:00','2026-04-18 09:30:00','Control de vacunas anual','Programada'),(2,3,2,'2026-04-18 10:30:00','2026-04-18 11:15:00','Cojera en pata trasera izquierda','Programada'),(3,5,1,'2026-04-19 15:00:00','2026-04-19 15:30:00','Limpieza dental profunda','Programada'),(4,2,4,'2026-04-20 11:00:00','2026-04-20 11:30:00','Gato decaído y sin apetito','Programada');
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `rut` (`rut`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `duenos`
--

LOCK TABLES `duenos` WRITE;
/*!40000 ALTER TABLE `duenos` DISABLE KEYS */;
INSERT INTO `duenos` VALUES (1,'15.678.901-2','Javiera Alarcón','+56988776655','javi.alarcon@gmail.com','Av. Condell 123, Quillota'),(2,'12.345.678-k','Roberto Muñoz','+56911223344','roberto.m@outlook.com','Calle Larga 45, Santiago'),(3,'18.990.123-4','Carolina Herrera','+56955443322','c.herrera.vet@yahoo.com','Población Corvi, Quillota'),(4,'10.223.445-6','Patricio Espinoza','+56977665544','pato.espi@gmail.com','Providencia 890, Santiago'),(5,'20.112.334-5','Francisca Valdés','+56999008877','fran.valdes@live.cl','San Martín 56, Quillota');
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
  PRIMARY KEY (`id`),
  KEY `id_paciente` (`id_paciente`),
  KEY `id_veterinario` (`id_veterinario`),
  CONSTRAINT `fichas_clinicas_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id`),
  CONSTRAINT `fichas_clinicas_ibfk_2` FOREIGN KEY (`id_veterinario`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fichas_clinicas`
--

LOCK TABLES `fichas_clinicas` WRITE;
/*!40000 ALTER TABLE `fichas_clinicas` DISABLE KEYS */;
INSERT INTO `fichas_clinicas` VALUES (1,1,1,'2026-04-19 01:37:12','Paciente sano. Esquema de vacunación al día (Séxtuple y Antirrábica).','No requiere tratamiento. Próximo control en 12 meses.'),(2,3,2,'2026-04-19 01:37:12','Posible esguince de ligamento por salto brusco. No presenta fractura visible.','Reposo absoluto por 7 días y administración de antiinflamatorios.'),(3,2,4,'2026-04-19 01:37:12','Deshidratación leve y cuadro febril. Sospecha de infección urinaria.','Hospitalización por 24 horas para hidratación y toma de exámenes de sangre/orina.');
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
INSERT INTO `recetas` VALUES (1,2,'Meloxicam 0.5mg','Dar 3 gotas cada 24 horas por 5 días vía oral después de comer.'),(2,3,'Enrofloxacino 50mg','1 comprimido cada 12 horas por 7 días. Observar reacciones alérgicas.');
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
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `rol` enum('Administrativo','Veterinario') NOT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Dr. Ricardo Retamales','r.retamales@medivet.cl','$2b$12$K89jbVsd9023asdLK23','Veterinario','2026-04-19 01:37:12'),(2,'Dra. Camila Soto','c.soto@medivet.cl','$2b$12$P90lkJhg6789mnbV456','Veterinario','2026-04-19 01:37:12'),(3,'Andrés Iturra','a.iturra@medivet.cl','$2b$12$Q12weRt3456yuIo789','Administrativo','2026-04-19 01:37:12'),(4,'Dra. Beatriz Aravena','b.aravena@medivet.cl','$2b$12$Z09xiCv8765bnM234','Veterinario','2026-04-19 01:37:12');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-20 13:15:25
