async function init() {
    // Function to hide job items that contain 'Applied' or user-defined keywords
    function hideJobItems() {
        const jobItems = document.querySelectorAll('.jobs-search-results__list-item, .scaffold-layout__list-item');
        let appliedJobsHidden = 0;
        let keywordMatches = {};

        // Get user-defined keywords from storage
        chrome.storage.sync.get(['keywords', 'caseInsensitive'], (result) => {
            const keywords = result.keywords ? result.keywords.split(',').map(k => k.trim()) : [];
            const caseInsensitive = result.caseInsensitive || false;
            
            // Initialize keyword counters
            keywords.forEach(keyword => {
                keywordMatches[keyword] = 0;
            });
            
            jobItems.forEach(item => {
                const appliedElement = Array.from(item.querySelectorAll('li')).find(li => {
                    const text = li.textContent.trim();
                    return caseInsensitive ? text.toLowerCase() === 'applied' : text === 'Applied';
                });
                
                let wasHidden = false;
                if (appliedElement) {
                    appliedJobsHidden++;
                    wasHidden = true;
                }

                // Check each keyword separately to track matches
                keywords.forEach(keyword => {
                    const itemText = item.textContent;
                    const matches = caseInsensitive ? 
                        itemText.toLowerCase().includes(keyword.toLowerCase()) :
                        itemText.includes(keyword);
                    
                    if (matches) {
                        keywordMatches[keyword]++;
                        wasHidden = true;
                    }
                });

                if (wasHidden) {
                    item.style.display = 'none'; // Hide the job item
                }
            });

            // Build detailed log message
            let logMessage = `${chrome.runtime.getManifest().name}: `;
            logMessage += `Hidden ${appliedJobsHidden} jobs you've applied to`;
            
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

init();