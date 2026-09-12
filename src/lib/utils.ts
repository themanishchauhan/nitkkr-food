/**
 * Orandus - Centralized Utility Functions
 * Unified across SSR, Client, API, and UI components
 */

/**
 * Slugs of verified 100% Pure Vegetarian vendors on campus
 */
export const PURE_VEG_VENDOR_SLUGS = new Set([
  'apna-fast-food',
  'apna-fresh-fast-food',
  'bakers-bite-kkr',
  'bakers-bite',
  'yummy-tummy-foods',
  'yummy-tummy',
  'pizza-king'
]);

/**
 * Determine if a vendor is 100% Pure Vegetarian (Zomato-style classification)
 */
export function isPureVegVendor(vendor: { slug?: string; name?: string; isPureVeg?: boolean } | null | undefined): boolean {
  if (!vendor) return false;
  if (typeof vendor.isPureVeg === 'boolean') return vendor.isPureVeg;
  if (vendor.slug && PURE_VEG_VENDOR_SLUGS.has(vendor.slug.toLowerCase())) return true;
  const name = (vendor.name || '').toLowerCase();
  if (name.includes('apna') || name.includes('bakers bite') || name.includes('yummy tummy') || name.includes('pizza king')) {
    return true;
  }
  return false;
}

/**
 * Format 24-hour time ('09:00', '23:30', '13:00:00') into 12-hour AM/PM Indian format ('9:00 AM', '11:30 PM')
 */
export function formatTime12h(timeStr: string | null | undefined): string {
  if (!timeStr) return '';
  const clean = timeStr.trim();
  const parts = clean.split(':');
  if (parts.length < 2) return clean;
  let hour = parseInt(parts[0], 10);
  const minute = parts[1].padStart(2, '0');
  if (isNaN(hour)) return clean;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${hour}:${minute} ${ampm}`;
}

/**
 * Format vendor operating hours ('09:00:00', '23:30:00' -> '9:00 AM – 11:30 PM')
 */
export function formatOperatingHours(opensAt: string | null | undefined, closesAt: string | null | undefined): string {
  if (!opensAt || !closesAt) return 'Hours not specified';
  const openFormatted = formatTime12h(opensAt);
  const closeFormatted = formatTime12h(closesAt);
  if (!openFormatted || !closeFormatted) return 'Hours not specified';
  return `${openFormatted} – ${closeFormatted}`;
}

/**
 * Robust Indian Standard Time (IST, UTC+5:30) check if vendor is currently open
 * Handles regular hours and overnight hours (e.g. 18:00 to 03:00) consistently
 */
export function isVendorOpen(opensAt: string | null | undefined, closesAt: string | null | undefined, now?: Date): boolean {
  if (!opensAt || !closesAt) return true;

  // Use IST timezone (Asia/Kolkata)
  const currentDate = now || new Date();
  const istFormatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  const istTimeString = istFormatter.format(currentDate); // "14:30"
  const [currentH, currentM] = istTimeString.split(':').map(Number);
  const currentTotal = currentH * 60 + currentM;

  const [openH, openM] = opensAt.split(':').map(Number);
  const [closeH, closeM] = closesAt.split(':').map(Number);

  if (isNaN(openH) || isNaN(openM) || isNaN(closeH) || isNaN(closeM)) return true;

  const openTotal = openH * 60 + openM;
  const closeTotal = closeH * 60 + closeM;

  // Normal daytime hours (e.g., 09:00 to 22:00)
  if (openTotal < closeTotal) {
    return currentTotal >= openTotal && currentTotal < closeTotal;
  }

  // Overnight hours (e.g., 18:00 to 02:00 next day)
  if (openTotal > closeTotal) {
    return currentTotal >= openTotal || currentTotal < closeTotal;
  }

  // 24 hours open
  return true;
}

export interface VendorTimingStatus {
  isOpen: boolean;
  statusText: string;
  isUrgent: boolean;
}

/**
 * Compute dynamic human-friendly timing status:
 * - "Hurry up, closing soon" (if <= 45m left)
 * - "Open until 11:30 PM" (when open normally)
 * - "Opens in an hour" (if <= 60m until opening)
 * - "Opens at 8:00 AM" (when closed)
 */
export function getVendorTimingStatus(
  opensAt: string | null | undefined,
  closesAt: string | null | undefined,
  now?: Date,
  closedDays?: string[] | string | null
): VendorTimingStatus {
  if (!opensAt || !closesAt) {
    return { isOpen: true, statusText: 'Open Today', isUrgent: false };
  }

  const currentDate = now || new Date();
  // Compute IST date (UTC + 5:30)
  const istOffsetMs = 330 * 60 * 1000;
  const istTimeMs = currentDate.getTime() + (currentDate.getTimezoneOffset() * 60 * 1000) + istOffsetMs;
  const istDate = new Date(istTimeMs);
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDayName = dayNames[istDate.getDay()];

  // Check if today is a scheduled weekly closed day
  let closedDaysList: string[] = [];
  if (Array.isArray(closedDays)) {
    closedDaysList = closedDays;
  } else if (typeof closedDays === 'string' && closedDays.trim()) {
    try {
      const parsed = JSON.parse(closedDays);
      if (Array.isArray(parsed)) closedDaysList = parsed;
      else closedDaysList = [closedDays];
    } catch {
      closedDaysList = closedDays.split(',').map(s => s.trim());
    }
  }

  const isClosedToday = closedDaysList.some(d => d.trim().toLowerCase() === currentDayName.toLowerCase());
  if (isClosedToday) {
    return {
      isOpen: false,
      statusText: `Closed on ${currentDayName}s`,
      isUrgent: false,
    };
  }

  // Compute IST minutes accurately
  const utcMinutes = currentDate.getUTCHours() * 60 + currentDate.getUTCMinutes() + 330;
  const currentTotal = (utcMinutes % 1440 + 1440) % 1440;

  const [openH, openM] = opensAt.split(':').map(Number);
  const [closeH, closeM] = closesAt.split(':').map(Number);

  if (isNaN(openH) || isNaN(openM) || isNaN(closeH) || isNaN(closeM)) {
    return { isOpen: true, statusText: 'Open Today', isUrgent: false };
  }

  const openTotal = openH * 60 + openM;
  const closeTotal = closeH * 60 + closeM;
  const openTimeFormatted = formatTime12h(opensAt);
  const closeTimeFormatted = formatTime12h(closesAt);

  // Normal same-day hours (e.g., 08:00 to 23:00)
  if (openTotal < closeTotal) {
    const isOpen = currentTotal >= openTotal && currentTotal < closeTotal;

    if (isOpen) {
      const minutesUntilClose = closeTotal - currentTotal;
      if (minutesUntilClose <= 45) {
        return { isOpen: true, statusText: 'Hurry up, closing soon', isUrgent: true };
      }
      if (minutesUntilClose <= 75) {
        return { isOpen: true, statusText: 'Closes in ~1 hour', isUrgent: true };
      }
      return { isOpen: true, statusText: `Until ${closeTimeFormatted}`, isUrgent: false };
    } else {
      let minutesUntilOpen: number;
      if (currentTotal < openTotal) {
        minutesUntilOpen = openTotal - currentTotal;
      } else {
        minutesUntilOpen = (1440 - currentTotal) + openTotal;
      }

      if (minutesUntilOpen <= 60) {
        return { isOpen: false, statusText: 'Opens in an hour', isUrgent: false };
      }
      return { isOpen: false, statusText: `Opens at ${openTimeFormatted}`, isUrgent: false };
    }
  }

  // Overnight hours (e.g., 18:00 to 02:00 next day)
  if (openTotal > closeTotal) {
    const isOpen = currentTotal >= openTotal || currentTotal < closeTotal;

    if (isOpen) {
      const minutesUntilClose = currentTotal >= openTotal
        ? (1440 - currentTotal) + closeTotal
        : closeTotal - currentTotal;

      if (minutesUntilClose <= 45) {
        return { isOpen: true, statusText: 'Hurry up, closing soon', isUrgent: true };
      }
      if (minutesUntilClose <= 75) {
        return { isOpen: true, statusText: 'Closes in ~1 hour', isUrgent: true };
      }
      return { isOpen: true, statusText: `Until ${closeTimeFormatted}`, isUrgent: false };
    } else {
      const minutesUntilOpen = openTotal - currentTotal;
      if (minutesUntilOpen <= 60) {
        return { isOpen: false, statusText: 'Opens in an hour', isUrgent: false };
      }
      return { isOpen: false, statusText: `Opens at ${openTimeFormatted}`, isUrgent: false };
    }
  }

  // 24 hours open
  return { isOpen: true, statusText: 'Open 24 Hours', isUrgent: false };
}

/**
 * Format price in Indian Rupee format
 */
export function formatPrice(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined) return '₹0';
  const num = typeof amount === 'number' ? amount : parseFloat(String(amount));
  if (isNaN(num)) return '₹0';
  return `₹${Math.round(num)}`;
}

/**
 * Format review ratings with 1 decimal place (e.g., '4.8')
 */
export function formatRating(rating: number | string | null | undefined): string {
  if (rating === null || rating === undefined) return '';
  const num = typeof rating === 'number' ? rating : parseFloat(String(rating));
  if (isNaN(num) || num <= 0) return '';
  return num.toFixed(1);
}

/**
 * Sanitize telephone number link to prevent double +91 prefixes (e.g. 'tel:+919896475885')
 */
export function cleanTelHref(phone: string | null | undefined, defaultPhone = '9896475885'): string {
  if (!phone) return `tel:+91${defaultPhone}`;
  const digits = phone.replace(/\D/g, '');
  let clean10 = digits.startsWith('91') && digits.length === 12 ? digits.slice(2) : digits;
  if (clean10.length === 9) clean10 = `${clean10}0`;
  return `tel:+91${clean10 || defaultPhone}`;
}

/**
 * Sanitize WhatsApp chat link with optional pre-filled text
 */
export function cleanWhatsAppHref(phone: string | null | undefined, text = 'Hi! I found your menu on Orandus and would like to check availability.', defaultPhone = '9896475885'): string {
  const digits = (phone || '').replace(/\D/g, '');
  let clean10 = digits.startsWith('91') && digits.length === 12 ? digits.slice(2) : digits;
  if (clean10.length === 9) clean10 = `${clean10}0`;
  const num = clean10 || defaultPhone;
  return `https://wa.me/91${num}?text=${encodeURIComponent(text)}`;
}

/**
 * Clean phone number for display (e.g. '+91 98964 75885')
 */
export function cleanDisplayPhone(phone: string | null | undefined, defaultPhone = '98964 75885'): string {
  if (!phone) return `+91 ${defaultPhone}`;
  const digits = phone.replace(/\D/g, '');
  let clean10 = digits.startsWith('91') && digits.length === 12 ? digits.slice(2) : digits;
  if (clean10.length === 9) clean10 = `${clean10}0`;
  if (clean10.length === 10) {
    return `+91 ${clean10.slice(0, 5)} ${clean10.slice(5)}`;
  }
  return phone.startsWith('+') ? phone : `+91 ${phone}`;
}

/**
 * Generate URL-friendly slug from text
 */
export function slugify(text: string): string {
  return (text || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Multi-City Location & Delivery Configurations (NIT Kurukshetra + Narnaul Ready)
 */
export const CITY_CONFIGS = {
  kurukshetra: {
    name: 'Kurukshetra (NIT Campus)',
    code: 'KKR',
    deliveryFee: 0,
    presetLocations: [
      'Back Gate',
      'Front Gate',
      'Girls Hostel',
      'Mega Boys Hostel',
      'Market Counter'
    ]
  },
  narnaul: {
    name: 'Narnaul City',
    code: 'NNL',
    deliveryFee: 40,
    presetLocations: [
      'Mahaveer Chowk',
      'Rewari Road',
      'Pul Bazar',
      'Singhana Road',
      'Subhash Park',
      'Narnaul Bus Stand'
    ]
  }
} as const;

export type CityCode = keyof typeof CITY_CONFIGS;

/**
 * Generate a human-friendly unique order token (e.g. 'OR-8492')
 */
export function generateOrderId(cityPrefix = 'OR'): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${cityPrefix}-${randomNum}`;
}

export interface OrderTicketItem {
  name: string;
  quantity: number;
  price: number;
}

export interface OrderTicketPayload {
  orderId: string;
  vendorName: string;
  vendorCity?: string;
  customerName?: string;
  customerPhone: string;
  location: string;
  cookingNotes?: string;
  items: OrderTicketItem[];
  itemTotal: number;
  deliveryFee?: number;
  totalPayable: number;
  paymentMethod?: string;
  timestamp?: string;
}

/**
 * Build a clean, structured, and professional WhatsApp order message
 */
export function buildWhatsAppOrderTicket(order: OrderTicketPayload): string {
  const lines: string[] = [];
  lines.push(`🧾 *ORANDUS ORDER #${order.orderId}*`);
  if (order.timestamp) {
    lines.push(`📅 ${order.timestamp}`);
  }
  lines.push(`🏪 *Stall:* ${order.vendorName}`);
  lines.push('──────────────────────');

  if (order.customerName && order.customerName.trim()) {
    lines.push(`👤 *Customer:* ${order.customerName.trim()} (+91 ${order.customerPhone})`);
  } else {
    lines.push(`👤 *Customer Phone:* +91 ${order.customerPhone}`);
  }
  lines.push(`📍 *Location:* ${order.location}`);

  if (order.cookingNotes && order.cookingNotes.trim()) {
    lines.push(`📝 *Note:* "${order.cookingNotes.trim()}"`);
  }

  lines.push('──────────────────────');
  lines.push('*ITEMS:*');
  for (let i = 0; i < order.items.length; i++) {
    const item = order.items[i];
    const sub = item.price * item.quantity;
    lines.push(`▪ ${item.quantity}x ${item.name} (₹${item.price} ea) = ₹${sub}`);
  }

  lines.push('──────────────────────');
  lines.push(`Subtotal: ₹${order.itemTotal}`);
  if (order.deliveryFee && order.deliveryFee > 0) {
    lines.push(`Delivery Fee: ₹${order.deliveryFee}`);
  }
  lines.push(`💵 *TOTAL TO PAY: ₹${order.totalPayable}*`);
  lines.push(`💳 *Payment:* ${order.paymentMethod || 'Cash / UPI upon handover'}`);
  lines.push('──────────────────────');
  lines.push(`👉 *Vendor:* Please reply "CONFIRMED" to accept order.`);
  lines.push(`_Sent via Orandus Platform_`);

  return lines.join('\n');
}
