# Stella AI - Project Instructions (GEMINI.md)

Welcome to the **Stella AI** frontend development repository. Stella AI is a modern AI-powered hiring and interviewing platform. This document serves as the source of truth for architectural guidelines, UI/UX design standards, and development workflows.

---

## 🎨 Theme & Styling Standards

### Palette
We use a **Modern AI hiring platform** theme with a crisp **White + Blue + Dark Navy** color scheme.
- **Primary / Brand Blue**: Deep, trustworthy electric blue (e.g., Tailwind `blue-600` / `#2563eb` or `blue-700` / `#1d4ed8`). Used for call-to-actions, primary buttons, links, and highlighted states.
- **Dark Navy**: High-contrast, premium dark slate (e.g., Tailwind `slate-900` / `#0f172a` or `slate-850` / `#1e293b`). Used for headers, sidebars, main headings, and dark mode sections.
- **White / Light Gray**: Clean, spacious backgrounds (e.g., Tailwind `white` / `#ffffff` and `slate-50` / `#f8fafc`). Used for pages, cards, and body backgrounds.
- **Accents**: Subtle teal or indigo accents are permitted for AI-specific highlights, but the dominant brand remains Blue, Navy, and White.

### Typography & Spacing
- Use standard Sans-serif font stack (Inter or system UI sans).
- Ensure consistent padding/margins (`p-4`, `p-6`, `gap-4`, `gap-6`) across pages to maintain layout rhythm.
- Transitions must be smooth (`transition-all duration-200 ease-in-out`) on buttons, links, and hover states.

---

## 🛠️ Architecture & Folder Structure

We maintain a clean, scalable folder structure under `stella-ai-interviewer/src/`:

```
src/
 ├── assets/      # Static assets (images, icons, SVGs)
 ├── components/  # Reusable UI components (Button, Input, Card, Modal, Loader)
 ├── pages/       # Page-level components corresponding to router paths
 ├── layouts/     # Base layouts (e.g., SaaS base dashboard layout)
 ├── services/    # API calls, WebSocket services, external integrations
 ├── hooks/       # Custom React hooks (e.g., useAuth, useAudioRecorder)
 ├── utils/       # Utility functions, helpers, constants, date formatters
 ├── App.jsx      # Main application router and context providers
 └── main.jsx     # Entry point
```

---

## 📋 Frontend Engineering Guidelines

### 1. Consistent Forms & Inputs
- All input fields must follow the **White + Blue + Dark Navy** theme:
  - White background, thin border (e.g., `border-slate-300`).
  - Dark Navy text for input content and label titles.
  - Active/Focus state: Tailwind `focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none`.
- Labels must be explicit, positioned above the input, and styled uniformly (e.g., `text-sm font-medium text-slate-700 mb-1`).
- Buttons must show active, hover, disabled, and loading states cleanly.

### 2. Error & Validation Message Consistency
- Never display bare technical/system errors (like `TypeError: Cannot read property 'map' of undefined` or raw API responses) to the user.
- Always catch errors and translate them into friendly, plain-language error messages.
- Error text must be styled consistently using a bright rose/red color (e.g., Tailwind `text-red-600 text-sm mt-1`).
- Error containers (like alerts or banner components) should use a light red background with a red border (e.g., `bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg`).
- Form validations must check:
  - Required fields.
  - Format validation (emails, phone numbers).
  - Show validation errors inline *under* the field immediately, rather than only in top-level popups.

### 3. Component Writing Rules
- Use functional components with hooks.
- Explicitly define `propTypes` or destructured params with default values for clear usage documentation.
- Maintain pure presentational components separate from business logic (hooks/services) where possible.
- Avoid using inline inline-styles (`style={{...}}`) except for dynamic CSS properties (like progress bar widths). Use Tailwind CSS utility classes exclusively.

### 4. Routing
- Manage all routing in `App.jsx` using `react-router-dom`.
- Define path constants in `src/utils/paths.js` or directly inside routing definitions for clarity.
- Utilize layouts to wrap groups of pages (e.g., SaaS-style shell with header, sidebar, and content area).
