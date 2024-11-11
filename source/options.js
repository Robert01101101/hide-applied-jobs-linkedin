// Saves options to chrome.storage
const saveOptions = () => {
    const hideJobsChecked = document.getElementById('jobToggle').checked;
  
    chrome.storage.sync.set(
      { hideJobs: hideJobsChecked },
      () => {
        // Update status to let user know options were saved.
        const status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(() => {
          status.textContent = '';
        }, 750);
      }
    );
  };
  
  // Restores select box and checkbox state using the preferences
  // stored in chrome.storage.
  const restoreOptions = () => {
    chrome.storage.sync.get(
      { hideJobs: true},
      (items) => {
        document.getElementById('jobToggle').checked = items.hideJobs;
      }
    );
  };
  
  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.getElementById('save').addEventListener('click', saveOptions);