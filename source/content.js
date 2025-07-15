async function init() {
    // Function to hide job items that contain 'Applied' or user-defined keywords
    function hideJobItems() {
        const jobItems = document.querySelectorAll('.jobs-search-results__list-item, .scaffold-layout__list-item');
        let appliedJobsHidden = 0;
        let keywordMatches = {};

        // Get user-defined keywords and mode from storage
        chrome.storage.sync.get(['keywords', 'caseInsensitive', 'mode', 'highlightColor'], (result) => {
            const keywords = result.keywords ? result.keywords.split(',').map(k => k.trim()) : [];
            const caseInsensitive = result.caseInsensitive || false;
            const mode = result.mode || 'none';
            const highlightColor = result.highlightColor || '#fffbe6';
            
            const appliedTranslations = [
                'Applied',                  // English
                'Solicitados',              // Spanish
                'Candidature envoyée',      // French
                'Beworben',                 // German
                'Candidatura inviata',      // Italian
                'Candidatura enviada',      // Portuguese
                'Sollicitatie verzonden',   // Dutch
                'Ansökt',                   // Swedish
                'Søgt',                     // Danish
                'Søkt',                     // Norwegian
                'Haettu',                   // Finnish
                'Zaaplikowano',             // Polish
                'Přihlášeno',               // Czech
                'Jelentkezett'              // Hungarian
            ];
            
            // Initialize keyword counters
            keywords.forEach(keyword => {
                keywordMatches[keyword] = 0;
            });
            
            jobItems.forEach(item => {
                // Remove highlight class if present
                item.classList.remove('hajl-highlight');

                // Reset styles
                item.style.background = '';
                item.style.border = '';
                item.style.display = '';

                if (mode === 'none') {
                    // Do nothing
                    return;
                }

                const appliedElement = Array.from(item.querySelectorAll('li')).find(li => {
                    const text = li.textContent.trim();
                    return appliedTranslations.includes(text);
                });
                
                let wasMatched = false;
                if (appliedElement) {
                    appliedJobsHidden++;
                    wasMatched = true;
                }

                // Check each keyword separately to track matches
                keywords.forEach(keyword => {
                    const itemText = item.textContent;
                    const matches = caseInsensitive ? 
                        itemText.toLowerCase().includes(keyword.toLowerCase()) :
                        itemText.includes(keyword);
                    
                    if (matches) {
                        keywordMatches[keyword]++;
                        wasMatched = true;
                    }
                });

                if (wasMatched) {
                    if (mode === 'hide') {
                        item.style.display = 'none';
                        item.classList.remove('hajl-highlight');
                        item.style.background = '';
                        item.style.border = '';
                    } else if (mode === 'highlight') {
                        item.style.display = '';
                        item.classList.add('hajl-highlight');
                        item.style.background = highlightColor;
                        item.style.border = `2px solid ${highlightColor}`;
                        item.style.boxShadow = `0 0 8px ${hexToRgba(highlightColor, 0.55)}`;
                    }
                } else {
                    item.style.display = '';
                    item.classList.remove('hajl-highlight');
                    item.style.background = '';
                    item.style.border = '';
                    item.style.boxShadow = '';
                }
            });

            // Build detailed log message
            let logMessage = `${chrome.runtime.getManifest().name}: `;
            if (mode === 'none') {
                logMessage += `No action taken on jobs.`;
            } else {
                logMessage += `${mode === 'hide' ? 'Hidden' : 'Highlighted'} ${appliedJobsHidden} jobs you've applied to`;
                // Add keyword match details if any keywords matched
                const totalKeywordMatches = Object.values(keywordMatches).reduce((a, b) => a + b, 0);
                if (totalKeywordMatches > 0) {
                    logMessage += `, and ${totalKeywordMatches} jobs matching keywords:`;
                    Object.entries(keywordMatches).forEach(([keyword, count]) => {
                        if (count > 0) {
                            logMessage += `\n- "${keyword}": ${count} jobs`;
                        }
                    });
                }
            }
            
            console.log(logMessage);
        });
    }

    // Function to check the toggle state
    function checkToggle(callback) {
        chrome.storage.sync.get(['hideJobs'], (result) => {
            const toggleState = result.hideJobs !== undefined ? result.hideJobs : true; // Default to true if not set
            callback(toggleState);
        });
    }

    // Check the toggle state and hide job items if enabled
    checkToggle((state) => {
        if (state) {
            hideJobItems(); // Initial call to hide job items if toggle is on
        }
    });

    // Set up a MutationObserver to watch for changes in the job listings
    const observer = new MutationObserver(() => {
        checkToggle((state) => {
            if (state) {
                hideJobItems();
            }
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

// Helper to convert hex color to rgba with alpha
function hexToRgba(hex, alpha) {
    let c = hex.replace('#', '');
    if (c.length === 3) {
        c = c[0]+c[0]+c[1]+c[1]+c[2]+c[2];
    }
    const num = parseInt(c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r},${g},${b},${alpha})`;
}

init();