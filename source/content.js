import optionsStorage from './options-storage.js';

console.log('hide-applied-jobs-linkedin - 💈 Content script loaded for', chrome.runtime.getManifest().name);

async function init() {
    const options = await optionsStorage.getAll();
    const color = `rgb(${options.colorRed}, ${options.colorGreen},${options.colorBlue})`;
    const text = options.text;
    const notice = document.createElement('div');
    notice.innerHTML = text;
    document.body.prepend(notice);
    notice.id = 'text-notice';
    notice.style.border = '2px solid ' + color;
    notice.style.color = color;

    // Function to hide job items that contain 'Applied'
    function hideJobItems() {
        const jobItems = document.querySelectorAll('.jobs-search-results__list-item');
        console.log(`hide-applied-jobs-linkedin - Found ${jobItems.length} job items to check.`); // Log the number of items found
        jobItems.forEach(item => {
            // Check if the item contains a child element with the text 'Applied'
            const appliedElement = Array.from(item.querySelectorAll('li')).find(li => li.textContent.trim() === 'Applied');
            if (appliedElement) {
                item.style.display = 'none'; // Hide the job item
                console.log('hide-applied-jobs-linkedin - Hiding job item:', item); // Log each item being hidden
            }
        });
    }

    // Initial call to hide job items
    hideJobItems();

    // Set up a MutationObserver to watch for changes in the job listings
    const observer = new MutationObserver(hideJobItems);
    observer.observe(document.body, { childList: true, subtree: true });
    console.log('hide-applied-jobs-linkedin - MutationObserver set up to watch for changes in the DOM.'); // Log that the observer is set up
}

init();