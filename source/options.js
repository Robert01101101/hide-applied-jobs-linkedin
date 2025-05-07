// Saves options to chrome.storage
const saveOptions = () => {
    const hideJobsChecked = document.getElementById('jobToggle').checked;
    const caseInsensitiveChecked = document.getElementById('caseInsensitiveToggle').checked;
    const keywords = document.getElementById('keywords').value;

    chrome.storage.sync.set(
        { hideJobs: hideJobsChecked, caseInsensitive: caseInsensitiveChecked, keywords: keywords },
        () => {
            const status = document.getElementById('status');
            status.textContent = 'Options saved. Refresh the page to see changes.';
            setTimeout(() => {
                status.textContent = '';
            }, 3000);
        }
    );
};

// Restores select box and checkbox state using the preferences stored in chrome.storage.
const restoreOptions = () => {
    chrome.storage.sync.get(
        { hideJobs: true, caseInsensitive: false, keywords: '' },
        (items) => {
            document.getElementById('jobToggle').checked = items.hideJobs;
            document.getElementById('caseInsensitiveToggle').checked = items.caseInsensitive;
            document.getElementById('keywords').value = items.keywords;
            updateFieldStates(items.hideJobs);
        }
    );
};

// Updates the disabled state of fields based on the hide jobs toggle
const updateFieldStates = (hideJobsEnabled) => {
    document.getElementById('caseInsensitiveToggle').disabled = !hideJobsEnabled;
    document.getElementById('keywords').disabled = !hideJobsEnabled;
    
    // Add visual feedback for disabled state
    const disabledElements = document.querySelectorAll('#caseInsensitiveToggle, #keywords');
    disabledElements.forEach(element => {
        element.style.opacity = hideJobsEnabled ? '1' : '0.5';
    });
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('jobToggle').addEventListener('change', (e) => {
    updateFieldStates(e.target.checked);
});