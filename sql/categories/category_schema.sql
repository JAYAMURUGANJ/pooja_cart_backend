
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