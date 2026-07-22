CREATE DATABASE  IF NOT EXISTS `p05_flexserv` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `p05_flexserv`;
-- MySQL dump 10.13  Distrib 8.0.25, for Win64 (x86_64)
--
-- Host: localhost    Database: p05_flexserv
-- ------------------------------------------------------
-- Server version	8.2.0

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

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `house_no` varchar(50) DEFAULT NULL,
  `street` varchar(150) DEFAULT NULL,
  `area` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `pincode` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES (1,1,'Flat 402, Alpine Towers','FC Road','Shivajinagar','Pune','Maharashtra','411005'),(2,2,'Row House No. 7','Kalyani Nagar Main Rd','Kalyani Nagar','Pune','Maharashtra','411006');
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `provider_id` int NOT NULL,
  `service_id` int NOT NULL,
  `address_id` int NOT NULL,
  `booking_date` date DEFAULT NULL,
  `booking_time` time DEFAULT NULL,
  `status` varchar(30) DEFAULT NULL,
  `total_price` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `customer_id` (`customer_id`),
  KEY `provider_id` (`provider_id`),
  KEY `service_id` (`service_id`),
  KEY `address_id` (`address_id`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`),
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`provider_id`) REFERENCES `service_provider_company` (`id`),
  CONSTRAINT `bookings_ibfk_3` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`),
  CONSTRAINT `bookings_ibfk_4` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,1,1,1,1,'2026-07-10','10:00:00','Confirmed',450.00,'2026-07-04 12:48:12'),(2,2,2,3,2,'2026-07-12','09:30:00','Pending',2500.00,'2026-07-04 12:48:12');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Plumbing','All kinds of residential and commercial plumbing repair and setup.'),(2,'Electrical','Appliance repairs, house wiring, and smart home installations.'),(3,'Cleaning','Deep home cleaning, disinfection, and sofa/carpet shampooing.');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `complaints`
--

DROP TABLE IF EXISTS `complaints`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `complaints` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `serviceP_id` int NOT NULL,
  `description` text,
  `resolved` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `serviceP_id` (`serviceP_id`),
  CONSTRAINT `complaints_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `complaints_ibfk_2` FOREIGN KEY (`serviceP_id`) REFERENCES `service_provider_company` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `complaints`
--

LOCK TABLES `complaints` WRITE;
/*!40000 ALTER TABLE `complaints` DISABLE KEYS */;
INSERT INTO `complaints` VALUES (1,2,2,'The cleaner arrived 30 minutes late for the consultation session.',0,'2026-07-04 12:48:24','2026-07-04 12:48:24');
/*!40000 ALTER TABLE `complaints` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `booking_id` int NOT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `payment_status` varchar(30) DEFAULT NULL,
  `transaction_id` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `booking_id` (`booking_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,1,450.00,'UPI','Completed','TXN98765432101','2026-07-04 12:48:16');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `provider_services`
--

DROP TABLE IF EXISTS `provider_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `provider_services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `provider_id` int NOT NULL,
  `service_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `provider_id` (`provider_id`),
  KEY `service_id` (`service_id`),
  CONSTRAINT `provider_services_ibfk_1` FOREIGN KEY (`provider_id`) REFERENCES `service_provider_company` (`id`),
  CONSTRAINT `provider_services_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `provider_services`
--

LOCK TABLES `provider_services` WRITE;
/*!40000 ALTER TABLE `provider_services` DISABLE KEYS */;
INSERT INTO `provider_services` VALUES (1,1,1),(2,2,2),(3,2,3);
/*!40000 ALTER TABLE `provider_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `booking_id` int NOT NULL,
  `customer_id` int NOT NULL,
  `provider_id` int NOT NULL,
  `rating` int DEFAULT NULL,
  `comment` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `booking_id` (`booking_id`),
  KEY `customer_id` (`customer_id`),
  KEY `provider_id` (`provider_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`),
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`),
  CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`provider_id`) REFERENCES `service_provider_company` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,1,1,1,5,'Rajesh arrived right on time and fixed the kitchen faucet quickly. Great experience!','2026-07-04 12:48:20');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_provider_company`
--

DROP TABLE IF EXISTS `service_provider_company`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service_provider_company` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `company_name` varchar(150) DEFAULT NULL,
  `experience_years` int DEFAULT NULL,
  `bio` text,
  `is_verified` tinyint(1) DEFAULT NULL,
  `rating` decimal(3,2) DEFAULT NULL,
  `company_available` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `service_provider_company_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_provider_company`
--

LOCK TABLES `service_provider_company` WRITE;
/*!40000 ALTER TABLE `service_provider_company` DISABLE KEYS */;
INSERT INTO `service_provider_company` VALUES (1,3,'Rajesh Plumbing Works',5,'Professional plumbing expert certified by local civic bodies.',1,4.80,1),(2,4,'Sparkle Electricals & Cleaning',3,'One stop solution for electrical repairs and deep sanitation packages.',1,4.50,1);
/*!40000 ALTER TABLE `service_provider_company` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `price` decimal(10,2) DEFAULT NULL,
  `duration` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `services_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (1,1,'Leaky Pipe Repair','Fixing minor to major water pipeline leaks.',450.00,60),(2,2,'Fan Installation','Unboxing and ceiling mount installation of standard fans.',300.00,45),(3,3,'Full House Deep Cleaning','Complete wiping, mopping, and vacuuming of a standard 2BHK flat.',2500.00,240);
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Aman Sharma','aman.sharma@example.com','9876543210','$2b$12$eImiTxHX0a2M9Bv.','customer','2026-07-04 12:47:43','2026-07-04 12:47:43'),(2,'Priya Patel','priya.p@example.com','9876543211','$2b$12$eImiTxHX0a2M9Bv.','customer','2026-07-04 12:47:43','2026-07-04 12:47:43'),(3,'Rajesh Kumar','rajesh.fixit@example.com','9876543212','$2b$12$eImiTxHX0a2M9Bv.','provider','2026-07-04 12:47:43','2026-07-04 12:47:43'),(4,'Vikram Singh','vikram.spark@example.com','9876543213','$2b$12$eImiTxHX0a2M9Bv.','provider','2026-07-04 12:47:43','2026-07-04 12:47:43');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-04 18:20:33
