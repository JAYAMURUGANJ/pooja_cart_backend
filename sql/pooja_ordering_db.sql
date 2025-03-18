-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 13, 2025 at 06:19 PM
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
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'Deepam Oil');

-- --------------------------------------------------------

--
-- Table structure for table `functions`
--

CREATE TABLE `functions` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `functions`
--

INSERT INTO `functions` (`id`, `name`) VALUES
(2, 'House Warming'),
(1, 'Pooja Items');

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `unit` varchar(50) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`id`, `name`, `category_id`, `unit`, `price`) VALUES
(1, 'Gopuram Kungumam', 1, '100g', 40.00);

-- --------------------------------------------------------

--
-- Table structure for table `item_functions`
--

CREATE TABLE `item_functions` (
  `item_id` int(11) NOT NULL,
  `function_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `item_functions`
--

INSERT INTO `item_functions` (`item_id`, `function_id`) VALUES
(1, 1),
(1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `address` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `order_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `token_blacklist`
--

CREATE TABLE `token_blacklist` (
  `id` int(11) NOT NULL,
  `token` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(1, 'jai', 'jai@gmail.com', '$2b$10$Arnoj3f.L16.R6OivTDzNOWbWEGYnBPK6WYYg24ClllXaB.yLcr7O', '2025-03-09 14:14:38');

--


--
-- Table structure for table `unit_master`
--

CREATE TABLE unit_master (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,  -- Full name of the unit (English)
    ta_name VARCHAR(50) NOT NULL UNIQUE,  -- Tamil name of the unit
    abbreviation VARCHAR(10) NOT NULL UNIQUE,  -- English short form (kg, ml, etc.)
    ta_abbreviation VARCHAR(10) NOT NULL UNIQUE,  -- Tamil short form
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

--
-- Dumping data for table `users`
--

INSERT INTO unit_master (name, ta_name, abbreviation, ta_abbreviation) VALUES
('Kilogram', 'கிலோ கிராம்', 'kg', 'கி.கி'),
('Gram', 'கிராம்', 'g', 'கி'),
('Liter', 'லிட்டர்', 'L', 'லி'),
('Milliliter', 'மில்லி லிட்டர்', 'ml', 'மி.லி'),
('Packet', 'பொதி', 'pkt', 'பொ.'),
('Dozen', 'டஜன்', 'dz', 'டஜ.'),
('Piece', 'துண்டு', 'pc', 'து.'),
('Box', 'பெட்டி', 'bx', 'பெ.'),
('Bundle', 'கட்டு', 'bndl', 'க.');

--

-- Table structure for table `categories`

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    ta_name VARCHAR(255) NOT NULL UNIQUE,
    icon VARCHAR(255) NULL,
    active_status TINYINT(1) NOT NULL DEFAULT 1, -- 1 for active, 0 for inactive
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Dumping data for table `categories`
INSERT INTO categories (name, ta_name, icon, active_status) VALUES 
('Coconut Oil', 'தேங்காய் எண்ணெய்', NULL, 1),
('Rice', 'அரிசி', NULL, 1),
('Sugar', 'சர்க்கரை', NULL, 1),
('Salt', 'உப்பு', NULL, 1),
('Milk', 'பால்', NULL, 1),
('Vegetables', 'காய்கறிகள்', NULL, 1),
('Fruits', 'பழங்கள்', NULL, 1),
('Spices', 'மசாலா', NULL, 1),
('Lentils', 'பருப்பு', NULL, 1),
('Beverages', 'பானங்கள்', NULL, 1);
--------->


-- Create 'Category_Units' Mapping Table

CREATE TABLE category_units (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    unit_id INT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE,
    UNIQUE(category_id, unit_id) -- Ensures a unit is not assigned multiple times to the same category
);

-- Dumping data for table `Category_Units`

INSERT INTO category_units (category_id, unit_id) VALUES 
(1, 5), -- Coconut Oil -> Liter
(1, 6), -- Coconut Oil -> Milliliter
(2, 1), -- Rice -> Kilogram
(2, 3), -- Rice -> Quintal
(3, 2), -- Sugar -> Gram
(3, 1), -- Sugar -> Kilogram
(4, 2), -- Salt -> Gram
(4, 1), -- Salt -> Kilogram
(5, 5), -- Milk -> Liter
(6, 1), -- Vegetables -> Kilogram
(7, 1), -- Fruits -> Kilogram
(8, 2), -- Spices -> Gram
(9, 2), -- Lentils -> Gram
(9, 1), -- Lentils -> Kilogram
(10, 6); -- Beverages -> Milliliter







-- ========================================================> 



-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `functions`
--
ALTER TABLE `functions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `item_functions`
--
ALTER TABLE `item_functions`
  ADD PRIMARY KEY (`item_id`,`function_id`),
  ADD KEY `function_id` (`function_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`order_id`,`item_id`),
  ADD KEY `item_id` (`item_id`);

--
-- Indexes for table `token_blacklist`
--
ALTER TABLE `token_blacklist`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `functions`
--
ALTER TABLE `functions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `token_blacklist`
--
ALTER TABLE `token_blacklist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `items`
--
ALTER TABLE `items`
  ADD CONSTRAINT `items_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `item_functions`
--
ALTER TABLE `item_functions`
  ADD CONSTRAINT `item_functions_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `item_functions_ibfk_2` FOREIGN KEY (`function_id`) REFERENCES `functions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
