# SPEC.md — Friendship KeyChain

> Product and development specification for the Friendship KeyChain storefront.
> Repository: `Ridho-Fauzan/GantunganKunci3d`
> Live site: https://friendshipmerch.vercel.app
> Status: Existing static website; this document describes the current product and the rules for future changes.

## 1. Product Overview

Friendship KeyChain is a small online storefront for **Toko Aksesoris "Persahabatan"**, a band-merch and custom acrylic keychain business. The website lets visitors browse ready-made designs, experiment with custom keychains in an interactive 3D editor, and submit a pre-order request for collection at the event booth.

The experience should feel like a compact independent band-merch shop: dark visual foundation, bold typography, and red, black, and warm cream accents. Keep the interface expressive but practical, with the product artwork remaining the visual focus.

### Primary goals

1. Present the available keychain products clearly.
2. Let visitors inspect products through 3D previews and customize their own design.
3. Turn a selected catalog product or custom design into a pre-order request.
4. Communicate event collection details and ordering instructions clearly.
5. Keep the site lightweight and easy to maintain without requiring a backend.

### Out of scope

- Online payment or checkout.
- Shipping, courier integration, or delivery address collection.
- Customer accounts, login, or order history.
- Inventory synchronization or order-management dashboard.
- Online payment, shipping, and customer accounts.
- Server-side order storage is now provided by Supabase for preorder tracking; customer-facing checkout remains a WhatsApp/Instagram hand-off.

An **admin-only order dashboard** is in scope, using Supabase Auth email/password, an explicit admin allowlist, a public preorder insert flow, and admin-only read/update policies.

## 2. Target Users and Main Journey

**Target users:** visitors discovering the booth or store through social media, QR codes, or the live website; people interested in band merchandise and custom acrylic keychains.

### Main user journey

1. Open the storefront and browse the catalog.
2. Inspect a product using its poster/video preview.
3. Choose **Coba 3D** to open the editor with the product's preset design, or open the editor to create a custom design.
4. Adjust the shape, artwork, text, material, color, dimensions, and other available options.
5. Open the pre-order page with the current design carried into the order summary.
6. Review the product/design and event collection details.
7. Continue the order conversation through the configured WhatsApp or Instagram contact.

## 3. Pages and Responsibilities

### 3.1 Storefront — `index.html`

The main landing and catalog page.

Requirements:
- Display the shop identity and current event/booth information.
- Render products from `window.KATALOG` in `assets/shop.js`; do not duplicate product data in page markup.
- Each product card should show its name, price or "Harga via DM", product artwork/poster, and relevant short specification.
- Play product preview videos silently and only when the relevant card is visible. Provide a poster/fallback image when video is unavailable or unsupported.
- Provide clear actions to open the 3D editor and start a pre-order. Include a dedicated **Custom Keychain** catalog card priced at Rp15.000 that opens the blank 3D editor.
- Include a **Bagikan toko** action using the native share sheet where supported, with copy-link fallback.
- Keep Instagram/contact and event details consistent with the shared shop configuration.

### 3.2 3D Designer — `desain.html`

Interactive editor for creating and reviewing keychain designs.

Requirements:
- Support direct links to a catalog preset using `desain.html?produk=<id>`.
- Support custom designs without requiring a catalog product.
- Provide interactive 3D rendering using Three.js.
- Allow camera orbit by dragging the background and zoom by scroll/pinch.
- Support the existing chain and pendant animation, including automatic movement and manual shake interaction.
- Support multiple pendants on one ring, with a maximum of six pendants.
- Keep settings scoped to the currently selected pendant.
- Provide a clear action to continue to pre-order with the current design.

#### Design controls

The editor should preserve the existing capabilities:
- Pendant shape: guitar pick, heart, star, tag, and round.
- Material: glossy acrylic, clear acrylic, and matte acrylic.
- Preset colors and custom color picker.
- Custom text with raised/extruded appearance on both sides.
- Custom artwork upload (PNG, WebP, SVG, and JPG where supported).
- Drag-and-drop artwork upload.
- Transparent artwork outline detection; optional background retention for full-background artwork.
- Adjustable background-removal tolerance for plain-background JPG images.
- Adjustable acrylic border, hanging-hole position, dimensions in millimeters, and acrylic thickness (1–15 mm).
- Optional tilt based on the pendant's center of mass.
- Per-pendant chain length (0–8 links).
- Add, duplicate, select, and remove pendants.
- Optional solid collision between pendants; users must be able to disable it for performance.

#### Editor review mode

The review page/mode (currently accessible through `desain.html#review`) should provide a distraction-free full-screen preview.

Requirements:
- Hide the editor controls while preserving the 3D preview.
- Allow the pendant to be dragged to swing; background drag rotates the camera.
- Support zoom by scroll/pinch.
- Provide automatic 360-degree rotation, shake, lighting presets, background color, glow, and nail visibility controls.
- Allow PNG screenshot export.
- Allow free video recording up to 60 seconds and one-full-rotation recording.
- Support keyboard shortcuts: Space to start/stop recording and Escape to return to the editor.
- Keep UI text and controls legible against the selected background.

### 3.3 Pre-order — `preorder.html`

A pre-order summary and contact hand-off page.

Requirements:
- Accept the selected catalog product or custom design from the editor.
- Display an understandable order summary before opening the messaging app.
- Show shop contact details, event name, booth location, date, and opening hours.
- Explain that the order is confirmed by the admin through WhatsApp.
- Clearly state that orders are collected at the event booth and **shipping is not available**.
- Use the configured WhatsApp contact as the single primary hand-off action, labelled **Make an Order**. Do not show separate Instagram DM or copy-summary buttons in the order summary.
- Never imply that an order has been submitted or paid until the customer completes the external conversation.

## 4. 3D Export and Production Files

The editor supports the following exports:

| Format | Purpose | Requirements |
|---|---|---|
| GLB | 3D model for Blender, viewers, web, or AR | Export the complete multi-pendant stack |
| PNG | Preview image | Capture the current visible preview |
| SVG | Acrylic cutting template | Export the selected pendant's cut outline and hanging hole in millimeters; use a red cut line |
| WEBM | Preview recording | Record the animation; review mode supports up to 60 seconds and one full 360° rotation |

For SVG output, artwork and cut geometry must remain distinguishable. Do not silently scale the physical dimensions during export.

## 5. Store Configuration and Product Data

The shared source of truth is `assets/shop.js`.

### Shop configuration

`window.SHOP` contains:
- `nama`: shop name.
- `tagline`: short shop description.
- `instagram`: Instagram username, without the URL.
- `whatsapp`: optional international phone number containing digits only, without plus sign or spaces.
- `event`: event name, location, dates, and hours.
- `catatanPO`: pre-order and collection instructions.

### Catalog data

`window.KATALOG` is an array of product objects. Each product uses:
- `id`: stable URL-safe identifier.
- `nama`: product display name.
- `harga`: price in IDR as a number, or `null` for "Harga via DM".
- `badge`: optional short label.
- `aset`: source artwork path.
- `gambar`: catalog poster path.
- `video`: catalog preview video path.
- `spek`: short product specification.
- `deskripsi`: product description.
- `desain`: initial editor settings for that product.

### Data rules

- Product IDs must be unique and URL-safe.
- Prices are stored as integer Rupiah values; formatting is handled by `SHOP_UTIL.harga()`.
- A missing/empty WhatsApp number must not generate a broken WhatsApp link.
- Product references in URLs must be validated; unknown IDs should fall back gracefully instead of breaking the page.
- Keep shop, event, and product information in `assets/shop.js`, not duplicated across HTML files.
- Do not commit private customer information or real order details into the repository.

## 6. Technical Architecture

### Current approach

- Static multi-page website: `index.html`, `desain.html`, and `preorder.html`.
- Client-side JavaScript and CSS; no application server or database is required.
- Three.js is loaded from a CDN for the 3D editor.
- Shared shop/catalog configuration lives in `assets/shop.js`.
- Product artwork, posters, and preview videos are stored in the repository.
- The site is hosted on Vercel and deployed from the `main` branch.
- Admin authentication uses Supabase JS v2 from a CDN; project URL and publishable key are in `assets/supabase-config.js`.
- `admin-login.html` is the email/password login page; `admin.html` is a protected admin landing page; `assets/admin-auth.js` handles session and allowlist checks.
- `public.admin_users` is the admin allowlist. Row Level Security permits authenticated users to read only their own admin row; adding/removing admins is done manually in the Supabase SQL Editor using `supabase/admin-setup.sql`.
- `public.orders` stores preorder details and a status (`new`, `confirmed`, `processing`, `completed`, `cancelled`). Run `supabase/orders-setup.sql` to create it.
- Anonymous visitors may insert a new preorder only. They cannot select or update orders. Authenticated users listed in `admin_users` may select and update orders; no browser delete policy is provided.
- WhatsApp is required and validated as an 8–15 digit phone number on the preorder form. Instagram username is optional and is stored as null when omitted.
- For custom 3D designs, store each pendant's processed artwork canvas separately from the 3D viewport screenshot in the order's JSONB design payload. The admin order detail displays the actual processed artwork.
- `assets/order-storage.js` writes the preorder only when the customer chooses the WhatsApp or Instagram hand-off. The initial status is `new`; it is not proof of payment or admin confirmation.
- `admin.html` is the protected order dashboard; `assets/admin-dashboard.js` handles stats, search, filters, order details, and status updates.
- The publishable key is public by design. Never expose Supabase `service_role` or secret keys in frontend code or source control.
- Supabase Auth login alone does not grant admin access. The user must also have a row in `public.admin_users`.

### Development constraints

- Preserve the static-site architecture unless a change has a clear, approved reason to introduce a build system or backend.
- Do not introduce a framework or dependency for a feature that can reasonably be implemented with the existing stack.
- Keep modules focused and avoid duplicating shared behavior across pages.
- Handle unavailable CDN resources, missing media, unsupported browser APIs, and invalid user input gracefully.
- Avoid blocking the main thread with expensive 3D calculations; expose performance-sensitive options such as collision simulation.
- Revoke temporary object URLs when uploaded artwork is replaced or no longer needed.
- Validate uploaded file types and sizes before processing. Never trust file extensions alone.
- Do not upload user artwork to a server; processing should remain local in the browser unless the product scope is explicitly changed.

## 7. Visual and UX Guidelines

- Overall direction: dark band-poster aesthetic using red, black, and warm cream.
- Keep product artwork and the 3D preview as the main visual focus.
- Use consistent spacing, typography, button styles, borders, and feedback states across all pages.
- Make primary actions visually obvious and label them in Indonesian.
- Provide visible hover, focus, active, disabled, loading, and error states where applicable.
- Do not rely on color alone to communicate status.
- Use clear empty states when there are no products or no custom artwork.
- Confirm destructive actions such as deleting a pendant.
- Keep the catalog and pre-order flow usable on mobile screens as well as desktop.
- Respect reduced-motion preferences where practical; animation must not prevent users from using the page.

## 8. Accessibility and Compatibility

- Use semantic HTML and descriptive labels for controls.
- All interactive controls must be keyboard reachable and have visible focus indicators.
- Provide meaningful alternative text for product images.
- Ensure text contrast is readable on dark and light backgrounds.
- Provide non-video poster fallbacks.
- Support current versions of Chrome, Edge, Firefox, and Safari where the required WebGL and browser APIs are available.
- If WebGL, media recording, or native sharing is unavailable, show a helpful fallback instead of failing silently.

## 9. SEO, Sharing, and Discoverability

- Each page should have an appropriate document title and meta description.
- Maintain Open Graph metadata and the existing social preview image.
- Keep canonical URLs consistent with the production domain.
- Keep `sitemap.xml` and `robots.txt` aligned with public pages.
- Keep favicon and install/share icons valid.
- QR codes must point to the intended storefront or pre-order destination and be regenerated when those URLs change.

## 10. Performance and Reliability

- Lazy-load below-the-fold images and defer non-critical work.
- Only play catalog videos while their cards are visible; pause them when they leave view.
- Prefer compressed, appropriately sized media assets.
- Avoid unnecessary re-rendering or recreation of Three.js geometry/materials.
- Dispose of Three.js geometries, materials, textures, renderers, and event listeners when scenes are replaced or pages are left.
- Provide graceful fallbacks when an asset fails to load.
- Keep the site functional without a backend and avoid adding unnecessary network requests.

## 11. Privacy and Security

- Treat uploaded artwork as untrusted input.
- Validate and limit uploaded file size and supported formats.
- Avoid injecting user-provided text or filenames as raw HTML.
- Do not store sensitive customer information in local storage, URLs, analytics events, or source control.
- Do not collect more personal information than needed to prepare the pre-order message.
- External contact links must use the configured shop account/number only.

## 12. Acceptance Criteria

A change is considered complete when all relevant criteria pass:

### Storefront
- [ ] Catalog products are rendered from `assets/shop.js`.
- [ ] Product names, prices, specifications, and media match the configuration.
- [ ] Missing video or poster assets do not break the catalog.
- [ ] Product links open the correct editor preset.
- [ ] Share action works or falls back to copying the store URL.

### 3D editor
- [ ] Editor opens with and without a valid catalog product ID.
- [ ] Main customization controls update the 3D preview.
- [ ] Uploaded artwork is validated and processed without sending it to a server.
- [ ] Multiple pendants can be added, selected, duplicated, and removed up to the six-item limit.
- [ ] Per-pendant settings do not unintentionally modify other pendants.
- [ ] Camera controls and animation work on supported browsers.
- [ ] Exported GLB, PNG, and SVG files open and represent the intended design.
- [ ] Performance-sensitive collision simulation can be disabled.

### Review mode
- [ ] Review mode can be opened directly and exited with Escape.
- [ ] Camera, lighting, background, and animation controls work.
- [ ] PNG and WEBM recording provide clear feedback and graceful failure handling.
- [ ] One-rotation recording stops after one complete rotation.

### Admin dashboard and order database
- [ ] `supabase/orders-setup.sql` creates `public.orders` with RLS enabled.
- [ ] Anonymous visitors can insert a new preorder but cannot read or update any order.
- [ ] Allowlisted admins can list orders and update status; non-admin users cannot.
- [ ] Dashboard stats, search, status filters, detail view, and status updates work.
- [ ] Clicking **Make an Order** stores the order before opening the configured WhatsApp chat.

### Admin authentication
- [ ] Admin can sign in with an email/password account created in Supabase.
- [ ] A signed-in user without an `admin_users` row is denied and signed out.
- [ ] `admin.html` redirects unauthenticated users to `admin-login.html`.
- [ ] Admin can sign out.
- [ ] Admin membership can only be granted/revoked through trusted Supabase dashboard/SQL access, not from the browser.

### Pre-order
- [ ] Catalog and custom designs produce a correct order summary.
- [ ] Event and collection information are visible before hand-off.
- [ ] WhatsApp is used only when configured; Instagram DM remains available as fallback.
- [ ] The page clearly states booth collection only and no shipping.
- [ ] The website does not claim payment or order confirmation has occurred.

### General
- [ ] All pages work on mobile and desktop.
- [ ] No broken navigation, console-breaking errors, or missing critical assets.
- [ ] Keyboard focus and readable contrast are maintained.
- [ ] Existing SEO, social preview, and QR destinations remain valid.

## 13. Development Workflow

Before implementing a feature:
1. Read this specification and the relevant existing page/script.
2. Identify whether the behavior already exists before adding a duplicate.
3. Keep changes scoped to the smallest relevant files.
4. Preserve existing product data and user-facing flows unless the task explicitly changes them.
5. Test the affected page locally in a modern browser.
6. Test mobile layout for any UI changes.
7. Check browser console errors and verify exports/contact links when relevant.
8. Update this specification and `README.md` when product behavior or setup instructions change.

### Suggested manual smoke test

1. Open `index.html`; inspect all catalog cards and media.
2. Open a product through **Coba 3D** and verify its preset.
3. Upload a transparent PNG and a plain-background JPG.
4. Add and duplicate pendants, then test the six-pendant limit.
5. Open review mode; test orbit, zoom, shake, screenshot, and recording.
6. Export GLB and SVG and inspect the resulting files.
7. Continue to pre-order and verify the summary and contact fallback.
8. Create a Supabase Auth user, add it to `public.admin_users`, then test admin login, denied non-admin login, direct access to `admin.html`, and logout.
9. Repeat the main journey at a mobile viewport.

---

## 14. Current Business Configuration (Reference)

The following values reflect the current `assets/shop.js` configuration and should be changed in that file rather than hard-coded elsewhere:

- Shop: **Toko Aksesoris "Persahabatan"**
- Tagline: **Band Merch · Keychain Custom**
- Instagram: **@toko.aksesoris.persahabatan**
- Event: **Binus Festival (Bifest)**
- Location: **Binus Anggrek, Lantai 1**
- Schedule: **25–26 November 2026, 09.00–17.00**
- Price examples: current catalog products are listed at **Rp12.000** each.
- Collection: **booth pickup only; no shipping**.
- WhatsApp: **6285179621456** is configured in `assets/shop.js` for pre-order confirmation; Instagram DM remains available as a fallback.


## 15. Admin Dashboard and Order Database

### Database setup
1. Keep the existing `public.admin_users` table and its RLS policy from `supabase/admin-setup.sql`.
2. Run the complete `supabase/orders-setup.sql` file in Supabase SQL Editor.
3. The `public.orders` table stores customer contact details, product/design snapshot, quantity, print sides, notes, summary, status, and timestamps.
4. Public access is insert-only for new orders. Only allowlisted authenticated admins can select and update orders. Browser-side deletion is intentionally unavailable.

### Order flow
- The preorder form saves a record when the customer clicks **Make an Order**. The record starts with status `new`.
- The external message hand-off is still required for the customer to contact the shop. A database record is not a confirmation or payment receipt.
- The admin dashboard at `admin.html` shows order counts, search, status filtering, order details, and status updates.
- Supported statuses: `new`, `confirmed`, `processing`, `completed`, and `cancelled`.
