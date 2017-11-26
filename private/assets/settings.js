window.onload = function() {
    document.getElementById("forceFocus").addEventListener("change", saveSettings);

    document.getElementById("save").addEventListener("click", saveSettings);

    document.getElementById("help").addEventListener("click", function() {
        window.open(chrome.runtime.getURL('private/help.html'));
    });

    document.getElementById("reset").addEventListener("click", reset);
}

/*
 * Save modified settings
 * @param: N/A
 * @return: void 
 */
function saveSettings() {
    var forceFocus = document.getElementById("forceFocus").checked;
    var userName = document.getElementById("userName").value;
    var expTrigger = document.getElementById("exp").value.split("\n");
    var expLink = document.getElementById("expLink").value.split("\n");

    var array = [];
    if (expTrigger.length != expLink.length) {
        status("Syntax error on Express links. Please verify.");
        return;
    }
    else {
        for (i = 0; i < expTrigger.length; i++) {
            array[i] = [expTrigger[i], expLink[i]];
        }
    }

    chrome.storage.sync.set({
        force: forceFocus,
        uname: userName,
        exp: array
      }, function() {
        status("Settings saved.");
      });
}

/*
 * Restore settings to GUI
 * @param: N/A
 * @return: void 
 */
function restoreSettings() {
    var defaultExp = {
        "hack": "https://hackclub.com"
    };
    chrome.storage.sync.get({
        force: true,
        uname: "",
        exp: [
            ["hack", "https://hackclub.com"]
        ]
      }, function(items) {
        var expTrigger = [];
        var expLink = [];

        for (i = 0; i < items.exp.length; i++) {
            expTrigger[i] = items.exp[i][0];
            expLink[i] = items.exp[i][1];
        }
        expTrigger = expTrigger.join("\n");
        expLink = expLink.join("\n");

        document.getElementById("forceFocus").checked = items.force;
        document.getElementById("userName").value = items.uname;
        document.getElementById("exp").value = expTrigger;
        document.getElementById("expLink").value = expLink;
      });
}

document.addEventListener('DOMContentLoaded', restoreSettings);

/*
 * Display output in the status span
 * @param: N/A
 * @return: void 
 */
function status(text) {
    var status = document.getElementById('status');
    status.innerHTML = text;
    setTimeout(function() {
      status.innerHTML = '&nbsp;';
    }, 1000);
}

/*
 * Reset all settings to default (clear localstorage)
 * @param: N/A
 * @return: void 
 */
function reset() {
    var conf = confirm("Are you sure you want to reset the extension to its default settings? You will lose all your configurations.")
    if (conf) {
        chrome.storage.sync.clear();
        restoreSettings();
    }
}