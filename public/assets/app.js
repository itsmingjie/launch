var FORCE;

/*
 * Fetch localstorage and get current settings
 * Configure name if not configured yet
 * @param: N/A
 * @return: void 
 */
function restoreSettings() {
    chrome.storage.sync.get({
        force: true,
        uname: ""
    }, function (items) {
        FORCE = items.force;

        if (items.uname == "" || items.uname == null) {
            var newName = prompt("Welcome! What is your name?", "");
            chrome.storage.sync.set({
                uname: newName
            }, function () {
                refreshGreet(newName);
            });
        } else {
            refreshGreet(items.uname);
        }

    });
}

var expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
var regex = new RegExp(expression);

window.onload = function () {
    restoreSettings();

    setInterval(function () {
        if (FORCE) {
            document.getElementById("searchBox").focus();
        }
    }, 1);

    document.getElementById("searchBox").addEventListener("keyup", function (event) {
        event.preventDefault();

        if (event.keyCode == 13) {
            if (this.value != "") {
                if (this.value.match(regex)) {
                    redir(this.value);
                } else {
                    var foundMatch = findMatchExp(this.value);
                    if (foundMatch == false) {
                        redir("https://google.com/search?q=" + this.value);
                    }
                }
            }
        } else {
            if (this.value.match(regex)) {
                document.getElementById("note").innerHTML = "URL detected... Will redirect.";
            }
            else {
                document.getElementById("note").innerHTML = "";
            }

        }
    });
}

/*
 * Refresh greeting on the new tab page
 * @param: newName = the name of the user
 * @return: void 
 */
function refreshGreet(newName) {
    var t = new Date().getHours();
    if (t < 12)
        res = "morning";
    else if (t >= 12 && t < 17)
        res = "afternoon";
    else if (t >= 17 && t < 20)
        res = "evening";
    else
        res = "night";

    document.getElementById("time").innerHTML = res;

    document.getElementById("userName").innerHTML = newName;
}

/*
 * Check if query matches one of the configured express links
 * Replace trigger with url if found
 * @param: query = the query to match with configuration
 * @return: Boolean (if query is matched)
 */
function findMatchExp(query) {
    if (query == "settings") {
            window.open(chrome.runtime.getURL('private/settings.html'));
    }

    chrome.storage.sync.get({
        exp: []
    }, function (items) {
        var exp = items.exp;

        for (var i = 0; i < exp.length; i++) {
            if (exp[i][0] == query) {
                document.getElementById("searchBox").value = exp[i][1];
                var res = "Query replaced with express url. To search for \"" + query + "\", please click ";
                res += "<a href=\"https://google.com/search?q=" + query + "\">here</a>";
    
                document.getElementById("note").innerHTML = res;
                return true;
            }
        }
    });
    return false;
}

/*
 * Open page in current tab
 * @param: N/A
 * @return: void 
 */
function redir(l) {
    var win = window.open(l, "_parent");
}