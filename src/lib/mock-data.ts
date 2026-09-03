import { FOOD_CAVE_VENDOR, FOOD_CAVE_MENU_ITEMS } from './food-cave-data';
import { APNA_FAST_FOOD_VENDOR, APNA_FAST_FOOD_MENU_ITEMS } from './apna-fast-food-data';
import { SURAJ_VENDOR, SURAJ_MENU_ITEMS } from './suraj-restaurant-data';
import { FOOD_POINT_VENDOR, FOOD_POINT_MENU_ITEMS } from './food-point-data';
import { HANGRY_CLUB_VENDOR, HANGRY_CLUB_MENU_ITEMS } from './hangry-club-data';
import { RAHUL_FAST_FOOD_VENDOR, RAHUL_FAST_FOOD_MENU_ITEMS } from './rahul-fast-food-data';
import { EAT_AND_FUN_VENDOR, EAT_AND_FUN_MENU_ITEMS } from './eat-and-fun-data';
import { CHEF_ON_FOOD_JUNCTION_VENDOR, CHEF_ON_FOOD_JUNCTION_MENU_ITEMS } from './chef-on-food-junction-data';
import { BAKERS_BITE_KKR_VENDOR, BAKERS_BITE_KKR_MENU_ITEMS } from './bakers-bite-kkr-data';

export { 
  FOOD_CAVE_VENDOR, 
  FOOD_CAVE_MENU_ITEMS, 
  APNA_FAST_FOOD_VENDOR, 
  APNA_FAST_FOOD_MENU_ITEMS, 
  SURAJ_VENDOR, 
  SURAJ_MENU_ITEMS,
  FOOD_POINT_VENDOR,
  FOOD_POINT_MENU_ITEMS,
  HANGRY_CLUB_VENDOR,
  HANGRY_CLUB_MENU_ITEMS,
  RAHUL_FAST_FOOD_VENDOR,
  RAHUL_FAST_FOOD_MENU_ITEMS,
  EAT_AND_FUN_VENDOR,
  EAT_AND_FUN_MENU_ITEMS,
  CHEF_ON_FOOD_JUNCTION_VENDOR,
  CHEF_ON_FOOD_JUNCTION_MENU_ITEMS,
  BAKERS_BITE_KKR_VENDOR,
  BAKERS_BITE_KKR_MENU_ITEMS
};

export const MOCK_CATEGORIES = [
  { id: 1, name: 'Fast Food', slug: 'fast-food', icon: '🍔', displayOrder: 1 },
  { id: 2, name: 'Chinese & Momos', slug: 'chinese', icon: '🥢', displayOrder: 2 },
  { id: 3, name: 'Beverages & Shakes', slug: 'beverages', icon: '🧋', displayOrder: 3 },
  { id: 4, name: 'North Indian & Thali', slug: 'north-indian', icon: '🍲', displayOrder: 4 },
  { id: 5, name: 'South Indian', slug: 'south-indian', icon: '🫓', displayOrder: 5 },
  { id: 6, name: 'Desserts & Sweets', slug: 'desserts', icon: '🍰', displayOrder: 6 },
  { id: 7, name: 'Rolls & Wraps', slug: 'rolls', icon: '🌯', displayOrder: 7 },
  { id: 8, name: 'Chai & Snacks', slug: 'chai-snacks', icon: '☕', displayOrder: 8 },
];

export const MOCK_VENDORS = [
  FOOD_CAVE_VENDOR,
  APNA_FAST_FOOD_VENDOR,
  SURAJ_VENDOR,
  FOOD_POINT_VENDOR,
  HANGRY_CLUB_VENDOR,
  RAHUL_FAST_FOOD_VENDOR,
  EAT_AND_FUN_VENDOR,
  CHEF_ON_FOOD_JUNCTION_VENDOR,
  BAKERS_BITE_KKR_VENDOR
];

export const MOCK_MENU_ITEMS = [
  ...FOOD_CAVE_MENU_ITEMS,
  ...APNA_FAST_FOOD_MENU_ITEMS,
  ...SURAJ_MENU_ITEMS,
  ...FOOD_POINT_MENU_ITEMS,
  ...HANGRY_CLUB_MENU_ITEMS,
  ...RAHUL_FAST_FOOD_MENU_ITEMS,
  ...EAT_AND_FUN_MENU_ITEMS,
  ...CHEF_ON_FOOD_JUNCTION_MENU_ITEMS,
  ...BAKERS_BITE_KKR_MENU_ITEMS
];

export const MOCK_REVIEWS = [
  { id: 1, menuItemId: 2109, studentName: 'Aarav S. (Hostel 4)', rating: 5, comment: 'Cold Coffee is super thick and refreshing. Great quality near Gate 2!', createdAt: new Date(Date.now() - 3600000 * 18).toISOString() },
  { id: 2, menuItemId: 2154, studentName: 'Priya Verma', rating: 5, comment: 'Chicken Roll with Egg is loaded and very tasty.', createdAt: new Date(Date.now() - 3600000 * 36).toISOString() },
  { id: 3, menuItemId: 2218, studentName: 'Rohan Gupta (Hostel 7)', rating: 5, comment: 'Paneer Butter Masala with Butter Naan is our go-to dinner order.', createdAt: new Date(Date.now() - 3600000 * 50).toISOString() },
  { id: 4, menuItemId: 2167, studentName: 'Divya M.', rating: 4, comment: 'Cheese Maggi is creamy and delicious comfort food.', createdAt: new Date(Date.now() - 3600000 * 72).toISOString() }
];

export function addVendorToMock(vendorData: any) {
  const existing = MOCK_VENDORS.find(v => v.id === vendorData.id || v.slug === vendorData.slug);
  if (!existing) {
    MOCK_VENDORS.unshift(vendorData);
  }
}
