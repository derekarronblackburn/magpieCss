const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');

const filesToBundle = [
    'variables.css',
    'reset.css',
    'layout.css',
    'components.css'
];

if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

let bundledContent = `/* 
 * MagpieCSS - Design System & UI Library
 * Extracted from MagpieStash app.
 * Fully responsive, multi-themed, vanilla CSS layout and components framework.
 */\n\n`;

filesToBundle.forEach(file => {
    const filePath = path.join(srcDir, file);
    if (fs.existsSync(filePath)) {
        console.log(`Bundling ${file}...`);
        const content = fs.readFileSync(filePath, 'utf-8');
        bundledContent += `/* --- START OF ${file} --- */\n`;
        bundledContent += content;
        bundledContent += `\n/* --- END OF ${file} --- */\n\n`;
    } else {
        console.error(`Warning: ${file} not found in ${srcDir}`);
    }
});

const outputPath = path.join(distDir, 'magpie.css');
fs.writeFileSync(outputPath, bundledContent, 'utf-8');
console.log(`Success! Bundle created at ${outputPath}`);
