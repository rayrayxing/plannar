# Plannar - Reusable UI Components List

This document lists key reusable UI components that will form the building blocks of the Plannar frontend. Many will be Material UI components styled with Tailwind CSS, while others might be custom composite components.

## 1. Core Application Shell

*   **AppHeader:**
    *   **Description:** Main application header containing logo, global search, notification icon/dropdown, user profile icon/dropdown.
    *   **Base:** Custom structure, Material UI Icons, Tailwind for styling.
    *   **Reference:** `sample_wireframe.md`, `wireframes/dashboard.md`.
*   **AppSidebar:**
    *   **Description:** Main navigation sidebar with links to different modules.
    *   **Base:** Material UI `Drawer` or custom, Material UI `List` & `ListItem`, Tailwind.
    *   **Reference:** `sample_wireframe.md`, `wireframes/dashboard.md`.

## 2. Page Structure & Layout

*   **PageHeader:**
    *   **Description:** Standardized header for main content pages, displaying page title and optional action buttons (e.g., "Create New Project").
    *   **Base:** Custom, Material UI `Typography`, `Button`, Tailwind.
*   **SectionContainer:**
    *   **Description:** A styled container (e.g., a Card or a bordered box) for grouping related content within a page or modal.
    *   **Base:** Material UI `Paper` or `Card`, Tailwind.
*   **FilterPanel:**
    *   **Description:** A reusable sidebar or dropdown panel containing various filter controls (selects, date pickers, search inputs) for list views.
    *   **Base:** Custom, Material UI form controls, Tailwind.

## 3. Data Display

*   **StatCard / KPIWidget:**
    *   **Description:** Compact card for displaying key metrics or statistics on dashboards (e.g., "Total Projects: 25", "Avg Utilization: 75%").
    *   **Base:** Material UI `Card`, `Typography`, Tailwind.
*   **DataTable:**
    *   **Description:** A highly reusable and consistently styled table component. Includes features like pagination, sorting, column filtering (optional), and row actions.
    *   **Base:** Material UI `Table` components (`Table`, `TableHead`, `TableBody`, `TableRow`, `TableCell`, `TablePagination`, `TableSortLabel`), Tailwind for specific styling.
*   **DetailList / DescriptionList:**
    *   **Description:** For displaying key-value pairs of information, like in a profile view or details section.
    *   **Base:** Material UI `List` or custom definition lists, Tailwind.
*   **TaskCard:**
    *   **Description:** A card to display summary information about a task (name, project, due date, status, assignee).
    *   **Base:** Material UI `Card`, Tailwind.
*   **ProjectCard:**
    *   **Description:** Similar to TaskCard, but for project summaries in list views.
    *   **Base:** Material UI `Card`, Tailwind.

## 4. Forms & Inputs

*   **StyledTextField:**
    *   **Description:** Material UI `TextField` with Plannar-specific styling (border, background, focus states) applied via Tailwind or theme overrides.
*   **StyledSelect:**
    *   **Description:** Material UI `Select` with Plannar-specific styling.
*   **StyledDatePicker:**
    *   **Description:** Material UI Date Picker (from `@mui/x-date-pickers`) with Plannar-specific styling.
*   **ResourceSelector:**
    *   **Description:** A specialized input component for selecting one or more resources. Might include search, filtering by skill/availability, and display of key resource info in the dropdown/modal.
    *   **Base:** Material UI `Autocomplete` or custom modal, Tailwind.
*   **SkillInput:**
    *   **Description:** Component for adding/editing skills, including skill name (autocomplete from taxonomy), proficiency rating (e.g., stars, slider), and years of experience.
    *   **Base:** Custom, Material UI `Autocomplete`, `Rating` or custom input, Tailwind.

## 5. Navigation & Interaction

*   **StyledButton:**
    *   **Description:** Material UI `Button` with predefined styles for primary, secondary, destructive, and icon-only variants, using Tailwind classes.
*   **ConfirmationModal:**
    *   **Description:** Standardized modal dialog for confirming actions (e.g., delete, save changes with significant impact).
    *   **Base:** Material UI `Dialog`, `DialogTitle`, `DialogContent`, `DialogActions`, `Button`, Tailwind.
*   **NotificationItem:**
    *   **Description:** Component to display a single notification in the notifications dropdown/list (icon, title, message, timestamp).
    *   **Base:** Custom, Material UI `ListItem`, `Avatar`, `Typography`, Tailwind.

## 6. Visualizations & Tags

*   **ProfileAvatar:**
    *   **Description:** Consistently styled user avatar (image or initials).
    *   **Base:** Material UI `Avatar`, Tailwind.
*   **StatusTag / Pill:**
    *   **Description:** Colored tag/pill to indicate status (e.g., Project Status: "On Track" (green), Resource Availability: "Allocated" (orange)).
    *   **Base:** Custom `<span>` or `<div>` styled with Tailwind (background color, text color, padding, border-radius).
*   **SkillTag:**
    *   **Description:** Displays a skill name, possibly with proficiency level.
    *   **Base:** Similar to StatusTag.
*   **ChartWrapper:**
    *   **Description:** A wrapper component for Echarts instances to standardize common configurations (e.g., theme, tooltip behavior, responsive resizing) for charts used in Plannar (Donut, Bar, Line, Heatmap).
    *   **Base:** Custom React component managing an Echarts instance.

This list will be refined and expanded as frontend development progresses.
