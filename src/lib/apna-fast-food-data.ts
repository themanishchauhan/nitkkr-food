export const APNA_FAST_FOOD_VENDOR = {
  id: 22,
  name: 'Apna Fresh Fast Food',
  slug: 'apna-fast-food',
  phone: '9992010548',
  whatsapp: '7082497764',
  address: 'Front of NIT Main Gate, Kurukshetra',
  latitude: '29.9670',
  longitude: '76.8815',
  opensAt: '08:00',
  closesAt: '23:00',
  deliversTo: ['NITKKR campus all'],
  image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
  isActive: true,
  isFeatured: true,
  displayOrder: 2,
  createdAt: new Date()
};

export const APNA_FAST_FOOD_MENU_ITEMS = [
  // ================= ☕ DRINKS & BEVERAGES (Category 8 / 3) =================
  {
    id: 2201,
    vendorId: 22,
    categoryId: 8,
    name: 'Tea',
    description: 'Freshly brewed hot kadak tea / campus chai',
    price: '10.00',
    isVeg: true,
    isAvailable: true,
    tags: ['chai', 'tea', 'hot', 'pocket-friendly', 'under-50'],
    displayOrder: 1
  },
  {
    id: 2202,
    vendorId: 22,
    categoryId: 8,
    name: 'Doodh Patti',
    description: 'Rich and strong milk tea brewed with whole milk',
    price: '15.00',
    isVeg: true,
    isAvailable: true,
    tags: ['tea', 'chai', 'doodh patti', 'milk tea', 'under-50'],
    displayOrder: 2
  },
  {
    id: 2203,
    vendorId: 22,
    categoryId: 3,
    name: 'Hot Coffee',
    description: 'Hot frothy instant campus coffee',
    price: '20.00',
    isVeg: true,
    isAvailable: true,
    tags: ['coffee', 'hot', 'beverage', 'under-50'],
    displayOrder: 3
  },
  {
    id: 2204,
    vendorId: 22,
    categoryId: 3,
    name: 'Lemon Water',
    description: 'Freshly squeezed refreshing nimbu pani with spices',
    price: '15.00',
    isVeg: true,
    isAvailable: true,
    tags: ['lemon water', 'nimbu pani', 'refreshing', 'cold', 'under-50'],
    displayOrder: 4
  },
  {
    id: 2205,
    vendorId: 22,
    categoryId: 3,
    name: 'Lemon Soda',
    description: 'Chilled fizzy fresh lemon soda with masala',
    price: '30.00',
    isVeg: true,
    isAvailable: true,
    tags: ['lemon soda', 'soda', 'fizzy', 'cold', 'under-50'],
    displayOrder: 5
  },
  {
    id: 2206,
    vendorId: 22,
    categoryId: 3,
    name: 'Soft Drinks',
    description: 'Chilled cold drink bottle / can (MRP)',
    price: '40.00',
    isVeg: true,
    isAvailable: true,
    tags: ['cold drink', 'soft drink', 'soda', 'under-50'],
    displayOrder: 6
  },

  // ================= 🍔 BURGERS (Category 1 - Fast Food) =================
  {
    id: 2207,
    vendorId: 22,
    categoryId: 1,
    name: 'Veg Burger',
    description: 'Crispy spiced vegetable patty burger with fresh veggies and tangy sauce',
    price: '30.00',
    isVeg: true,
    isAvailable: true,
    tags: ['burger', 'veg burger', 'fast food', 'snack', 'under-50'],
    displayOrder: 7
  },
  {
    id: 2208,
    vendorId: 22,
    categoryId: 1,
    name: 'Paneer Burger',
    description: 'Loaded burger with juicy spiced paneer slice and creamy dressing',
    price: '40.00',
    isVeg: true,
    isAvailable: true,
    tags: ['burger', 'paneer burger', 'paneer', 'protein', 'under-50'],
    displayOrder: 8
  },
  {
    id: 2209,
    vendorId: 22,
    categoryId: 1,
    name: 'Cheese Burger',
    description: 'Delicious grilled burger topped with melted cheese and crispy patty',
    price: '50.00',
    isVeg: true,
    isAvailable: true,
    tags: ['burger', 'cheese burger', 'cheese', 'bestseller', 'under-50'],
    displayOrder: 9
  },

  // ================= 🍜 MAGGI (Category 1 - Fast Food) =================
  {
    id: 2210,
    vendorId: 22,
    categoryId: 1,
    name: 'Plain Maggi',
    description: 'Classic hot 2-minute campus comfort noodles',
    price: '30.00',
    isVeg: true,
    isAvailable: true,
    tags: ['maggi', 'maggie', 'noodles', 'under-50', 'comfort-food'],
    displayOrder: 10
  },
  {
    id: 2211,
    vendorId: 22,
    categoryId: 1,
    name: 'Mix Veg Maggi',
    description: 'Maggi tossed with fresh green peas, onions, tomatoes and capsicum',
    price: '40.00',
    isVeg: true,
    isAvailable: true,
    tags: ['maggi', 'veg maggi', 'vegetable', 'noodles', 'under-50'],
    displayOrder: 11
  },
  {
    id: 2212,
    vendorId: 22,
    categoryId: 1,
    name: 'Paneer Maggi',
    description: 'Loaded spicy Maggi topped with soft paneer cubes and butter',
    price: '50.00',
    isVeg: true,
    isAvailable: true,
    tags: ['maggi', 'paneer maggi', 'paneer', 'protein', 'under-50'],
    displayOrder: 12
  },
  {
    id: 2213,
    vendorId: 22,
    categoryId: 1,
    name: 'Tandoori Maggi',
    description: 'Smoky tandoori flavored Maggi cooked with special tandoori sauce',
    price: '50.00',
    isVeg: true,
    isAvailable: true,
    tags: ['maggi', 'tandoori maggi', 'smoky', 'spicy', 'under-50'],
    displayOrder: 13
  },
  {
    id: 2214,
    vendorId: 22,
    categoryId: 1,
    name: 'Extra Cheese (Add-on)',
    description: 'Add a rich layer of melted cheese to your Maggi, Burger or Paratha',
    price: '10.00',
    isVeg: true,
    isAvailable: true,
    tags: ['cheese', 'add-on', 'extra cheese', 'under-50'],
    displayOrder: 14
  },

  // ================= 🫓 STREET SNACKS (Category 8 - Chai & Snacks) =================
  {
    id: 2215,
    vendorId: 22,
    categoryId: 8,
    name: 'Special Bhelpuri',
    description: 'Crispy puffed rice mixed with tangy tamarind chutney, onions, sev and lemon',
    price: '40.00',
    isVeg: true,
    isAvailable: true,
    tags: ['bhelpuri', 'bhel', 'chaat', 'street snack', 'crispy', 'under-50'],
    displayOrder: 15
  },

  // ================= 🍲 PARATHA (Category 4 - North Indian & Thali) =================
  {
    id: 2216,
    vendorId: 22,
    categoryId: 4,
    name: 'Aaloo Paratha',
    description: 'Crispy golden tawa paratha stuffed with seasoned mashed potatoes',
    price: '25.00',
    isVeg: true,
    isAvailable: true,
    tags: ['paratha', 'aaloo paratha', 'aloo paratha', 'desi', 'under-50'],
    displayOrder: 16
  },
  {
    id: 2217,
    vendorId: 22,
    categoryId: 4,
    name: 'Aaloo Payaaz Paratha',
    description: 'Stuffed paratha with spiced potatoes and crunchy chopped onions',
    price: '30.00',
    isVeg: true,
    isAvailable: true,
    tags: ['paratha', 'aaloo pyaz', 'aloo pyaaz', 'desi', 'under-50'],
    displayOrder: 17
  },
  {
    id: 2218,
    vendorId: 22,
    categoryId: 4,
    name: 'Gobhi Paratha',
    description: 'Tawa roasted paratha stuffed with grated spiced cauliflower',
    price: '35.00',
    isVeg: true,
    isAvailable: true,
    tags: ['paratha', 'gobhi paratha', 'cauliflower', 'under-50'],
    displayOrder: 18
  },
  {
    id: 2219,
    vendorId: 22,
    categoryId: 4,
    name: 'Paneer Payaaz Paratha',
    description: 'Hearty paratha stuffed with fresh grated paneer, onions and green chillies',
    price: '40.00',
    isVeg: true,
    isAvailable: true,
    tags: ['paratha', 'paneer pyaz', 'paneer payaaz', 'protein', 'under-50'],
    displayOrder: 19
  },
  {
    id: 2220,
    vendorId: 22,
    categoryId: 4,
    name: 'Paneer Paratha',
    description: 'Generously loaded pure paneer stuffed paratha roasted with butter',
    price: '50.00',
    isVeg: true,
    isAvailable: true,
    tags: ['paratha', 'paneer paratha', 'pure paneer', 'protein', 'bestseller', 'under-50'],
    displayOrder: 20
  },

  // ================= 🥪 SANDWICHES (Category 1 - Fast Food) =================
  {
    id: 2221,
    vendorId: 22,
    categoryId: 1,
    name: 'Grilled Sandwich',
    description: 'Crispy golden grilled bread stuffed with seasoned veggies and green chutney',
    price: '40.00',
    isVeg: true,
    isAvailable: true,
    tags: ['sandwich', 'grilled sandwich', 'snack', 'under-50'],
    displayOrder: 21
  },
  {
    id: 2222,
    vendorId: 22,
    categoryId: 1,
    name: 'Paneer Sandwich',
    description: 'Grilled sandwich loaded with seasoned paneer cubes and special spices',
    price: '50.00',
    isVeg: true,
    isAvailable: true,
    tags: ['sandwich', 'paneer sandwich', 'paneer', 'protein', 'under-50'],
    displayOrder: 22
  },
  {
    id: 2223,
    vendorId: 22,
    categoryId: 1,
    name: 'Corn Mix Veg Sandwich',
    description: 'Sweet corn kernels and crunchy mixed vegetables grilled to perfection',
    price: '40.00',
    isVeg: true,
    isAvailable: true,
    tags: ['sandwich', 'corn sandwich', 'mix veg', 'under-50'],
    displayOrder: 23
  },

  // ================= 🥟 PATTIES (Category 8 - Chai & Snacks) =================
  {
    id: 2224,
    vendorId: 22,
    categoryId: 8,
    name: 'Aaloo Patties',
    description: 'Flaky puff pastry stuffed with spiced potato filling',
    price: '15.00',
    isVeg: true,
    isAvailable: true,
    tags: ['patties', 'aaloo patties', 'puff', 'snack', 'pocket-friendly', 'under-50'],
    displayOrder: 24
  },
  {
    id: 2225,
    vendorId: 22,
    categoryId: 8,
    name: 'Cream Patties',
    description: 'Hot flaky patties loaded with rich mayonnaise and seasoning',
    price: '30.00',
    isVeg: true,
    isAvailable: true,
    tags: ['patties', 'cream patties', 'mayo', 'under-50'],
    displayOrder: 25
  },
  {
    id: 2226,
    vendorId: 22,
    categoryId: 8,
    name: 'Cheese Patties',
    description: 'Oven-baked crispy puff pastry loaded with melted cheese',
    price: '40.00',
    isVeg: true,
    isAvailable: true,
    tags: ['patties', 'cheese patties', 'cheese', 'under-50'],
    displayOrder: 26
  },
  {
    id: 2227,
    vendorId: 22,
    categoryId: 8,
    name: 'Namkin Patties',
    description: 'Crispy patties filled with savory namkeen mixture and spicy chutneys',
    price: '40.00',
    isVeg: true,
    isAvailable: true,
    tags: ['patties', 'namkin patties', 'namkeen', 'under-50'],
    displayOrder: 27
  },

  // ================= 🌯 WRAPS & ROLLS (Category 7 - Rolls & Wraps) =================
  {
    id: 2228,
    vendorId: 22,
    categoryId: 7,
    name: 'Aaloo Wrap',
    description: 'Soft toasted wrap rolled with spiced potato filling and sauces',
    price: '30.00',
    isVeg: true,
    isAvailable: true,
    tags: ['wrap', 'aaloo wrap', 'aloo wrap', 'roll', 'under-50'],
    displayOrder: 28
  },
  {
    id: 2229,
    vendorId: 22,
    categoryId: 7,
    name: 'Veg Wrap',
    description: 'Toasted roll stuffed with crunchy mixed vegetables, mint sauce and onions',
    price: '40.00',
    isVeg: true,
    isAvailable: true,
    tags: ['wrap', 'veg wrap', 'roll', 'under-50'],
    displayOrder: 29
  },
  {
    id: 2230,
    vendorId: 22,
    categoryId: 7,
    name: 'Paneer Wrap',
    description: 'Loaded soft wrap rolled with marinated paneer, spicy mayo and crisp onions',
    price: '50.00',
    isVeg: true,
    isAvailable: true,
    tags: ['wrap', 'paneer wrap', 'paneer roll', 'protein', 'bestseller', 'under-50'],
    displayOrder: 30
  }
];
