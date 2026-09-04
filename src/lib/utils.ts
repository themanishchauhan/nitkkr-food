/**
 * Orandus - Centralized Utility Functions
 * Unified across SSR, Client, API, and UI components
 */

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
  const clean10 = digits.startsWith('91') && digits.length === 12 ? digits.slice(2) : digits;
  return `tel:+91${clean10 || defaultPhone}`;
}

/**
 * Sanitize WhatsApp chat link with optional pre-filled text
 */
export function cleanWhatsAppHref(phone: string | null | undefined, text = 'Hi! I found your menu on Orandus and would like to check availability.', defaultPhone = '9896475885'): string {
  const digits = (phone || '').replace(/\D/g, '');
  const clean10 = digits.startsWith('91') && digits.length === 12 ? digits.slice(2) : digits;
  const num = clean10 || defaultPhone;
  return `https://wa.me/91${num}?text=${encodeURIComponent(text)}`;
}

/**
 * Clean phone number for display (e.g. '+91 98964 75885')
 */
export function cleanDisplayPhone(phone: string | null | undefined, defaultPhone = '98964 75885'): string {
  if (!phone) return `+91 ${defaultPhone}`;
  const digits = phone.replace(/\D/g, '');
  const clean10 = digits.startsWith('91') && digits.length === 12 ? digits.slice(2) : digits;
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
