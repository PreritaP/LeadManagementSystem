-- MySQL dump 10.13  Distrib 5.7.30, for Linux (x86_64)
--
-- Host: localhost    Database: lms
-- ------------------------------------------------------
-- Server version	5.7.30-0ubuntu0.18.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `lms_city_master`
--

DROP TABLE IF EXISTS `lms_city_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lms_city_master` (
  `cityId` int(11) NOT NULL AUTO_INCREMENT,
  `cityName` varchar(25) NOT NULL,
  `cityStateId` int(11) NOT NULL,
  PRIMARY KEY (`cityId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lms_city_master`
--

LOCK TABLES `lms_city_master` WRITE;
/*!40000 ALTER TABLE `lms_city_master` DISABLE KEYS */;
INSERT INTO `lms_city_master` VALUES (1,'New Delhi',1),(2,'Mumbai',2),(3,'Chennai',3),(4,'Bangalore',4),(5,'Jaipur',5);
/*!40000 ALTER TABLE `lms_city_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lms_group`
--

DROP TABLE IF EXISTS `lms_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lms_group` (
  `groupId` int(11) NOT NULL AUTO_INCREMENT,
  `groupRank` int(11) NOT NULL,
  `groupType` int(11) NOT NULL,
  PRIMARY KEY (`groupId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lms_group`
--

LOCK TABLES `lms_group` WRITE;
/*!40000 ALTER TABLE `lms_group` DISABLE KEYS */;
INSERT INTO `lms_group` VALUES (1,1,1),(2,2,1);
/*!40000 ALTER TABLE `lms_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lms_lead_allocation`
--

DROP TABLE IF EXISTS `lms_lead_allocation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lms_lead_allocation` (
  `allocationId` int(11) NOT NULL AUTO_INCREMENT,
  `leadId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `allocationTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `allocationBy` varchar(25) NOT NULL,
  `allocationUpdation` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `allocationStatus` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`allocationId`),
  UNIQUE KEY `leadId` (`leadId`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `lms_lead_detail`
--

DROP TABLE IF EXISTS `lms_lead_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lms_lead_detail` (
  `leadId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'lead id',
  `mobileNumber` double NOT NULL,
  `customerName` varchar(100) CHARACTER SET utf16 NOT NULL,
  `address` varchar(255) NOT NULL,
  `pinCode` int(6) NOT NULL,
  `city` varchar(25) NOT NULL,
  `rank` tinyint(4) NOT NULL,
  `allocatedTo` varchar(25) DEFAULT NULL,
  `dispositionId` mediumint(6) DEFAULT NULL,
  `createdTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `leadStatus` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`leadId`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `lms_state_master`
--

DROP TABLE IF EXISTS `lms_state_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lms_state_master` (
  `stateId` int(11) NOT NULL AUTO_INCREMENT,
  `stateName` varchar(25) NOT NULL,
  PRIMARY KEY (`stateId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lms_state_master`
--

LOCK TABLES `lms_state_master` WRITE;
/*!40000 ALTER TABLE `lms_state_master` DISABLE KEYS */;
INSERT INTO `lms_state_master` VALUES (1,'Delhi'),(2,'Maharashtra'),(3,'Tamil Nadu'),(4,'Karnataka'),(5,'Rajasthan');
/*!40000 ALTER TABLE `lms_state_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lms_user_detail`
--

DROP TABLE IF EXISTS `lms_user_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lms_user_detail` (
  `userId` int(11) NOT NULL AUTO_INCREMENT,
  `userName` varchar(25) NOT NULL,
  `employeeCode` varchar(23) NOT NULL,
  `userRole` varchar(20) NOT NULL,
  `userStatus` tinyint(4) NOT NULL DEFAULT '1',
  `userDayBucket` smallint(6) NOT NULL DEFAULT '10',
  `userTotalBucket` smallint(6) NOT NULL DEFAULT '50',
  `userActive` tinyint(4) NOT NULL DEFAULT '1',
  `userAllocationMode` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lms_user_detail`
--

LOCK TABLES `lms_user_detail` WRITE;
/*!40000 ALTER TABLE `lms_user_detail` DISABLE KEYS */;
INSERT INTO `lms_user_detail` VALUES (1,'Agent 1','LMS01','1',1,2,1000,1,1),(2,'Agent 2','LMS02','1',1,2,1000,1,1),(3,'Agent 3','LMS03','2',1,2,1000,1,1);
/*!40000 ALTER TABLE `lms_user_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lms_user_group_mapping`
--

DROP TABLE IF EXISTS `lms_user_group_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lms_user_group_mapping` (
  `userGroupId` int(11) NOT NULL AUTO_INCREMENT,
  `userGroupRank` int(11) NOT NULL,
  `userGroupGroupId` int(11) NOT NULL,
  `userGroupUserId` mediumint(6) DEFAULT NULL,
  PRIMARY KEY (`userGroupId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lms_user_group_mapping`
--

LOCK TABLES `lms_user_group_mapping` WRITE;
/*!40000 ALTER TABLE `lms_user_group_mapping` DISABLE KEYS */;
INSERT INTO `lms_user_group_mapping` VALUES (1,1,1,1),(2,1,1,2),(3,1,1,3);
/*!40000 ALTER TABLE `lms_user_group_mapping` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-06-26 14:55:14
