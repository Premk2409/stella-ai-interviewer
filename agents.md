# Stella AI - Agent Guidelines (agents.md)

This file coordinates collaboration and operations for AI agents and LLM-based assistants working on the **Stella AI** frontend application.

---

## 🤖 Agent Core Mandates

1. **Adherence to GEMINI.md**:
   - Always read and follow the visual theme, palette (White + Blue + Dark Navy), and folder structure outlined in `GEMINI.md`.
   - Ensure form and error styling strictly adheres to the established visual guidelines.

2. **Surgical Code Modifications**:
   - Prefer targeted, precise text replacements in existing files rather than replacing entire files.
   - Do not delete or rewrite unrelated sections, utility methods, or components.

3. **Incremental Testing & Verification**:
   - When a code change is made, immediately run any related test suites or compile checks.
   - If tests are not available, verify the behavior by creating a mock/unit test or confirming that the Vite build succeeds without compilation warnings.

4. **Code Quality & Modern Standards**:
   - Use ES6+ modern JavaScript standards.
   - Use standard Tailwind utility classes for all styling.
   - Avoid manual DOM manipulation. Let React control the state.

---

## 🚀 Key Action Steps for Development

- **Installing Packages**:
  - Always verify existing dependencies in `package.json` before installing new packages.
  - When adding packages (e.g., Lucide React icons, Tailwind config), use `--save-dev` or standard `npm i` without modifying existing package constraints arbitrarily.

- **Component Creation Pattern**:
  1. Determine the path and placement of the component.
  2. Implement functional, clean React components.
  3. Wire the component into the router/layout.
  4. Manually or programmatically verify that routing and rendering work.
