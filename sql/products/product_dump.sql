-- Insert Products
INSERT INTO products (category_id, is_active) VALUES 
(1, TRUE),  -- Oil
(1, TRUE),
(2, TRUE),  -- Ghee
(2, TRUE),
(3, TRUE),  -- Camphor
(3, TRUE),
(4, TRUE),  -- Incense Sticks
(5, TRUE),  -- Grains
(5, TRUE);

-- Insert Product Translations (Tamil & English)
INSERT INTO product_translations (product_id, language_code, name, description) VALUES 
(1, 'ta', 'நல்லெண்ணெய்', 'உயர்தர நல்லெண்ணெய்'),
(1, 'en', 'Sesame Oil', 'High-quality sesame oil'),
(2, 'ta', 'கடலை எண்ணெய்', 'உயர்தர கடலை எண்ணெய்'),
(2, 'en', 'Groundnut Oil', 'Premium groundnut oil'),
(3, 'ta', 'நாட்டு நெய்', 'மரசெங்கிழி நாட்டு நெய்'),
(3, 'en', 'Traditional Ghee', 'Pure village-made ghee'),
(4, 'ta', 'கிராம நெய்', 'சுத்தமான கிராம நெய்'),
(4, 'en', 'Cow Ghee', 'Pure cow ghee for cooking'),
(5, 'ta', 'பச்சை கற்பூரம்', 'வாசனை நிறைந்த பச்சை கற்பூரம்'),
(5, 'en', 'Edible Camphor', 'Aromatic edible camphor'),
(6, 'ta', 'பூஜை கற்பூரம்', 'பூஜைக்கு ஏற்ற கற்பூரம்'),
(6, 'en', 'Pooja Camphor', 'Special camphor for religious use'),
(7, 'ta', 'தூபக் குச்சி', 'பூஜைக்கு பயன்படும் தூபக் குச்சி'),
(7, 'en', 'Incense Sticks', 'Fragrant sticks for worship'),
(8, 'ta', 'அரிசி', 'பச்சரிசி மற்றும் புதுநிலம் அரிசி'),
(8, 'en', 'Rice', 'Premium rice varieties'),
(9, 'ta', 'தானியங்கள்', 'பருப்பு, பயறு, முட்டை பருப்பு'),
(9, 'en', 'Grains', 'Pulses, lentils, and cereals');

-- Insert Product Units
INSERT INTO product_units (product_id, unit_id, conversion_factor, mrp, selling_price, is_default, in_stock) VALUES 
(1, 3, 1, 180, 170, TRUE, 100),  -- Sesame Oil - Liter
(1, 4, 1000, 180, 170, FALSE, 5000), -- Sesame Oil - Milliliter
(2, 3, 1, 200, 190, TRUE, 100),  -- Groundnut Oil - Liter
(2, 4, 1000, 200, 190, FALSE, 5000), -- Groundnut Oil - Milliliter
(3, 1, 1, 500, 480, TRUE, 50),  -- Traditional Ghee - Kilogram
(3, 2, 1000, 500, 480, FALSE, 2000), -- Traditional Ghee - Gram
(4, 1, 1, 550, 530, TRUE, 50),  -- Cow Ghee - Kilogram
(4, 2, 1000, 550, 530, FALSE, 2000), -- Cow Ghee - Gram
(5, 2, 1, 300, 290, TRUE, 100),  -- Edible Camphor - Gram
(5, 5, 1, 10, 9, FALSE, 1000),  -- Edible Camphor - Piece
(6, 2, 1, 350, 340, TRUE, 100),  -- Pooja Camphor - Gram
(6, 5, 1, 12, 11, FALSE, 1000),  -- Pooja Camphor - Piece
(7, 5, 1, 50, 45, TRUE, 1000),  -- Incense Sticks - Piece
(8, 1, 1, 60, 55, TRUE, 500),  -- Rice - Kilogram
(8, 2, 1000, 60, 55, FALSE, 5000), -- Rice - Gram
(9, 1, 1, 80, 75, TRUE, 500),  -- Grains - Kilogram
(9, 2, 1000, 80, 75, FALSE, 5000); -- Grains - Gram


-- Insert Product Images
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES 
(1, 'https://example.com/sesame_oil.jpg', TRUE, 1),
(2, 'https://example.com/groundnut_oil.jpg', TRUE, 1),
(3, 'https://example.com/traditional_ghee.jpg', TRUE, 1),
(4, 'https://example.com/cow_ghee.jpg', TRUE, 1),
(5, 'https://example.com/edible_camphor.jpg', TRUE, 1),
(6, 'https://example.com/pooja_camphor.jpg', TRUE, 1),
(7, 'https://example.com/incense_sticks.jpg', TRUE, 1),
(8, 'https://example.com/rice.jpg', TRUE, 1),
(9, 'https://example.com/grains.jpg', TRUE, 1);
