INSERT INTO categories (id) VALUES (1), (2), (3), (4), (5);

-- Insert Category Translations (English & Tamil)
INSERT INTO category_translations (category_id, language_code, name) VALUES 
(1, 'en', 'Rice'),
(1, 'ta', 'அரிசி'),
(2, 'en', 'Wheat'),
(2, 'ta', 'கோதுமை'),
(3, 'en', 'Sugar'),
(3, 'ta', 'சர்க்கரை'),
(4, 'en', 'Salt'),
(4, 'ta', 'உப்பு'),
(5, 'en', 'Milk'),
(5, 'ta', 'பால்');

-- Map Categories to Units
INSERT INTO category_units (category_id, unit_id) VALUES 
(1, 1), -- Rice → Kilogram
(1, 2), -- Rice → Gram
(2, 1), -- Wheat → Kilogram
(2, 2), -- Wheat → Gram
(3, 1), -- Sugar → Kilogram
(3, 2), -- Sugar → Gram
(4, 3), -- Salt → Liter
(4, 4), -- Salt → Milliliter
(5, 3), -- Milk → Liter
(5, 4); -- Milk → Milliliter
