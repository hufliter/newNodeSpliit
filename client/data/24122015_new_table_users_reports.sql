-- phpMyAdmin SQL Dump
-- version 4.5.2deb2.trusty~ppa.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Dec 24, 2015 at 02:24 PM
-- Server version: 5.6.27-0ubuntu0.14.04.1
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
-- Table structure for table `users_reports`
--

CREATE TABLE `users_reports` (
  `id_report` int(11) NOT NULL,
  `id_cust` int(11) NOT NULL,
  `id_owner` int(11) NOT NULL,
  `id_deal` int(11) NOT NULL,
  `is_reporting` tinyint(4) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users_reports`
--
ALTER TABLE `users_reports`
  ADD PRIMARY KEY (`id_report`,`id_cust`,`id_owner`,`id_deal`) USING BTREE,
  ADD UNIQUE KEY `id_users_report` (`id_cust`,`id_owner`,`id_deal`) USING BTREE;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users_reports`
--
ALTER TABLE `users_reports`
  MODIFY `id_report` int(11) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;