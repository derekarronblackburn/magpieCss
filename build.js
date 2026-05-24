const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');

const cssFiles = [
    'variables.css',
    'reset.css',
    'layout.css',
    'components.css',
    'icons.css'
];

// 0. Auto-extract SVGs from index.html and generate src/icons.css
try {
    console.log("Extracting SVG vectors from index.html to generate src/icons.css...");
    const indexHtmlPath = path.join(__dirname, 'index.html');
    const indexHtmlContent = fs.readFileSync(indexHtmlPath, 'utf-8');

    const cardRegex = /<div\s+class="icon-card"[^>]*>([\s\S]*?)<\/div>/g;
    const svgRegex = /<svg[^>]*>([\s\S]*?)<\/svg>/;
    const nameRegex = /<span\s+class="icon-card-name">([^<]+)<\/span>/;

    let iconsCssContent = `/* 
 * MagpieCSS Generated Icons
 * Automatically generated from the SVG Icon Gallery in index.html.
 * Do not modify this file directly.
 */

.m-icon {
    display: inline-block;
    width: 24px;
    height: 24px;
    background-color: currentColor;
    -webkit-mask-size: contain;
    mask-size: contain;
    -webkit-mask-position: center;
    mask-position: center;
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    vertical-align: middle;
}

`;

    let match;
    let count = 0;
    while ((match = cardRegex.exec(indexHtmlContent)) !== null) {
        const cardBody = match[1];
        const svgMatch = svgRegex.exec(cardBody);
        const nameMatch = nameRegex.exec(cardBody);
        
        if (svgMatch && nameMatch) {
            const svgContent = svgMatch[0];
            const rawName = nameMatch[1].trim().toLowerCase();
            const cleanName = rawName
                .replace(/\s*\/\s*/g, '-')
                .replace(/\s+/g, '-');
                
            // Convert to solid stroke and solid fill for masking
            let cssSvg = svgContent
                .replace(/stroke="currentColor"/g, 'stroke="black"')
                .replace(/fill="currentColor"/g, 'fill="black"');
                
            // URL encoding for CSS data URI
            const encodedSvg = cssSvg
                .replace(/#/g, '%23')
                .replace(/\r?\n/g, '')
                .replace(/\s+/g, ' ')
                .trim();
                
            iconsCssContent += `.m-icon-${cleanName} {
    -webkit-mask-image: url('data:image/svg+xml;utf8,${encodedSvg}');
    mask-image: url('data:image/svg+xml;utf8,${encodedSvg}');
}

`;
            count++;
        }
    }

    const iconsCssPath = path.join(srcDir, 'icons.css');
    fs.writeFileSync(iconsCssPath, iconsCssContent, 'utf-8');
    console.log(`Successfully generated ${iconsCssPath} with ${count} icon classes.`);
} catch (err) {
    console.error("Error generating icons.css:", err);
    process.exit(1);
}

if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

// 1. Bundle CSS
console.log("Starting CSS bundling...");
let bundledCss = `/* 
 * MagpieCSS - Design System & UI Library
 * Extracted from MagpieStash app.
 * Fully responsive, multi-themed, vanilla CSS layout and components framework.
 */\n\n`;

cssFiles.forEach(file => {
    const filePath = path.join(srcDir, file);
    if (fs.existsSync(filePath)) {
        console.log(`Bundling ${file}...`);
        const content = fs.readFileSync(filePath, 'utf-8');
        bundledCss += `/* --- START OF ${file} --- */\n`;
        bundledCss += content;
        bundledCss += `\n/* --- END OF ${file} --- */\n\n`;
    } else {
        console.error(`Warning: ${file} not found in ${srcDir}`);
    }
});

const cssOutputPath = path.join(distDir, 'magpie.css');
fs.writeFileSync(cssOutputPath, bundledCss, 'utf-8');
console.log(`Success! Bundle created at ${cssOutputPath}`);

// 2. Minify CSS
console.log("Minifying CSS...");
let minifiedCss = bundledCss
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s+/g, ' ')             // Collapse spaces
    .replace(/\s*([\{\};:])\s*/g, '$1') // Remove spaces around delimiters
    .replace(/;}/g, '}')              // Remove trailing semicolons inside blocks
    .trim();

const cssMinOutputPath = path.join(distDir, 'magpie.min.css');
fs.writeFileSync(cssMinOutputPath, minifiedCss, 'utf-8');
console.log(`Success! Minified CSS created at ${cssMinOutputPath}`);

// 3. Minify JS
console.log("Minifying JS...");
const jsSrcPath = path.join(distDir, 'magpie.js'); // Read the source JS file
if (fs.existsSync(jsSrcPath)) {
    const jsContent = fs.readFileSync(jsSrcPath, 'utf-8');
    
    // Simple regex JS minification: remove comments and extra whitespace
    let minifiedJs = jsContent
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
        .replace(/\/\/.*$/gm, '')         // Remove line comments
        .replace(/^\s+|\s+$/gm, '')       // Trim line spaces
        .replace(/\n+/g, '\n')            // Remove empty lines
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n'); // Keep line breaks for safety with semicolon insertion, but heavily stripped

    const jsMinOutputPath = path.join(distDir, 'magpie.min.js');
    fs.writeFileSync(jsMinOutputPath, minifiedJs, 'utf-8');
    console.log(`Success! Minified JS created at ${jsMinOutputPath}`);
} else {
    console.error("Warning: magpie.js not found in dist/ for JS minification.");
}

// Compare file sizes
const getKBS = (p) => (fs.statSync(p).size / 1024).toFixed(2) + " KB";
console.log("\n--- File Size Comparison ---");
console.log(`magpie.css:     ${getKBS(cssOutputPath)}`);
console.log(`magpie.min.css: ${getKBS(cssMinOutputPath)}`);
if (fs.existsSync(jsSrcPath)) {
    const jsMinPath = path.join(distDir, 'magpie.min.js');
    console.log(`magpie.js:      ${getKBS(jsSrcPath)}`);
    console.log(`magpie.min.js:  ${getKBS(jsMinPath)}`);
}
