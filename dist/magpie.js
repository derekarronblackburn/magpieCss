/**
 * MagpieCSS Helper Library
 * Client-side script to manage themes, dialog modals, toasts, and dropdowns.
 */

const MagpieCSS = {
    // --- 1. THEME MANAGER ---
    theme: {
        getSaved: function() {
            return localStorage.getItem('magpiestash-theme') || 'magpie';
        },
        set: function(themeName) {
            document.documentElement.setAttribute('data-theme', themeName);
            localStorage.setItem('magpiestash-theme', themeName);
            
            // Dispatch custom event if other scripts want to listen
            window.dispatchEvent(new CustomEvent('magpie-theme-change', { detail: themeName }));
        },
        init: function() {
            const saved = this.getSaved();
            this.set(saved);
        }
    },

    // --- 2. DYNAMIC TOAST SYSTEM ---
    toast: {
        show: function(message, type = 'success', duration = 3000) {
            let toast = document.getElementById('magpieToast');
            
            // Create element dynamically if it doesn't exist
            if (!toast) {
                toast = document.createElement('div');
                toast.id = 'magpieToast';
                document.body.appendChild(toast);
            }
            
            // Set styles & icon based on type
            toast.style.display = 'flex';
            toast.style.animation = 'toastFadeIn 0.3s ease-out forwards';
            
            let iconHtml = '';
            if (type === 'error') {
                toast.style.borderColor = 'var(--danger)';
                iconHtml = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                `;
            } else if (type === 'warning') {
                toast.style.borderColor = 'var(--gold)';
                iconHtml = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                `;
            } else {
                toast.style.borderColor = 'var(--accent)';
                iconHtml = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                `;
            }
            
            toast.innerHTML = `
                <div style="flex-shrink: 0; display: flex; align-items: center;">${iconHtml}</div>
                <div style="color: var(--text); font-size: 0.9rem; font-weight: 500;">${message}</div>
            `;
            
            // Remove previous timeout if active
            if (toast._timeout) clearTimeout(toast._timeout);
            
            toast._timeout = setTimeout(() => {
                toast.style.animation = 'toastFadeOut 0.3s ease-in forwards';
                setTimeout(() => {
                    toast.style.display = 'none';
                }, 300);
            }, duration);
        },

        /**
         * Triggers an animated assistant notification toast.
         * @param {string} title - The title of the notification header.
         * @param {string} message - Description message inside toast.
         * @param {number} [duration=6000] - Lifespan of toast in milliseconds.
         * @param {function|null} [actionCallback=null] - Action callback trigger (if set, displays primary action button).
         * @param {string|null} [customIconHtml=null] - Optional custom HTML string for the icon (e.g. an SVG or <img> tag). Defaults to the Magpie bird SVG.
         */
        showClippy: function(title, message, duration = 6000, actionCallback = null, customIconHtml = null) {
            let clippy = document.getElementById('clippyToast');
            
            // Create clippy toast dynamically if it doesn't exist
            if (!clippy) {
                clippy = document.createElement('div');
                clippy.id = 'clippyToast';
                document.body.appendChild(clippy);
            }
            
            clippy.style.display = 'flex';
            clippy.style.animation = 'clippySlide 0.5s ease-out forwards';
            
            const iconHtml = customIconHtml || `
                <!-- Cute Magpie Assistant SVG (Default) -->
                <svg width="48" height="48" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 25 80 C 10 95 0 90 10 80 C 20 65 35 55 45 60 Z" fill="#1f2937" />
                    <path d="M 50 75 L 45 95 M 65 75 L 60 95" stroke="var(--gold)" stroke-width="3" stroke-linecap="round" />
                    <ellipse cx="55" cy="60" rx="28" ry="22" fill="#1f2937" />
                    <path d="M 40 75 C 65 85 80 65 82 55 C 82 55 60 50 40 75 Z" fill="#ffffff" />
                    <path d="M 35 55 C 50 45 65 65 50 75 C 40 70 30 65 35 55 Z" fill="#f8fafc" />
                    <path d="M 40 58 C 50 50 60 65 50 70 Z" fill="var(--accent)" />
                    <circle cx="68" cy="38" r="18" fill="#1f2937" />
                    <path d="M 80 35 L 100 40 L 80 46 Z" fill="var(--gold)" stroke-linejoin="round" />
                    <circle cx="75" cy="33" r="6" fill="#ffffff" />
                    <circle cx="77" cy="33" r="2.5" fill="#000000" />
                </svg>
            `;
            
            clippy.innerHTML = `
                <div style="flex-shrink: 0; margin-top: 5px;">
                    ${iconHtml}
                </div>
                <div style="flex-grow: 1;">
                    <h4 style="margin: 0 0 5px 0; color: var(--accent); font-size: 1.05rem;">${title}</h4>
                    <p style="margin: 0; color: var(--text); font-size: 0.85rem; line-height: 1.4;">${message}</p>
                    <div style="margin-top: 12px; display: flex; gap: 10px;">
                        <button class="stash-btn" id="clippyActionBtn" style="padding: 4px 12px; font-size: 0.75rem;">Action</button>
                        <button class="stash-btn" id="clippyDismissBtn" style="padding: 4px 10px; font-size: 0.75rem; background: transparent; border: 1px solid var(--border); color: var(--muted-text);">Dismiss</button>
                    </div>
                </div>
            `;
            
            const dismissBtn = clippy.querySelector('#clippyDismissBtn');
            const actionBtn = clippy.querySelector('#clippyActionBtn');
            
            const closeClippy = () => {
                clippy.style.animation = 'clippySlide 0.5s ease-in reverse forwards';
                setTimeout(() => { clippy.style.display = 'none'; }, 500);
            };
            
            dismissBtn.onclick = closeClippy;
            
            if (actionCallback) {
                actionBtn.onclick = () => {
                    actionCallback();
                    closeClippy();
                };
            } else {
                actionBtn.style.display = 'none';
            }
            
            if (clippy._timeout) clearTimeout(clippy._timeout);
            clippy._timeout = setTimeout(closeClippy, duration);
        }
    },

    // --- 3. CUSTOM MODAL DIALOGS ---
    dialog: {
        _resolve: null,
        
        show: function(title, message, isConfirm = false) {
            return new Promise((resolve) => {
                this._resolve = resolve;
                let modal = document.getElementById('customDialogModal');
                
                if (!modal) {
                    modal = document.createElement('div');
                    modal.id = 'customDialogModal';
                    modal.className = 'modal-overlay';
                    modal.style.zIndex = '20000';
                    modal.innerHTML = `
                        <div class="modal-content" style="max-width: 400px; text-align: center;">
                            <h3 id="customDialogTitle" style="margin-top: 0; color: var(--text);">Notice</h3>
                            <p id="customDialogMessage" style="color: var(--muted-text); margin-bottom: 20px;"></p>
                            <div style="display: flex; gap: 15px; justify-content: center;">
                                <button id="customDialogCancel" class="stash-btn" style="background: var(--hover-bg); color: var(--text); border: 1px solid var(--border);">Cancel</button>
                                <button id="customDialogConfirm" class="stash-btn">OK</button>
                            </div>
                        </div>
                    `;
                    document.body.appendChild(modal);
                }
                
                modal.querySelector('#customDialogTitle').innerText = title;
                modal.querySelector('#customDialogMessage').innerText = message;
                
                const cancelBtn = modal.querySelector('#customDialogCancel');
                const confirmBtn = modal.querySelector('#customDialogConfirm');
                
                cancelBtn.style.display = isConfirm ? 'block' : 'none';
                modal.style.display = 'flex';
                
                const close = (result) => {
                    modal.style.display = 'none';
                    if (this._resolve) {
                        this._resolve(result);
                        this._resolve = null;
                    }
                };
                
                cancelBtn.onclick = () => close(false);
                confirmBtn.onclick = () => close(true);
                
                // Clicking overlay closes as cancel
                modal.onclick = (e) => {
                    if (e.target === modal) close(false);
                };
            });
        },
        
        alert: function(message, title = 'Notice') {
            return this.show(title, message, false);
        },
        
        confirm: function(message, title = 'Are you sure?') {
            return this.show(title, message, true);
        }
    },

    // --- 4. DROPDOWNS & NAVIGATION TABS ---
    ui: {
        toggleDropdown: function(dropdownId) {
            const el = document.getElementById(dropdownId);
            if (!el) return;
            
            // Hide other open dropdowns first
            document.querySelectorAll('.dropdown-content.show').forEach(dd => {
                if (dd.id !== dropdownId) dd.classList.remove('show');
            });
            
            el.classList.toggle('show');
        },
        
        initDropdownAutoClose: function() {
            window.addEventListener('click', (event) => {
                if (!event.target.closest('.hamburger-btn')) {
                    document.querySelectorAll('.dropdown-content.show').forEach(dd => dd.classList.remove('show'));
                }
            });
        },
        
        initTabs: function(tabContainerSelector) {
            const containers = document.querySelectorAll(tabContainerSelector);
            containers.forEach(container => {
                const btns = container.querySelectorAll('.tab-btn');
                btns.forEach(btn => {
                    btn.addEventListener('click', () => {
                        const tabId = btn.getAttribute('data-tab');
                        if (!tabId) return;
                        
                        // Set active button
                        btns.forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        
                        // Set active tab content
                        const contentGroup = btn.closest('.tabs-parent') || document;
                        const contents = contentGroup.querySelectorAll('.tab-content');
                        contents.forEach(c => c.classList.remove('active'));
                        
                        const targetContent = contentGroup.querySelector(`#${tabId}`);
                        if (targetContent) targetContent.classList.add('active');
                    });
                });
            });
        initCodeBlocks: function() {
            document.querySelectorAll('.code-block-copy').forEach(btn => {
                btn.addEventListener('click', () => {
                    const block = btn.closest('.code-block');
                    if (!block) return;
                    const codeEl = block.querySelector('code');
                    if (!codeEl) return;
                    
                    const text = codeEl.innerText;
                    navigator.clipboard.writeText(text).then(() => {
                        btn.classList.add('copied');
                        const originalHtml = btn.innerHTML;
                        
                        btn.innerHTML = `
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            <span class="copy-label">Copied!</span>
                        `;
                        
                        setTimeout(() => {
                            btn.classList.remove('copied');
                            btn.innerHTML = originalHtml;
                        }, 2000);
                    }).catch(err => {
                        console.error('Failed to copy code: ', err);
                    });
                });
            });
        }
    }
};

// Initialize theme automatically on script load
MagpieCSS.theme.init();
MagpieCSS.ui.initDropdownAutoClose();
MagpieCSS.ui.initCodeBlocks();
window.MagpieCSS = MagpieCSS;

