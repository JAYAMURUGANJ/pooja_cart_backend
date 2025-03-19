-- Product table with multilingual support (Removed base_price)
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Product translations table
CREATE TABLE product_translations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    language_code ENUM('en', 'ta') NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    UNIQUE (product_id, language_code),
    UNIQUE (language_code, name),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Product units table (many-to-many relationship between products and units)
CREATE TABLE product_units (
    product_id INT NOT NULL,
    unit_id INT NOT NULL,
    conversion_factor DECIMAL(10, 4) NOT NULL DEFAULT 1.0000,
    mrp DECIMAL(10, 2) NOT NULL,
    selling_price DECIMAL(10, 2) NOT NULL,
    in_stock INT NOT NULL DEFAULT 0,
    is_default BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (product_id, unit_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (unit_id) REFERENCES unit_master(id) ON DELETE CASCADE,
    CHECK (conversion_factor > 0), -- Ensure positive conversion factor
    CHECK (mrp >= 0), -- Ensure MRP is not negative
    CHECK (selling_price >= 0 AND selling_price <= mrp), -- Selling price must be valid
    CHECK (in_stock >= 0) -- Stock cannot be negative
);

-- Product images table
CREATE TABLE product_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
