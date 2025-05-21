# Plannar - Initial Style Guide

## 1. Introduction

This document outlines the initial visual style guide for Plannar. It is based on the existing `sample_wireframe.md` (which uses Tailwind CSS and Echarts) and the planned use of Material UI as the primary component library. The goal is a clean, modern, and professional interface that prioritizes clarity and ease of use.

## 2. Color Palette

Colors are inspired by `sample_wireframe.md` and typical choices for professional applications.

*   **Primary Color (Branding, Interactive Elements):**
    *   Blue: `text-blue-600` (Tailwind), `#3B82F6` (Hex). Used for primary buttons, links, active navigation, chart accents.
    *   Darker Blue (Hover/Active): `text-blue-700` / `bg-blue-700`, `#2563EB`.

*   **Secondary Color (Accents, Secondary Actions - TBD, can be a complementary color or a lighter primary shade):
    *   (Placeholder - e.g., a Teal or a lighter Blue if needed for secondary buttons/callouts).

*   **Neutral/Greyscale (Text, Backgrounds, Borders):**
    *   Background: `bg-gray-50` (Lightest Gray - main app background), `bg-white` (Cards, Modals, Sidebar, Header).
    *   Borders: `border-gray-200`, `border-gray-300`.
    *   Text (Body): `text-gray-700` or `text-gray-800` (Dark Gray).
    *   Text (Headings): `text-gray-900` (Near Black).
    *   Text (Subtle/Placeholders): `text-gray-500`, `text-gray-400`.

*   **Status & Notification Colors:**
    *   Success: Green (`text-green-600`, `bg-green-100`). Example: `#10B981`.
    *   Warning: Amber/Orange (`text-amber-600`, `bg-amber-100`). Example: `#F59E0B`.
    *   Error/Critical: Red (`text-red-600`, `bg-red-100`). Example: `#EF4444`.
    *   Information: Blue (can use Primary Blue or a lighter variant like `text-blue-500`, `bg-blue-100`).

*   **Chart Colors (from `sample_wireframe.md` Echarts examples):**
    *   A distinct palette for charts, ensuring good contrast and visual separation.
    *   Example Set: `#3B82F6` (Blue), `#10B981` (Green), `#F59E0B` (Orange), `#8B5CF6` (Purple), `#E5E7EB` (Light Gray for remaining/backgrounds).

## 3. Typography

(Assuming a standard sans-serif font stack, often Roboto or Inter with Material UI and Tailwind CSS. This should be confirmed or configured in Tailwind/Material UI theme.)

*   **Font Family:** System Sans-Serif stack (e.g., `font-sans` in Tailwind).
    *   Primary: Inter, Roboto, Helvetica Neue, Arial, sans-serif.

*   **Headings:**
    *   H1 (Page Titles): `text-2xl` or `text-3xl`, `font-bold`, `text-gray-900`.
    *   H2 (Section Titles): `text-xl` or `text-2xl`, `font-semibold`, `text-gray-900`.
    *   H3 (Sub-Section Titles): `text-lg` or `text-xl`, `font-semibold`, `text-gray-800`.
    *   Card Titles: `text-md` or `text-lg`, `font-medium` or `font-semibold`, `text-gray-800`.

*   **Body Text:**
    *   Standard: `text-sm` or `text-base`, `font-normal`, `text-gray-700`.
    *   Input Fields: `text-sm`, `text-gray-900` (when filled).

*   **Labels & Captions:**
    *   `text-xs` or `text-sm`, `font-medium`, `text-gray-600` or `text-gray-500`.

*   **Links:**
    *   `text-blue-600`, `hover:text-blue-700`, `hover:underline`.

*   **Buttons:**
    *   `text-sm` or `text-base`, `font-medium`.

## 4. Iconography

*   **Primary Set:** Font Awesome (as used in `sample_wireframe.md`). Ensure consistent weight and style (e.g., solid, regular).
    *   Example: `<i class="fas fa-calendar-alt"></i>`
*   **Alternative/Fallback:** Material Icons (if Font Awesome is not comprehensive enough or for specific Material UI components that come with their own icons).
*   **Sizing:** Icons should be scaled appropriately with accompanying text or interactive elements (e.g., `text-xs` to `text-xl`).
*   **Color:** Icons generally inherit text color or can be explicitly colored (e.g., `text-gray-400` for subtle icons, or status colors for alert icons).

## 5. Layout and Spacing

*   **Grid System:** Leverage Tailwind CSS's responsive grid system (`grid`, `grid-cols-*`, `gap-*`).
*   **Spacing Scale:** Use Tailwind's default spacing scale (multiples of 0.25rem) for padding, margins, gaps to ensure consistency.
    *   Examples: `p-2` (0.5rem), `m-4` (1rem), `space-x-4` (1rem horizontal spacing between children).
*   **Page Structure:** Consistent header, sidebar, and main content area as defined in wireframes.
*   **Responsive Design:** Ensure layouts adapt gracefully to different screen sizes using Tailwind's responsive prefixes (sm, md, lg, xl).

## 6. Component Styling Principles

*   **Base Components:** Material UI will provide the foundational unstyled or lightly styled components (Buttons, Inputs, Modals, Tables, etc.).
*   **Styling Layer:** Tailwind CSS utility classes will be the primary method for applying Plannar's specific look and feel (colors, spacing, typography, borders, shadows) to Material UI components or custom-built components.
*   **Custom Components:** When a suitable Material UI component is not available, build custom React components styled with Tailwind CSS.
*   **Consistency:** Strive for consistent appearance and behavior across all UI elements.
    *   **Border Radius:** Consistent use of `rounded-md` or `rounded-lg` (from Tailwind) for cards, inputs, buttons.
    *   **Shadows:** Subtle shadows for elevation, e.g., `shadow-sm` or `shadow-md` for cards and dropdowns.

## 7. Interactive Elements

*   **Buttons:**
    *   Primary: `bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg`.
    *   Secondary: `bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg` (or `border-blue-600 text-blue-600 hover:bg-blue-50`).
    *   Destructive: `bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg`.
    *   Icon Buttons: Minimal styling, rely on icon clarity.
*   **Input Fields:**
    *   `border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent`.
*   **Dropdowns/Selects:** Styled consistently with input fields.
*   **Links:** Standard blue, underlined on hover.
*   **Hover/Focus States:** Clear visual feedback for all interactive elements (e.g., change in background color, border color, shadow).

## 8. Accessibility (A11y)

*   Ensure sufficient color contrast (WCAG AA as a minimum).
*   Proper ARIA attributes for custom components.
*   Keyboard navigability for all interactive elements.
*   Focus indicators should be clear.

This style guide is a living document and will evolve as the Plannar UI is developed.
