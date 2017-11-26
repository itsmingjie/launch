/*
 * Open help page on install 
 */
chrome.runtime.onInstalled.addListener(function() {
    window.open(chrome.runtime.getURL('private/help.html'));
});
