const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

// Helper to run build and mock fs directly rather than using t.mock
// due to how require evaluates the module sync
const runBuildAndCapture = (mockFiles) => {
    const writtenFiles = {};

    const origWrite = fs.writeFileSync;
    const origRead = fs.readFileSync;
    const origExists = fs.existsSync;
    const origMkdir = fs.mkdirSync;
    const origStat = fs.statSync;
    const origLog = console.log;
    const origError = console.error;

    fs.writeFileSync = (p, data) => {
        writtenFiles[p] = data;
    };

    fs.readFileSync = (p, e) => {
        if (typeof p !== 'string') return '';
        if (p.endsWith('variables.css')) return '/* variables */\n:root { --color: red; }';
        if (p.endsWith('reset.css')) return '/* reset */\n* { margin: 0; }';
        if (p.endsWith('layout.css')) return '/* layout */\n.layout { display: flex; }';
        if (p.endsWith('components.css')) return '/* components */\n.btn { padding: 10px; }';
        if (p.endsWith('icons.css')) return '/* icons */\n.icon { width: 24px; }';
        if (p.endsWith('index.html')) return '<div class="icon-card"><svg><path d="M0 0h24v24H0z"/></svg><span class="icon-card-name">test-icon</span></div>';
        if (p.endsWith('magpie.js')) return 'console.log("hello");';
        return origRead(p, e);
    };

    fs.existsSync = (p) => {
        if (typeof p !== 'string') return false;
        if (p.endsWith('variables.css')) return mockFiles.variables !== false;
        if (p.endsWith('reset.css')) return mockFiles.reset !== false;
        if (p.endsWith('layout.css')) return mockFiles.layout !== false;
        if (p.endsWith('components.css')) return mockFiles.components !== false;
        if (p.endsWith('icons.css')) return true; // generated
        if (p.endsWith('magpie.js')) return true;
        if (p.endsWith('dist')) return true;
        return false;
    };

    fs.mkdirSync = () => {};
    fs.statSync = () => ({size: 100});

    console.log = () => {};
    console.error = () => {};

    try {
        const buildPath = path.resolve(__dirname, '../build.js');
        delete require.cache[require.resolve(buildPath)];
        require(buildPath);
    } finally {
        // Restore immediately
        fs.writeFileSync = origWrite;
        fs.readFileSync = origRead;
        fs.existsSync = origExists;
        fs.mkdirSync = origMkdir;
        fs.statSync = origStat;
        console.log = origLog;
        console.error = origError;
    }

    return writtenFiles;
};

test('CSS Bundling Happy Path', () => {
    const writtenFiles = runBuildAndCapture({});

    const cssPath = Object.keys(writtenFiles).find(p => p.endsWith('magpie.css') && !p.endsWith('magpie.min.css'));
    assert.ok(cssPath, 'magpie.css should be created');

    const bundledContent = writtenFiles[cssPath];
    assert.ok(bundledContent.includes('/* --- START OF variables.css --- */'), 'Should include variables.css');
    assert.ok(bundledContent.includes(':root { --color: red; }'), 'Should include variables.css content');

    assert.ok(bundledContent.includes('/* --- START OF reset.css --- */'), 'Should include reset.css');
    assert.ok(bundledContent.includes('/* --- START OF layout.css --- */'), 'Should include layout.css');
    assert.ok(bundledContent.includes('/* --- START OF components.css --- */'), 'Should include components.css');
    assert.ok(bundledContent.includes('/* --- START OF icons.css --- */'), 'Should include icons.css');
});

test('CSS Bundling Edge Case', () => {
    const writtenFiles = runBuildAndCapture({ layout: false });

    const cssPath = Object.keys(writtenFiles).find(p => p.endsWith('magpie.css') && !p.endsWith('magpie.min.css'));
    assert.ok(cssPath, 'magpie.css should be created');

    const bundledContent = writtenFiles[cssPath];
    assert.ok(!bundledContent.includes('/* --- START OF layout.css --- */'), 'Should NOT include layout.css header');
    assert.ok(bundledContent.includes('/* --- START OF components.css --- */'), 'Should include components.css');
});
