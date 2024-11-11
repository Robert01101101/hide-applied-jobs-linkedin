// Saves options to chrome.storage
const saveOptions = () => {
    const hideJobsChecked = document.getElementById('jobToggle').checked;
    const keywords = document.getElementById('keywords').value;

    chrome.storage.sync.set(
        { hideJobs: hideJobsChecked, keywords: keywords },
        () => {
            const status = document.getElementById('status');
            status.textContent = 'Options saved.';
            setTimeout(() => {
                status.textContent = '';
            }, 1000);
        }
    );
};

// Restores select box and checkbox state using the preferences stored in chrome.storage.
const restoreOptions = () => {
    chrome.storage.sync.get(
        { hideJobs: true, keywords: '' },
        (items) => {
            document.getElementById('jobToggle').checked = items.hideJobs;
            document.getElementById('keywords').value = items.keywords;
        }
    );
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);