# MagpieCSS

A modern, open-source vanilla CSS design system and components library designed for building beautiful, responsive, and highly themeable web applications, dashboards, and wikis.

MagpieCSS features a curated, dark-slate visual style by default, with built-in variables supporting multiple color themes.

---

## Key Features

* **Five Built-In Themes**: Easily toggle between **Magpie** (slate blue & teal), **Dark Mode**, **Light Mode**, **High Contrast** (accessibility stark contrast), and a retro monospace **Terminal** theme.
* **Responsive App Layouts**: Responsive side-navigation dashboard layouts that seamlessly transform for small/mobile screens.
* **Airtable-Style Dense Grid**: A data table style designed for high information density that dynamically transforms into list cards on mobile devices (screens under `800px` wide).
* **Hierarchical Trees**: Collapsible location/folder tree structures styled using native `<details>` and summary connector elements.
* **UI Component Kit**: Custom-styled form elements, toggle switches, buttons, modals, and slide-in toast notifications (including a retro interactive assistant toast!).
* **Spatial Mapping Canvas UI**: Standard layout rules for overlay tool palettes, floating controls, color pickers, and viewport view selectors.
* **Print and PDF Styles**: Dedicated high-contrast printer styles ideal for index listings, audits, or invoice exports.

---

## File Structure

* **`src/`** (Modular Core):
  - `variables.css` - Custom properties for themes, spacing, and transition speeds.
  - `reset.css` - Normalizations, custom webkit/firefox scrollbars, and Terminal theme font overrides.
  - `layout.css` - Desktop/mobile side navigation layouts, full-width utility overrides, and printer media.
  - `components.css` - Form inputs, file uploads, buttons, badges, data tables, trees, modals, alerts, and tool palettes.
* **`dist/`** (Distribution):
  - `magpie.css` / `magpie.min.css` - Bundled production stylesheets (unminified and minified).
  - `magpie.js` / `magpie.min.js` - Companion helper scripts (unminified and minified).

---

## Getting Started

To use MagpieCSS in your project, copy the distribution files (preferably `magpie.min.css` and `magpie.min.js` for production) into your project directory.

### 1. Link Assets in HTML

```html
<!DOCTYPE html>
<html lang="en" data-theme="magpie">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My App</title>
    <!-- Link MagpieCSS -->
    <link rel="stylesheet" href="dist/magpie.css">
</head>
<body>

    <!-- Your content here -->

    <!-- Link MagpieCSS Script -->
    <script src="dist/magpie.js"></script>
</body>
</html>
```

### 2. Swap Themes Programmatically

You can switch the visual theme dynamically via JavaScript:

```javascript
// Available themes: 'magpie', 'dark', 'light', 'hc', 'terminal'
MagpieCSS.theme.set('terminal');
```

### 3. Add a Code Snippet Card

MagpieCSS includes a styled, copyable `.code-block` component:

```html
<div class="code-block">
  <div class="code-block-header">
    <span class="code-block-lang">HTML</span>
    <button class="code-block-copy">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
      </svg>
      <span class="copy-label">Copy</span>
    </button>
  </div>
  <pre><code>&lt;link rel="stylesheet" href="magpie.css"&gt;</code></pre>
</div>
```

The companion script automatically detects and registers interactive copy-to-clipboard handlers for all `.code-block-copy` buttons.

---

## Development & Customization

If you want to modify the source code, make your changes directly inside the files in the `src/` directory.

To recompile and bundle the changes into `dist/magpie.css`, ensure you have Node.js installed, then run the bundler script in the root directory:

```bash
node build.js
```

---

## Core Tenets

* **Zero Emojis**: MagpieCSS is designed for clean, professional, and dense flat-vector layouts. The use of Unicode emojis (colored or default pictographs) is strictly prohibited in buttons, headers, components, or templates. Always use inline SVGs or custom CSS stylings instead of pictograph character mappings.

---

## License

This project is licensed under the MIT License. Feel free to use it for personal or commercial projects!
