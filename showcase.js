// Showcase Site Controller

document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation routing
    const navLinks = document.querySelectorAll('.nav-menu .nav-link');
    const sections = document.querySelectorAll('.doc-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Set active link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Show corresponding section
            const targetId = link.getAttribute('href').substring(1);
            sections.forEach(sec => {
                if (window.llmViewActive) {
                    sec.classList.remove('active');
                    if (sec.id === 'global-llm-view') {
                        sec.classList.add('active');
                    }
                    if (sec.id === targetId) {
                        window._previousActiveSectionId = targetId;
                        window.updateLlmViewContent(sec);
                    }
                } else {
                    if (sec.id === targetId) {
                        sec.classList.add('active');
                    } else {
                        sec.classList.remove('active');
                    }
                }
            });

            // Close mobile menu on click
            const mainNavMenu = document.getElementById('mainNavMenu');
            if (mainNavMenu) mainNavMenu.classList.remove('show');
            
            // Scroll to top of content
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // 2. Code Copy Functionality
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const container = btn.closest('.code-container');
            const codeEl = container.querySelector('code');
            
            // Get unescaped HTML content or clean text
            const codeText = codeEl.innerText;
            
            navigator.clipboard.writeText(codeText).then(() => {
                btn.innerText = 'Copied!';
                if (window.MagpieCSS) {
                    MagpieCSS.toast.show("Code snippet copied to clipboard!", "success", 2000);
                }
                setTimeout(() => { btn.innerText = 'Copy'; }, 2000);
            }).catch(err => {
                console.error("Failed to copy code: ", err);
                if (window.MagpieCSS) {
                    MagpieCSS.toast.show("Copy failed. Please manually select and copy.", "error", 3000);
                }
            });
        });
    });

    // 2.1 Search Filter Functionality
    const searchInput = document.querySelector('.nav-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase().trim();
            const navLinks = document.querySelectorAll('.nav-menu .nav-link');
            const menu = document.getElementById('mainNavMenu');
            if (!menu) return;

            let currentHeader = null;
            let hasVisibleLinkInGroup = false;

            Array.from(menu.children).forEach(child => {
                if (child.tagName === 'DIV') {
                    if (currentHeader) {
                        currentHeader.style.display = hasVisibleLinkInGroup || !query ? 'block' : 'none';
                    }
                    currentHeader = child;
                    hasVisibleLinkInGroup = false;
                } else if (child.tagName === 'A' && child.classList.contains('nav-link')) {
                    const text = child.textContent.toLowerCase();
                    const matches = text.includes(query);
                    child.style.display = matches ? 'block' : 'none';
                    if (matches) {
                        hasVisibleLinkInGroup = true;
                    }
                }
            });

            if (currentHeader) {
                currentHeader.style.display = hasVisibleLinkInGroup || !query ? 'block' : 'none';
            }

            // Check if any link is visible
            let anyVisible = false;
            navLinks.forEach(link => {
                if (link.style.display !== 'none') anyVisible = true;
            });

            let noResultsMsg = document.getElementById('navNoResults');
            if (!anyVisible) {
                if (!noResultsMsg) {
                    noResultsMsg = document.createElement('div');
                    noResultsMsg.id = 'navNoResults';
                    noResultsMsg.style.padding = '15px 10px';
                    noResultsMsg.style.fontSize = '0.85rem';
                    noResultsMsg.style.color = 'var(--muted-text)';
                    noResultsMsg.style.textAlign = 'center';
                    noResultsMsg.innerText = 'No components match search.';
                    menu.appendChild(noResultsMsg);
                }
            } else {
                if (noResultsMsg) noResultsMsg.remove();
            }
        });
    }

    // 3. Setup dynamic demo listeners
    setupDemoListeners();
    checkChangelog();
});

// Setup interactive features on the showcase page
function setupDemoListeners() {
    // Tab controls
    if (window.MagpieCSS) {
        MagpieCSS.ui.initTabs('.admin-tabs');
    }

    // Toggle Mobile menu
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileToggle) {
        mobileToggle.onclick = () => {
            const nav = document.getElementById('mainNavMenu');
            if (nav) nav.classList.toggle('show');
        };
    }

    // 3.1 Theme toggler in showcase header
    window.setAppTheme = function(themeName) {
        if (window.MagpieCSS) {
            MagpieCSS.theme.set(themeName);
            
            // Sync theme modal/dropdown items
            document.querySelectorAll('.theme-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            const activeBtn = document.getElementById('btn-theme-' + themeName);
            if (activeBtn) activeBtn.classList.add('active');
            
            // Update color swatch values based on active theme variables
            updateColorSwatchValues();
        }
    };

    // Update showcase swatches with real calculated CSS variable colors
    function updateColorSwatchValues() {
        const swatches = document.querySelectorAll('.swatch-card');
        swatches.forEach(swatch => {
            const varName = swatch.querySelector('.swatch-var').innerText.trim();
            const colorBlock = swatch.querySelector('.swatch-color');
            const labelValue = swatch.querySelector('.swatch-hex');
            
            // Read computed variable style value
            const computedColor = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
            colorBlock.style.backgroundColor = `var(${varName})`;
            if (labelValue) labelValue.innerText = computedColor || 'N/A';
        });
    }
    
    // Initial swatch calculation
    setTimeout(updateColorSwatchValues, 200);
    window.addEventListener('magpie-theme-change', updateColorSwatchValues);

    // 3.2 Dynamic Toast triggers
    window.triggerToast = function(type) {
        if (!window.MagpieCSS) return;
        
        if (type === 'success') {
            MagpieCSS.toast.show("Vault item 'Vintage Camera' saved successfully!", "success");
        } else if (type === 'error') {
            MagpieCSS.toast.show("Failed to update warehouse bin. Database error occurred.", "error");
        } else if (type === 'warning') {
            MagpieCSS.toast.show("Warning: Storage space is reaching 95% capacity.", "warning");
        }
    };

    window.triggerClippy = function() {
        if (!window.MagpieCSS) return;
        
        MagpieCSS.toast.showClippy(
            "Version 1.5.0 has landed!", 
            "We have added spatial mapping support for multiple floor levels and receipts upload features. Click to check the full notes.",
            8000,
            () => {
                MagpieCSS.dialog.alert("Here are the Release Notes for version 1.5.0:\n- Added multi-layered spatial mapping editor.\n- Integrated secure document vaults.\n- Enhanced mobile responsive layouts.", "MagpieStash Updates");
            }
        );
    };

    // 3.3 Dynamic Dialogs triggers
    window.triggerAlert = function() {
        if (!window.MagpieCSS) return;
        MagpieCSS.dialog.alert("Your file 'warranty_info.pdf' has been successfully uploaded and encrypted in the vault.", "File Upload Completed");
    };

    window.triggerConfirm = function() {
        if (!window.MagpieCSS) return;
        MagpieCSS.dialog.confirm("Are you sure you want to permanently delete the location 'Garage Shelf B'? This will de-stash 14 items.", "Delete Location").then(confirmed => {
            if (confirmed) {
                MagpieCSS.toast.show("Location deleted. Items moved to Unsorted Vault.", "success");
            } else {
                MagpieCSS.toast.show("Delete operation cancelled.", "warning");
            }
        });
    };

    // 3.4 Spatial mapping interactive controls
    window.toggleCanvasPalette = function() {
        const pal = document.getElementById('demoPalette');
        if (pal) pal.classList.toggle('expanded');
    };

    window.selectCanvasTool = function(btn, toolName) {
        const btns = btn.parentNode.querySelectorAll('.tool-btn');
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Show status toast
        if (window.MagpieCSS) {
            MagpieCSS.toast.show(`Tool switched to: ${toolName}`, 'success', 1500);
        }
    };

    window.toggleCanvasFullscreen = function() {
        const container = document.getElementById('demoMapContainer');
        if (container) {
            container.classList.toggle('fullscreen');
            
            // Esc key exits fullscreen
            const escHandler = (e) => {
                if (e.key === 'Escape' && container.classList.contains('fullscreen')) {
                    container.classList.remove('fullscreen');
                    document.removeEventListener('keydown', escHandler);
                }
            };
            
            if (container.classList.contains('fullscreen')) {
                document.addEventListener('keydown', escHandler);
                if (window.MagpieCSS) MagpieCSS.toast.show("Press ESC to exit fullscreen mode.", "success", 2000);
            }
        }
    };

    // 3.5 Hierarchical tree expand/collapse demo
    window.toggleTreeDetails = function(summaryEl) {
        // Toggle the icon dynamically
        const details = summaryEl.parentNode;
        const icon = summaryEl.querySelector('.node-toggle-icon');
        
        // Wait a tiny bit for the 'open' attribute state to toggle
        setTimeout(() => {
            if (details.hasAttribute('open')) {
                if (icon) icon.style.transform = 'rotate(0deg)';
            } else {
                if (icon) icon.style.transform = 'rotate(-90deg)';
            }
        }, 50);
    };
    
    // Setup detail summaries for icons
    document.querySelectorAll('details.tree-node > summary').forEach(sum => {
        sum.addEventListener('click', () => {
            window.toggleTreeDetails(sum);
        });
    });

    // 3.6 Location item Details toggle button
    window.toggleAdvancedDrawer = function() {
        const toggleBtn = document.getElementById('drawerToggleBtn');
        const drawer = document.getElementById('advancedDrawer');
        if (toggleBtn && drawer) {
            toggleBtn.classList.toggle('active');
            drawer.classList.toggle('show');
        }
    };

    // SVG Icon Search Filter
    const svgSearch = document.getElementById('svgIconSearchInput');
    if (svgSearch) {
        svgSearch.addEventListener('input', () => {
            const query = svgSearch.value.toLowerCase().trim();
            const groups = document.querySelectorAll('#svg-gallery .gallery-category-group');
            
            groups.forEach(group => {
                const cards = group.querySelectorAll('.icon-card');
                let groupHasVisible = false;
                
                cards.forEach(card => {
                    const names = card.getAttribute('data-name').toLowerCase();
                    if (names.includes(query)) {
                        card.style.display = 'flex';
                        groupHasVisible = true;
                    } else {
                        card.style.display = 'none';
                    }
                });
                
                group.style.display = groupHasVisible ? 'block' : 'none';
            });
        });
    }
}

// 4. Changelog (What's Changed) system
async function checkChangelog() {
    try {
        const res = await fetch('changelog.json?t=' + new Date().getTime());
        if (!res.ok) return;
        const changelog = await res.json();
        if (changelog.length === 0) return;
        
        const latest = changelog[0];
        const lastSeen = localStorage.getItem('magpie_css_last_version');
        
        if (lastSeen !== latest.version) {
            if (window.MagpieCSS) {
                // Trigger the Clippy notification toast
                MagpieCSS.toast.showClippy(
                    `MagpieCSS v${latest.version} Released!`,
                    `${latest.highlight} Click below to see what changed in the design system library.`,
                    10000,
                    () => {
                        localStorage.setItem('magpie_css_last_version', latest.version);
                        window.openChangelogModal();
                    }
                );
            }
        }
    } catch (e) {
        console.error("Failed to check changelog", e);
    }
}

window.openChangelogModal = async function(e) {
    if (e) e.preventDefault();
    const modal = document.getElementById('changelogModal');
    if (!modal) return;
    
    modal.style.display = 'flex';
    const contentDiv = document.getElementById('changelogContent');
    if (!contentDiv) return;
    
    contentDiv.innerHTML = '<div style="text-align: center; padding: 20px; color: var(--muted-text);">Loading release notes...</div>';
    
    try {
        const res = await fetch('changelog.json?t=' + new Date().getTime());
        if (!res.ok) {
            contentDiv.innerHTML = '<div style="color: var(--danger); text-align: center; padding: 20px;">Could not load changelog.json.</div>';
            return;
        }
        const changelog = await res.json();
        
        // Use a dedicated inner container with right padding so text never touches the scrollbar
        contentDiv.innerHTML = '<div id="changelogContentInner" style="display: flex; flex-direction: column; gap: 25px; padding-right: 16px;"></div>';
        const innerDiv = document.getElementById('changelogContentInner');
        
        changelog.forEach(release => {
            const changesList = release.changes.map(c => `<li style="margin-bottom: 6px;">${c}</li>`).join('');
            const html = `
                <div style="border-left: 3px solid var(--accent); padding-left: 15px;">
                    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px;">
                        <h3 style="margin: 0; color: var(--text); font-size: 1.15rem;">v${release.version}</h3>
                        <span style="font-size: 0.75rem; color: var(--muted-text);">${release.date}</span>
                    </div>
                    <p style="color: var(--secondary); font-size: 0.9rem; margin-top: 0; margin-bottom: 12px; font-weight: 500;"><em>${release.highlight}</em></p>
                    <ul style="color: var(--text); font-size: 0.85rem; padding-left: 18px; line-height: 1.5; margin: 0 0 10px 0;">
                        ${changesList}
                    </ul>
                </div>
            `;
            innerDiv.insertAdjacentHTML('beforeend', html);
        });
        
        if (changelog.length > 0) {
            localStorage.setItem('magpie_css_last_version', changelog[0].version);
        }
    } catch (e) {
        console.error("Failed to load changelog", e);
        contentDiv.innerHTML = '<div style="color: var(--danger); text-align: center; padding: 20px;">Error fetching release notes.</div>';
    }
};

window.triggerLoadingModal = function() {
    let modal = document.getElementById('demoLoadingModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'demoLoadingModal';
        modal.className = 'modal-overlay';
        modal.style.zIndex = '30000';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 300px; text-align: center; padding: 30px;">
                <div class="spinner large" style="margin-bottom: 15px; border-top-color: var(--accent);"></div>
                <div style="font-weight: 600; color: var(--text); font-family: 'Outfit', sans-serif;">Synchronizing Database...</div>
                <div style="font-size: 0.8rem; color: var(--muted-text); margin-top: 5px; font-family: monospace;">STATUS: ENCRYPTING_VAULT</div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    modal.style.display = 'flex';
    
    setTimeout(() => {
        modal.style.display = 'none';
        if (window.MagpieCSS) {
            MagpieCSS.toast.show("Vault synchronization complete!", "success");
        }
    }, 3000);
};

window.copySvgToClipboard = function(card) {
    const svgEl = card.querySelector('svg').cloneNode(true);
    // Add standard xmlns attribute
    svgEl.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const svgText = svgEl.outerHTML;

    navigator.clipboard.writeText(svgText).then(() => {
        const nameEl = card.querySelector('.icon-card-name');
        const hintEl = card.querySelector('.icon-card-copy-hint');
        const originalName = nameEl.innerText;

        nameEl.innerText = 'Copied!';
        hintEl.style.opacity = '0';
        
        card.style.borderColor = 'var(--secondary)';
        card.style.background = 'color-mix(in srgb, var(--secondary) 8%, transparent)';

        if (window.MagpieCSS) {
            MagpieCSS.toast.show(`Copied ${originalName} SVG markup!`, "success", 1500);
        }

        setTimeout(() => {
            nameEl.innerText = originalName;
            hintEl.style.opacity = '';
            card.style.borderColor = '';
            card.style.background = '';
        }, 1500);
    }).catch(err => {
        console.error("Failed to copy SVG: ", err);
        if (window.MagpieCSS) {
            MagpieCSS.toast.show("Copy failed. Please try again.", "error");
        }
    });
};

window.toggleWikiCmsView = function() {
    const container = document.getElementById('wikiCmsContainer');
    const content = document.getElementById('wikiHtmlContent');
    const codeEl = document.getElementById('wikiCmsCode');
    
    if (!container || !content || !codeEl) return;
    
    if (container.style.display === 'none') {
        const markdown = window.MagpieCSS.cms.toMarkdown(content);
        codeEl.innerText = markdown;
        container.style.display = 'block';
        if (window.MagpieCSS) {
            window.MagpieCSS.toast.show("Content negotiated! Accept: text/markdown served.", "success", 2000);
        }
    } else {
        container.style.display = 'none';
    }
};

window.copyWikiCmsMarkdown = function() {
    const codeEl = document.getElementById('wikiCmsCode');
    if (!codeEl) return;
    navigator.clipboard.writeText(codeEl.innerText).then(() => {
        if (window.MagpieCSS) {
            window.MagpieCSS.toast.show("Markdown copied to clipboard!", "success", 1500);
        }
    }).catch(err => {
        console.error("Failed to copy Markdown: ", err);
    });
};

// Global LLM / Agent View Toggle System
window.llmViewActive = false;

window.updateLlmViewContent = function(section) {
    if (!section) return;
    const codeEl = document.getElementById('globalLlmCode');
    if (!codeEl) return;
    
    const markdown = window.MagpieCSS.cms.toMarkdown(section);
    codeEl.innerText = markdown;
    
    const titleEl = document.getElementById('globalLlmTitle');
    if (titleEl) {
        const titleText = section.querySelector('.doc-section-title')?.innerText.trim() || 'Active Section';
        titleEl.innerText = `LLM Accept: text/markdown - ${titleText}`;
    }
};

window.toggleGlobalLlmView = function() {
    const btnText = document.getElementById('globalLlmBtnText');
    const llmSection = document.getElementById('global-llm-view');
    const toggleBtn = document.getElementById('globalLlmToggleBtn');
    if (!llmSection || !btnText) return;
    
    window.llmViewActive = !window.llmViewActive;
    
    if (window.llmViewActive) {
        const currentActive = Array.from(document.querySelectorAll('.doc-section')).find(s => s.classList.contains('active') && s.id !== 'global-llm-view');
        if (currentActive) {
            window._previousActiveSectionId = currentActive.id;
            window.updateLlmViewContent(currentActive);
            currentActive.classList.remove('active');
        }
        llmSection.classList.add('active');
        if (toggleBtn) toggleBtn.classList.add('active');
        if (window.MagpieCSS) {
            window.MagpieCSS.toast.show("Agent View Enabled (Accept: text/markdown)", "success", 2000);
        }
    } else {
        llmSection.classList.remove('active');
        const prevSection = document.getElementById(window._previousActiveSectionId || 'overview');
        if (prevSection) prevSection.classList.add('active');
        if (toggleBtn) toggleBtn.classList.remove('active');
        if (window.MagpieCSS) {
            window.MagpieCSS.toast.show("Return to Human View (Accept: text/html)", "success", 2000);
        }
    }
};

window.copyGlobalLlmMarkdown = function() {
    const codeEl = document.getElementById('globalLlmCode');
    if (!codeEl) return;
    navigator.clipboard.writeText(codeEl.innerText).then(() => {
        if (window.MagpieCSS) {
            window.MagpieCSS.toast.show("Global Markdown copied!", "success", 1500);
        }
    }).catch(err => {
        console.error("Failed to copy Markdown: ", err);
    });
};


