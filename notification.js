chrome.browserAction.onClicked.addListener(function(tab) {
    var notifOptions = {
        type: "basic",
        iconUrl: "freeapp 128.png",
        title: "Limit reached!",
        message: "Uh oh, look's like you've reached your alloted limit."};
    chrome.notifications.create('limitNotif', notifOptions);
 });