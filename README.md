# MagpieCSS/CMS

A modern, open-source vanilla CSS design system and components library designed for building beautiful, responsive, and highly themeable web applications, dashboards, and wikis.

MagpieCSS/CMS features a curated, dark-slate visual style by default, with built-in variables supporting multiple color themes.

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

To use MagpieCSS/CMS in your project, copy the distribution files (preferably `magpie.min.css` and `magpie.min.js` for production) into your project directory.

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

MagpieCSS/CMS includes a styled, copyable `.code-block` component:

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

## CMS (Cascading Markdown Sheets) & LLM Content Negotiation

**Cascading Markdown Sheets (CMS)** is a client-side compiler design pattern built into MagpieCSS/CMS. Instead of forcing AI crawlers to parse bloated DOM trees or maintaining separate sets of static markdown files, the CMS engine translates visual HTML layouts on the fly into clean, token-efficient Markdown.

### How It Works

1. **Content Negotiation (HTTP Accept Header)**: When an LLM crawler or AI agent requests a page with the header `Accept: text/markdown`, the server intercepts the request, bypasses the HTML/CSS layout rendering entirely, and returns the raw Markdown payload.
2. **Client-Side DOM Compiler**: If the page is already rendered in the browser, the client-side helper `MagpieCSS.cms.toMarkdown(element)` recursively inspects the target elements (handling complex grids, tables, and details trees) while stripping away visual helpers (copy buttons, theme switches, and layout wrappers) to deliver pure semantic context.

---

### How to Implement It

#### 1. Server-Side Content Negotiation

##### Python / FastAPI
Detect the incoming `Accept` header to dynamically serve Markdown payloads instead of HTML templates:

```python
from fastapi import FastAPI, Header, Response
from fastapi.responses import HTMLResponse

app = FastAPI()

@app.get("/dashboard", response_class=HTMLResponse)
def read_dashboard(accept: str = Header(None)):
    if accept and "text/markdown" in accept:
        markdown_content = """# System Dashboard
- **Active Nodes**: 12
- **Status**: Operational
- **Load**: Normal"""
        return Response(content=markdown_content, media_type="text/markdown")
    
    # Otherwise return normal HTML template
    return "<html>...</html>"
```

##### Node.js / Express
```javascript
app.get('/dashboard', (req, res) => {
    if (req.headers.accept && req.headers.accept.includes('text/markdown')) {
        res.type('text/markdown');
        return res.send('# System Dashboard\n\n- Active nodes: 12\n- Status: OK');
    }
    res.sendFile(path.join(__dirname, 'index.html'));
});
```

#### 2. Client-Side DOM-to-Markdown (MagpieCSS.cms API)
Instantly compile any rendered sub-tree of the active DOM into Markdown for dynamic clipboard copies, local agent prompts, or client-side indexing:

```javascript
// Select the DOM container to translate
const contentNode = document.getElementById('my-document-root');

// Compile DOM to clean Markdown (strips layout, theme styling and copy actions)
const markdown = MagpieCSS.cms.toMarkdown(contentNode);

console.log(markdown);
```

---

## Core Tenets

* **Zero Emojis**: MagpieCSS/CMS is designed for clean, professional, and dense flat-vector layouts. The use of Unicode emojis (colored or default pictographs) is strictly prohibited in buttons, headers, components, or templates. Always use inline SVGs or custom CSS stylings instead of pictograph character mappings.
* **LLM-Friendly Legibility**: DOM hierarchies, design tokens, and class naming conventions are engineered to be readable by LLMs. Includes dynamic DOM-to-Markdown (CMS) parsers for agent content negotiation (serving styled HTML to humans and token-efficient Markdown to AI agents).

---

## License

This project is licensed under the MIT License. Feel free to use it for personal or commercial projects!
