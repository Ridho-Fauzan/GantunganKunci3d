# AGENTS.md — Instructions for Coding Agents

These instructions apply to the entire repository unless a more specific `AGENTS.md` exists in a subdirectory.

## 1. Project Context

This repository contains **Friendship KeyChain**, a static storefront and interactive 3D custom keychain designer for **Toko Aksesoris "Persahabatan"**.

- Production website: https://friendshipmerch.vercel.app
- Main branch: `main`
- Hosting: Vercel, deployed from `main`
- Architecture: plain HTML, CSS, and browser JavaScript
- 3D rendering: Three.js loaded from a CDN
- Shared shop and catalog data: `assets/shop.js`
- The storefront and designer remain static; Supabase is used for admin authentication only.
- Admin auth files: `admin-login.html`, `admin.html`, `assets/admin-auth.js`, `assets/supabase-config.js`, and `supabase/admin-setup.sql`.

Before making changes, read:
1. `spec.md` — product requirements, existing features, constraints, and acceptance criteria.
2. `README.md` — current feature documentation, local run instructions, and asset workflows.
3. The relevant HTML, JavaScript, CSS, and configuration files involved in the task.

Treat the existing implementation as the source of truth for behavior. Documentation can lag behind code; investigate discrepancies and avoid silently removing working behavior.

## 2. Core Working Principles

1. **Understand before editing.** Inspect the relevant implementation and its dependencies before changing anything.
2. **Make the smallest complete change.** Prefer focused edits over broad rewrites or unrelated refactors.
3. **Preserve existing behavior.** Do not remove, simplify, or replace working features unless the user explicitly asks.
4. **Follow the current architecture.** Keep the project static and dependency-light.
5. **Do not invent requirements.** If an important product or technical decision is ambiguous, ask the user rather than making a disruptive assumption.
6. **Be transparent.** Never claim that a test, browser check, export, or deployment succeeded unless it was actually performed.
7. **Keep documentation accurate.** Update `spec.md` and/or `README.md` when a change affects documented behavior, setup, or workflows.

## 3. Architecture and Technology Rules

- Use the existing HTML, CSS, and vanilla JavaScript approach.
- Do not migrate to React, Vue, Next.js, Vite, TypeScript, or another framework/build system unless explicitly requested or approved.
- Do not add payment processing or server-side order storage without explicit approval.
- Supabase admin authentication is already approved and implemented; preserve its email/password flow, admin allowlist, and RLS boundaries.
- Reuse existing utilities and shared code instead of duplicating logic across pages.
- Keep shared shop information and catalog product data in `assets/shop.js`; do not hard-code duplicate copies in page markup or unrelated scripts.
- Keep Three.js and other external resources consistent with the current CDN-based setup unless a change is justified.
- Avoid adding dependencies for functionality that can reasonably be implemented with the existing stack.
- Do not introduce a package manager workflow or build step just for convenience.

## 4. Product and Business Rules

- The shop name is **Toko Aksesoris "Persahabatan"**.
- The current event configuration is stored in `assets/shop.js`; treat that file as the source of truth.
- Catalog products are defined in `window.KATALOG` in `assets/shop.js`.
- Product IDs must remain unique and URL-safe. Preserve existing IDs because they are used in links and saved product references.
- Store prices as integer Rupiah values. Use the existing price utility where appropriate.
- Do not duplicate event dates, booth location, contact details, or product prices in multiple files.
- WhatsApp is configured in `assets/shop.js`; use the shared configuration rather than hard-coding the number.
- Keep Instagram DM as the fallback contact method when WhatsApp is unavailable.
- Orders are collected at the Bifest booth. **There is no shipping.**
- Do not represent a message hand-off as a confirmed order or completed payment.
- Never add real customer personal information, private order details, credentials, or API secrets to source control.

## 5. Page Responsibilities

### `index.html` — Storefront
- Render catalog content from `window.KATALOG`.
- Preserve product links and the `desain.html?produk=<id>` preset flow.
- Keep video previews muted and limited to visible cards; pause videos when cards leave view.
- Preserve poster/fallback behavior when video cannot play.
- Preserve the native share action and copy-link fallback.

### `desain.html` — 3D Designer
- Preserve both custom-design and catalog-preset entry points.
- Keep pendant settings scoped to the selected pendant.
- Respect the maximum of six pendants.
- Preserve existing shape, material, color, text, artwork, dimensions, thickness, chain, camera, animation, and collision controls.
- Preserve the current editor-to-preorder hand-off.
- Keep review mode accessible through `desain.html#review`.
- Avoid unnecessary recreation of Three.js resources during UI updates.
- Dispose of obsolete geometries, materials, textures, renderers, and event listeners when appropriate.

### `preorder.html` — Pre-order
- Preserve the order summary for catalog and custom designs.
- Validate incoming URL/query data and handle invalid or missing values gracefully.
- Use configured contact details only.
- Clearly communicate booth pickup and no-shipping rules.
- Do not claim that an order has been submitted, confirmed, or paid before the customer completes the external conversation.

## 6. Supabase Authentication and Security

- Use only the Supabase publishable key in browser code. Never expose `service_role` or secret keys in source control or client-side scripts.
- A successful Supabase Auth login is not sufficient for admin access; require a matching row in `public.admin_users`.
- Keep Row Level Security enabled on `public.admin_users`. Authenticated users may select only their own row; do not add client-side insert/update/delete policies for the admin allowlist.
- Grant or revoke admin membership only through trusted Supabase Dashboard/SQL Editor access.
- Do not add public admin registration or let a user self-assign an admin role.
- Protect every future admin page by checking both the Supabase session and admin allowlist. Frontend route checks are UX only; any future database table containing orders or private data must have its own restrictive RLS policies.
- Keep the Supabase project URL and publishable key in `assets/supabase-config.js`; these values are public configuration, not secrets.

## 7. 3D, Artwork, and Export Safety

- Keep artwork processing client-side. Do not upload customer artwork to a server unless the user explicitly approves a scope change.
- Treat uploaded files as untrusted input.
- Validate actual file type and file size; do not trust file extensions alone.
- Support only the formats already intended by the product (PNG, WebP, SVG, and JPG where supported).
- Do not insert uploaded SVG or user-provided text into the page as unsanitized HTML.
- Revoke temporary object URLs when assets are replaced or no longer needed.
- Handle unsupported WebGL, unavailable CDN resources, and browser API failures with a useful message or fallback.
- Preserve physical dimensions in millimeters in design controls and SVG exports.
- Do not silently scale production cut geometry.
- Preserve the distinction between artwork and SVG cut lines.
- GLB export should continue to include the full pendant stack; SVG export should continue to target the selected pendant, unless the specification is intentionally changed.
- Recording and screenshot controls must fail gracefully when browser capabilities are unavailable.

## 8. UI, UX, and Accessibility

- Follow the established dark band-poster visual direction: red, black, and warm cream.
- Keep product artwork and the 3D preview visually prominent.
- Use Indonesian for customer-facing interface text unless the user requests otherwise.
- Maintain consistent typography, spacing, buttons, borders, and interaction states.
- Provide visible hover, focus, active, disabled, loading, and error states where relevant.
- Use semantic HTML, descriptive labels, meaningful image alt text, and visible keyboard focus.
- Do not communicate important status through color alone.
- Ensure the storefront, designer, and preorder flow remain usable on mobile and desktop.
- Respect reduced-motion preferences where practical.
- Confirm destructive actions such as deleting a pendant.
- Avoid adding decorative UI that makes important actions harder to find.

## 9. Performance and Reliability

- Keep the site lightweight and avoid unnecessary dependencies and network requests.
- Lazy-load non-critical media where appropriate.
- Avoid blocking the main thread with expensive 3D calculations.
- Preserve the option to disable performance-heavy collision simulation.
- Reuse Three.js geometry, materials, and textures when possible.
- Clean up resources and event listeners when scenes or components are replaced.
- Compress and size media assets appropriately.
- Provide fallbacks for missing images, videos, and external resources.
- Avoid unnecessary polling, animation loops, and repeated DOM queries.

## 10. Code Quality and Editing Practices

- Match the existing code style and naming conventions in each file.
- Prefer clear, descriptive names and small functions with focused responsibilities.
- Avoid unrelated formatting changes or large file rewrites.
- Do not minify or obfuscate source code.
- Avoid adding global variables; when the existing architecture requires globals, follow its established conventions.
- Do not use `innerHTML` with user-controlled content. Prefer `textContent` and safe DOM APIs.
- Validate and normalize URL parameters before using them.
- Handle missing elements and optional configuration safely.
- Keep comments useful and update comments when behavior changes.
- Do not add placeholder links, fake data, or unfinished controls that appear functional.

## 11. Testing and Verification

There may be no automated test suite. Do not assume one exists.

For every change:
1. Review the diff for accidental edits and unrelated changes.
2. Check for syntax errors in modified JavaScript.
3. Open or serve the relevant page locally when browser testing is available.
4. Check the browser console for errors.
5. Test the affected user flow, not just whether the page loads.
6. Check responsive behavior for UI changes.
7. Verify external links, downloads, and browser API fallbacks when relevant.

### Suggested local server

Run from the repository root:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

On Windows, `py -m http.server 8000` may be used if `python3` is unavailable.

### Relevant smoke tests

- Storefront: catalog cards, product data, video fallback, share/copy action.
- Product preset: open `desain.html?produk=<id>` and verify the correct design loads.
- Custom design: create a design without a catalog product.
- Artwork: test a transparent image and a plain-background JPG.
- Pendant stack: add, select, duplicate, delete, and verify the six-pendant limit.
- Review mode: orbit, zoom, shake, lighting/background controls, screenshot, and recording.
- Export: verify GLB, PNG, SVG, and WEBM where applicable.
- Pre-order: verify catalog/custom summary, event details, WhatsApp handoff, and no-shipping notice.
- Admin auth: verify allowlisted login, non-admin denial, protected direct route, and logout.
- Responsive: repeat the main journey at a mobile viewport.

If a test cannot be performed, state that clearly in the final report.

## 12. Documentation and Asset Changes

- Update `README.md` when user-visible features, setup steps, or asset-generation workflows change.
- Update `spec.md` when product requirements, page behavior, business rules, or acceptance criteria change.
- Keep screenshots, posters, QR codes, and social preview assets consistent with the actual site.
- Do not regenerate or overwrite large media assets unless the task requires it.
- If a URL or production domain changes, inspect canonical URLs, Open Graph metadata, sitemap, robots file, and QR destinations for consistency.
- Do not commit generated temporary files, local caches, secrets, or unrelated artifacts.

## 13. Git and Deployment Rules

- Work on the current branch unless the user requests another branch.
- Do not force-push, rewrite history, delete branches, or revert user changes without explicit approval.
- Do not overwrite uncommitted or existing user work.
- Keep commits focused and use descriptive commit messages when asked to commit.
- Vercel deploys from `main`; do not claim a production deployment completed unless deployment status was actually verified.
- Do not change repository settings, deployment settings, environment variables, or domain configuration without explicit approval.

## 14. Final Response Format

After completing a task, report briefly:

1. **What changed** — list the important files and behavior.
2. **Verification** — what was actually tested and what was not.
3. **Known limitations** — mention relevant remaining issues or assumptions.
4. **Commit/deployment** — include the commit reference if a commit was created; distinguish a GitHub commit from a verified production deployment.

Do not claim completion for work that was only proposed or partially implemented.
