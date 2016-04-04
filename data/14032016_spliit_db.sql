-- phpMyAdmin SQL Dump
-- version 4.5.5.1deb2.trusty~ppa.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Mar 14, 2016 at 07:30 PM
-- Server version: 5.6.28-0ubuntu0.14.04.1
-- PHP Version: 5.5.9-1ubuntu4.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `spliit`
--

-- --------------------------------------------------------

--
-- Table structure for table `AccessToken`
--

CREATE TABLE `AccessToken` (
  `id` varchar(255) NOT NULL,
  `userId` bigint(20) NOT NULL,
  `ttl` int(11) DEFAULT NULL,
  `created` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `AccessToken`
--

INSERT INTO `AccessToken` (`id`, `userId`, `ttl`, `created`) VALUES
('uwzOr6MUlCGaFqoeNfQbUUW1HoaEatpSLfyRjehBX9a0iqkknYWZ65EKlJEDcNLz', 134, 1209600, '2016-03-14 09:00:29');

-- --------------------------------------------------------

--
-- Table structure for table `ACL`
--

CREATE TABLE `ACL` (
  `id` int(11) NOT NULL,
  `model` varchar(512) DEFAULT NULL,
  `property` varchar(512) DEFAULT NULL,
  `accessType` varchar(512) DEFAULT NULL,
  `permission` varchar(512) DEFAULT NULL,
  `principalType` varchar(512) DEFAULT NULL,
  `principalId` varchar(512) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `brand`
--

CREATE TABLE `brand` (
  `id_brand` int(11) NOT NULL,
  `brand_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `brand`
--

INSERT INTO `brand` (`id_brand`, `brand_name`) VALUES
(1, 'NIKE'),
(3, 'ZARA'),
(4, 'CELIO'),
(7, 'JULES'),
(8, 'GO SPORT'),
(10, 'ZARA'),
(11, 'ADIDAS'),
(12, 'DIOR'),
(13, 'CHANEL'),
(14, 'THE BODY SHOP'),
(15, 'JULES'),
(16, 'KAPORAL'),
(17, 'LACOSTE'),
(18, 'LEVIS'),
(19, 'YVES ROCHER');

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id_category` int(11) NOT NULL,
  `language` varchar(2) NOT NULL COMMENT 'Language on 2 chars',
  `label` varchar(20) NOT NULL,
  `url_image` varchar(100) NOT NULL,
  `active` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id_category`, `language`, `label`, `url_image`, `active`) VALUES
(0, 'fr', 'category0', '', 1),
(1, 'fr', 'category1', 'http://spliit.net/rest-prod/img/category/clothes@3x.png', 1),
(2, 'fr', 'category2', 'http://spliit.net/rest-prod/img/category/technology@3x.png', 1),
(3, 'fr', 'category3', 'http://spliit.net/rest-prod/img/category/furniture@3x.png', 1),
(4, 'fr', 'category4', 'http://spliit.net/rest-prod/img/category/accessories@3x.png', 1),
(5, 'fr', 'category5', 'http://spliit.net/rest-prod/img/category/activities@3x.png', 1),
(9, 'fr', 'category8', 'http://spliit.net/rest-prod/img/category/automobile@2x.png', 1),
(10, 'fr', 'category9', 'http://spliit.net/rest-prod/img/category/bienetre@2x.png', 1),
(11, 'fr', 'category10', 'http://spliit.net/rest-prod/img/category/divers@2x.png', 1);

-- --------------------------------------------------------

--
-- Table structure for table `city`
--

CREATE TABLE `city` (
  `id_city` int(11) NOT NULL,
  `city_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `city`
--

INSERT INTO `city` (`id_city`, `city_name`) VALUES
(1, 'Paris'),
(2, 'Toulouse'),
(5, 'Bordeaux'),
(6, 'Nantes');

-- --------------------------------------------------------

--
-- Table structure for table `deal`
--

CREATE TABLE `deal` (
  `id_deal` bigint(20) NOT NULL,
  `id_shop` int(11) NOT NULL,
  `created_date` datetime NOT NULL,
  `created_by` bigint(20) NOT NULL,
  `title` varchar(200) CHARACTER SET latin1 NOT NULL,
  `description` text CHARACTER SET latin1 NOT NULL,
  `type_deal` int(11) NOT NULL,
  `promo` varchar(10) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `category` int(11) NOT NULL,
  `address` varchar(100) CHARACTER SET latin1 NOT NULL,
  `location` varchar(20) CHARACTER SET latin1 NOT NULL,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  `brand` varchar(100) CHARACTER SET latin1 NOT NULL,
  `store_name` varchar(100) CHARACTER SET latin1 NOT NULL,
  `active` tinyint(1) NOT NULL,
  `nb_required_cust` int(11) NOT NULL,
  `last_modified_date` datetime NOT NULL,
  `last_modified_user` bigint(20) NOT NULL,
  `url_image` varchar(100) CHARACTER SET latin1 NOT NULL,
  `archived` tinyint(4) NOT NULL DEFAULT '0',
  `geo` point DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `deal`
--

INSERT INTO `deal` (`id_deal`, `id_shop`, `created_date`, `created_by`, `title`, `description`, `type_deal`, `promo`, `start_date`, `end_date`, `category`, `address`, `location`, `latitude`, `longitude`, `brand`, `store_name`, `active`, `nb_required_cust`, `last_modified_date`, `last_modified_user`, `url_image`, `archived`, `geo`) VALUES
(57, 0, '2016-02-25 12:13:07', 30, '', 'test', 0, '10', '0000-00-00', '2016-03-20', 0, '37 Phan XÃ­ch Long, ph??ng 2, PhÃº Nhu?n, H? ChÃ­ Minh, Vi?t Nam', '10.800243,106.684942', 10.800243, 106.684942, 'test', '', 1, 2, '2016-02-25 00:00:00', 30, 'http://spliit.local/rest-prod/img/deals/_pictures_20160225121254.jpg', 0, NULL),
(63, 0, '2016-03-10 00:00:00', 30, 'string', 'string', 0, 'string', '2016-03-10', '2016-03-16', 0, 'string', 'string', 0, 0, 'string', 'string', 1, 3, '2016-03-10 00:00:00', 0, 'string', 0, '\0\0\0\0\0\0\0³´Ss¹™%@\njøÖ«Z@'),
(65, 0, '2016-03-11 00:00:00', 30, 'string', 'string', 0, 'string', '2016-03-11', '2016-03-16', 0, 'string', 'string', 0, 0, 'string', 'string', 1, 3, '2016-03-11 00:00:00', 0, 'string', 0, '\0\0\0\0\0\0\0AÔ}\0R›@Sy;ÂikZ@');

-- --------------------------------------------------------

--
-- Table structure for table `deal_group`
--

CREATE TABLE `deal_group` (
  `id_deal_group` int(11) NOT NULL,
  `id_deal` bigint(20) NOT NULL,
  `group_number` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `concluded` int(11) NOT NULL DEFAULT '0',
  `reviewed` int(11) NOT NULL DEFAULT '0',
  `archived` int(11) DEFAULT '0',
  `required_nb_cust` int(11) NOT NULL,
  `current_nb_cust` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `deal_group`
--

INSERT INTO `deal_group` (`id_deal_group`, `id_deal`, `group_number`, `status`, `concluded`, `reviewed`, `archived`, `required_nb_cust`, `current_nb_cust`) VALUES
(1, 57, 1, 0, 0, 0, 0, 2, 1),
(7, 63, 1, 1, 0, 0, 0, 3, 2);

-- --------------------------------------------------------

--
-- Table structure for table `email_for_beta`
--

CREATE TABLE `email_for_beta` (
  `id_email` int(11) NOT NULL,
  `email` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `email_for_beta`
--

INSERT INTO `email_for_beta` (`id_email`, `email`) VALUES
(7, 'contact@julianohayon.com'),
(4, 'fabien.lwh@gmail.com'),
(5, 'nicocins@gmail.com'),
(8, 'nicocins@hotmail.com'),
(10, 'quynhquyenbui@gmail.com'),
(1, 'ruben.aouizerate@gmail.com'),
(11, 'tan15111988@gmail.com'),
(12, 'wizard.fpt@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `h_queries`
--

CREATE TABLE `h_queries` (
  `id` int(11) NOT NULL,
  `id_cust` bigint(20) NOT NULL,
  `query_name` int(11) NOT NULL,
  `last_executed_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `h_queries`
--

INSERT INTO `h_queries` (`id`, `id_cust`, `query_name`, `last_executed_date`) VALUES
(9, 17, 1, '2015-12-02 20:41:21'),
(10, 1, 1, '2015-11-15 19:57:40'),
(11, 30, 1, '2016-01-26 05:58:52'),
(12, 26, 1, '2015-12-02 09:31:43'),
(13, 0, 1, '2016-01-26 07:08:42');

-- --------------------------------------------------------

--
-- Table structure for table `label`
--

CREATE TABLE `label` (
  `id_label` int(11) NOT NULL,
  `module` varchar(30) CHARACTER SET latin1 NOT NULL,
  `language` varchar(2) CHARACTER SET latin1 NOT NULL,
  `name` varchar(20) CHARACTER SET latin1 NOT NULL,
  `value` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `label`
--

INSERT INTO `label` (`id_label`, `module`, `language`, `name`, `value`) VALUES
(1, 'category', 'fr', 'category1', 'Pret a porter'),
(2, 'category', 'fr', 'category2', 'Technologie'),
(3, 'category', 'fr', 'category3', 'Meubles'),
(4, 'category', 'fr', 'category4', 'Accessoires'),
(5, 'category', 'en', 'category1', 'Clothes'),
(6, 'category', 'en', 'category2', 'Technologies'),
(7, 'category', 'en', 'category3', 'Furnitures'),
(8, 'category', 'en', 'category4', 'Accessories'),
(9, 'category', 'fr', 'category5', 'ActivitÃ©es'),
(10, 'category', 'en', 'category5', 'Activities'),
(11, 'category', 'fr', 'category6', 'Automobile'),
(12, 'category', 'en', 'category6', 'Cars'),
(13, 'category', 'en', 'category7', 'Cosmetics'),
(14, 'category', 'fr', 'category7', 'Cosmetiques'),
(15, 'category', 'fr', 'category0', 'Tous'),
(16, 'category', 'en', 'category0', 'All'),
(17, 'category', 'fr', 'category8', 'Automobiles'),
(18, 'category', 'en', 'category8', 'Cars'),
(23, 'category', 'fr', 'category9', 'Bien Ãªtre'),
(24, 'category', 'en', 'category9', 'Health Care'),
(25, 'category', 'fr', 'category10', 'Divers'),
(26, 'category', 'en', 'category10', 'Various');

-- --------------------------------------------------------

--
-- Table structure for table `Role`
--

CREATE TABLE `Role` (
  `id` int(11) NOT NULL,
  `name` varchar(512) NOT NULL,
  `description` varchar(512) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Role`
--

INSERT INTO `Role` (`id`, `name`, `description`, `created`, `modified`) VALUES
(1, 'USER', 'User type', NULL, NULL),
(2, 'ADMIN', 'Administrator', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `RoleMapping`
--

CREATE TABLE `RoleMapping` (
  `id` int(11) NOT NULL,
  `principalType` varchar(512) DEFAULT NULL,
  `principalId` varchar(512) DEFAULT NULL,
  `roleId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `RoleMapping`
--

INSERT INTO `RoleMapping` (`id`, `principalType`, `principalId`, `roleId`) VALUES
(1, 'USER', '111', 1),
(2, 'USER', '112', NULL),
(3, 'USER', '113', NULL),
(4, 'USER', '114', NULL),
(5, 'USER', '115', NULL),
(6, 'USER', '116', 1),
(7, 'USER', '117', 1),
(8, 'USER', '118', 1),
(9, 'USER', '119', 1),
(10, 'USER', '120', 1),
(11, 'USER', '121', 1),
(12, 'USER', '122', 1),
(13, 'USER', '123', 1),
(14, 'USER', '124', 1),
(15, 'USER', '125', 1),
(16, 'USER', '126', 1),
(17, 'USER', '127', 1),
(18, 'USER', '128', 1),
(19, 'USER', '129', 1),
(20, 'USER', '130', 1),
(21, 'USER', '131', 1),
(22, 'USER', '132', 1),
(23, 'USER', '133', 1),
(24, 'USER', '134', 1),
(25, 'USER', '135', 1);

-- --------------------------------------------------------

--
-- Table structure for table `session`
--

CREATE TABLE `session` (
  `id_session` bigint(20) NOT NULL,
  `id_cust` bigint(20) NOT NULL,
  `id_device` bigint(20) NOT NULL,
  `status` enum('Working','Closed','','') NOT NULL,
  `start_date` date NOT NULL,
  `expiration_date` date NOT NULL,
  `end_date` date NOT NULL,
  `id_crypted` varchar(100) NOT NULL,
  `private_key` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `session`
--

INSERT INTO `session` (`id_session`, `id_cust`, `id_device`, `status`, `start_date`, `expiration_date`, `end_date`, `id_crypted`, `private_key`) VALUES
(54, 8, 0, 'Working', '0000-00-00', '0000-00-00', '0000-00-00', '7e260b02f609dd20abe35c8b7594d2ee6fcf602e', 'TEST'),
(70, 6, 0, 'Working', '0000-00-00', '0000-00-00', '0000-00-00', 'bf9fc6dc4b9726574b3488acb548f1169e24c9b5', 'TEST'),
(86, 18, 0, 'Working', '0000-00-00', '0000-00-00', '0000-00-00', '5ce330aec8f206fa77e0fa088f9218d346b3be85', 'TEST'),
(130, 23, 0, 'Working', '0000-00-00', '0000-00-00', '0000-00-00', 'aabf62d6803efa7803da2fe4b363796adadd9ba6', 'TEST'),
(131, 27, 0, 'Working', '0000-00-00', '0000-00-00', '0000-00-00', '0e1c873edf48016ce433fea34705e1d2e8ad6f04', 'TEST'),
(270, 14, 0, 'Working', '0000-00-00', '0000-00-00', '0000-00-00', '50f1848f37e9a19fa03a0110c4cac144ea91a091', 'TEST'),
(322, 17, 0, 'Working', '0000-00-00', '0000-00-00', '0000-00-00', '82164c6b3759465ba446dec290d28156c8fe87f0', 'TEST'),
(362, 29, 0, 'Working', '0000-00-00', '0000-00-00', '0000-00-00', '478b41f12ae1dbfbd68b7b2a3eb17a37341da693', 'TEST'),
(363, 26, 0, 'Working', '0000-00-00', '0000-00-00', '0000-00-00', '0a6e30aebf862f7babdb6238da15345f80285386', 'TEST');

-- --------------------------------------------------------

--
-- Table structure for table `shared_deal`
--

CREATE TABLE `shared_deal` (
  `id_s_deal` bigint(20) NOT NULL,
  `id_deal` bigint(20) NOT NULL,
  `id_cust` bigint(20) NOT NULL,
  `customer_status` int(11) NOT NULL,
  `has_concluded` int(11) NOT NULL DEFAULT '0',
  `has_reviewed` int(11) NOT NULL DEFAULT '0',
  `archive` int(11) NOT NULL DEFAULT '0',
  `status` enum('INCOMPLETE','COMPLETE') DEFAULT NULL,
  `creation_date` datetime NOT NULL,
  `group_number` int(11) NOT NULL,
  `last_modified_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `shared_deal`
--

INSERT INTO `shared_deal` (`id_s_deal`, `id_deal`, `id_cust`, `customer_status`, `has_concluded`, `has_reviewed`, `archive`, `status`, `creation_date`, `group_number`, `last_modified_date`) VALUES
(6, 63, 134, 1, 0, 0, 0, 'INCOMPLETE', '2016-03-14 10:40:56', 1, '2016-03-14 12:28:58'),
(33, 63, 29, 1, 0, 0, 0, 'INCOMPLETE', '2016-03-14 11:55:12', 1, '2016-03-14 12:28:58');

-- --------------------------------------------------------

--
-- Table structure for table `shop`
--

CREATE TABLE `shop` (
  `id_shop` int(11) NOT NULL,
  `address` varchar(100) NOT NULL,
  `city` varchar(100) NOT NULL,
  `cp` varchar(10) NOT NULL,
  `name` varchar(80) NOT NULL,
  `latitude` float NOT NULL,
  `longitude` float NOT NULL,
  `id_brand` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `shop`
--

INSERT INTO `shop` (`id_shop`, `address`, `city`, `cp`, `name`, `latitude`, `longitude`, `id_brand`) VALUES
(2, '40 Avenue d\'Italie', 'Paris', '75013', 'GO SPORT', 48.8303, 2.35303, 8),
(3, 'Centre Commercial les 4 Temps,Les 4 Temps', 'Paris', '92092', 'GO SPORT', 48.8908, 2.23577, 8),
(5, 'Centre Commercial Auchan, Chemin de Gabardie, 31200 Toulouse Gramont', 'Toulouse', '31200 ', 'NIKE', 0, 0, 1),
(6, 'Centre Commercial les 4 Temps,Les 4 Temps', 'Paris', '92092', 'NIKE', 48.8908, 2.23577, 1),
(7, 'Centre Italie 2', 'Paris', '75013', 'NIKE', 48.8303, 2.35303, 1),
(20, '3 Ter Rue des Rosiers', 'Paris', '75004', 'Adidas Originals', 48.8575, 2.31135, 11),
(21, '22 Avenue des champs ElysÃ©es', 'Paris', '75008', 'Y-3', 48.8697, 2.30699, 11),
(22, '30 Avenue d\'Italie', 'Paris', '75013', 'Centre Commercial Italie 2 - Printemps', 48.8303, 2.35303, 4),
(23, '30 Avenue d\'Italie', 'Paris', '75013', 'Centre Commercial Italie 2 - Printemps', 48.8303, 2.35303, 17),
(24, '30 Avenue d\'Italie', 'Paris', '75013', 'Centre Commercial Italie 2 - Printemps', 48.8303, 2.35303, 18),
(25, '30 Avenue d\'Italie', 'Paris', '75013', 'Centre Commercial Italie 2 - The body Shop', 48.8303, 2.35303, 14),
(26, '30 Avenue d\'Italie', 'Paris', '75013', 'Centre Commercial Italie 2 - The body Shop', 48.8303, 2.35303, 15),
(27, '22 Rue du DÃ©part', 'Paris', '75015', 'Centre Commercial Montparnasse - Lacoste', 48.8428, 2.32045, 17),
(28, '22 Rue du DÃ©part', 'Paris', '75015', 'Centre Commercial Montparnasse - Passing Levis', 48.8428, 2.32045, 18),
(29, 'Somewhere', 'HCMC', '75015', 'Go Pro', 10.8065, 106.682, 18);

-- --------------------------------------------------------

--
-- Table structure for table `stats_deal`
--

CREATE TABLE `stats_deal` (
  `id_statistique_deal` int(11) NOT NULL,
  `id_deal` bigint(20) NOT NULL,
  `current_nb_group` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `stats_deal`
--

INSERT INTO `stats_deal` (`id_statistique_deal`, `id_deal`, `current_nb_group`) VALUES
(47, 57, 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id_cust` bigint(20) NOT NULL COMMENT 'Id of customer',
  `login` varchar(60) NOT NULL COMMENT 'Login of customer',
  `password` varchar(60) NOT NULL COMMENT 'Password of customer',
  `email` varchar(100) NOT NULL COMMENT 'Email of customer',
  `first_name` varchar(60) NOT NULL,
  `last_name` varchar(60) NOT NULL,
  `mobile_phone` varchar(12) NOT NULL,
  `birthdate` date NOT NULL,
  `activation_key` tinyint(1) NOT NULL COMMENT 'Dertemines if customer validates his/her account',
  `password_reset_token` varchar(255) DEFAULT NULL,
  `customer_admin` tinyint(1) NOT NULL COMMENT 'Determines if the user have administrator profile or not',
  `gender` varchar(1) NOT NULL,
  `nb_shared_deal` int(11) NOT NULL,
  `mark` int(11) NOT NULL,
  `country` varchar(60) NOT NULL,
  `avatar` longtext NOT NULL,
  `url_validation` varchar(50) NOT NULL,
  `longitude` double NOT NULL,
  `latitude` double NOT NULL,
  `distance` int(11) NOT NULL,
  `facebook_id` varchar(255) NOT NULL,
  `realm` varchar(512) DEFAULT NULL,
  `emailVerified` tinyint(4) DEFAULT NULL,
  `verificationToken` varchar(512) DEFAULT NULL,
  `status` varchar(512) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id_cust`, `login`, `password`, `email`, `first_name`, `last_name`, `mobile_phone`, `birthdate`, `activation_key`, `password_reset_token`, `customer_admin`, `gender`, `nb_shared_deal`, `mark`, `country`, `avatar`, `url_validation`, `longitude`, `latitude`, `distance`, `facebook_id`, `realm`, `emailVerified`, `verificationToken`, `status`) VALUES
(1, '', 'd16dc28323e710019676487f4cc7d48e421df134', 'guyn49@gmail.com', 'Fabiena', 'LWYY', '0760454545', '0000-00-00', 0, NULL, 0, 'M', 0, 0, 'France', 'http://spliit.net/rest-prod/img/users/1_pictures_20151003100138.jpg', '', 2.3639542, 48.8215234, 50, '', NULL, NULL, NULL, NULL),
(6, '', '926fd0b43701a3e720e635cfded14ee6c8e8d2ce', 'guyn52@gmail.com', 'Nicolas', 'Sadir', '0760454545', '0000-00-00', 0, NULL, 0, 'M', 0, 0, 'France', 'http://spliit.net/rest-prod/img/users/6_pictures_20151005083814.jpg', '', 0, 0, 50, '', NULL, NULL, NULL, NULL),
(8, '', '926fd0b43701a3e720e635cfded14ee6c8e8d2ce', 'nicolas6@gmail.com', 'Vinh', 'Diemel', '0760454545', '0000-00-00', 0, NULL, 0, 'M', 0, 0, 'France', 'http://spliit.net/rest-prod/img/users/8_pictures_20151005084000.jpg', '', 0, 0, 50, '', NULL, NULL, NULL, NULL),
(10, '', 'd16dc28323e710019676487f4cc7d48e421df134', 'nicolas7@gmail.com', 'Marco', 'Vera', '0760454545', '0000-00-00', 0, NULL, 0, 'M', 0, 3, 'France', 'http://spliit.net/rest-prod/img/users/10_pictures_20151005085611.jpg', '', 0, 0, 50, '', NULL, NULL, NULL, NULL),
(14, '', 'd16dc28323e710019676487f4cc7d48e421df134', 'nicolas8@gmail.com', 'Fabiena', 'LWYY', '0760454545', '0000-00-00', 0, NULL, 0, 'M', 0, 5, 'France', 'http://spliit.net/rest-prod/img/users/14_pictures_20151005085704.jpg', '', 0, 0, 50, '', NULL, NULL, NULL, NULL),
(17, '', 'd16dc28323e710019676487f4cc7d48e421df134', 'plop@plop.com', 'First', 'Last', '0669696969', '0000-00-00', 0, NULL, 0, 'm', 0, 4, 'fr', 'http://spliit.net/rest-prod/img/users/17_pictures_20151018141808.jpg', '', 0, 0, 50, '', NULL, NULL, NULL, NULL),
(18, '', '2c08e8f5884750a7b99f6f2f342fc638db25ff31', 'plop1@plop.com', 'First', 'Last', '0669696969', '0000-00-00', 0, NULL, 0, 'M', 0, 0, 'fr', 'http://spliit.net/rest-prod/img/users/fichier_du_20150909230326.gif', '', 0, 0, 50, '', NULL, NULL, NULL, NULL),
(19, '', '2c08e8f5884750a7b99f6f2f342fc638db25ff31', 'plop2@plop.com', 'Plop2', 'Last', '0669696969', '0000-00-00', 0, NULL, 0, 'M', 0, 0, 'fr', '', '', 0, 0, 50, '', NULL, NULL, NULL, NULL),
(21, '', '2c08e8f5884750a7b99f6f2f342fc638db25ff31', 'plop3@plop.com', 'Plop3', 'Last', '0669696969', '0000-00-00', 0, NULL, 0, 'F', 0, 0, 'fr', '', '', 0, 0, 50, '', NULL, NULL, NULL, NULL),
(22, '', '2c08e8f5884750a7b99f6f2f342fc638db25ff31', 'plop4@plop.com', 'Plop4', 'Last', '0669696969', '0000-00-00', 0, NULL, 0, 'M', 0, 0, 'fr', 'http://spliit.net/rest-prod/img/users/fichier_du_20150909230326.gif', '', 0, 0, 50, '', NULL, NULL, NULL, NULL),
(23, '', '2c08e8f5884750a7b99f6f2f342fc638db25ff31', 'plop5@plop.com', 'Plop5', 'Last', '0669696969', '0000-00-00', 0, NULL, 0, 'M', 0, 0, 'fr', '', '', 0, 0, 50, '', NULL, NULL, NULL, NULL),
(24, '', '2c08e8f5884750a7b99f6f2f342fc638db25ff31', 'plop6@plop.com', 'Plop6', 'Last', '0669696969', '0000-00-00', 0, NULL, 0, 'M', 0, 0, 'fr', '', '', 0, 0, 50, '', NULL, NULL, NULL, NULL),
(25, '', '2c08e8f5884750a7b99f6f2f342fc638db25ff31', 'ploppi42@wanadoo.fr', 'Plop7', 'Last', '0669696969', '0000-00-00', 0, NULL, 0, '', 0, 0, 'fr', 'http://spliit.net/rest-prod/img/users/fichier_du_20150909230326.gif', '', 0, 0, 50, '', NULL, NULL, NULL, NULL),
(26, '', 'd16dc28323e710019676487f4cc7d48e421df134', 'tannn@elinext.com', 'Tan', 'Nguyen', '1234567', '0000-00-00', 0, NULL, 0, 'M', 0, 0, 'FRANCE', '', 'a94e7901a3d70c64e82f5b8b3fa849712953b407', 0, 0, 10, '', NULL, NULL, NULL, NULL),
(29, '', '$2a$10$RqBNhJ8wS10pCNpCBy6Kvulzggr5LjZ/264ybPVJjqwMiqOpEvxNG', 'wizard.fpt@gmail.com', 'PT2000', 'Angular', '0612345678', '0000-00-00', 1, '', 0, 'M', 0, 5, 'FRANCE', 'http://spliit.local/rest-prod/img/users/29_pictures_20160105135241.png', 'c4ca5a2bca5148139f9f4ea01e56ae0b2159fc50', 0, 0, 10, '', NULL, 1, NULL, NULL),
(30, '', 'd16dc28323e710019676487f4cc7d48e421df134', 'tuongthang.phan@elinext.com', 'Phan', 'Thang', ' 33124455667', '0000-00-00', 1, 'c1d33a68fefc454801cccf3008a74dce', 0, 'M', 0, 4, 'FRANCE', '', '071c17bd319d403c6c8d2105e5ce35fd1378e04c', 0, 0, 10, '', NULL, NULL, NULL, NULL),
(31, '', 'c4dccc8c3c72bca4947231ce7d91cba0aeed6bf7', 'undefined', 'Undefined', 'Undefined', 'undefined', '0000-00-00', 0, NULL, 0, 'U', 0, 0, 'FRANCE', '', 'f7801dd1d92d8cf24f615607afe90c43c334caac', 0, 0, 10, '', NULL, NULL, NULL, NULL),
(34, '', '1a66356b3a157d12fb43299a3d1d5875166e4af9', 'qwd@awd', 'Qwdqwdqqwqwd', 'Wdwd', '01266183831', '0000-00-00', 0, NULL, 0, 'M', 0, 0, 'FRANCE', '', '75aab398843fa116ae4374ba1020206b6b24f609', 0, 0, 10, '', NULL, NULL, NULL, NULL),
(62, '', '1a66356b3a157d12fb43299a3d1d5875166e4af9', 'gethight@gmail.com', 'Test', 'Test', '(2 1154-555-', '0000-00-00', 0, NULL, 0, 'F', 0, 0, 'Vietnam', '', '117859431bda194792eeb9a0b52c0f15e1b4337d', 0, 0, 10, '', NULL, NULL, NULL, NULL),
(78, '', '1a66356b3a157d12fb43299a3d1d5875166e4af9', 'bleed@blled.uk', 'TP', 'Test', ' 1 558-484-8', '0000-00-00', 0, NULL, 0, 'M', 0, 0, '', './avatar/Test-bleed@blled.uk.jpg', '62fa38637f2b523823854a714c8f3f98a8672a58', 0, 0, 10, '', NULL, NULL, NULL, NULL),
(79, '', '1a66356b3a157d12fb43299a3d1d5875166e4af9', 'anotherblob@gmail.com', 'Thang', 'Phan', ' 33 4 45 44 ', '0000-00-00', 0, NULL, 0, 'M', 0, 0, '', './avatar/Phan-anotherblob@gmail.com.jpg', 'ecaa9eb860b81da4344c6c71ddbde0d4188949be', 0, 0, 10, '', NULL, NULL, NULL, NULL),
(80, '', '1a66356b3a157d12fb43299a3d1d5875166e4af9', 'isisarmy@gmail.com', 'Isis', 'Islam', ' 33 1 51 14 ', '0000-00-00', 0, NULL, 0, 'M', 0, 0, '', './avatar/Islam-isisarmy@gmail.com.jpg', '68efbcc676e28538529a99687d2e9f60b4b4cf3d', 0, 0, 10, '', NULL, NULL, NULL, NULL),
(81, '', '1a66356b3a157d12fb43299a3d1d5875166e4af9', 'wiizwii@gmail.com', 'W', 'Dw', ' 1 231-231-2', '0000-00-00', 0, NULL, 0, 'F', 0, 0, '', './avatar/Dw-wiizwii@gmail.com.jpg', '422e1eaaf931cf258c0c61989405aa7240f6292d', 0, 0, 10, '', NULL, NULL, NULL, NULL),
(82, '', '1a66356b3a157d12fb43299a3d1d5875166e4af9', 'teii@gmail.com', 'W', 'W', ' 1 152-265-5', '0000-00-00', 0, NULL, 0, 'M', 0, 0, '', './avatar/W-teii@gmail.com.jpg', 'd5e8b853f9958c17badfae7081237425aa9f9b22', 0, 0, 10, '', NULL, NULL, NULL, NULL),
(83, '', '1a66356b3a157d12fb43299a3d1d5875166e4af9', 'tester001@gmail.com', 'Thang', 'Phan', ' 1 232-321-2', '0000-00-00', 0, NULL, 0, 'M', 0, 0, '', './avatar/Phan-tester001@gmail.com.jpg', 'e81edc337684f9d247eccd89ffd79c55bf38949a', 0, 0, 10, '', NULL, NULL, NULL, NULL),
(84, '', '1a66356b3a157d12fb43299a3d1d5875166e4af9', 'testerelisoft@gmail.com', 'Thang', 'Phan', ' 1 588-454-5', '0000-00-00', 0, NULL, 0, 'F', 0, 0, '', './avatar/Phan-testerelisoft@gmail.com.jpg', '495a9adc5b880a505edfe22e54df9ef11c31667e', 0, 0, 10, '', NULL, NULL, NULL, NULL),
(87, '', '1a66356b3a157d12fb43299a3d1d5875166e4af9', 'tester12elisoft@gmail.com', 'Thang', 'Phan', ' 1 588-454-5', '1991-05-08', 0, NULL, 0, 'F', 0, 0, '', './avatar/Phan-testerelisoft@gmail.com.jpg', '495a9adc5b880a505edfe22e54df9ef11c31667e', 0, 0, 10, '', NULL, NULL, NULL, NULL),
(88, '', '1a66356b3a157d12fb43299a3d1d5875166e4af9', 'etanol@gmail.com', 'T', 'A', ' 1 995-668-6', '1992-06-05', 0, NULL, 0, 'M', 0, 0, '', './avatar/A-etanol@gmail.com.jpg', '60bd1ea749a6c35ec173ec794e9193aab84a91c3', 0, 0, 10, '', NULL, NULL, NULL, NULL),
(96, '', 'd16dc28323e710019676487f4cc7d48e421df134', 'thangtuyen2408@gmail.com', 'Thang', 'Phan', ' 1 233-524-3', '1991-04-07', 0, NULL, 0, 'M', 0, 0, '', 'http://spliit.local/rest-prod/img/users/users_pictures_20160106100431_478744508.png', '6f44c5ca3e86afdacf5d81aa5bcd44340bb03830', 0, 0, 10, '', NULL, NULL, NULL, NULL),
(104, '', '', 'bongsennho98@yahoo.com', 'Nguyen', 'Hoa', '', '0000-00-00', 0, NULL, 0, 'F', 0, 0, 'FRANCE', 'https://graph.facebook.com/998758023528871/picture?type=large', '', 0, 0, 10, '998758023528871', NULL, NULL, NULL, NULL),
(107, 'string', '$2a$10$2.mLiuW0WMgD6D7i.Vy.4.4T3z.pCaGJaDrxC/23h3UH/WxcRAmGW', 'gabrieltp123@gmail.com', 'string', 'string', 'string', '2016-03-07', 0, 'string', 0, 'M', 0, 0, 'FR', 'string', 'string', 0, 0, 0, 'string', NULL, NULL, NULL, NULL),
(134, '', '$2a$10$8fB6uXvbc56PRXE4dUphrOMeBztAYdktmxQxBwCLkcIU9tRAzdCF6', 'finalfantasy812@gmail.com', '', '', '', '0000-00-00', 0, NULL, 0, 'M', 0, 0, 'FR', 'https://graph.facebook.com/998758023528871/picture?type=large', '', 0, 0, 0, '998758023528871', NULL, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users_comments`
--

CREATE TABLE `users_comments` (
  `id_users_comments` int(11) NOT NULL,
  `id_cust` bigint(20) NOT NULL,
  `id_owner` bigint(20) NOT NULL,
  `id_deal` bigint(20) NOT NULL,
  `comments` text NOT NULL,
  `mark` int(11) NOT NULL,
  `id_s_deal` int(11) NOT NULL,
  `creation_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users_comments`
--

INSERT INTO `users_comments` (`id_users_comments`, `id_cust`, `id_owner`, `id_deal`, `comments`, `mark`, `id_s_deal`, `creation_date`) VALUES
(1, 81, 30, 65, 'Plapla', 4, 2, '2016-03-11');

-- --------------------------------------------------------

--
-- Table structure for table `users_reports`
--

CREATE TABLE `users_reports` (
  `id_report` int(11) NOT NULL,
  `id_cust` bigint(20) NOT NULL,
  `id_owner` bigint(20) NOT NULL,
  `id_deal` bigint(20) NOT NULL,
  `is_reporting` tinyint(4) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `AccessToken`
--
ALTER TABLE `AccessToken`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `ACL`
--
ALTER TABLE `ACL`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `brand`
--
ALTER TABLE `brand`
  ADD PRIMARY KEY (`id_brand`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id_category`);

--
-- Indexes for table `city`
--
ALTER TABLE `city`
  ADD PRIMARY KEY (`id_city`);

--
-- Indexes for table `deal`
--
ALTER TABLE `deal`
  ADD PRIMARY KEY (`id_deal`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `category` (`category`);

--
-- Indexes for table `deal_group`
--
ALTER TABLE `deal_group`
  ADD PRIMARY KEY (`id_deal_group`),
  ADD UNIQUE KEY `id_users_comments` (`id_deal`,`group_number`);

--
-- Indexes for table `email_for_beta`
--
ALTER TABLE `email_for_beta`
  ADD PRIMARY KEY (`id_email`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `h_queries`
--
ALTER TABLE `h_queries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_cust` (`id_cust`);

--
-- Indexes for table `label`
--
ALTER TABLE `label`
  ADD PRIMARY KEY (`id_label`);

--
-- Indexes for table `Role`
--
ALTER TABLE `Role`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `RoleMapping`
--
ALTER TABLE `RoleMapping`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `session`
--
ALTER TABLE `session`
  ADD PRIMARY KEY (`id_session`),
  ADD UNIQUE KEY `id_cust` (`id_cust`),
  ADD UNIQUE KEY `id_session` (`id_session`);

--
-- Indexes for table `shared_deal`
--
ALTER TABLE `shared_deal`
  ADD PRIMARY KEY (`id_s_deal`),
  ADD UNIQUE KEY `id_s_deal` (`id_s_deal`),
  ADD UNIQUE KEY `id_cust` (`id_cust`) USING BTREE,
  ADD KEY `id_deal` (`id_deal`);

--
-- Indexes for table `shop`
--
ALTER TABLE `shop`
  ADD PRIMARY KEY (`id_shop`);

--
-- Indexes for table `stats_deal`
--
ALTER TABLE `stats_deal`
  ADD PRIMARY KEY (`id_statistique_deal`),
  ADD KEY `id_deal` (`id_deal`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_cust`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `users_comments`
--
ALTER TABLE `users_comments`
  ADD PRIMARY KEY (`id_users_comments`,`id_deal`,`id_cust`,`id_owner`) USING BTREE,
  ADD UNIQUE KEY `id_users_comments` (`id_cust`,`id_deal`,`id_owner`) USING BTREE,
  ADD KEY `id_owner` (`id_owner`),
  ADD KEY `id_deal` (`id_deal`);

--
-- Indexes for table `users_reports`
--
ALTER TABLE `users_reports`
  ADD PRIMARY KEY (`id_report`,`id_cust`,`id_owner`,`id_deal`) USING BTREE,
  ADD UNIQUE KEY `id_users_report` (`id_cust`,`id_owner`,`id_deal`) USING BTREE,
  ADD KEY `id_deal` (`id_deal`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ACL`
--
ALTER TABLE `ACL`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `brand`
--
ALTER TABLE `brand`
  MODIFY `id_brand` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id_category` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
--
-- AUTO_INCREMENT for table `city`
--
ALTER TABLE `city`
  MODIFY `id_city` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `deal`
--
ALTER TABLE `deal`
  MODIFY `id_deal` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;
--
-- AUTO_INCREMENT for table `deal_group`
--
ALTER TABLE `deal_group`
  MODIFY `id_deal_group` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
--
-- AUTO_INCREMENT for table `email_for_beta`
--
ALTER TABLE `email_for_beta`
  MODIFY `id_email` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `h_queries`
--
ALTER TABLE `h_queries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
--
-- AUTO_INCREMENT for table `label`
--
ALTER TABLE `label`
  MODIFY `id_label` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;
--
-- AUTO_INCREMENT for table `Role`
--
ALTER TABLE `Role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `RoleMapping`
--
ALTER TABLE `RoleMapping`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;
--
-- AUTO_INCREMENT for table `session`
--
ALTER TABLE `session`
  MODIFY `id_session` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=364;
--
-- AUTO_INCREMENT for table `shared_deal`
--
ALTER TABLE `shared_deal`
  MODIFY `id_s_deal` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;
--
-- AUTO_INCREMENT for table `shop`
--
ALTER TABLE `shop`
  MODIFY `id_shop` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;
--
-- AUTO_INCREMENT for table `stats_deal`
--
ALTER TABLE `stats_deal`
  MODIFY `id_statistique_deal` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id_cust` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Id of customer', AUTO_INCREMENT=136;
--
-- AUTO_INCREMENT for table `users_comments`
--
ALTER TABLE `users_comments`
  MODIFY `id_users_comments` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `users_reports`
--
ALTER TABLE `users_reports`
  MODIFY `id_report` int(11) NOT NULL AUTO_INCREMENT;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `AccessToken`
--
ALTER TABLE `AccessToken`
  ADD CONSTRAINT `AccessToken_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id_cust`);

--
-- Constraints for table `deal`
--
ALTER TABLE `deal`
  ADD CONSTRAINT `deal_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id_cust`),
  ADD CONSTRAINT `deal_ibfk_2` FOREIGN KEY (`category`) REFERENCES `category` (`id_category`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `deal_group`
--
ALTER TABLE `deal_group`
  ADD CONSTRAINT `deal_group_ibfk_1` FOREIGN KEY (`id_deal`) REFERENCES `deal` (`id_deal`);

--
-- Constraints for table `shared_deal`
--
ALTER TABLE `shared_deal`
  ADD CONSTRAINT `shared_deal_ibfk_1` FOREIGN KEY (`id_deal`) REFERENCES `deal` (`id_deal`),
  ADD CONSTRAINT `shared_deal_ibfk_2` FOREIGN KEY (`id_cust`) REFERENCES `users` (`id_cust`);

--
-- Constraints for table `stats_deal`
--
ALTER TABLE `stats_deal`
  ADD CONSTRAINT `stats_deal_ibfk_1` FOREIGN KEY (`id_deal`) REFERENCES `deal` (`id_deal`);

--
-- Constraints for table `users_comments`
--
ALTER TABLE `users_comments`
  ADD CONSTRAINT `users_comments_ibfk_1` FOREIGN KEY (`id_owner`) REFERENCES `users` (`id_cust`),
  ADD CONSTRAINT `users_comments_ibfk_2` FOREIGN KEY (`id_deal`) REFERENCES `deal` (`id_deal`);

--
-- Constraints for table `users_reports`
--
ALTER TABLE `users_reports`
  ADD CONSTRAINT `users_reports_ibfk_1` FOREIGN KEY (`id_cust`) REFERENCES `users` (`id_cust`),
  ADD CONSTRAINT `users_reports_ibfk_2` FOREIGN KEY (`id_deal`) REFERENCES `deal` (`id_deal`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
