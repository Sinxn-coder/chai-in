-- Seed Data for Spots Table
-- Use these URLs/Path as dummies. In a real app, these would be Supabase Storage URLs.

insert into public.spots (
  name, 
  description, 
  city, 
  category, 
  phone, 
  whatsapp, 
  instagram, 
  opening_time, 
  closing_time, 
  features, 
  special_dishes, 
  average_cost, 
  images, 
  latitude, 
  longitude, 
  status, 
  is_verified, 
  is_featured
)
values
('Oceanic Grill', 'Fresh seafood with a view of the harbor.', 'Kochi', 'Restaurant', '9876543210', '9876543210', '@oceanic_grill', '11:00 AM', '11:00 PM', ARRAY['Outdoor Seating', 'Parking', 'WiFi'], ARRAY['Grilled Sea Bass', 'Prawn Roast'], 1500, ARRAY['land.png', 'icon.png'], 9.9312, 76.2673, 'approved', true, true),
('The Coffee Bean', 'A cozy spot for your morning caffeine fix.', 'Kochi', 'Cafe', '9876543211', '9876543211', '@coffeebean_kochi', '08:00 AM', '10:00 PM', ARRAY['WiFi', 'AC'], ARRAY['Cappuccino', 'Blueberry Muffin'], 500, ARRAY['land.png'], 9.9315, 76.2670, 'approved', true, false),
('Urban Junction', 'Trendy gastropub with amazing music.', 'Kochi', 'Bar', '9876543212', '9876543212', '@urban_junction', '04:00 PM', '12:00 AM', ARRAY['WiFi', 'Valet Parking', 'Live Music'], ARRAY['Beef Sliders', 'Classic Martini'], 2000, ARRAY['construction.png', 'land.png'], 9.9320, 76.2680, 'approved', false, true),
('Green Park Cafe', 'Eat healthy in the middle of nature.', 'Kochi', 'Cafe', '9876543213', '9876543213', '@greenpark_cafe', '09:00 AM', '08:00 PM', ARRAY['Pet Friendly', 'Outdoor Seating'], ARRAY['Avocado Toast', 'Berry Smoothie'], 800, ARRAY['land.png'], 9.9300, 76.2650, 'approved', true, false),
('Spice Route', 'Traditional Kerala cuisine with a modern twist.', 'Calicut', 'Restaurant', '9876543214', '9876543214', '@spiceroute_calicut', '12:00 PM', '10:30 PM', ARRAY['AC', 'Parking'], ARRAY['Kozhikode Biriyani', 'Fish Molee'], 1200, ARRAY['icon.png', 'land.png'], 11.2588, 75.7804, 'approved', true, true),
('Street Bite', 'The best street food in town.', 'Calicut', 'Street Food', '9876543215', '9876543215', '@streetbite', '05:00 PM', '11:00 PM', ARRAY['Parking'], ARRAY['Chicken Roll', 'Masala Dosa'], 300, ARRAY['construction.png'], 11.2595, 75.7810, 'approved', false, false),
('Highland Brews', 'Premium teas and snacks with a view.', 'Munnar', 'Cafe', '9876543216', '9876543216', '@highland_munnar', '07:00 AM', '07:00 PM', ARRAY['WiFi', 'Outdoor Seating'], ARRAY['Masala Tea', 'Bread Omelette'], 400, ARRAY['land.png'], 10.0889, 77.0595, 'approved', true, true),
('Sunset Lounge', 'Catch the best sunset with a refreshing drink.', 'Varkala', 'Bar', '9876543217', '9876543217', '@sunset_varkala', '03:00 PM', '11:30 PM', ARRAY['Outdoor Seating', 'Live Music'], ARRAY['Cocktail Platter', 'Calamari Rings'], 1800, ARRAY['land.png', 'icon.png'], 8.7300, 76.7110, 'approved', true, false),
('Mist Valley', 'Fine dining atop the hills.', 'Wayanad', 'Restaurant', '9876543218', '9876543218', '@mistvalley_wayanad', '12:30 PM', '10:00 PM', ARRAY['AC', 'Parking', 'WiFi'], ARRAY['Bamboo Biriyani', 'Dates Cake'], 1600, ARRAY['land.png'], 11.6854, 76.1320, 'approved', true, true),
('The Bakers Oven', 'Freshly baked breads and cakes every day.', 'Trivandrum', 'Bakery', '9876543219', '9876543219', '@bakers_oven_tvm', '09:00 AM', '09:00 PM', ARRAY['AC', 'Takeout'], ARRAY['Black Forest Cake', 'Plum Cake'], 600, ARRAY['icon.png'], 8.5241, 76.9366, 'approved', true, false);
