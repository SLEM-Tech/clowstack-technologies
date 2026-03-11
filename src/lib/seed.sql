-- ============================================================
-- Clowstack Seed Data — Digital Goods (Gadgets, Phones, Accessories)
-- Run via: GET /api/db/seed?secret=seed-db-2024
-- ============================================================

-- ── Categories ───────────────────────────────────────────────

-- Parent categories
INSERT INTO clowstack_categories (name, slug, description, parent_id, image_url, count) VALUES
  ('Smartphones & Tablets',   'smartphones-tablets',   'Latest smartphones and tablets from top brands',              NULL, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', 0),
  ('Laptops & Computers',     'laptops-computers',     'Powerful laptops, desktops and computer accessories',         NULL, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', 0),
  ('Audio & Headphones',      'audio-headphones',      'Premium earbuds, headphones and portable speakers',           NULL, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 0),
  ('Phone Accessories',       'phone-accessories',     'Cases, chargers, power banks and more',                       NULL, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400', 0),
  ('Smartwatches & Wearables','smartwatches-wearables','Smart watches, fitness trackers and wearable tech',           NULL, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', 0),
  ('Cameras & Photography',   'cameras-photography',   'Digital cameras, action cameras and photography gear',        NULL, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400', 0),
  ('Gaming',                  'gaming',                'Consoles, games and gaming peripherals',                      NULL, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400', 0),
  ('Computer Accessories',    'computer-accessories',  'Keyboards, mice, monitors and peripherals',                   NULL, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', 0)
ON CONFLICT (slug) DO NOTHING;

-- Sub-categories (parent_id resolved by slug lookup)
INSERT INTO clowstack_categories (name, slug, description, parent_id, image_url, count)
SELECT 'Android Phones', 'android-phones', 'Samsung, Tecno, Infinix and more', id, 'https://images.unsplash.com/photo-1570101945621-945409a6370f?w=400', 0
FROM clowstack_categories WHERE slug = 'smartphones-tablets'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO clowstack_categories (name, slug, description, parent_id, image_url, count)
SELECT 'iPhones & iPads', 'iphones-ipads', 'Apple iPhone and iPad lineup', id, 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400', 0
FROM clowstack_categories WHERE slug = 'smartphones-tablets'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO clowstack_categories (name, slug, description, parent_id, image_url, count)
SELECT 'Laptops', 'laptops', 'MacBook, Dell, HP, Lenovo and more', id, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400', 0
FROM clowstack_categories WHERE slug = 'laptops-computers'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO clowstack_categories (name, slug, description, parent_id, image_url, count)
SELECT 'Earbuds & Earphones', 'earbuds', 'True wireless and wired earbuds', id, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400', 0
FROM clowstack_categories WHERE slug = 'audio-headphones'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO clowstack_categories (name, slug, description, parent_id, image_url, count)
SELECT 'Over-Ear Headphones', 'headphones', 'Premium over-ear and on-ear headphones', id, 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400', 0
FROM clowstack_categories WHERE slug = 'audio-headphones'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO clowstack_categories (name, slug, description, parent_id, image_url, count)
SELECT 'Portable Speakers', 'portable-speakers', 'Bluetooth and wireless portable speakers', id, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', 0
FROM clowstack_categories WHERE slug = 'audio-headphones'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO clowstack_categories (name, slug, description, parent_id, image_url, count)
SELECT 'Cases & Covers', 'cases-covers', 'Protective cases for phones and tablets', id, 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400', 0
FROM clowstack_categories WHERE slug = 'phone-accessories'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO clowstack_categories (name, slug, description, parent_id, image_url, count)
SELECT 'Chargers & Cables', 'chargers-cables', 'Fast chargers, USB cables and adapters', id, 'https://images.unsplash.com/photo-1623126908029-58cb08a2b272?w=400', 0
FROM clowstack_categories WHERE slug = 'phone-accessories'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO clowstack_categories (name, slug, description, parent_id, image_url, count)
SELECT 'Power Banks', 'power-banks', 'Portable power banks and charging stations', id, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400', 0
FROM clowstack_categories WHERE slug = 'phone-accessories'
ON CONFLICT (slug) DO NOTHING;

-- ── Products ─────────────────────────────────────────────────

-- 1. Samsung Galaxy S24 Ultra
INSERT INTO clowstack_products (name, slug, sku, description, short_description, price, regular_price, sale_price, stock_status, stock_quantity, rating_count, average_rating, status)
VALUES (
  'Samsung Galaxy S24 Ultra',
  'samsung-galaxy-s24-ultra',
  'SAM-S24U-256',
  'The Samsung Galaxy S24 Ultra redefines what a smartphone can be. Featuring a 6.8" Dynamic AMOLED 2X display with 120Hz refresh rate, Snapdragon 8 Gen 3 processor, a 200MP quad-camera system, and the built-in S Pen. With 5000mAh battery and 45W fast charging, it lasts all day.',
  'Flagship Android phone with 200MP camera and built-in S Pen',
  1250000, 1350000, 1250000, 'instock', 15, 28, 4.80, 'publish'
) ON CONFLICT (slug) DO NOTHING;

-- 2. iPhone 15 Pro Max
INSERT INTO clowstack_products (name, slug, sku, description, short_description, price, regular_price, sale_price, stock_status, stock_quantity, rating_count, average_rating, status)
VALUES (
  'Apple iPhone 15 Pro Max',
  'apple-iphone-15-pro-max',
  'APL-IP15PM-256',
  'The iPhone 15 Pro Max features Apple''s most advanced A17 Pro chip, a 48MP main camera with 5x telephoto zoom, titanium design, and the new Action Button. The 6.7" Super Retina XDR display with ProMotion technology delivers an immersive viewing experience.',
  'Apple''s most powerful iPhone with titanium build and 5x zoom',
  1550000, 1650000, 1550000, 'instock', 10, 35, 4.90, 'publish'
) ON CONFLICT (slug) DO NOTHING;

-- 3. Samsung Galaxy A55 5G
INSERT INTO clowstack_products (name, slug, sku, description, short_description, price, regular_price, sale_price, stock_status, stock_quantity, rating_count, average_rating, status)
VALUES (
  'Samsung Galaxy A55 5G',
  'samsung-galaxy-a55-5g',
  'SAM-A55-128',
  'The Galaxy A55 5G delivers a premium experience at a mid-range price. Featuring a 6.6" Super AMOLED display, 50MP OIS camera, 5000mAh battery, and IP67 water resistance. Powered by Exynos 1480 for smooth everyday performance.',
  'Premium mid-range 5G phone with 50MP OIS camera and IP67 rating',
  380000, 420000, 380000, 'instock', 30, 18, 4.50, 'publish'
) ON CONFLICT (slug) DO NOTHING;

-- 4. Tecno Phantom X2 Pro
INSERT INTO clowstack_products (name, slug, sku, description, short_description, price, regular_price, sale_price, stock_status, stock_quantity, rating_count, average_rating, status)
VALUES (
  'Tecno Phantom X2 Pro',
  'tecno-phantom-x2-pro',
  'TEC-PX2P-256',
  'Tecno''s flagship, the Phantom X2 Pro, features a retractable portrait lens — a world''s first. With a 6.8" curved AMOLED display, Dimensity 9000 processor, 60MP retractable portrait camera, and 5160mAh battery with 45W charging.',
  'World''s first retractable portrait lens flagship from Tecno',
  285000, 320000, 285000, 'instock', 20, 12, 4.40, 'publish'
) ON CONFLICT (slug) DO NOTHING;

-- 5. Apple iPad Pro 12.9" M2
INSERT INTO clowstack_products (name, slug, sku, description, short_description, price, regular_price, sale_price, stock_status, stock_quantity, rating_count, average_rating, status)
VALUES (
  'Apple iPad Pro 12.9" M2',
  'apple-ipad-pro-12-m2',
  'APL-IPP12-256',
  'The iPad Pro with M2 chip is the ultimate iPad experience. Featuring a 12.9" Liquid Retina XDR display with ProMotion, M2 chip for desktop-class performance, Thunderbolt connectivity, and up to 16GB RAM. Compatible with Apple Pencil 2nd gen and Magic Keyboard.',
  'Ultimate iPad with M2 chip and Liquid Retina XDR display',
  920000, 980000, 920000, 'instock', 8, 22, 4.85, 'publish'
) ON CONFLICT (slug) DO NOTHING;

-- 6. MacBook Pro 14" M3 Pro
INSERT INTO clowstack_products (name, slug, sku, description, short_description, price, regular_price, sale_price, stock_status, stock_quantity, rating_count, average_rating, status)
VALUES (
  'Apple MacBook Pro 14" M3 Pro',
  'apple-macbook-pro-14-m3-pro',
  'APL-MBP14-M3',
  'The MacBook Pro 14" with M3 Pro chip delivers extraordinary performance for pro workflows. Features a stunning Liquid Retina XDR display, up to 18 hours battery life, 18GB unified memory, ProRes video support, and an advanced thermal system for sustained performance.',
  'Professional laptop with M3 Pro chip and up to 18hr battery',
  1850000, 1950000, 1850000, 'instock', 6, 19, 4.90, 'publish'
) ON CONFLICT (slug) DO NOTHING;

-- 7. Dell XPS 15 (2024)
INSERT INTO clowstack_products (name, slug, sku, description, short_description, price, regular_price, sale_price, stock_status, stock_quantity, rating_count, average_rating, status)
VALUES (
  'Dell XPS 15 (Intel Core i7, 2024)',
  'dell-xps-15-2024',
  'DEL-XPS15-i7',
  'The Dell XPS 15 packs serious performance into a premium slim chassis. Intel Core i7-13700H processor, NVIDIA GeForce RTX 4060 GPU, 15.6" OLED 3.5K display, 32GB DDR5 RAM, and 1TB NVMe SSD. Perfect for creators and professionals.',
  'Premium thin-and-light laptop with RTX 4060 and OLED display',
  1280000, 1380000, 1280000, 'instock', 10, 14, 4.60, 'publish'
) ON CONFLICT (slug) DO NOTHING;

-- 8. HP Pavilion 15 Laptop
INSERT INTO clowstack_products (name, slug, sku, description, short_description, price, regular_price, sale_price, stock_status, stock_quantity, rating_count, average_rating, status)
VALUES (
  'HP Pavilion 15 Laptop (Ryzen 5)',
  'hp-pavilion-15-ryzen5',
  'HP-PAV15-R5',
  'The HP Pavilion 15 is your everyday performance laptop. AMD Ryzen 5 7530U processor, AMD Radeon Graphics, 15.6" FHD IPS micro-edge display, 8GB DDR4 RAM, 512GB SSD, and up to 8.5 hours battery life. Great for students and everyday use.',
  'Reliable everyday laptop with AMD Ryzen 5 and FHD display',
  580000, 620000, 580000, 'instock', 25, 16, 4.30, 'publish'
) ON CONFLICT (slug) DO NOTHING;

-- 9. Apple AirPods Pro 2nd Generation
INSERT INTO clowstack_products (name, slug, sku, description, short_description, price, regular_price, sale_price, stock_status, stock_quantity, rating_count, average_rating, status)
VALUES (
  'Apple AirPods Pro (2nd Gen)',
  'apple-airpods-pro-2nd-gen',
  'APL-APP2-WHT',
  'AirPods Pro (2nd Gen) deliver up to 2x more Active Noise Cancellation than the previous generation. Transparency mode, Adaptive Audio, Conversation Awareness, and Personalized Spatial Audio make this the ultimate wireless earbuds. 6 hours listening + 30 hours total with case.',
  'Best-in-class ANC earbuds with Adaptive Audio and Spatial Audio',
  215000, 240000, 215000, 'instock', 40, 45, 4.80, 'publish'
) ON CONFLICT (slug) DO NOTHING;

-- 10. Samsung Galaxy Buds2 Pro
INSERT INTO clowstack_products (name, slug, sku, description, short_description, price, regular_price, sale_price, stock_status, stock_quantity, rating_count, average_rating, status)
VALUES (
  'Samsung Galaxy Buds2 Pro',
  'samsung-galaxy-buds2-pro',
  'SAM-GB2P-BLK',
  'Galaxy Buds2 Pro deliver Hi-Fi audio with 24-bit audio quality. Intelligent Active Noise Cancellation adapts to your environment, while 3D Audio with head tracking provides immersive sound. IPX7 water resistance and up to 5 hours playtime (29 hours with case).',
  'Hi-Fi 24-bit audio earbuds with intelligent ANC and IPX7 rating',
  125000, 145000, 125000, 'instock', 35, 20, 4.50, 'publish'
) ON CONFLICT (slug) DO NOTHING;

-- 11. Sony WH-1000XM5 Headphones
INSERT INTO clowstack_products (name, slug, sku, description, short_description, price, regular_price, sale_price, stock_status, stock_quantity, rating_count, average_rating, status)
VALUES (
  'Sony WH-1000XM5 Wireless Headphones',
  'sony-wh-1000xm5',
  'SNY-WH1000XM5-BLK',
  'Sony''s flagship noise-cancelling headphones. Industry-leading ANC with 8 microphones and two processors, 30-hour battery, multipoint connection for two devices, and crystal-clear hands-free calling. The lightweight, all-plastic design is foldable and travel-friendly.',
  'Industry-leading ANC headphones with 30hr battery and multipoint',
  285000, 310000, 285000, 'instock', 22, 38, 4.75, 'publish'
) ON CONFLICT (slug) DO NOTHING;

-- 12. JBL Charge 5 Bluetooth Speaker
INSERT INTO clowstack_products (name, slug, sku, description, short_description, price, regular_price, sale_price, stock_status, stock_quantity, rating_count, average_rating, status)
VALUES (
  'JBL Charge 5 Portable Speaker',
  'jbl-charge-5',
  'JBL-CHG5-BLK',
  'The JBL Charge 5 delivers powerful JBL Pro Sound from a rugged, IP67 waterproof and dustproof design. 20 hours of playtime, built-in power bank to charge your devices, PartyBoost to link multiple speakers, and a bold new woofer for deeper bass.',
  'IP67 waterproof speaker with 20hr playtime and built-in power bank',
  88000, 98000, 88000, 'instock', 28, 30, 4.65, 'publish'
) ON CONFLICT (slug) DO NOTHING;

-- 13. Apple Watch Series 9 (GPS)
INSERT INTO clowstack_products (name, slug, sku, description, short_description, price, regular_price, sale_price, stock_status, stock_quantity, rating_count, average_rating, status)
VALUES (
  'Apple Watch Series 9 GPS 45mm',
  'apple-watch-series-9-gps-45mm',
  'APL-AWS9-45-MID',
  'Apple Watch Series 9 features the new S9 chip with double tap gesture, a brighter Always-On Retina display, advanced health sensors (ECG, Blood Oxygen, Temperature), crash detection, and 18 hours battery life. Carbon neutral with sport band.',
  'Latest Apple Watch with S9 chip, double tap and health monitoring',
  420000, 460000, 420000, 'instock', 18, 25, 4.80, 'publish'
) ON CONFLICT (slug) DO NOTHING;

-- 14. Samsung Galaxy Watch 6 Classic
INSERT INTO clowstack_products (name, slug, sku, description, short_description, price, regular_price, sale_price, stock_status, stock_quantity, rating_count, average_rating, status)
VALUES (
  'Samsung Galaxy Watch 6 Classic 47mm',
  'samsung-galaxy-watch-6-classic-47mm',
  'SAM-GW6C-47-BLK',
  'The Galaxy Watch 6 Classic brings back the iconic rotating bezel. Features advanced health tracking (BioActive sensor, sleep coaching, body composition), Wear OS 4 with One UI Watch 5, 40-hour battery, and sapphire crystal glass for durability.',
  'Premium smartwatch with rotating bezel and advanced health tracking',
  255000, 285000, 255000, 'instock', 15, 17, 4.55, 'publish'
) ON CONFLICT (slug) DO NOTHING;

-- 15. Anker 67W GaN USB-C Charger
INSERT INTO clowstack_products (name, slug, sku, description, short_description, price, regular_price, sale_price, stock_status, stock_quantity, rating_count, average_rating, status)
VALUES (
  'Anker 67W GaN USB-C Wall Charger',
  'anker-67w-gan-usb-c-charger',
  'ANK-67W-GAN-BLK',
  'Anker''s 67W GaN charger replaces three chargers in one. Three ports (2x USB-C, 1x USB-A) with intelligent power distribution. Charges a MacBook Pro at 67W, iPhone at 27W, and a third device simultaneously. GaN technology keeps it cool and compact.',
  'Replace 3 chargers with one — 67W GaN with 3 ports',
  28000, 32000, 28000, 'instock', 60, 42, 4.70, 'publish'
) ON CONFLICT (slug) DO NOTHING;

-- 16. Baseus 20000mAh Power Bank (65W)
INSERT INTO clowstack_products (name, slug, sku, description, short_description, price, regular_price, sale_price, stock_status, stock_quantity, rating_count, average_rating, status)
VALUES (
  'Baseus 20000mAh 65W Power Bank',
  'baseus-20000mah-65w-power-bank',
  'BAS-20K-65W-WHT',
  'Baseus 20000mAh power bank with 65W max output can charge a MacBook from 0–30% in 30 minutes. Features 2x USB-C + 1x USB-A ports, dual input (USB-C + Micro), LED digital display, and a slim form factor. Airline-safe capacity.',
  '20000mAh laptop-grade power bank with 65W fast charging',
  48000, 55000, 48000, 'instock', 45, 33, 4.60, 'publish'
) ON CONFLICT (slug) DO NOTHING;

-- 17. Spigen Tough Armor iPhone 15 Pro Case
INSERT INTO clowstack_products (name, slug, sku, description, short_description, price, regular_price, sale_price, stock_status, stock_quantity, rating_count, average_rating, status)
VALUES (
  'Spigen Tough Armor iPhone 15 Pro Case',
  'spigen-tough-armor-iphone-15-pro',
  'SPG-TA-IP15P-GRY',
  'Military-grade protection (MIL-STD-810G) meets slim design. The Spigen Tough Armor features dual-layer protection with a polycarbonate back and flexible TPU bumper. Kickstand for hands-free viewing, precise cutouts for all ports, and raised lips for screen/camera protection.',
  'Military-grade dual-layer protection with built-in kickstand',
  16000, 19000, 16000, 'instock', 80, 55, 4.50, 'publish'
) ON CONFLICT (slug) DO NOTHING;

-- 18. Logitech MX Master 3S Mouse
INSERT INTO clowstack_products (name, slug, sku, description, short_description, price, regular_price, sale_price, stock_status, stock_quantity, rating_count, average_rating, status)
VALUES (
  'Logitech MX Master 3S Wireless Mouse',
  'logitech-mx-master-3s',
  'LOG-MXM3S-GRY',
  'The MX Master 3S is Logitech''s most advanced mouse. 8000 DPI MagSpeed electromagnetic scroll wheel, whisper-quiet clicks, USB-C charging, Logi Bolt + Bluetooth connectivity, and multi-device/OS support. Ergonomic shape designed for all-day comfort.',
  'Advanced ergonomic mouse with ultra-fast MagSpeed scrolling',
  98000, 110000, 98000, 'instock', 20, 28, 4.70, 'publish'
) ON CONFLICT (slug) DO NOTHING;

-- 19. Sony ZV-E10 Mirrorless Camera
INSERT INTO clowstack_products (name, slug, sku, description, short_description, price, regular_price, sale_price, stock_status, stock_quantity, rating_count, average_rating, status)
VALUES (
  'Sony ZV-E10 Mirrorless Camera (Body)',
  'sony-zv-e10-mirrorless-body',
  'SNY-ZVE10-BLK',
  'The Sony ZV-E10 is designed for vloggers and content creators. APS-C 24.2MP sensor, interchangeable lens system, real-time Eye AF, 4K video, side-flip touchscreen LCD, and a directional 3-capsule microphone. Compact, lightweight and beginner-friendly.',
  'Vlogger-focused mirrorless camera with 4K video and flip screen',
  395000, 430000, 395000, 'instock', 12, 22, 4.55, 'publish'
) ON CONFLICT (slug) DO NOTHING;

-- 20. GoPro Hero 12 Black
INSERT INTO clowstack_products (name, slug, sku, description, short_description, price, regular_price, sale_price, stock_status, stock_quantity, rating_count, average_rating, status)
VALUES (
  'GoPro HERO12 Black Action Camera',
  'gopro-hero12-black',
  'GPR-H12B-BLK',
  'GoPro HERO12 Black shoots 5.3K60 video and 27MP photos. Features HyperSmooth 6.0 stabilization, 10-bit color, HDR video, Emmy-winning Enduro battery for extreme conditions, waterproof to 10m, and 1/1.9" image sensor. Compatible with all GoPro accessories.',
  'Best GoPro ever — 5.3K60, HyperSmooth 6.0, 10-bit color',
  325000, 360000, 325000, 'instock', 14, 26, 4.65, 'publish'
) ON CONFLICT (slug) DO NOTHING;

-- 21. PlayStation 5 Console (Disc Edition)
INSERT INTO clowstack_products (name, slug, sku, description, short_description, price, regular_price, sale_price, stock_status, stock_quantity, rating_count, average_rating, status)
VALUES (
  'Sony PlayStation 5 Console (Disc Edition)',
  'sony-playstation-5-disc',
  'SNY-PS5-DSC-WHT',
  'Experience lightning-fast loading with the PS5''s ultra-high-speed SSD, breathtaking immersion with the DualSense controller''s haptic feedback and adaptive triggers, 4K gaming at up to 120fps, ray tracing, and 3D Audio. Includes one DualSense wireless controller.',
  'Next-gen gaming console with 4K gaming, ray tracing and 3D Audio',
  750000, 820000, 750000, 'instock', 8, 40, 4.85, 'publish'
) ON CONFLICT (slug) DO NOTHING;

-- 22. Infinix Hot 40 Pro
INSERT INTO clowstack_products (name, slug, sku, description, short_description, price, regular_price, sale_price, stock_status, stock_quantity, rating_count, average_rating, status)
VALUES (
  'Infinix Hot 40 Pro',
  'infinix-hot-40-pro',
  'INF-H40P-256',
  'The Infinix Hot 40 Pro offers incredible value with a 6.78" AMOLED display, 108MP AI triple camera, Helio G99 processor, 5000mAh battery with 45W fast charging, and 256GB storage. Dual SIM 4G and Android 13 with XOS 13.',
  'Budget flagship with 108MP camera and AMOLED display',
  148000, 168000, 148000, 'instock', 50, 14, 4.30, 'publish'
) ON CONFLICT (slug) DO NOTHING;

-- ── Product Images ────────────────────────────────────────────

INSERT INTO clowstack_product_images (product_id, src, name, alt, position)
SELECT p.id, 'https://images.unsplash.com/photo-1709393217025-d5f34ff63b4f?w=600', 'Galaxy S24 Ultra Front', 'Samsung Galaxy S24 Ultra', 0
FROM clowstack_products p WHERE p.slug = 'samsung-galaxy-s24-ultra' ON CONFLICT DO NOTHING;

INSERT INTO clowstack_product_images (product_id, src, name, alt, position)
SELECT p.id, 'https://images.unsplash.com/photo-1695048133142-1a20484429be?w=600', 'iPhone 15 Pro Max', 'Apple iPhone 15 Pro Max', 0
FROM clowstack_products p WHERE p.slug = 'apple-iphone-15-pro-max' ON CONFLICT DO NOTHING;

INSERT INTO clowstack_product_images (product_id, src, name, alt, position)
SELECT p.id, 'https://images.unsplash.com/photo-1610945264803-c22b62831e5c?w=600', 'Galaxy A55', 'Samsung Galaxy A55 5G', 0
FROM clowstack_products p WHERE p.slug = 'samsung-galaxy-a55-5g' ON CONFLICT DO NOTHING;

INSERT INTO clowstack_product_images (product_id, src, name, alt, position)
SELECT p.id, 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600', 'Tecno Phantom X2 Pro', 'Tecno Phantom X2 Pro', 0
FROM clowstack_products p WHERE p.slug = 'tecno-phantom-x2-pro' ON CONFLICT DO NOTHING;

INSERT INTO clowstack_product_images (product_id, src, name, alt, position)
SELECT p.id, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600', 'iPad Pro 12.9', 'Apple iPad Pro 12.9 M2', 0
FROM clowstack_products p WHERE p.slug = 'apple-ipad-pro-12-m2' ON CONFLICT DO NOTHING;

INSERT INTO clowstack_product_images (product_id, src, name, alt, position)
SELECT p.id, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600', 'MacBook Pro 14 M3 Pro', 'Apple MacBook Pro 14 M3 Pro', 0
FROM clowstack_products p WHERE p.slug = 'apple-macbook-pro-14-m3-pro' ON CONFLICT DO NOTHING;

INSERT INTO clowstack_product_images (product_id, src, name, alt, position)
SELECT p.id, 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600', 'Dell XPS 15', 'Dell XPS 15 2024', 0
FROM clowstack_products p WHERE p.slug = 'dell-xps-15-2024' ON CONFLICT DO NOTHING;

INSERT INTO clowstack_product_images (product_id, src, name, alt, position)
SELECT p.id, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600', 'HP Pavilion 15', 'HP Pavilion 15 Laptop', 0
FROM clowstack_products p WHERE p.slug = 'hp-pavilion-15-ryzen5' ON CONFLICT DO NOTHING;

INSERT INTO clowstack_product_images (product_id, src, name, alt, position)
SELECT p.id, 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600', 'AirPods Pro 2', 'Apple AirPods Pro 2nd Gen', 0
FROM clowstack_products p WHERE p.slug = 'apple-airpods-pro-2nd-gen' ON CONFLICT DO NOTHING;

INSERT INTO clowstack_product_images (product_id, src, name, alt, position)
SELECT p.id, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600', 'Galaxy Buds2 Pro', 'Samsung Galaxy Buds2 Pro', 0
FROM clowstack_products p WHERE p.slug = 'samsung-galaxy-buds2-pro' ON CONFLICT DO NOTHING;

INSERT INTO clowstack_product_images (product_id, src, name, alt, position)
SELECT p.id, 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600', 'Sony WH-1000XM5', 'Sony WH-1000XM5 Headphones', 0
FROM clowstack_products p WHERE p.slug = 'sony-wh-1000xm5' ON CONFLICT DO NOTHING;

INSERT INTO clowstack_product_images (product_id, src, name, alt, position)
SELECT p.id, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600', 'JBL Charge 5', 'JBL Charge 5 Bluetooth Speaker', 0
FROM clowstack_products p WHERE p.slug = 'jbl-charge-5' ON CONFLICT DO NOTHING;

INSERT INTO clowstack_product_images (product_id, src, name, alt, position)
SELECT p.id, 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=600', 'Apple Watch Series 9', 'Apple Watch Series 9', 0
FROM clowstack_products p WHERE p.slug = 'apple-watch-series-9-gps-45mm' ON CONFLICT DO NOTHING;

INSERT INTO clowstack_product_images (product_id, src, name, alt, position)
SELECT p.id, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600', 'Galaxy Watch 6 Classic', 'Samsung Galaxy Watch 6 Classic', 0
FROM clowstack_products p WHERE p.slug = 'samsung-galaxy-watch-6-classic-47mm' ON CONFLICT DO NOTHING;

INSERT INTO clowstack_product_images (product_id, src, name, alt, position)
SELECT p.id, 'https://images.unsplash.com/photo-1626143508000-4b5a33b4f95d?w=600', 'Anker 67W GaN Charger', 'Anker 67W GaN USB-C Charger', 0
FROM clowstack_products p WHERE p.slug = 'anker-67w-gan-usb-c-charger' ON CONFLICT DO NOTHING;

INSERT INTO clowstack_product_images (product_id, src, name, alt, position)
SELECT p.id, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600', 'Baseus Power Bank', 'Baseus 20000mAh 65W Power Bank', 0
FROM clowstack_products p WHERE p.slug = 'baseus-20000mah-65w-power-bank' ON CONFLICT DO NOTHING;

INSERT INTO clowstack_product_images (product_id, src, name, alt, position)
SELECT p.id, 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600', 'Spigen Case', 'Spigen Tough Armor iPhone 15 Pro Case', 0
FROM clowstack_products p WHERE p.slug = 'spigen-tough-armor-iphone-15-pro' ON CONFLICT DO NOTHING;

INSERT INTO clowstack_product_images (product_id, src, name, alt, position)
SELECT p.id, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600', 'Logitech MX Master 3S', 'Logitech MX Master 3S Mouse', 0
FROM clowstack_products p WHERE p.slug = 'logitech-mx-master-3s' ON CONFLICT DO NOTHING;

INSERT INTO clowstack_product_images (product_id, src, name, alt, position)
SELECT p.id, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600', 'Sony ZV-E10', 'Sony ZV-E10 Mirrorless Camera', 0
FROM clowstack_products p WHERE p.slug = 'sony-zv-e10-mirrorless-body' ON CONFLICT DO NOTHING;

INSERT INTO clowstack_product_images (product_id, src, name, alt, position)
SELECT p.id, 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600', 'GoPro Hero 12', 'GoPro HERO12 Black', 0
FROM clowstack_products p WHERE p.slug = 'gopro-hero12-black' ON CONFLICT DO NOTHING;

INSERT INTO clowstack_product_images (product_id, src, name, alt, position)
SELECT p.id, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600', 'PlayStation 5', 'Sony PlayStation 5 Console', 0
FROM clowstack_products p WHERE p.slug = 'sony-playstation-5-disc' ON CONFLICT DO NOTHING;

INSERT INTO clowstack_product_images (product_id, src, name, alt, position)
SELECT p.id, 'https://images.unsplash.com/photo-1610945264803-c22b62831e5c?w=600', 'Infinix Hot 40 Pro', 'Infinix Hot 40 Pro', 0
FROM clowstack_products p WHERE p.slug = 'infinix-hot-40-pro' ON CONFLICT DO NOTHING;

-- ── Product ↔ Category Links ──────────────────────────────────

-- Samsung Galaxy S24 Ultra → smartphones-tablets, android-phones
INSERT INTO clowstack_product_categories (product_id, category_id)
SELECT p.id, c.id FROM clowstack_products p, clowstack_categories c
WHERE p.slug = 'samsung-galaxy-s24-ultra' AND c.slug IN ('smartphones-tablets','android-phones')
ON CONFLICT DO NOTHING;

-- iPhone 15 Pro Max → smartphones-tablets, iphones-ipads
INSERT INTO clowstack_product_categories (product_id, category_id)
SELECT p.id, c.id FROM clowstack_products p, clowstack_categories c
WHERE p.slug = 'apple-iphone-15-pro-max' AND c.slug IN ('smartphones-tablets','iphones-ipads')
ON CONFLICT DO NOTHING;

-- Galaxy A55 → smartphones-tablets, android-phones
INSERT INTO clowstack_product_categories (product_id, category_id)
SELECT p.id, c.id FROM clowstack_products p, clowstack_categories c
WHERE p.slug = 'samsung-galaxy-a55-5g' AND c.slug IN ('smartphones-tablets','android-phones')
ON CONFLICT DO NOTHING;

-- Tecno Phantom X2 Pro → smartphones-tablets, android-phones
INSERT INTO clowstack_product_categories (product_id, category_id)
SELECT p.id, c.id FROM clowstack_products p, clowstack_categories c
WHERE p.slug = 'tecno-phantom-x2-pro' AND c.slug IN ('smartphones-tablets','android-phones')
ON CONFLICT DO NOTHING;

-- iPad Pro → smartphones-tablets, iphones-ipads
INSERT INTO clowstack_product_categories (product_id, category_id)
SELECT p.id, c.id FROM clowstack_products p, clowstack_categories c
WHERE p.slug = 'apple-ipad-pro-12-m2' AND c.slug IN ('smartphones-tablets','iphones-ipads')
ON CONFLICT DO NOTHING;

-- MacBook Pro → laptops-computers, laptops
INSERT INTO clowstack_product_categories (product_id, category_id)
SELECT p.id, c.id FROM clowstack_products p, clowstack_categories c
WHERE p.slug = 'apple-macbook-pro-14-m3-pro' AND c.slug IN ('laptops-computers','laptops')
ON CONFLICT DO NOTHING;

-- Dell XPS 15 → laptops-computers, laptops
INSERT INTO clowstack_product_categories (product_id, category_id)
SELECT p.id, c.id FROM clowstack_products p, clowstack_categories c
WHERE p.slug = 'dell-xps-15-2024' AND c.slug IN ('laptops-computers','laptops')
ON CONFLICT DO NOTHING;

-- HP Pavilion → laptops-computers, laptops
INSERT INTO clowstack_product_categories (product_id, category_id)
SELECT p.id, c.id FROM clowstack_products p, clowstack_categories c
WHERE p.slug = 'hp-pavilion-15-ryzen5' AND c.slug IN ('laptops-computers','laptops')
ON CONFLICT DO NOTHING;

-- AirPods Pro → audio-headphones, earbuds
INSERT INTO clowstack_product_categories (product_id, category_id)
SELECT p.id, c.id FROM clowstack_products p, clowstack_categories c
WHERE p.slug = 'apple-airpods-pro-2nd-gen' AND c.slug IN ('audio-headphones','earbuds')
ON CONFLICT DO NOTHING;

-- Galaxy Buds2 Pro → audio-headphones, earbuds
INSERT INTO clowstack_product_categories (product_id, category_id)
SELECT p.id, c.id FROM clowstack_products p, clowstack_categories c
WHERE p.slug = 'samsung-galaxy-buds2-pro' AND c.slug IN ('audio-headphones','earbuds')
ON CONFLICT DO NOTHING;

-- Sony WH-1000XM5 → audio-headphones, headphones
INSERT INTO clowstack_product_categories (product_id, category_id)
SELECT p.id, c.id FROM clowstack_products p, clowstack_categories c
WHERE p.slug = 'sony-wh-1000xm5' AND c.slug IN ('audio-headphones','headphones')
ON CONFLICT DO NOTHING;

-- JBL Charge 5 → audio-headphones, portable-speakers
INSERT INTO clowstack_product_categories (product_id, category_id)
SELECT p.id, c.id FROM clowstack_products p, clowstack_categories c
WHERE p.slug = 'jbl-charge-5' AND c.slug IN ('audio-headphones','portable-speakers')
ON CONFLICT DO NOTHING;

-- Apple Watch → smartwatches-wearables
INSERT INTO clowstack_product_categories (product_id, category_id)
SELECT p.id, c.id FROM clowstack_products p, clowstack_categories c
WHERE p.slug = 'apple-watch-series-9-gps-45mm' AND c.slug = 'smartwatches-wearables'
ON CONFLICT DO NOTHING;

-- Galaxy Watch 6 → smartwatches-wearables
INSERT INTO clowstack_product_categories (product_id, category_id)
SELECT p.id, c.id FROM clowstack_products p, clowstack_categories c
WHERE p.slug = 'samsung-galaxy-watch-6-classic-47mm' AND c.slug = 'smartwatches-wearables'
ON CONFLICT DO NOTHING;

-- Anker Charger → phone-accessories, chargers-cables
INSERT INTO clowstack_product_categories (product_id, category_id)
SELECT p.id, c.id FROM clowstack_products p, clowstack_categories c
WHERE p.slug = 'anker-67w-gan-usb-c-charger' AND c.slug IN ('phone-accessories','chargers-cables')
ON CONFLICT DO NOTHING;

-- Baseus Power Bank → phone-accessories, power-banks
INSERT INTO clowstack_product_categories (product_id, category_id)
SELECT p.id, c.id FROM clowstack_products p, clowstack_categories c
WHERE p.slug = 'baseus-20000mah-65w-power-bank' AND c.slug IN ('phone-accessories','power-banks')
ON CONFLICT DO NOTHING;

-- Spigen Case → phone-accessories, cases-covers
INSERT INTO clowstack_product_categories (product_id, category_id)
SELECT p.id, c.id FROM clowstack_products p, clowstack_categories c
WHERE p.slug = 'spigen-tough-armor-iphone-15-pro' AND c.slug IN ('phone-accessories','cases-covers')
ON CONFLICT DO NOTHING;

-- Logitech Mouse → computer-accessories
INSERT INTO clowstack_product_categories (product_id, category_id)
SELECT p.id, c.id FROM clowstack_products p, clowstack_categories c
WHERE p.slug = 'logitech-mx-master-3s' AND c.slug = 'computer-accessories'
ON CONFLICT DO NOTHING;

-- Sony ZV-E10 → cameras-photography
INSERT INTO clowstack_product_categories (product_id, category_id)
SELECT p.id, c.id FROM clowstack_products p, clowstack_categories c
WHERE p.slug = 'sony-zv-e10-mirrorless-body' AND c.slug = 'cameras-photography'
ON CONFLICT DO NOTHING;

-- GoPro Hero 12 → cameras-photography
INSERT INTO clowstack_product_categories (product_id, category_id)
SELECT p.id, c.id FROM clowstack_products p, clowstack_categories c
WHERE p.slug = 'gopro-hero12-black' AND c.slug = 'cameras-photography'
ON CONFLICT DO NOTHING;

-- PS5 → gaming
INSERT INTO clowstack_product_categories (product_id, category_id)
SELECT p.id, c.id FROM clowstack_products p, clowstack_categories c
WHERE p.slug = 'sony-playstation-5-disc' AND c.slug = 'gaming'
ON CONFLICT DO NOTHING;

-- Infinix Hot 40 Pro → smartphones-tablets, android-phones
INSERT INTO clowstack_product_categories (product_id, category_id)
SELECT p.id, c.id FROM clowstack_products p, clowstack_categories c
WHERE p.slug = 'infinix-hot-40-pro' AND c.slug IN ('smartphones-tablets','android-phones')
ON CONFLICT DO NOTHING;

-- ── Product Attributes ────────────────────────────────────────

INSERT INTO clowstack_product_attributes (product_id, name, options, position)
SELECT id, 'Storage', ARRAY['256GB', '512GB', '1TB'], 0 FROM clowstack_products WHERE slug = 'samsung-galaxy-s24-ultra' ON CONFLICT DO NOTHING;
INSERT INTO clowstack_product_attributes (product_id, name, options, position)
SELECT id, 'Color', ARRAY['Titanium Black', 'Titanium Gray', 'Titanium Violet', 'Titanium Yellow'], 1 FROM clowstack_products WHERE slug = 'samsung-galaxy-s24-ultra' ON CONFLICT DO NOTHING;

INSERT INTO clowstack_product_attributes (product_id, name, options, position)
SELECT id, 'Storage', ARRAY['256GB', '512GB', '1TB'], 0 FROM clowstack_products WHERE slug = 'apple-iphone-15-pro-max' ON CONFLICT DO NOTHING;
INSERT INTO clowstack_product_attributes (product_id, name, options, position)
SELECT id, 'Color', ARRAY['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'], 1 FROM clowstack_products WHERE slug = 'apple-iphone-15-pro-max' ON CONFLICT DO NOTHING;

INSERT INTO clowstack_product_attributes (product_id, name, options, position)
SELECT id, 'Storage', ARRAY['128GB', '256GB'], 0 FROM clowstack_products WHERE slug = 'samsung-galaxy-a55-5g' ON CONFLICT DO NOTHING;
INSERT INTO clowstack_product_attributes (product_id, name, options, position)
SELECT id, 'Color', ARRAY['Awesome Iceblue', 'Awesome Navy', 'Awesome Lilac'], 1 FROM clowstack_products WHERE slug = 'samsung-galaxy-a55-5g' ON CONFLICT DO NOTHING;

INSERT INTO clowstack_product_attributes (product_id, name, options, position)
SELECT id, 'RAM', ARRAY['16GB', '18GB'], 0 FROM clowstack_products WHERE slug = 'apple-macbook-pro-14-m3-pro' ON CONFLICT DO NOTHING;
INSERT INTO clowstack_product_attributes (product_id, name, options, position)
SELECT id, 'Storage', ARRAY['512GB SSD', '1TB SSD', '2TB SSD'], 1 FROM clowstack_products WHERE slug = 'apple-macbook-pro-14-m3-pro' ON CONFLICT DO NOTHING;
INSERT INTO clowstack_product_attributes (product_id, name, options, position)
SELECT id, 'Color', ARRAY['Space Black', 'Silver'], 2 FROM clowstack_products WHERE slug = 'apple-macbook-pro-14-m3-pro' ON CONFLICT DO NOTHING;

INSERT INTO clowstack_product_attributes (product_id, name, options, position)
SELECT id, 'Color', ARRAY['Midnight', 'Starlight', 'Pink', 'Storm Blue', 'Green'], 0 FROM clowstack_products WHERE slug = 'apple-watch-series-9-gps-45mm' ON CONFLICT DO NOTHING;
INSERT INTO clowstack_product_attributes (product_id, name, options, position)
SELECT id, 'Size', ARRAY['41mm', '45mm'], 1 FROM clowstack_products WHERE slug = 'apple-watch-series-9-gps-45mm' ON CONFLICT DO NOTHING;

INSERT INTO clowstack_product_attributes (product_id, name, options, position)
SELECT id, 'Color', ARRAY['Phantom Black', 'Cream', 'Graphite'], 0 FROM clowstack_products WHERE slug = 'samsung-galaxy-buds2-pro' ON CONFLICT DO NOTHING;

INSERT INTO clowstack_product_attributes (product_id, name, options, position)
SELECT id, 'Color', ARRAY['Black', 'Blue', 'Red', 'Gray'], 0 FROM clowstack_products WHERE slug = 'jbl-charge-5' ON CONFLICT DO NOTHING;

-- ── Update category product counts ───────────────────────────

UPDATE clowstack_categories c
SET count = (
  SELECT COUNT(*) FROM clowstack_product_categories pc WHERE pc.category_id = c.id
);
