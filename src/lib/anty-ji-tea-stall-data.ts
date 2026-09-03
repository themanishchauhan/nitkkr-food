export const ANTY_JI_TEA_STALL_VENDOR = {
  id: 33,
  name: 'Anty Ji Tea Stall',
  slug: 'anty-ji-tea-stall',
  phone: '7056688037',
  whatsapp: '7056688037',
  address: 'Near NIT Kurukshetra, Kurukshetra',
  latitude: '29.9676',
  longitude: '76.8818',
  opensAt: '07:00',
  closesAt: '22:00',
  deliversTo: ['NIT Main Gate', 'NIT Back Gate', 'Girls Hostel', 'Boys Hostel', 'Hostel Delivery'],
  image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=80',
  isActive: true,
  isFeatured: true,
  displayOrder: 13,
  createdAt: new Date()
};

export const ANTY_JI_TEA_STALL_MENU_ITEMS = [
  // ================= 🫓 PARATHAS (Category 8 - Chai & Snacks) =================
  {
    id: 3501,
    vendorId: 33,
    categoryId: 8,
    name: 'Paneer Paratha',
    description: 'Hot tawa paratha stuffed with freshly crumbled seasoned cottage cheese and butter',
    price: '40.00',
    isVeg: true,
    isAvailable: true,
    tags: ['paratha', 'paneer paratha', 'breakfast', 'under-50', 'bestseller'],
    displayOrder: 1
  },
  {
    id: 3502,
    vendorId: 33,
    categoryId: 8,
    name: 'Aloo Paratha',
    description: 'Golden whole wheat tawa paratha packed with spiced mashed potatoes',
    price: '35.00',
    isVeg: true,
    isAvailable: true,
    tags: ['paratha', 'aloo paratha', 'breakfast', 'under-50'],
    displayOrder: 2
  },
  {
    id: 3503,
    vendorId: 33,
    categoryId: 8,
    name: 'Aloo Pyaz Paratha',
    description: 'Crispy tawa paratha stuffed with spiced potatoes and chopped onions',
    price: '35.00',
    isVeg: true,
    isAvailable: true,
    tags: ['paratha', 'aloo pyaz', 'breakfast', 'under-50', 'bestseller'],
    displayOrder: 3
  },
  {
    id: 3504,
    vendorId: 33,
    categoryId: 8,
    name: 'Egg Paratha',
    description: 'Layered tawa paratha cooked with egg bhurji and onions (Single Egg: ₹40 / Double Egg: ₹50)',
    price: '40.00',
    isVeg: false,
    isAvailable: true,
    tags: ['paratha', 'egg paratha', 'egg', 'eggs', 'protein', 'under-50'],
    displayOrder: 4
  },

  // ================= 🌯 ROLLS & PANEER SPECIALS =================
  {
    id: 3505,
    vendorId: 33,
    categoryId: 7,
    name: 'Paneer Roll',
    description: 'Crisp paratha wrap loaded with spiced paneer cubes and chutneys',
    price: '50.00',
    isVeg: true,
    isAvailable: true,
    tags: ['roll', 'paneer roll', 'snack', 'under-50', 'bestseller'],
    displayOrder: 5
  },
  {
    id: 3506,
    vendorId: 33,
    categoryId: 7,
    name: 'Egg Roll',
    description: 'Flaky paratha rolled with seasoned egg omelet and crunchy onions (Single: ₹40 / Double: ₹50)',
    price: '40.00',
    isVeg: false,
    isAvailable: true,
    tags: ['roll', 'egg roll', 'egg', 'eggs', 'under-50'],
    displayOrder: 6
  },
  {
    id: 3507,
    vendorId: 33,
    categoryId: 4,
    name: 'Paneer Bhurji',
    description: 'Fresh scrambled cottage cheese cooked with onions, tomatoes and green chilies (Half: ₹120 / Full: ₹180)',
    price: '120.00',
    isVeg: true,
    isAvailable: true,
    tags: ['paneer bhurji', 'paneer', 'curry', 'bestseller'],
    displayOrder: 7
  },

  // ================= 🍳 EGG DISHES (Category 7 / 4) =================
  {
    id: 3508,
    vendorId: 33,
    categoryId: 7,
    name: 'Bread Omelette',
    description: 'Toasted bread sandwiched with double egg masala omelet',
    price: '40.00',
    isVeg: false,
    isAvailable: true,
    tags: ['bread omelette', 'omelet', 'egg', 'eggs', 'breakfast', 'under-50'],
    displayOrder: 8
  },
  {
    id: 3509,
    vendorId: 33,
    categoryId: 7,
    name: 'Masala Omelette',
    description: 'Fluffy egg omelet seasoned with onions, green chilies, and black pepper',
    price: '30.00',
    isVeg: false,
    isAvailable: true,
    tags: ['omelet', 'egg', 'eggs', 'under-50'],
    displayOrder: 9
  },

  // ================= 🥟 SNACKS & PAKODAS (Category 8) =================
  {
    id: 3510,
    vendorId: 33,
    categoryId: 8,
    name: 'Bread Pakoda',
    description: 'Crispy fried bread fritter stuffed with spiced potato masala and green chutney',
    price: '15.00',
    isVeg: true,
    isAvailable: true,
    tags: ['bread pakoda', 'snack', 'tea time', 'under-50'],
    displayOrder: 10
  },
  {
    id: 3511,
    vendorId: 33,
    categoryId: 8,
    name: 'Samosa',
    description: 'Crisp flaky pastry filled with savory spiced potatoes and peas',
    price: '15.00',
    isVeg: true,
    isAvailable: true,
    tags: ['samosa', 'snack', 'tea time', 'under-50', 'bestseller'],
    displayOrder: 11
  },
  {
    id: 3512,
    vendorId: 33,
    categoryId: 8,
    name: 'Mix Veg Pakoda (1 Kg)',
    description: 'Fresh crispy assorted vegetable pakodas fried golden with gram flour and chaat masala',
    price: '150.00',
    isVeg: true,
    isAvailable: true,
    tags: ['pakoda', 'mix pakoda', 'snack', 'bestseller'],
    displayOrder: 12
  },

  // ================= 🍜 MAGGI & RICE (Category 1 & 4) =================
  {
    id: 3513,
    vendorId: 33,
    categoryId: 1,
    name: 'Plain Maggi',
    description: 'Classic comforting hot 2-minute masala Maggi',
    price: '30.00',
    isVeg: true,
    isAvailable: true,
    tags: ['maggi', 'plain maggi', 'under-50'],
    displayOrder: 13
  },
  {
    id: 3514,
    vendorId: 33,
    categoryId: 1,
    name: 'Veg Maggi',
    description: 'Masala Maggi tossed with chopped onions, tomatoes, and vegetables',
    price: '40.00',
    isVeg: true,
    isAvailable: true,
    tags: ['maggi', 'veg maggi', 'under-50', 'bestseller'],
    displayOrder: 14
  },
  {
    id: 3515,
    vendorId: 33,
    categoryId: 4,
    name: 'Veg Fried Rice',
    description: 'Wok tossed basmati rice with vegetables, soy sauce, and aromatic spices',
    price: '100.00',
    isVeg: true,
    isAvailable: true,
    tags: ['fried rice', 'rice', 'chinese'],
    displayOrder: 15
  },

  // ================= ☕ TEA & BEVERAGES (Category 3 & 8) =================
  {
    id: 3516,
    vendorId: 33,
    categoryId: 8,
    name: 'Special Kadak Chai',
    description: 'Freshly brewed hot milk tea infused with crushed ginger and cardamom',
    price: '15.00',
    isVeg: true,
    isAvailable: true,
    tags: ['tea', 'chai', 'hot beverage', 'under-50', 'bestseller'],
    displayOrder: 16
  },
  {
    id: 3517,
    vendorId: 33,
    categoryId: 8,
    name: 'Hot Coffee',
    description: 'Steaming rich frothy milk coffee',
    price: '20.00',
    isVeg: true,
    isAvailable: true,
    tags: ['coffee', 'hot coffee', 'under-50'],
    displayOrder: 17
  },
  {
    id: 3518,
    vendorId: 33,
    categoryId: 3,
    name: 'Nimbu Pani (Fresh Lime)',
    description: 'Refreshing sweet and salty fresh lemon water cooler',
    price: '20.00',
    isVeg: true,
    isAvailable: true,
    tags: ['nimbu pani', 'lemonade', 'beverage', 'under-50'],
    displayOrder: 18
  },

  // ================= 🍱 MEALS & TIFFIN (Category 4 - North Indian & Thali) =================
  {
    id: 3519,
    vendorId: 33,
    categoryId: 4,
    name: 'Veg Thali',
    description: 'Homestyle comforting meal with Dal, seasonal Sabzi, Roti, Rice, and Salad',
    price: '90.00',
    isVeg: true,
    isAvailable: true,
    tags: ['thali', 'veg thali', 'meal', 'bestseller'],
    displayOrder: 19
  },
  {
    id: 3520,
    vendorId: 33,
    categoryId: 4,
    name: 'Tiffin',
    description: 'Homestyle student meal consisting of Dal, Sabzi, Roti, Rice, and Salad',
    price: '90.00',
    isVeg: true,
    isAvailable: true,
    tags: ['tiffin', 'tiffin service', 'meal', 'ghar jaisa', 'bestseller'],
    displayOrder: 20
  }
];
