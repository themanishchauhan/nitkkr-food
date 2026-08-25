-- Seed Food Cave Fast Food and 172 Menu Items
INSERT OR IGNORE INTO vendors (id, name, slug, phone, whatsapp, address, latitude, longitude, opens_at, closes_at, delivers_to, image, is_active, is_featured, display_order)
VALUES (
  21,
  'Food Cave Fast Food',
  'food-cave',
  '+91 98964 75885',
  '919896475885',
  'NIT Gate-2, Kirmach Road, Kurukshetra',
  29.9662,
  76.8808,
  '09:00',
  '23:30',
  '["Hostel 1-11","DB Hall","Academic Block","Campus Gate 1 & 2","Faculty Flats"]',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
  1,
  1,
  1
);

INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2101,
  21,
  3,
  'Tea',
  'Fresh hot campus chai',
  15,
  1,
  1,
  '["chai","beverage","hot","popular"]',
  1
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2102,
  21,
  3,
  'Tea (Big Glass)',
  'Extra large glass of hot freshly brewed tea',
  20,
  1,
  1,
  '["chai","beverage","hot"]',
  2
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2103,
  21,
  3,
  'Masala Tea',
  'Aromatic tea brewed with traditional Indian spices',
  30,
  1,
  1,
  '["chai","masala","bestseller"]',
  3
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2104,
  21,
  3,
  'Milk Tea',
  'Rich creamy milk tea',
  25,
  1,
  1,
  '["chai","milk"]',
  4
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2105,
  21,
  3,
  'Lemon Tea',
  'Refreshing hot lemon infused black tea',
  20,
  1,
  1,
  '["tea","lemon","healthy"]',
  5
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2106,
  21,
  3,
  'Black Tea',
  'Strong black tea without milk',
  15,
  1,
  1,
  '["tea","black tea"]',
  6
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2107,
  21,
  3,
  'Cold Tea',
  'Chilled iced tea refreshment',
  30,
  1,
  1,
  '["tea","iced tea","cold"]',
  7
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2108,
  21,
  3,
  'Coffee',
  'Hot frothy campus coffee',
  30,
  1,
  1,
  '["coffee","hot"]',
  8
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2109,
  21,
  3,
  'Cold Coffee',
  'Chilled thick blended coffee with chocolate syrup',
  50,
  1,
  1,
  '["coffee","cold","bestseller"]',
  9
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2110,
  21,
  3,
  'Cold Coffee with Ice Cream',
  'Creamy cold coffee topped with vanilla ice cream scoop',
  50,
  1,
  1,
  '["coffee","ice cream","dessert"]',
  10
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2111,
  21,
  3,
  'Milk Shake',
  'Thick flavored milk shake',
  50,
  1,
  1,
  '["shake","sweet"]',
  11
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2112,
  21,
  3,
  'Cold Drinks',
  'Chilled soft drink bottle (MRP)',
  40,
  1,
  1,
  '["cold drink","soda"]',
  12
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2113,
  21,
  3,
  'Mineral Water',
  'Packaged drinking water bottle (MRP)',
  20,
  1,
  1,
  '["water"]',
  13
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2114,
  21,
  3,
  'Soda',
  'Chilled fresh soda water (MRP)',
  20,
  1,
  1,
  '["soda"]',
  14
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2115,
  21,
  3,
  'Lemon Water',
  'Freshly squeezed sweet and salted nimbu pani',
  30,
  1,
  1,
  '["lemon","healthy"]',
  15
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2116,
  21,
  3,
  'Lemon Soda',
  'Fizzy lemon soda with chaat masala',
  40,
  1,
  1,
  '["lemon soda","fizzy"]',
  16
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2117,
  21,
  3,
  'Lassi Salted',
  'Traditional Punjabi salted buttermilk lassi',
  30,
  1,
  1,
  '["lassi","desi"]',
  17
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2118,
  21,
  3,
  'Lassi Mithi',
  'Thick sweet Punjabi lassi with malai',
  40,
  1,
  1,
  '["lassi","sweet","bestseller"]',
  18
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2119,
  21,
  8,
  'Tomato Soup',
  'Warm tangy tomato soup with crunchy croutons',
  40,
  1,
  1,
  '["soup","warm"]',
  19
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2120,
  21,
  8,
  'Veg. Soup',
  'Healthy mixed vegetable clear soup',
  45,
  1,
  1,
  '["soup","healthy"]',
  20
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2121,
  21,
  8,
  'Cream of Tomato Soup',
  'Rich velvety creamy tomato soup with butter',
  50,
  1,
  1,
  '["soup","creamy"]',
  21
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2122,
  21,
  8,
  'Manchow Soup',
  'Spicy Indo-Chinese soup topped with crispy fried noodles',
  50,
  1,
  1,
  '["soup","chinese","spicy"]',
  22
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2123,
  21,
  8,
  'Chicken Soup',
  'Warm nourishing chicken broth with shredded chicken pieces',
  70,
  0,
  1,
  '["soup","chicken","protein","nonveg"]',
  23
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2124,
  21,
  8,
  'Veg. Pakora',
  'Crispy assorted mixed vegetable pakoras (Full: ₹140 / Half: ₹90)',
  140,
  1,
  1,
  '["pakora","snacks","rainy-day"]',
  24
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2125,
  21,
  8,
  'Paneer Tikka (4 Pcs.)',
  'Tandoor roasted marinated paneer cubes with capsicum and onion',
  200,
  1,
  1,
  '["paneer","tandoori","special","protein"]',
  25
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2126,
  21,
  8,
  'French Fry',
  'Crispy salted golden potato french fries (Full: ₹100 / Half: ₹70)',
  100,
  1,
  1,
  '["fries","crispy","snack"]',
  26
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2127,
  21,
  2,
  'Veg. Noodles',
  'Wok tossed chowmein with crunchy cabbage, carrots and capsicum (Full: ₹80 / Half: ₹60)',
  80,
  1,
  1,
  '["noodles","chinese","popular"]',
  27
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2128,
  21,
  2,
  'Veg. Hakka Noodles',
  'Classic Hakka style tossed noodles with soy and vinegar (Full: ₹90 / Half: ₹70)',
  90,
  1,
  1,
  '["noodles","hakka"]',
  28
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2129,
  21,
  2,
  'Noodles with Mayonnaise',
  'Spicy noodles generously loaded with creamy mayonnaise (Full: ₹90 / Half: ₹70)',
  90,
  1,
  1,
  '["noodles","mayo","creamy"]',
  29
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2130,
  21,
  2,
  'Egg Noodles (2 Egg)',
  'Wok tossed noodles scrambled with 2 farm eggs and veggies (Full: ₹90 / Half: ₹70)',
  90,
  0,
  1,
  '["noodles","egg","protein"]',
  30
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2131,
  21,
  2,
  'Egg Hakka Noodles',
  'Hakka noodles tossed with egg shreds and pepper (Full: ₹90 / Half: ₹70)',
  90,
  0,
  1,
  '["noodles","egg","protein"]',
  31
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2132,
  21,
  2,
  'Half Fry Egg Hakka Noodles',
  'Hakka noodles topped with a delicious sunny side half fry egg (Full: ₹90 / Half: ₹70)',
  90,
  0,
  1,
  '["noodles","egg","half fry"]',
  32
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2133,
  21,
  2,
  'Chicken Hakka Noodles',
  'Wok tossed Hakka noodles with tender juicy chicken chunks (Full: ₹140 / Half: ₹90)',
  140,
  0,
  1,
  '["noodles","chicken","protein","bestseller"]',
  33
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2134,
  21,
  2,
  'Chilly Garlic Noodles',
  'Spicy noodles tossed with burnt garlic and red chilli sauce (Full: ₹110 / Half: ₹80)',
  110,
  1,
  1,
  '["noodles","spicy","garlic"]',
  34
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2135,
  21,
  2,
  'Paneer Fry Noodles',
  'Noodles tossed with golden fried paneer cubes (Full: ₹120 / Half: ₹90)',
  120,
  1,
  1,
  '["noodles","paneer","protein"]',
  35
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2136,
  21,
  2,
  'Gobhi Fry Noodles',
  'Noodles tossed with crispy fried cauliflower florets (Full: ₹100 / Half: ₹70)',
  100,
  1,
  1,
  '["noodles","gobhi"]',
  36
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2137,
  21,
  2,
  'Veg. Manchurian',
  'Crispy veg dumplings tossed in dark soya and garlic gravy (Full: ₹120 / Half: ₹80)',
  120,
  1,
  1,
  '["manchurian","chinese","bestseller"]',
  37
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2138,
  21,
  2,
  'Chily Potato',
  'Crispy fried potato fingers tossed in spicy chilli sauce (Full: ₹130 / Half: ₹90)',
  130,
  1,
  1,
  '["potato","spicy","crispy"]',
  38
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2139,
  21,
  2,
  'Honey Chily Potato',
  'Crispy fried potatoes glazed with sweet honey and spicy chilli (Full: ₹150 / Half: ₹100)',
  150,
  1,
  1,
  '["honey chilli","crispy","popular"]',
  39
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2140,
  21,
  2,
  'Veg. Chopsuey',
  'Crispy noodles topped with sweet and sour vegetable gravy (Full: ₹110 / Half: ₹80)',
  110,
  1,
  1,
  '["chopsuey","chinese"]',
  40
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2141,
  21,
  2,
  'American Chopsuey',
  'Sweet and tangy American style chopsuey loaded with vegetables (Full: ₹150 / Half: ₹100)',
  150,
  1,
  1,
  '["chopsuey","crispy"]',
  41
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2142,
  21,
  2,
  'Gravy Noodles',
  'Noodles served in thick spicy Chinese gravy (Full: ₹120 / Half: ₹90)',
  120,
  1,
  1,
  '["noodles","gravy"]',
  42
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2143,
  21,
  2,
  'Chicken Pakora',
  'Crisp seasoned batter-fried chicken bites (Full: ₹450 / Half: ₹250)',
  450,
  0,
  1,
  '["chicken","pakora","protein","nonveg"]',
  43
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2144,
  21,
  2,
  'Tandoori Chicken',
  'Traditional clay-oven roasted spiced chicken (Full: ₹450 / Half: ₹250)',
  450,
  0,
  1,
  '["chicken","tandoori","protein","bestseller"]',
  44
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2145,
  21,
  7,
  'Bread Omlete (2 Egg)',
  'Toasted bread slices sandwiched with 2-egg spiced omelette',
  50,
  0,
  1,
  '["egg","breakfast","protein","bestseller"]',
  45
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2146,
  21,
  7,
  'Bread Omlete (4 Egg)',
  'High protein double decker 4-egg bread omelette',
  90,
  0,
  1,
  '["egg","high protein","gym"]',
  46
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2147,
  21,
  7,
  'Veg. Bread Omlete (2 Egg)',
  'Bread omelette loaded with finely chopped onions, tomatoes, and green chillies',
  70,
  0,
  1,
  '["egg","veg omelette","protein"]',
  47
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2148,
  21,
  7,
  'Plain Omlete (2 Egg)',
  'Simple seasoned 2-egg omelette',
  40,
  0,
  1,
  '["egg","keto","protein"]',
  48
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2149,
  21,
  7,
  'Cheese Bread Omlete (2 Egg)',
  'Bread omelette stuffed with melted Amul cheese slice',
  90,
  0,
  1,
  '["egg","cheese","creamy"]',
  49
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2150,
  21,
  7,
  'Cheese Plain Omlete (2 Egg)',
  'Fluffy 2-egg omelette with melted cheese inside',
  70,
  0,
  1,
  '["egg","cheese","protein"]',
  50
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2151,
  21,
  7,
  'Egg Roll (2 Egg)',
  'Flaky paratha rolled with 2 scrambled eggs, onions and tangy sauces',
  60,
  0,
  1,
  '["roll","egg","popular"]',
  51
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2152,
  21,
  7,
  'Veg. Roll',
  'Crispy roll stuffed with spiced mixed vegetables',
  50,
  1,
  1,
  '["roll","veg","budget"]',
  52
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2153,
  21,
  7,
  'Paneer Roll',
  'Paratha wrap filled with marinated paneer cubes and mint sauce',
  70,
  1,
  1,
  '["roll","paneer","bestseller"]',
  53
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2154,
  21,
  7,
  'Chicken Roll with Egg',
  'Jumbo paratha rolled with seasoned chicken chunks and fried egg',
  110,
  0,
  1,
  '["roll","chicken","egg","protein","bestseller"]',
  54
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2155,
  21,
  7,
  'French Toast (2 Pcs)',
  'Golden pan-fried egg dipped bread slices',
  70,
  0,
  1,
  '["toast","breakfast"]',
  55
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2156,
  21,
  7,
  'Egg Bhurji (2 Egg)',
  'Desi spiced scrambled 2 eggs with onion, tomato and green chilli',
  50,
  0,
  1,
  '["bhurji","egg","protein"]',
  56
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2157,
  21,
  7,
  'Egg Curry (2 Egg)',
  'Two boiled eggs simmered in rich spiced gravy (Full: ₹90 / Half: ₹70)',
  90,
  0,
  1,
  '["curry","egg","protein","lunch"]',
  57
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2158,
  21,
  7,
  'Bread Half Fry (1 Egg)',
  'Toasted bread with a 1-egg sunny-side up half fry',
  30,
  0,
  1,
  '["egg","half fry"]',
  58
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2159,
  21,
  7,
  'Bread Full Fry (2 Egg)',
  'Toasted bread with double egg well-done fry',
  50,
  0,
  1,
  '["egg","full fry"]',
  59
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2160,
  21,
  1,
  'Plain Maggi',
  'Classic hostel style 2-minute instant Maggi noodles',
  30,
  1,
  1,
  '["maggi","hostel favorite","budget"]',
  60
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2161,
  21,
  1,
  'Veg. Maggi',
  'Maggi cooked with diced onions, tomatoes, peas and carrots',
  40,
  1,
  1,
  '["maggi","veg"]',
  61
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2162,
  21,
  1,
  'Full Fry Maggi',
  'Maggi noodles tossed with double full fried egg',
  50,
  0,
  1,
  '["maggi","egg"]',
  62
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2163,
  21,
  1,
  'Half Fry Maggi',
  'Maggi noodles topped with a runny yolk half fry egg',
  50,
  0,
  1,
  '["maggi","egg","half fry"]',
  63
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2164,
  21,
  1,
  'Bhurji Maggi',
  'Maggi cooked together with spicy scrambled egg bhurji',
  60,
  0,
  1,
  '["maggi","egg bhurji","protein"]',
  64
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2165,
  21,
  1,
  'Onion Tomato Fry Maggi',
  'Desi tadka Maggi cooked with butter fried onion and tomatoes',
  50,
  1,
  1,
  '["maggi","desi","popular"]',
  65
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2166,
  21,
  1,
  'Paneer Maggi',
  'Maggi noodles enriched with fresh paneer cubes and herbs',
  80,
  1,
  1,
  '["maggi","paneer","protein"]',
  66
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2167,
  21,
  1,
  'Cheese Maggi',
  'Creamy Maggi loaded with melted mozzarella and cheddar cheese',
  80,
  1,
  1,
  '["maggi","cheese","bestseller"]',
  67
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2168,
  21,
  1,
  'Chicken Maggi (7-8 Pcs)',
  'Delicious Maggi cooked with 7-8 tender chicken chunks',
  100,
  0,
  1,
  '["maggi","chicken","protein","nonveg"]',
  68
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2169,
  21,
  1,
  'Normal Pasta',
  'Penne pasta tossed in spiced tomato herb sauce (Full: ₹100 / Half: ₹60)',
  100,
  1,
  1,
  '["pasta","italian"]',
  69
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2170,
  21,
  1,
  'White Sauce Pasta',
  'Creamy rich bechamel white sauce pasta with cheese and oregano (Full: ₹100 / Half: ₹60)',
  100,
  1,
  1,
  '["pasta","white sauce","cheesy","bestseller"]',
  70
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2171,
  21,
  1,
  'Red Sauce Pasta',
  'Spicy tangy arrabbiata red sauce pasta with Italian seasonings (Full: ₹100 / Half: ₹60)',
  100,
  1,
  1,
  '["pasta","red sauce","spicy"]',
  71
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2172,
  21,
  1,
  'Desi Fry Burger',
  'Crispy fried veg patty burger with onion, tomato and tangy mayo',
  30,
  1,
  1,
  '["burger","desi","budget"]',
  72
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2173,
  21,
  1,
  'Toast Burger',
  'Toasted bun burger with crisp spiced vegetable patty',
  40,
  1,
  1,
  '["burger","crispy"]',
  73
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2174,
  21,
  1,
  'Half Fry Egg Burger',
  'Burger with seasoned vegetable patty topped with a half fry egg',
  50,
  0,
  1,
  '["burger","egg","half fry"]',
  74
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2175,
  21,
  1,
  'Cheese Egg Burger',
  'Loaded egg burger with melted cheese slice and sauces',
  60,
  0,
  1,
  '["burger","cheese","egg","bestseller"]',
  75
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2176,
  21,
  1,
  'Egg Burger',
  'Classic spiced fried egg burger with crunchy onions',
  50,
  0,
  1,
  '["burger","egg","protein"]',
  76
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2177,
  21,
  1,
  'Full Fry Egg Burger',
  'Burger layered with double full fried eggs and spicy dressing',
  50,
  0,
  1,
  '["burger","egg","full fry"]',
  77
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2178,
  21,
  1,
  'Veg. Sandwich Plain',
  'Fresh cucumber, tomato and potato slices in soft bread with green chutney',
  50,
  1,
  1,
  '["sandwich","healthy"]',
  78
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2179,
  21,
  1,
  'Toast Sandwich',
  'Crispy grilled spiced vegetable sandwich',
  50,
  1,
  1,
  '["sandwich","grilled"]',
  79
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2180,
  21,
  1,
  'Cheese Toast Sandwich',
  'Grilled sandwich overflowing with melted cheese and spiced potatoes',
  60,
  1,
  1,
  '["sandwich","cheese","bestseller"]',
  80
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2181,
  21,
  1,
  'Aloo (Toast) Sandwich',
  'Crispy toasted sandwich stuffed with seasoned aloo masala',
  40,
  1,
  1,
  '["sandwich","aloo","budget"]',
  81
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2182,
  21,
  1,
  'Pav Bhaji',
  'Spiced buttery mashed vegetable curry served with 2 soft toasted pavs',
  60,
  1,
  1,
  '["pav bhaji","mumbai style","popular"]',
  82
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2183,
  21,
  1,
  'Butter Pav Bhaji',
  'Extra butter laden pav bhaji served with lemon and chopped onions',
  70,
  1,
  1,
  '["pav bhaji","butter"]',
  83
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2184,
  21,
  1,
  'Cheese Pav Bhaji',
  'Rich pav bhaji smothered with grated mozzarella and cheddar cheese',
  80,
  1,
  1,
  '["pav bhaji","cheese","bestseller"]',
  84
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2185,
  21,
  4,
  'Veg. Fried Rice',
  'Basmati rice wok tossed with vegetables and light soy (Full: ₹100 / Half: ₹70)',
  100,
  1,
  1,
  '["rice","chinese"]',
  85
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2186,
  21,
  4,
  'Egg Fried Rice',
  'Fried rice scrambled with farm fresh eggs and scallions (Full: ₹120 / Half: ₹90)',
  120,
  0,
  1,
  '["rice","egg","protein"]',
  86
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2187,
  21,
  4,
  'Full Fry Egg Fried Rice',
  'Fried rice served with double full fry eggs on top (Full: ₹120 / Half: ₹90)',
  120,
  0,
  1,
  '["rice","egg"]',
  87
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2188,
  21,
  4,
  'Half Fry Egg Fried Rice',
  'Fried rice served with sunny side up half fry egg (Full: ₹120 / Half: ₹90)',
  120,
  0,
  1,
  '["rice","egg","half fry"]',
  88
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2189,
  21,
  4,
  'Mushroom Fried Rice',
  'Basmati rice tossed with sauteed button mushrooms (Full: ₹130 / Half: ₹90)',
  130,
  1,
  1,
  '["rice","mushroom"]',
  89
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2190,
  21,
  4,
  'Paneer Fried Rice',
  'Flavorful fried rice tossed with golden paneer cubes (Full: ₹130 / Half: ₹90)',
  130,
  1,
  1,
  '["rice","paneer","protein"]',
  90
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2191,
  21,
  4,
  'Cauliflowers Fried Rice',
  'Fried rice tossed with crispy spiced cauliflower (Full: ₹110 / Half: ₹80)',
  110,
  1,
  1,
  '["rice","gobhi"]',
  91
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2192,
  21,
  4,
  'Chicken Fried Rice',
  'Fried rice tossed with juicy spiced chicken bites (Full: ₹150 / Half: ₹100)',
  150,
  0,
  1,
  '["rice","chicken","protein","bestseller"]',
  92
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2193,
  21,
  4,
  'Chicken Biryani',
  'Fragrant spiced basmati biryani with tender chicken pieces (Full: ₹160 / Half: ₹100)',
  160,
  0,
  1,
  '["biryani","chicken","protein","bestseller"]',
  93
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2194,
  21,
  4,
  'Egg Biryani',
  'Aromatic layered basmati biryani served with spiced boiled eggs (Full: ₹130 / Half: ₹90)',
  130,
  0,
  1,
  '["biryani","egg","protein"]',
  94
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2195,
  21,
  4,
  'Veg. Biryani',
  'Rich dum basmati biryani cooked with fresh seasonal vegetables and spices (Full: ₹140 / Half: ₹90)',
  140,
  1,
  1,
  '["biryani","veg"]',
  95
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2196,
  21,
  4,
  'Plain Rice',
  'Steamed fluffy long grain basmati rice (Full: ₹60 / Half: ₹40)',
  60,
  1,
  1,
  '["rice","plain"]',
  96
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2197,
  21,
  4,
  'Jeera Rice',
  'Basmati rice tempered with fragrant roasted cumin and ghee (Full: ₹70 / Half: ₹50)',
  70,
  1,
  1,
  '["rice","jeera"]',
  97
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2198,
  21,
  4,
  'Paneer Rice',
  'Basmati rice cooked with seasoned paneer cubes (Full: ₹80 / Half: ₹60)',
  80,
  1,
  1,
  '["rice","paneer"]',
  98
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2199,
  21,
  4,
  'Veg. Pulao',
  'Aromatic basmati rice cooked with whole spices and vegetables (Full: ₹100 / Half: ₹70)',
  100,
  1,
  1,
  '["pulao","veg"]',
  99
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2200,
  21,
  4,
  'Lemon Rice',
  'South Indian style tangy lemon tempered rice with mustard seeds and curry leaves (Full: ₹70 / Half: ₹50)',
  70,
  1,
  1,
  '["rice","lemon"]',
  100
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2201,
  21,
  4,
  'Dal Fry',
  'Yellow lentils tempered with ghee, garlic, onion and cumin (Full: ₹100 / Half: ₹70)',
  100,
  1,
  1,
  '["dal","desi","popular"]',
  101
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2202,
  21,
  4,
  'Dal Tadka',
  'Yellow dal infused with smoky red chilli and garlic tadka (Full: ₹100 / Half: ₹70)',
  100,
  1,
  1,
  '["dal","tadka","bestseller"]',
  102
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2203,
  21,
  4,
  'Amritsari Dal',
  'Authentic Punjabi style rich black gram and chana dal (Full: ₹130 / Half: ₹100)',
  130,
  1,
  1,
  '["dal","punjabi"]',
  103
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2204,
  21,
  4,
  'Dal Makhni',
  'Slow cooked black urad lentils in butter, cream and tomato puree (Full: ₹140 / Half: ₹100)',
  140,
  1,
  1,
  '["dal makhni","butter","creamy","bestseller"]',
  104
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2205,
  21,
  4,
  'Yellow Dal',
  'Simple light homestyle cooked yellow toor dal (Full: ₹100 / Half: ₹60)',
  100,
  1,
  1,
  '["dal","homestyle"]',
  105
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2206,
  21,
  4,
  'Plain Dahi',
  'Fresh creamy set curd bowl',
  30,
  1,
  1,
  '["curd","healthy"]',
  106
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2207,
  21,
  4,
  'Boondi Raita',
  'Chilled spiced yogurt with crispy gram flour boondi and roasted jeera',
  55,
  1,
  1,
  '["raita","boondi"]',
  107
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2208,
  21,
  4,
  'Cucumber Raita',
  'Cooling grated cucumber mixed in spiced curd',
  55,
  1,
  1,
  '["raita","cucumber","cooling"]',
  108
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2209,
  21,
  4,
  'Mix Veg. Raita',
  'Chilled curd loaded with finely chopped onion, tomato and cucumber',
  55,
  1,
  1,
  '["raita","veg"]',
  109
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2210,
  21,
  4,
  'Onion Tomato Raita',
  'Spiced whipped yogurt with crunchy onions and ripe tomatoes',
  55,
  1,
  1,
  '["raita","onion tomato"]',
  110
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2211,
  21,
  4,
  'Aloo Raita',
  'Boiled potato cubes seasoned in spiced curd with black salt',
  50,
  1,
  1,
  '["raita","aloo"]',
  111
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2212,
  21,
  4,
  'Green Salad',
  'Fresh sliced cucumbers, tomatoes, carrots, onions and green chillies',
  50,
  1,
  1,
  '["salad","healthy"]',
  112
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2213,
  21,
  4,
  'Onion Salad',
  'Sliced red onion rings seasoned with chaat masala and lemon',
  50,
  1,
  1,
  '["salad","onion"]',
  113
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2214,
  21,
  4,
  'Shahi Paneer',
  'Paneer cubes in a rich, sweet and creamy cashew tomato gravy (Full: ₹130 / Half: ₹100)',
  130,
  1,
  1,
  '["paneer","shahi","creamy","popular"]',
  114
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2215,
  21,
  4,
  'Kadai Paneer',
  'Paneer cooked with bell peppers and freshly ground kadai masala (Full: ₹150 / Half: ₹100)',
  150,
  1,
  1,
  '["paneer","kadai","spicy","bestseller"]',
  115
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2216,
  21,
  4,
  'Cheese Tamato',
  'Rich tomato curry simmered with melted cheese (Full: ₹130 / Half: ₹100)',
  130,
  1,
  1,
  '["cheese","tomato"]',
  116
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2217,
  21,
  4,
  'Malai Kofta (7-8 Pcs)',
  'Soft paneer and potato dumplings in luscious creamy cashew gravy (Full: ₹130 / Half: ₹90)',
  130,
  1,
  1,
  '["kofta","malai","creamy","special"]',
  117
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2218,
  21,
  4,
  'Paneer Butter Masala',
  'Cottage cheese simmered in buttery aromatic tomato gravy (Full: ₹150 / Half: ₹100)',
  150,
  1,
  1,
  '["paneer","butter","bestseller"]',
  118
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2219,
  21,
  4,
  'Paneer Shahi Korma',
  'Royal Mughlai style paneer cooked with dry fruits and saffron gravy (Full: ₹160 / Half: ₹100)',
  160,
  1,
  1,
  '["paneer","korma","rich"]',
  119
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2220,
  21,
  4,
  'Paneer Pasanda Badami',
  'Stuffed paneer sandwiches cooked in rich almond gravy (Full: ₹170 / Half: ₹110)',
  170,
  1,
  1,
  '["paneer","badam","chef-special"]',
  120
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2221,
  21,
  4,
  'Paneer Methi Malai',
  'Cottage cheese cooked with fresh fenugreek leaves and fresh cream (Full: ₹150 / Half: ₹100)',
  150,
  1,
  1,
  '["paneer","methi","creamy"]',
  121
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2222,
  21,
  4,
  'Paneer Bhurji',
  'Desi spiced crumbled paneer sauteed with onion, ginger and tomatoes (Full: ₹160 / Half: ₹110)',
  160,
  1,
  1,
  '["paneer","bhurji","protein","bestseller"]',
  122
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2223,
  21,
  4,
  'Paneer Do Pyaja',
  'Paneer cooked with double quantity of caramelized and crunchy onion petals (Full: ₹150 / Half: ₹100)',
  150,
  1,
  1,
  '["paneer","do pyaza"]',
  123
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2224,
  21,
  4,
  'Chilly Paneer',
  'Indo-Chinese spicy cottage cheese tossed with capsicum and dark soy (Full: ₹220 / Half: ₹110)',
  220,
  1,
  1,
  '["paneer","chinese","chilly","bestseller"]',
  124
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2225,
  21,
  4,
  'Paneer Makhni',
  'Velvety makhani gravy enriched with butter and tender paneer (Full: ₹150 / Half: ₹100)',
  150,
  1,
  1,
  '["paneer","makhni"]',
  125
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2226,
  21,
  4,
  'Paneer Lababdar',
  'Grated and cubed paneer in luscious tomato-onion masala (Full: ₹170 / Half: ₹110)',
  170,
  1,
  1,
  '["paneer","lababdar","popular"]',
  126
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2227,
  21,
  4,
  'Tawa Paneer Masala',
  'Spiced semi-dry paneer cooked on a hot iron tawa (Full: ₹160 / Half: ₹100)',
  160,
  1,
  1,
  '["paneer","tawa"]',
  127
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2228,
  21,
  4,
  'Paneer Aachari',
  'Tangy and flavorful pickle-spiced paneer curry (Full: ₹160 / Half: ₹100)',
  160,
  1,
  1,
  '["paneer","achari","spicy"]',
  128
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2229,
  21,
  4,
  'Mix Veg.',
  'Homestyle mixed seasonal vegetables in masala gravy (Full: ₹150 / Half: ₹80)',
  150,
  1,
  1,
  '["veg","healthy"]',
  129
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2230,
  21,
  4,
  'Mushroom Mutter',
  'Button mushrooms and tender green peas in spiced onion tomato gravy (Full: ₹140 / Half: ₹80)',
  140,
  1,
  1,
  '["mushroom","matar"]',
  130
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2231,
  21,
  4,
  'Kadai Mushroom',
  'Sauteed mushrooms with bell peppers and roasted kadai spices (Full: ₹150 / Half: ₹100)',
  150,
  1,
  1,
  '["mushroom","kadai","spicy"]',
  131
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2232,
  21,
  4,
  'Aloo Tamato',
  'Desi homestyle potato and tomato curry (Full: ₹100 / Half: ₹70)',
  100,
  1,
  1,
  '["aloo","curry"]',
  132
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2233,
  21,
  4,
  'Dam Aloo',
  'Baby potatoes slow simmered in rich Kashmiri style spicy gravy (Full: ₹100 / Half: ₹70)',
  100,
  1,
  1,
  '["dum aloo","desi"]',
  133
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2234,
  21,
  4,
  'Achari Aloo',
  'Tangy spiced potatoes tossed in pickling spices (Full: ₹100 / Half: ₹70)',
  100,
  1,
  1,
  '["aloo","achari"]',
  134
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2235,
  21,
  4,
  'Normal Gravy',
  'Bowl of savory spiced curry gravy (Full: ₹90 / Half: ₹60)',
  90,
  1,
  1,
  '["gravy"]',
  135
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2236,
  21,
  4,
  'Masala Gravy',
  'Thick spicy onion tomato masala gravy bowl (Full: ₹100 / Half: ₹60)',
  100,
  1,
  1,
  '["gravy","masala"]',
  136
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2237,
  21,
  4,
  'Kadai Gravy',
  'Spiced aromatic kadai gravy bowl (Full: ₹110 / Half: ₹60)',
  110,
  1,
  1,
  '["gravy","kadai"]',
  137
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2238,
  21,
  4,
  'Aloo Jeera',
  'Dry roasted potato cubes tempered with roasted cumin seeds and green chillies (Full: ₹100 / Half: ₹60)',
  100,
  1,
  1,
  '["aloo","jeera","dry"]',
  138
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2239,
  21,
  4,
  'Aloo Chokha',
  'Traditional rustic mashed potato preparation with mustard oil and spices',
  100,
  1,
  1,
  '["aloo","chokha","desi"]',
  139
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2240,
  21,
  4,
  'Tawa Roti',
  'Fresh whole wheat flatbread made on tawa',
  12,
  1,
  1,
  '["roti","tawa","wheat"]',
  140
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2241,
  21,
  4,
  'Tandoori Roti (Plain)',
  'Crisp whole wheat bread baked in clay tandoor',
  12,
  1,
  1,
  '["roti","tandoori"]',
  141
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2242,
  21,
  4,
  'Tandoori Butter Roti',
  'Hot tandoor baked roti brushed with pure Amul butter',
  15,
  1,
  1,
  '["roti","butter","popular"]',
  142
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2243,
  21,
  4,
  'Missi Roti',
  'Spiced gram flour (besan) and wheat bread baked in tandoor',
  20,
  1,
  1,
  '["roti","missi","healthy"]',
  143
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2244,
  21,
  4,
  'Plain Naan',
  'Soft leavened refined flour flatbread baked in tandoor',
  35,
  1,
  1,
  '["naan","tandoori"]',
  144
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2245,
  21,
  4,
  'Butter Naan',
  'Soft tandoori naan brushed generously with melted butter',
  50,
  1,
  1,
  '["naan","butter","bestseller"]',
  145
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2246,
  21,
  4,
  'Lacha Prantha',
  'Multi-layered flaky crispy tandoori paratha',
  40,
  1,
  1,
  '["paratha","laccha","crispy"]',
  146
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2247,
  21,
  4,
  'Pudina Prantha',
  'Flaky layered paratha flavored with fresh mint leaves',
  40,
  1,
  1,
  '["paratha","pudina"]',
  147
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2248,
  21,
  4,
  'Plain Prantha',
  'Golden tawa roasted whole wheat paratha',
  30,
  1,
  1,
  '["paratha","plain"]',
  148
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2249,
  21,
  4,
  'Aloo Prantha',
  'Whole wheat paratha stuffed with spiced mashed potato filling',
  30,
  1,
  1,
  '["paratha","aloo","breakfast","popular"]',
  149
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2250,
  21,
  4,
  'Aloo Pyaj Prantha',
  'Paratha stuffed with spiced potatoes and crunchy onions',
  30,
  1,
  1,
  '["paratha","aloo pyaz"]',
  150
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2251,
  21,
  4,
  'Gobhi Prantha',
  'Paratha stuffed with seasoned grated cauliflower',
  30,
  1,
  1,
  '["paratha","gobhi"]',
  151
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2252,
  21,
  4,
  'Paneer Prantha',
  'Paratha generously stuffed with spiced grated paneer',
  50,
  1,
  1,
  '["paratha","paneer","protein","bestseller"]',
  152
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2253,
  21,
  4,
  'Paneer Pyaj Prantha',
  'Paratha stuffed with fresh paneer and chopped onions',
  40,
  1,
  1,
  '["paratha","paneer pyaz"]',
  153
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2254,
  21,
  4,
  'Pyaz Prantha',
  'Whole wheat paratha stuffed with spiced onion filling',
  50,
  1,
  1,
  '["paratha","pyaz"]',
  154
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2255,
  21,
  4,
  'Egg Prantha',
  'Paratha layered with spiced beaten egg inside',
  50,
  0,
  1,
  '["paratha","egg","protein"]',
  155
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2256,
  21,
  4,
  'Stuffed Prantha',
  'Loaded mixed stuffed paratha with potatoes, paneer, and spices',
  60,
  1,
  1,
  '["paratha","stuffed"]',
  156
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2257,
  21,
  4,
  'Mix Prantha',
  'Special combination paratha with assorted fillings',
  60,
  1,
  1,
  '["paratha","mix","special"]',
  157
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2258,
  21,
  4,
  'Chicken Prantha (Gravy/Myo.)',
  'Jumbo paratha stuffed with spiced chicken mince served with gravy/mayo',
  120,
  0,
  1,
  '["paratha","chicken","protein","bestseller"]',
  158
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2259,
  21,
  4,
  'Butter Chicken',
  'Tandoori chicken pieces simmered in rich creamy tomato and butter gravy (Full: ₹450 / Half: ₹250)',
  450,
  0,
  1,
  '["chicken","butter chicken","rich","protein","bestseller"]',
  159
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2260,
  21,
  4,
  'Punjabi Chicken',
  'Spicy rustic Punjabi style chicken curry with whole spices (Full: ₹450 / Half: ₹250)',
  450,
  0,
  1,
  '["chicken","punjabi","spicy","protein"]',
  160
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2261,
  21,
  4,
  'Lemon Chicken',
  'Tangy and zesty chicken cooked in citrus herb gravy (Full: ₹450 / Half: ₹250)',
  450,
  0,
  1,
  '["chicken","lemon","protein"]',
  161
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2262,
  21,
  4,
  'Chicken Boneless',
  'Succulent boneless chicken breast chunks in thick spiced gravy (Full: ₹550 / Half: ₹300)',
  550,
  0,
  1,
  '["chicken","boneless","high protein","gym"]',
  162
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2263,
  21,
  4,
  'Kadai Chicken',
  'Chicken cooked with bell peppers and fresh ground coriander-chilli kadai masala (Full: ₹450 / Half: ₹250)',
  450,
  0,
  1,
  '["chicken","kadai","protein","popular"]',
  163
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2264,
  21,
  4,
  'Chilly Chicken',
  'Indo-Chinese style crispy battered chicken tossed with onions and capsicum (Full: ₹450 / Half: ₹250)',
  450,
  0,
  1,
  '["chicken","chilli","chinese","bestseller"]',
  164
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2265,
  21,
  4,
  'Tandori Lemon Chicken',
  'Tandoor roasted chicken tossed with tangy lemon glaze (Full: ₹450 / Half: ₹250)',
  450,
  0,
  1,
  '["chicken","tandoori","lemon","protein"]',
  165
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2266,
  21,
  4,
  'Home Style Chicken',
  'Homestyle comforting chicken curry with light gravy (Full: ₹450 / Half: ₹250)',
  450,
  0,
  1,
  '["chicken","homestyle","protein"]',
  166
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2267,
  21,
  4,
  'Tawa Chicken',
  'Semi-dry spiced chicken cooked on a heavy iron tawa (Full: ₹450 / Half: ₹250)',
  450,
  0,
  1,
  '["chicken","tawa","protein"]',
  167
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2268,
  21,
  4,
  'Masala Chicken (Thik Gravy)',
  'Chicken simmered in rich caramelized onion tomato thick gravy (Full: ₹450 / Half: ₹250)',
  450,
  0,
  1,
  '["chicken","masala","protein"]',
  168
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2269,
  21,
  4,
  'Chicken Rara (Lt.)',
  'Special combination of chicken chunks cooked with minced chicken keema gravy (Full: ₹500 / Half: ₹300)',
  500,
  0,
  1,
  '["chicken","rara","special","protein"]',
  169
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2270,
  21,
  4,
  'Chicken Rogan Josh',
  'Kashmiri style aromatic chicken curry with whole spices (Full: ₹500 / Half: ₹300)',
  500,
  0,
  1,
  '["chicken","rogan josh","protein"]',
  170
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2271,
  21,
  4,
  'Chicken Ki Gravi',
  'Aromatic seasoned chicken curry gravy bowl (Full: ₹120 / Half: ₹80)',
  120,
  0,
  1,
  '["chicken","gravy"]',
  171
);
INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  2272,
  21,
  4,
  'Chicken Making Preparation',
  'Custom preparation and cooking service for student provided chicken (1 Kg)',
  240,
  0,
  1,
  '["chicken","preparation","service"]',
  172
);
