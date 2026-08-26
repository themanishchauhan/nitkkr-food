## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

---

## Web Design & UI/UX Guidelines

Follow these guidelines for all web interface and frontend development tasks:

### 1. Visual Aesthetics & Design System
- **Curated Color Palettes**: Use modern, harmonious palettes with clear semantic roles (Primary, Neutral, Accent, Success, Warning, Error) rather than default generic colors. Support seamless dark/light modes with CSS custom properties or Tailwind tokens.
- **Depth & Modern Styling**: Implement subtle depth using soft layered shadows, refined semi-transparent borders (`border-white/10` or `border-black/5`), and glassmorphism (`backdrop-blur-md bg-white/80 dark:bg-zinc-900/80`).
- **No Placeholders**: Use production-ready assets and realistic, high-quality images. Always design clean, meaningful empty states rather than blank or broken layouts.

### 2. Typography & Spatial Rhythm
- **Type Hierarchy**: Use a clean, modern font hierarchy (e.g., Inter, Outfit, system sans-serif). Maintain clear distinction between H1–H6 and body text.
- **Fluid & Scalable Sizing**: Use relative units (`rem`, `em`) and `clamp()` for fluid typography. Body text must be at least `16px` (`1rem`) with unitless line-height of at least `1.5`. Headings should use tighter line-heights (`1.1` to `1.25`).
- **Consistent Spacing**: Use an 8pt/4pt grid system for padding, margins, and gaps to ensure visual balance across all components.

### 3. Component States & Micro-Interactions
- **Comprehensive Interactive States**: Every interactive element (buttons, links, inputs, cards) must have distinct visual states:
  - `Default` & `Hover`
  - `Active` / `Pressed`
  - `Focus-Visible` (high-contrast outline/ring for keyboard navigation)
  - `Disabled` & `Loading` (spinners or skeleton loaders)
  - `Empty` / `Error`
- **Functional Motion**: Keep animations subtle and intentional (150ms–300ms ease curves). Use micro-interactions to confirm user actions (e.g., adding to cart, filtering items) and guide attention without causing cognitive fatigue.
- **Touch Targets**: Ensure touch targets are at least `44x44px` (recommended `48x48px`) on mobile devices with adequate spacing between adjacent buttons.

### 4. Accessibility (WCAG 2.1/2.2 AA Compliance)
- **Contrast Ratios**: Maintain minimum contrast of **4.5:1** for standard text and **3:1** for large text (18pt+ or 14pt bold) and interactive UI controls.
- **Non-Color Dependence**: Never rely on color alone to convey critical state or errors; always pair colors with icons or descriptive text labels.
- **Semantic HTML & Screen Readers**:
  - Use semantic elements (`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`, `<dialog>`).
  - Exactly one `<h1>` per page reflecting the main topic.
  - Descriptive `alt` attributes for meaningful images (`alt=""` for purely decorative).
  - Explicit `aria-label` or `aria-labelledby` for icon-only buttons.
- **Keyboard Navigation**: Ensure all features and modals are fully operable via keyboard with logical tab order and focus trapping inside active modals/dialogs.

### 5. Performance & Core Web Vitals (CWV)
- **LCP (Largest Contentful Paint)**: Use `fetchpriority="high"` and responsive `srcset` with modern formats (AVIF/WebP) for above-the-fold hero images. Preload critical fonts.
- **CLS (Cumulative Layout Shift)**: Always specify `width` and `height` or `aspect-ratio` on images, embeds, and video containers to avoid layout shifts during load.
- **INP (Interaction to Next Paint)**: Keep JavaScript execution lightweight, defer non-critical scripts, and avoid long-running tasks on the main UI thread.
- **Rendering Optimization**: Use `content-visibility: auto` for large offscreen lists and lazy-load below-the-fold media (`loading="lazy"`).

### 6. SEO & Metadata
- **Meta Tags**: Provide unique, descriptive `<title>` and `<meta name="description">` tags for every route.
- **Social Sharing**: Include Open Graph (`og:title`, `og:description`, `og:image`) and Twitter Card metadata.
- **Structured Data**: Include valid JSON-LD schemas (e.g., `Restaurant`, `LocalBusiness`, `Product`, `BreadcrumbList`) to enhance search visibility.

