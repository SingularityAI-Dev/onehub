# OneHub v2 Design System

This document specifies the foundational design system for OneHub v2. It is heavily inspired by the principles of **shadcn/ui**, emphasizing composability, accessibility, and customizability over a monolithic component library.

## Guiding Principles

1.  **Not a Library, but a Collection:** We are not building an external, versioned component library. Instead, this document describes components that developers can copy and paste into their applications, giving them full control over the code.
2.  **Radical Composability:** Components are built from unstyled, accessible primitives (like Radix UI). This allows for maximum flexibility and composition.
3.  **Accessibility First:** All components are designed with WAI-ARIA standards at their core. Keyboard navigation, focus management, and screen reader support are mandatory.
4.  **Developer Experience:** The system should be easy to use and customize. Styling is done via utility classes (e.g., Tailwind CSS), making it simple to tweak a component's appearance without overriding complex CSS.

---

## Primitives & Foundations

### Colors

Colors are defined using a simple palette. All names are semantic.

-   **Primary:** `primary` (for main CTAs, active states), `primary-foreground` (text on primary).
-   **Secondary:** `secondary` (for less prominent elements), `secondary-foreground` (text on secondary).
-   **Destructive:** `destructive` (for actions that delete data), `destructive-foreground`.
-   **Muted:** `muted` (for placeholder text, borders), `muted-foreground`.
-   **Background:** `background` (main app background), `foreground` (default text color).
-   **Card:** `card` (background of cards/widgets), `card-foreground`.
-   **Border:** `border`.

### Typography

-   **Font Family:** Inter (sans-serif).
-   **Headings:** `h1`, `h2`, `h3`, `h4` with defined sizes and weights.
-   **Body:** `p` (standard body text), `small` (for finer print), `muted` (for less important text).

### Spacing

A 4px base unit is used for all spacing (margins, padding, gaps). The scale is `0.5`, `1`, `1.5`, `2`, `2.5`, `3`, `4`, etc.

---

## Core Components

### 1. Button

-   **Description:** Used for triggering actions.
-   **Variants:**
    -   `default`: The standard, primary button.
    -   `secondary`: Less emphasis, for secondary actions.
    -   `destructive`: For dangerous actions (e.g., "Delete").
    -   `outline`: A transparent button with a border.
    -   `ghost`: A transparent, borderless button.
    -   `link`: A button that looks like a hyperlink.
-   **States:** `default`, `hover`, `focus`, `disabled`.
-   **Accessibility:** Must have a clear focus ring. Icon-only buttons must use `aria-label`.

### 2. Input Field

-   **Description:** A standard text input field.
-   **States:** `default`, `focus`, `disabled`, `error`.
-   **Accessibility:** Must be associated with a `label`. An `id` is required. The error state should be linked via `aria-describedby`.

### 3. Modal / Dialog

-   **Description:** A window overlaid on the primary content to display critical information or request user input.
-   **Structure:**
    -   `DialogOverlay`: A translucent background that covers the main content.
    -   `DialogContent`: The main modal container.
    -   `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`.
-   **Accessibility:** Must trap keyboard focus. Can be closed with the `Escape` key. `aria-labelledby` and `aria-describedby` are required for the title and description.

### 4. Navigation Bar

-   **Description:** The primary application header.
-   **Structure:**
    -   **Left:** Logo and application name.
    -   **Center:** (Optional) Main navigation links.
    -   **Right:** User profile dropdown (with links to settings, logout) and other key actions.
-   **Behavior:** Must be fully responsive, collapsing into a "hamburger" menu on smaller viewports.

### 5. Widget Container (Card)

-   **Description:** This is the standardized container for all service widgets (e.g., Metabase, HubSpot Campaign Monitor). It provides a consistent look and feel for all embedded content.
-   **Structure (built using the `Card` component):**
    -   `CardHeader`: Contains `CardTitle` and `CardDescription`. The title should be the name of the widget (e.g., "Key Business Metrics").
    -   `CardContent`: The main body where the external widget (e.g., a Metabase iframe) is rendered. This area should have defined states.
    -   `CardFooter`: (Optional) Can contain metadata, such as "Last updated" timestamps or links to the source service.
-   **States:**
    -   **Loading:** A skeleton loader should be displayed while the widget's data is being fetched.
    -   **Empty:** A message and (optional) an icon should be displayed if the widget has no data to show.
    -   **Error:** A clear error message with a "Try Again" action should be shown if the widget fails to load.
    -   **Active:** The fully rendered, interactive widget.
