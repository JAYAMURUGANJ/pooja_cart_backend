-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 26, 2025 at 02:00 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pooja_ordering_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `created_at`, `updated_at`) VALUES
(1, '2025-03-18 11:00:13', '2025-03-18 11:00:13'),
(2, '2025-03-18 11:00:13', '2025-03-18 11:00:13'),
(3, '2025-03-18 11:00:13', '2025-03-18 11:00:13'),
(4, '2025-03-18 11:00:13', '2025-03-18 11:00:13'),
(5, '2025-03-18 11:00:13', '2025-03-18 11:00:13'),
(6, '2025-03-20 09:59:39', '2025-03-20 09:59:39'),
(7, '2025-03-20 10:09:24', '2025-03-20 10:09:24'),
(11, '2025-03-20 10:41:35', '2025-03-20 10:41:35'),
(12, '2025-03-20 10:43:12', '2025-03-20 10:43:12'),
(13, '2025-03-20 10:43:18', '2025-03-20 10:43:18');

-- --------------------------------------------------------

--
-- Table structure for table `category_translations`
--

CREATE TABLE `category_translations` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `language_code` enum('en','ta') NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category_translations`
--

INSERT INTO `category_translations` (`id`, `category_id`, `language_code`, `name`) VALUES
(1, 1, 'en', 'Oil'),
(2, 1, 'ta', 'எண்ணெய்'),
(3, 2, 'en', 'Ghee'),
(4, 2, 'ta', 'நெய்'),
(5, 3, 'en', 'Camphor'),
(6, 3, 'ta', 'கற்பூரம்'),
(7, 4, 'en', 'Incense stick'),
(8, 4, 'ta', 'தூபக் குச்சி'),
(9, 5, 'en', 'Cereals'),
(10, 5, 'ta', 'தானியங்கள்'),
(17, 11, 'en', 'Masala'),
(18, 11, 'ta', 'மசாலா'),
(19, 12, 'en', 'Milk'),
(20, 12, 'ta', 'பால்'),
(21, 13, 'en', 'Milk'),
(22, 13, 'ta', 'பால்');

-- --------------------------------------------------------

--
-- Table structure for table `category_units`
--

CREATE TABLE `category_units` (
  `category_id` int(11) NOT NULL,
  `unit_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category_units`
--

INSERT INTO `category_units` (`category_id`, `unit_id`) VALUES
(1, 3),
(1, 4),
(2, 1),
(2, 2),
(3, 2),
(3, 5),
(4, 5),
(5, 1),
(5, 2),
(11, 1),
(11, 2),
(12, 1),
(12, 2),
(13, 1),
(13, 2);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `address_id` int(11) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `total_mrp` decimal(10,2) NOT NULL,
  `total_discount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `delivery_fee` decimal(10,2) NOT NULL DEFAULT 0.00,
  `taxes` decimal(10,2) NOT NULL DEFAULT 0.00,
  `grand_total` decimal(10,2) NOT NULL,
  `status` enum('PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED','RETURNED') NOT NULL DEFAULT 'PENDING',
  `payment_method` enum('COD','ONLINE','WALLET') NOT NULL DEFAULT 'COD',
  `payment_status` enum('PENDING','PAID','FAILED','REFUNDED') NOT NULL DEFAULT 'PENDING',
  `special_instructions` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `address_id`, `subtotal`, `total_mrp`, `total_discount`, `delivery_fee`, `taxes`, `grand_total`, `status`, `payment_method`, `payment_status`, `special_instructions`, `created_at`, `updated_at`) VALUES
(2, 1, 1, 820.00, 860.00, 40.00, 0.00, 0.00, 820.00, 'PENDING', 'COD', 'PENDING', 'Please leave at the door', '2025-03-19 11:25:20', '2025-03-19 11:25:20'),
(3, 1, 1, 960.00, 1000.00, 40.00, 0.00, 0.00, 960.00, 'PENDING', 'COD', 'PENDING', 'Please leave at the door', '2025-03-19 11:29:07', '2025-03-19 11:29:07');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `unit_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `unit_mrp` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `total_mrp` decimal(10,2) NOT NULL,
  `discount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `unit_id`, `quantity`, `unit_price`, `unit_mrp`, `total_price`, `total_mrp`, `discount`, `created_at`) VALUES
(1, 2, 1, 3, 2, 170.00, 180.00, 340.00, 360.00, 20.00, '2025-03-19 11:25:20'),
(2, 2, 3, 1, 1, 480.00, 500.00, 480.00, 500.00, 20.00, '2025-03-19 11:25:20'),
(3, 3, 3, 1, 2, 480.00, 500.00, 960.00, 1000.00, 40.00, '2025-03-19 11:29:07');

-- --------------------------------------------------------

--
-- Table structure for table `order_status_history`
--

CREATE TABLE `order_status_history` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `status` enum('PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED','RETURNED') NOT NULL,
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_status_history`
--

INSERT INTO `order_status_history` (`id`, `order_id`, `status`, `comment`, `created_at`) VALUES
(1, 2, 'PENDING', 'Order placed', '2025-03-19 11:25:20'),
(2, 3, 'PENDING', 'Order placed', '2025-03-19 11:29:07');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `category_id`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2025-03-24 05:59:10', '2025-03-24 05:59:10'),
(2, 11, 1, '2025-03-24 05:59:10', '2025-03-24 06:03:15');

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `is_primary` tinyint(1) DEFAULT 0,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `image_url`, `is_primary`, `display_order`, `created_at`) VALUES
(1, 1, 'https://m.media-amazon.com/images/I/61-5tsBEWKL.jpg', 1, 1, '2025-03-24 05:59:10'),
(2, 2, 'http://giri.in/cdn/shop/files/42500245_Turmeric_Powder_50Gms_2_700x700.webp', 1, 1, '2025-03-24 05:59:10');

-- --------------------------------------------------------

--
-- Table structure for table `product_translations`
--

CREATE TABLE `product_translations` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `language_code` enum('en','ta') NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_translations`
--

INSERT INTO `product_translations` (`id`, `product_id`, `language_code`, `name`, `description`) VALUES
(1, 1, 'ta', 'தீபம் எண்ணெய்', 'உயர்தர தீபம் எண்ணெய்'),
(2, 1, 'en', 'Deepam Oil', 'High-quality Deepam oil'),
(3, 2, 'ta', 'மஞ்சள் தூள்', 'உயர்தர மஞ்சள் தூள்'),
(4, 2, 'en', 'Turmeric Powder', 'Premium Turmeric Powder');

-- --------------------------------------------------------

--
-- Table structure for table `product_units`
--

CREATE TABLE `product_units` (
  `product_id` int(11) NOT NULL,
  `unit_id` int(11) NOT NULL,
  `conversion_factor` decimal(10,4) NOT NULL DEFAULT 1.0000,
  `mrp` decimal(10,2) NOT NULL,
  `selling_price` decimal(10,2) NOT NULL,
  `in_stock` int(11) NOT NULL DEFAULT 0,
  `is_default` tinyint(1) DEFAULT 0
) ;

--
-- Dumping data for table `product_units`
--

INSERT INTO `product_units` (`product_id`, `unit_id`, `conversion_factor`, `mrp`, `selling_price`, `in_stock`, `is_default`) VALUES
(1, 3, 1.0000, 180.00, 170.00, 100, 1),
(1, 4, 500.0000, 90.00, 85.00, 5000, 0),
(2, 1, 1.0000, 200.00, 190.00, 100, 1),
(2, 2, 50.0000, 100.00, 95.00, 5000, 0);

-- --------------------------------------------------------

--
-- Table structure for table `token_blacklist`
--

CREATE TABLE `token_blacklist` (
  `id` int(11) NOT NULL,
  `token` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `token_blacklist`
--

INSERT INTO `token_blacklist` (`id`, `token`, `created_at`) VALUES
(0, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjAsImlhdCI6MTc0MjIwODIzOCwiZXhwIjoxNzQyMjExODM4fQ.h_vuRbCWlYTtucEQgxwZ0NT7Rk4r9GvYiFs_kfCiT6U', '2025-03-17 10:45:51'),
(0, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjAsImlhdCI6MTc0MjIwODQwOCwiZXhwIjoxNzQyMjEyMDA4fQ.gMtXEbPwIOtBIyawkP9ouLHIaAVs8HyYbn0YYB95mAc', '2025-03-17 10:47:00');

-- --------------------------------------------------------

--
-- Table structure for table `unit_master`
--

CREATE TABLE `unit_master` (
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `unit_master`
--

INSERT INTO `unit_master` (`id`) VALUES
(1),
(2),
(3),
(4),
(5),
(6),
(7),
(8),
(9),
(10),
(11),
(13),
(14),
(15),
(16),
(17),
(18),
(19),
(20),
(21),
(22),
(23),
(24),
(25),
(26),
(27),
(28),
(29),
(30),
(31);

-- --------------------------------------------------------

--
-- Table structure for table `unit_translations`
--

CREATE TABLE `unit_translations` (
  `id` int(11) NOT NULL,
  `unit_id` int(11) NOT NULL,
  `language_code` enum('en','ta') NOT NULL,
  `name` varchar(255) NOT NULL,
  `abbreviation` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `unit_translations`
--

INSERT INTO `unit_translations` (`id`, `unit_id`, `language_code`, `name`, `abbreviation`) VALUES
(11, 1, 'en', 'Kilogram', 'kg'),
(12, 2, 'en', 'Gram', 'g'),
(13, 3, 'en', 'Liter', 'L'),
(14, 4, 'en', 'Milliliter', 'ml'),
(15, 5, 'en', 'Piece', 'pcs'),
(16, 6, 'en', 'Packet', 'pkt'),
(17, 7, 'en', 'Dozen', 'dz'),
(18, 8, 'en', 'Carton', 'ctn'),
(19, 9, 'en', 'Bundle', 'bndl'),
(20, 10, 'en', 'Pound', 'lb'),
(21, 11, 'en', 'Ounce', 'oz'),
(23, 13, 'en', 'Teaspoon', 'tsp'),
(24, 14, 'en', 'Tablespoon', 'tbsp'),
(25, 15, 'en', 'Cup', 'cup'),
(26, 16, 'en', 'Bowl', 'bowl'),
(27, 17, 'en', 'Handful', 'hndfl'),
(28, 18, 'en', 'Tola', 'tola'),
(29, 19, 'en', 'Pav', 'pav'),
(30, 20, 'en', 'Ser', 'ser'),
(31, 21, 'en', 'Masha', 'masha'),
(32, 22, 'en', 'Kuzhi', 'kuzhi'),
(33, 23, 'en', 'Padi', 'padi'),
(34, 24, 'en', 'Uzhakku', 'uzh'),
(35, 1, 'ta', 'கிலோகிராம்', 'கி.கி'),
(36, 2, 'ta', 'கிராம்', 'கி'),
(37, 3, 'ta', 'லிட்டர்', 'லி'),
(38, 4, 'ta', 'மில்லிலிட்டர்', 'மி.லி'),
(39, 5, 'ta', 'துண்டு', 'துண்டு'),
(40, 6, 'ta', 'பொதி', 'பொ'),
(41, 7, 'ta', 'டஜன்', 'டஜன்'),
(42, 8, 'ta', 'பெட்டகம்', 'பெ'),
(43, 9, 'ta', 'கட்டு', 'கட்டு'),
(44, 10, 'ta', 'பவுண்டு', 'பவுண்ட்'),
(45, 11, 'ta', 'ஔன்ஸ்', 'ஔ'),
(47, 13, 'ta', 'தேக்கரண்டி', 'தே'),
(48, 14, 'ta', 'டேபிள் ஸ்பூன்', 'டே'),
(49, 15, 'ta', 'கோப்பை', 'கோ'),
(50, 16, 'ta', 'கிண்ணம்', 'கிண்ணம்'),
(51, 17, 'ta', 'கைப்பிடி', 'கைப்பிடி'),
(52, 18, 'ta', 'தோளா', 'தோ'),
(53, 19, 'ta', 'பாவ்', 'பா'),
(54, 20, 'ta', 'சேர்', 'சே'),
(55, 21, 'ta', 'மாஷா', 'மா'),
(56, 22, 'ta', 'குழி', 'குழி'),
(57, 23, 'ta', 'படி', 'படி'),
(58, 24, 'ta', 'உழக்கு', 'உழக்கு'),
(59, 29, 'en', 'Milligram', 'mg'),
(60, 29, 'ta', 'மில்லி கிராம்', 'மி.கி');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `created_at`) VALUES
(1, 'Dhinakaran', 'dhinakaran@gmail.com', '$2b$10$lgcF0Bt5NqsJayUPpnamueE96deuNdP.U3tOTvzlDd/HaeY2fzmEK', '2025-03-17 10:31:09'),
(2, 'Kumar', 'kumar', '$2b$10$/zgxQVWfJn/VQQsjp3riNOjGxVJ6JdvjhUczAThAC06vgVw9VLO/G', '2025-03-20 12:01:02'),
(3, 'Kumar', 'kumar@gmail.com', '$2b$10$uYFWlLK3dAoVFEyijsLuIe5iH09vqCsTNT9vSqmbMnc3HBEfbXl.q', '2025-03-20 12:01:14');

-- --------------------------------------------------------

--
-- Table structure for table `user_addresses`
--

CREATE TABLE `user_addresses` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `address_line1` varchar(255) NOT NULL,
  `address_line2` varchar(255) DEFAULT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) NOT NULL,
  `country` varchar(100) NOT NULL DEFAULT 'India',
  `postal_code` varchar(20) NOT NULL,
  `is_default` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_addresses`
--

INSERT INTO `user_addresses` (`id`, `user_id`, `address_line1`, `address_line2`, `city`, `state`, `country`, `postal_code`, `is_default`, `created_at`, `updated_at`) VALUES
(1, 1, '123 Main Street', NULL, 'Chennai', 'Tamil Nadu', 'India', '600001', 1, '2025-03-19 11:25:14', '2025-03-19 11:25:14');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `category_translations`
--
ALTER TABLE `category_translations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `category_id` (`category_id`,`language_code`);

--
-- Indexes for table `category_units`
--
ALTER TABLE `category_units`
  ADD PRIMARY KEY (`category_id`,`unit_id`),
  ADD KEY `unit_id` (`unit_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `address_id` (`address_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `unit_id` (`unit_id`);

--
-- Indexes for table `order_status_history`
--
ALTER TABLE `order_status_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `product_translations`
--
ALTER TABLE `product_translations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_product_language` (`product_id`,`language_code`);

--
-- Indexes for table `product_units`
--
ALTER TABLE `product_units`
  ADD PRIMARY KEY (`product_id`,`unit_id`),
  ADD KEY `unit_id` (`unit_id`);

--
-- Indexes for table `unit_master`
--
ALTER TABLE `unit_master`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `unit_translations`
--
ALTER TABLE `unit_translations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unit_id` (`unit_id`,`language_code`),
  ADD UNIQUE KEY `language_code` (`language_code`,`name`),
  ADD UNIQUE KEY `language_code_2` (`language_code`,`abbreviation`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_addresses`
--
ALTER TABLE `user_addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `category_translations`
--
ALTER TABLE `category_translations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_status_history`
--
ALTER TABLE `order_status_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `product_translations`
--
ALTER TABLE `product_translations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `unit_master`
--
ALTER TABLE `unit_master`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `unit_translations`
--
ALTER TABLE `unit_translations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user_addresses`
--
ALTER TABLE `user_addresses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `category_translations`
--
ALTER TABLE `category_translations`
  ADD CONSTRAINT `category_translations_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `category_units`
--
ALTER TABLE `category_units`
  ADD CONSTRAINT `category_units_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `category_units_ibfk_2` FOREIGN KEY (`unit_id`) REFERENCES `unit_master` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`address_id`) REFERENCES `user_addresses` (`id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `order_items_ibfk_3` FOREIGN KEY (`unit_id`) REFERENCES `unit_master` (`id`);

--
-- Constraints for table `order_status_history`
--
ALTER TABLE `order_status_history`
  ADD CONSTRAINT `order_status_history_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_translations`
--
ALTER TABLE `product_translations`
  ADD CONSTRAINT `product_translations_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_units`
--
ALTER TABLE `product_units`
  ADD CONSTRAINT `product_units_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `product_units_ibfk_2` FOREIGN KEY (`unit_id`) REFERENCES `unit_master` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `unit_translations`
--
ALTER TABLE `unit_translations`
  ADD CONSTRAINT `unit_translations_ibfk_1` FOREIGN KEY (`unit_id`) REFERENCES `unit_master` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_addresses`
--
ALTER TABLE `user_addresses`
  ADD CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
