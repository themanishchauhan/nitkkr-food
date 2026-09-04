export const RAHUL_FAST_FOOD_VENDOR = {
  id: 26,
  name: 'Rahul Fast Food',
  slug: 'rahul-fast-food',
  phone: '8307153423',
  whatsapp: '8307153423',
  address: 'NIT Gate, Kurukshetra',
  latitude: '29.946899791737764',
  longitude: '76.82261820501682',
  opensAt: '12:00',
  closesAt: '02:00',
  deliversTo: ['NITKKR campus all'],
  image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
  isActive: true,
  isFeatured: true,
  displayOrder: 6,
  createdAt: new Date()
};

export const RAHUL_FAST_FOOD_MENU_ITEMS = [
  // ================= ☕ BEVERAGES & CHAI (Category 3 / 8) =================
  {
    id: 2601,
    vendorId: 26,
    categoryId: 8,
    name: 'Simple Chai',
    description: 'Hot brewed milk tea made with ginger and cardamom',
    price: '15.00',
    isVeg: true,
    isAvailable: true,
    tags: ['chai', 'tea', 'beverage', 'under-50'],
    displayOrder: 1
  },
  {
    id: 2602,
    vendorId: 26,
    categoryId: 8,
    name: 'Kulhad Chai',
    description: 'Traditional earthen clay cup (kulhad) flavored aromatic masala tea',
    price: '20.00',
    isVeg: true,
    isAvailable: true,
    tags: ['chai', 'kulhad chai', 'tea', 'under-50', 'bestseller'],
    displayOrder: 2
  },
  {
    id: 2603,
    vendorId: 26,
    categoryId: 8,
    name: 'Hot Coffee',
    description: 'Fresh frothy hot coffee',
    price: '20.00',
    isVeg: true,
    isAvailable: true,
    tags: ['coffee', 'hot coffee', 'beverage', 'under-50'],
    displayOrder: 3
  },
  {
    id: 2604,
    vendorId: 26,
    categoryId: 3,
    name: 'Nimboo Pani',
    description: 'Refreshing chilled freshly squeezed lemon water with mint & black salt',
    price: '20.00',
    isVeg: true,
    isAvailable: true,
    tags: ['nimboo pani', 'lemonade', 'cooling', 'beverage', 'under-50'],
    displayOrder: 4
  },
  {
    id: 2605,
    vendorId: 26,
    categoryId: 3,
    name: 'Lemon Soda',
    description: 'Fizzy carbonated soda with fresh lemon juice and spiced masala',
    price: '40.00',
    isVeg: true,
    isAvailable: true,
    tags: ['lemon soda', 'soda', 'beverage', 'under-50'],
    displayOrder: 5
  },

  // ================= 🫓 PARATHAS & ROTI (Category 4) =================
  {
    id: 2606,
    vendorId: 26,
    categoryId: 4,
    name: 'Tawa Roti',
    description: 'Fresh soft whole wheat tawa roti',
    price: '12.00',
    isVeg: true,
    isAvailable: true,
    tags: ['roti', 'tawa roti', 'bread', 'under-50'],
    displayOrder: 6
  },
  {
    id: 2607,
    vendorId: 26,
    categoryId: 4,
    name: 'Plain Paratha',
    description: 'Crispy pan-fried layered tawa paratha',
    price: '25.00',
    isVeg: true,
    isAvailable: true,
    tags: ['paratha', 'plain paratha', 'under-50'],
    displayOrder: 7
  },
  {
    id: 2608,
    vendorId: 26,
    categoryId: 4,
    name: 'Aloo Pyaz Paratha',
    description: 'Golden tawa paratha stuffed with spiced mashed potatoes and chopped onions',
    price: '40.00',
    isVeg: true,
    isAvailable: true,
    tags: ['paratha', 'aloo pyaz', 'bestseller', 'under-50'],
    displayOrder: 8
  },
  {
    id: 2609,
    vendorId: 26,
    categoryId: 4,
    name: 'Gobhi Paratha',
    description: 'Stuffed paratha filled with seasoned grated cauliflower and spices',
    price: '45.00',
    isVeg: true,
    isAvailable: true,
    tags: ['paratha', 'gobhi paratha', 'under-50'],
    displayOrder: 9
  },
  {
    id: 2610,
    vendorId: 26,
    categoryId: 4,
    name: 'Mix Paratha',
    description: 'Hearty stuffed paratha with potato, cauliflower, onion and spices',
    price: '45.00',
    isVeg: true,
    isAvailable: true,
    tags: ['paratha', 'mix paratha', 'under-50'],
    displayOrder: 10
  },
  {
    id: 2611,
    vendorId: 26,
    categoryId: 4,
    name: 'Paneer Pyaz Paratha',
    description: 'Stuffed paratha loaded with spiced cottage cheese and crunchy onions',
    price: '50.00',
    isVeg: true,
    isAvailable: true,
    tags: ['paratha', 'paneer pyaz', 'protein', 'under-50'],
    displayOrder: 11
  },
  {
    id: 2612,
    vendorId: 26,
    categoryId: 4,
    name: 'Plain Paneer Paratha',
    description: 'Crispy paratha filled generously with grated seasoned paneer',
    price: '60.00',
    isVeg: true,
    isAvailable: true,
    tags: ['paratha', 'paneer paratha', 'protein'],
    displayOrder: 12
  },

  // ================= 🌯 ROLLS (Category 7 - Rolls & Wraps) =================
  {
    id: 2613,
    vendorId: 26,
    categoryId: 7,
    name: 'Veg Roll',
    description: 'Crispy flatbread wrapped around seasoned veggies and tangy chutney',
    price: '40.00',
    isVeg: true,
    isAvailable: true,
    tags: ['roll', 'veg roll', 'snack', 'under-50'],
    displayOrder: 13
  },
  {
    id: 2614,
    vendorId: 26,
    categoryId: 7,
    name: 'Egg Roll',
    description: 'Toasted paratha rolled with fresh spiced egg omelet and onions',
    price: '50.00',
    isVeg: false,
    isAvailable: true,
    tags: ['roll', 'egg roll', 'egg', 'protein', 'under-50', 'nonveg'],
    displayOrder: 14
  },
  {
    id: 2615,
    vendorId: 26,
    categoryId: 7,
    name: 'Paneer Roll',
    description: 'Warm crispy roll stuffed with spiced tawa paneer cubes and green chutney',
    price: '50.00',
    isVeg: true,
    isAvailable: true,
    tags: ['roll', 'paneer roll', 'protein', 'under-50'],
    displayOrder: 15
  },

  // ================= 🍜 MAGGI (Category 8 - Snacks) =================
  {
    id: 2616,
    vendorId: 26,
    categoryId: 8,
    name: 'Plain Maggi',
    description: 'Classic hot 2-minute masala Maggi noodles',
    price: '40.00',
    isVeg: true,
    isAvailable: true,
    tags: ['maggi', 'plain maggi', 'snack', 'under-50'],
    displayOrder: 16
  },
  {
    id: 2617,
    vendorId: 26,
    categoryId: 8,
    name: 'Veg Maggi',
    description: 'Masala Maggi tossed with peas, carrots, onions and spices',
    price: '50.00',
    isVeg: true,
    isAvailable: true,
    tags: ['maggi', 'veg maggi', 'snack', 'under-50'],
    displayOrder: 17
  },
  {
    id: 2618,
    vendorId: 26,
    categoryId: 8,
    name: 'Egg Maggi',
    description: 'Spicy Maggi noodles scrambled with fresh farm eggs',
    price: '60.00',
    isVeg: false,
    isAvailable: true,
    tags: ['maggi', 'egg maggi', 'egg', 'protein', 'nonveg'],
    displayOrder: 18
  },
  {
    id: 2619,
    vendorId: 26,
    categoryId: 8,
    name: 'Paneer Maggi',
    description: 'Loaded masala Maggi cooked with soft diced paneer cubes',
    price: '60.00',
    isVeg: true,
    isAvailable: true,
    tags: ['maggi', 'paneer maggi', 'protein', 'bestseller'],
    displayOrder: 19
  },

  // ================= 🍱 SPECIAL THALI (Category 4 - North Indian & Thali) =================
  {
    id: 2620,
    vendorId: 26,
    categoryId: 4,
    name: 'Special Thali',
    description: 'Complete Wholesome Student Meal: 4 Roti + Dal + Subji + Rice + Salad + Achaar',
    price: '99.00',
    isVeg: true,
    isAvailable: true,
    tags: ['thali', 'special thali', 'meal', 'lunch', 'dinner', 'under-100', 'bestseller'],
    displayOrder: 20
  }
];
