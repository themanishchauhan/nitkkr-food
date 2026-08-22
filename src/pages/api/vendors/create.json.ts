import type { APIRoute } from 'astro';
import { db, schema } from '../../../lib/db';
import { addVendorToMock } from '../../../lib/mock-data';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, phone, address, opensAt, closesAt, whatsapp, deliversTo } = body;

    if (!name || !phone || !address) {
      return new Response(JSON.stringify({ error: 'Name, phone, and address are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'new-stall';

    const vendorData = {
      id: Date.now(),
      name,
      slug,
      phone: phone || '9876543210',
      whatsapp: whatsapp || phone || '9876543210',
      address: address || 'NITKKR Campus',
      opensAt: opensAt || '09:00',
      closesAt: closesAt || '23:00',
      isActive: true,
      isFeatured: false,
      deliversTo: deliversTo || ['All Hostels & Locations'],
      displayOrder: 99,
      image: '/placeholder-vendor.svg',
    };

    if (process.env.DATABASE_URL) {
      try {
        await db.insert(schema.vendors).values({
          name: vendorData.name,
          slug: vendorData.slug,
          phone: vendorData.phone,
          whatsapp: vendorData.whatsapp,
          address: vendorData.address,
          opensAt: vendorData.opensAt,
          closesAt: vendorData.closesAt,
          isActive: true,
          isFeatured: false,
          deliversTo: vendorData.deliversTo,
          displayOrder: 99,
          image: vendorData.image,
        });
      } catch (dbErr) {
        console.warn('DB insert fallback to mock store:', dbErr);
        addVendorToMock(vendorData);
      }
    } else {
      addVendorToMock(vendorData);
    }

    return new Response(JSON.stringify({ success: true, vendor: vendorData }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Create vendor API error:', error);
    return new Response(JSON.stringify({ error: 'Failed to create vendor', details: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
