async function init() {
    // Function to hide job items that contain 'Applied' or user-defined keywords
    function hideJobItems() {
        const jobItems = document.querySelectorAll('.jobs-search-results__list-item');
        var jobsHidden = 0;

        // Get user-defined keywords from storage
        chrome.storage.sync.get(['keywords'], (result) => {
            const keywords = result.keywords ? result.keywords.split(',').map(k => k.trim()) : [];
            jobItems.forEach(item => {
                const appliedElement = Array.from(item.querySelectorAll('li')).find(li => li.textContent.trim() === 'Applied');
                const containsKeyword = keywords.some(keyword => item.textContent.includes(keyword));

                if (appliedElement || containsKeyword) {
                    jobsHidden++;
                    item.style.display = 'none'; // Hide the job item
                }
            });
            console.log(chrome.runtime.getManifest().name, `: Found and hid ${jobsHidden} jobs already applied to or containing specified keywords.`);
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