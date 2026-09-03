---
name: modern-filter-ux
description: |
  Senior Software Engineer & UX Designer best practices for e-commerce, food delivery, and catalog filtering systems.
  Use this skill whenever designing, refactoring, or optimizing search filter toolbars, faceted search, category tabs, diet/price controls, and mobile tap targets.
---

# Modern Filter & Search UX Guidelines

A production-tested blueprint for designing high-conversion, accessible, and clean filter sections for modern consumer web applications (food delivery, marketplace, catalog).

---

## 1. Core Architectural Principles

### 1. Separation of Concerns (Entities vs Attributes)
- **Never mix Entity Navigation with Item Attributes**:
  - If vendors/stores have their own dedicated tab (`Campus Vendors`), **do not** clutter the item search view with redundant vendor filter pills.
  - Item filters should focus strictly on item attributes: **Category, Diet (Veg/Non-Veg), Price/Budget, Tags/Vibes, and Rating**.

### 2. Elimination of "Filter Stacking Fatigue"
- **The Problem**: Stacking 4 or 5 vertical rows of filter chips (Vendors, Vibes, Budget, Diet, Categories) consumes 50%+ of mobile screen height before any product appears.
- **The Solution**: 
  - Group filters into a maximum of 2 compact, logical tiers:
    - **Tier 1 (Core Attributes)**: Diet toggle (`Veg` / `Non-Veg`), Price Brackets, and Cravings/Vibes.
    - **Tier 2 (Taxonomy)**: Clean horizontal scrollable Category tabs with icons.
  - Provide a single unified `Clear All` action that only surfaces when non-default filters are active.

---

## 2. Senior Developer UX Specifications

### A. Diet / Binary Toggles
- Use explicit visual cues, not plain text:
  - **Pure Veg**: Green border + green dot icon (`border-emerald-500 bg-emerald-50 text-emerald-800`).
  - **Non-Veg**: Ruby border + red dot icon (`border-rose-500 bg-rose-50 text-rose-800`).
- Ensure mutually exclusive or multi-select states are clear to the user.

### B. Price & Budget Controls
- Avoid complex two-handle sliders on mobile (high friction, difficult to grab).
- Use distinct, mutually exclusive budget pills:
  - `≤ ₹50` (Pocket Friendly)
  - `₹50 – ₹100` (Quick Bites)
  - `₹100 – ₹150` (Combos & Meals)
  - `₹150+` (Feasts & Platters)

### C. Live Real-Time Operating Hours & Availability
- In instant delivery or campus food apps, **never display items from closed kitchens by default**.
- Filter out items from closed vendors in real-time based on local timezone (IST).
- Display a live operational pulse indicator:
  - `🟢 Live Open Kitchens` so customers know every result is orderable immediately.

### D. Touch Targets & Responsive Ergonomics (WCAG 2.2 AA)
- Mobile touch targets must have at least **44x44px** (or minimum height of `38px` with generous horizontal padding of `14px+`).
- Scrollable containers must feature `scrollbar-none` and generous horizontal padding so edge chips don't get clipped.
- Active states must use strong contrast ratios (minimum 4.5:1 text-to-background).
- Subtle scale transitions on tap (`active:scale-95 transition-all`).

---

## 3. High-Performance Client State Management (Alpine.js / React)

### Dynamic Active Filter Counter:
```js
get activeFilterCount() {
  let count = 0;
  if (this.query.trim()) count++;
  if (this.activeCat !== 'all') count++;
  if (this.vibeTag !== 'all') count++;
  if (this.priceBracket !== 'all') count++;
  if (this.vegFilter !== 'all') count++;
  return count;
}
```

### Clean One-Click Reset:
```js
resetFilters() {
  this.query = '';
  this.activeCat = 'all';
  this.vibeTag = 'all';
  this.priceBracket = 'all';
  this.vegFilter = 'all';
  this.displayLimit = 20;
}
```
