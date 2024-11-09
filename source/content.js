console.log(chrome.runtime.getManifest().name, ': 💈 Content script loaded');

async function init() {
    // Function to hide job items that contain 'Applied'
    function hideJobItems() {
        const jobItems = document.querySelectorAll('.jobs-search-results__list-item');
        var jobsHidden = 0;
        jobItems.forEach(item => {
            // Check if the item contains a child element with the text 'Applied'
            const appliedElement = Array.from(item.querySelectorAll('li')).find(li => li.textContent.trim() === 'Applied');
            if (appliedElement) {
                jobsHidden++;
                item.style.display = 'none'; // Hide the job item
                //console.log('hide-applied-jobs-linkedin - Hiding job item:', item); // Log each item being hidden
            }
        });
        console.log(chrome.runtime.getManifest().name, `: Found and hid ${jobsHidden} jobs already applied to.`); 
    }

    // Initial call to hide job items
    hideJobItems();

    // Set up a MutationObserver to watch for changes in the job listings
    const observer = new MutationObserver(hideJobItems);
    observer.observe(document.body, { childList: true, subtree: true });
}

init();