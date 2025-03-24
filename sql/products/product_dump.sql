-- Insert Products
INSERT INTO products (category_id, is_active) VALUES 
(1, TRUE), 
(2, TRUE); 

-- Insert Product Translations (Tamil & English)
INSERT INTO product_translations (product_id, language_code, name, description) VALUES 
(1, 'ta', 'தீபம் எண்ணெய்', 'உயர்தர தீபம் எண்ணெய்'),
(1, 'en', 'Deepam Oil', 'High-quality Deepam oil'),
(2, 'ta', 'மஞ்சள் தூள்', 'உயர்தர மஞ்சள் தூள்'),
(2, 'en', 'Turmeric Powder', 'Premium Turmeric Powder');


-- Insert Product Units
INSERT INTO product_units (product_id, unit_id, conversion_factor, mrp, selling_price, is_default, in_stock) VALUES 
(1, 3, 1, 180, 170, TRUE, 100),  -- Sesame Oil - Liter
(1, 4, 500, 90, 85, FALSE, 5000), -- Sesame Oil - Milliliter
(2, 1, 1, 200, 190, TRUE, 100),  -- Groundnut Oil - Liter
(2, 2, 50, 100, 95, FALSE, 5000); -- Groundnut Oil - Milliliter


-- Insert Product Images
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES 
(1, 'https://m.media-amazon.com/images/I/61-5tsBEWKL.jpg', TRUE, 1),
(2, 'http://giri.in/cdn/shop/files/42500245_Turmeric_Powder_50Gms_2_700x700.webp', TRUE, 1);
