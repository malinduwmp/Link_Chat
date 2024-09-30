/*
 Navicat Premium Data Transfer

 Source Server         : MyDB
 Source Server Type    : MySQL
 Source Server Version : 80031 (8.0.31)
 Source Host           : localhost:3306
 Source Schema         : smart_chat

 Target Server Type    : MySQL
 Target Server Version : 80031 (8.0.31)
 File Encoding         : 65001

 Date: 27/09/2024 13:05:05
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for chat
-- ----------------------------
DROP TABLE IF EXISTS `chat`;
CREATE TABLE `chat` (
  `id` int NOT NULL,
  `form_user_id` int NOT NULL,
  `to_user_id1` int NOT NULL,
  `massage` text NOT NULL,
  `date_time` datetime NOT NULL,
  `chat_status_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_chat_user1_idx` (`form_user_id`),
  KEY `fk_chat_user2_idx` (`to_user_id1`),
  KEY `fk_chat_chat_status1_idx` (`chat_status_id`),
  CONSTRAINT `fk_chat_chat_status1` FOREIGN KEY (`chat_status_id`) REFERENCES `chat_status` (`id`),
  CONSTRAINT `fk_chat_user1` FOREIGN KEY (`form_user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `fk_chat_user2` FOREIGN KEY (`to_user_id1`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Records of chat
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for chat_status
-- ----------------------------
DROP TABLE IF EXISTS `chat_status`;
CREATE TABLE `chat_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Records of chat_status
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mobile` varchar(10) NOT NULL,
  `first_name` varchar(45) NOT NULL,
  `last_name` varchar(45) NOT NULL,
  `password` varchar(20) NOT NULL,
  `registerd_date_time` datetime NOT NULL,
  `user_status_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_user_status_idx` (`user_status_id`),
  CONSTRAINT `fk_user_user_status` FOREIGN KEY (`user_status_id`) REFERENCES `user_status` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Records of user
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for user_status
-- ----------------------------
DROP TABLE IF EXISTS `user_status`;
CREATE TABLE `user_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Records of user_status
-- ----------------------------
BEGIN;
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
