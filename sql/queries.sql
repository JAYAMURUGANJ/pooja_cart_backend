CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE category_translations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    language_code ENUM('en', 'ta') NOT NULL, -- Can add more languages in the future
    name VARCHAR(255) NOT NULL,
    UNIQUE (category_id, language_code), -- Prevents duplicate translations per category
    UNIQUE (language_code, name), -- Ensures unique category names per language
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);
CREATE TABLE unit_master (
    id INT AUTO_INCREMENT PRIMARY KEY
);
CREATE TABLE unit_translations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    unit_id INT NOT NULL,
    language_code ENUM('en', 'ta') NOT NULL,
    name VARCHAR(255) NOT NULL,
    abbreviation VARCHAR(10) NOT NULL,
    UNIQUE (unit_id, language_code), -- Ensures each unit has only one translation per language
    UNIQUE (language_code, name), -- Prevents duplicate unit names in the same language
    UNIQUE (language_code, abbreviation), -- Ensures unique abbreviations in each language
    FOREIGN KEY (unit_id) REFERENCES unit_master(id) ON DELETE CASCADE
);
CREATE TABLE category_units (
    category_id INT NOT NULL,
    unit_id INT NOT NULL,
    PRIMARY KEY (category_id, unit_id), -- Ensures unique category-unit mapping
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (unit_id) REFERENCES unit_master(id) ON DELETE CASCADE
);
