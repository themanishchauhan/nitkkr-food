import { db, schema } from '../src/lib/db';
import { MOCK_CATEGORIES, MOCK_VENDORS, MOCK_MENU_ITEMS } from '../src/lib/mock-data';

export async function seedDatabase() {
  console.log('Seeding database with 20 NITKKR vendors data...');
  if (!process.env.DATABASE_URL) {
    console.log('No DATABASE_URL configured. Mock fallback data is enabled.');
    return;
  }

  try {
    // Insert categories
    for (const cat of MOCK_CATEGORIES) {
      await db.insert(schema.categories).values(cat).onConflictDoNothing();
    }
    console.log(`Seeded ${MOCK_CATEGORIES.length} categories.`);

    // Insert vendors
    for (const vendor of MOCK_VENDORS) {
      const { createdAt, ...vData } = vendor;
      await db.insert(schema.vendors).values(vData).onConflictDoNothing();
    }
    console.log(`Seeded ${MOCK_VENDORS.length} vendors.`);

    // Insert menu items
    for (const item of MOCK_MENU_ITEMS) {
      const { categoryName, categorySlug, categoryIcon, createdAt, ...itemData } = item as any;
      await db.insert(schema.menuItems).values(itemData).onConflictDoNothing();
    }
    console.log(`Seeded ${MOCK_MENU_ITEMS.length} menu items successfully.`);
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().then(() => process.exit(0));
}
