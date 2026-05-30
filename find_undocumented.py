import os
import re

# Read all selectors from index.html
with open("index.html", "r", encoding="utf-8") as f:
    html_content = f.read()

# Normalize HTML for easy searching of class names
# Find all class="..." occurrences in HTML
html_classes = set(re.findall(r'class=["\']([^"\']+)["\']', html_content))
# Split multi-class definitions (e.g. "stash-btn stash-btn-outline" -> "stash-btn", "stash-btn-outline")
split_html_classes = set()
for cls in html_classes:
    for sub_cls in cls.split():
        split_html_classes.add(sub_cls.strip())

# Read all selectors from CSS source files
css_files = [
    "src/variables.css",
    "src/reset.css",
    "src/layout.css",
    "src/components.css"
]

css_classes = set()
class_pattern = re.compile(r'\.([a-zA-Z0-9_-]+)(?::[a-z-]+)?(?:\s|\[|\.|,|{)', re.IGNORECASE)

css_file_contents = {}

for css_file in css_files:
    if os.path.exists(css_file):
        with open(css_file, "r", encoding="utf-8") as f:
            css_content = f.read()
        css_file_contents[css_file] = css_content
        # Clean comments
        clean_css = re.sub(r"/\*.*?\*/", "", css_content, flags=re.DOTALL)
        for match in class_pattern.finditer(clean_css):
            css_classes.add(match.group(1))

# Find CSS classes that are NOT in the HTML classes
undocumented = sorted(list(css_classes - split_html_classes))

print("Undocumented CSS classes:")
for u in undocumented:
    # Filter out common layout, state, layout utility tags or layout-wide overrides
    if u in ["container", "show", "active", "hover", "focus", "flipped", "disabled", "val-mobile"]:
        continue
    # Let's count where it occurs in the CSS files to see if it is a major styling class
    occurrences = []
    for css_file, c in css_file_contents.items():
        if f".{u}" in c:
            occurrences.append(os.path.basename(css_file))
    print(f"- .{u} (found in {', '.join(occurrences)})")
