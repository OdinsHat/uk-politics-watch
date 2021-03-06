'use strict';

chrome.runtime.onInstalled.addListener(function(details) {
    console.log('previousVersion', details.previousVersion);
});

chrome.browserAction.setBadgeText({
    text: ''
});


/** Omnibox Stuff **/

chrome.omnibox.onInputChanged.addListener(
    function(text, suggest) {
        console.log('inputChanged (search hansard): ' + text);
        suggest([{
            content: text + ' one',
            description: 'the first one'
        }, {
            content: text + ' number two',
            description: 'the second entry'
        }]);
    }
);

chrome.omnibox.onInputEntered.addListener(
    function(text) {
        console.log('inputEntered: ' + text);
        console.log('You just typed "' + text + '"');
    }
);

/** /Omnibox Stuff **/

/** Hansard Notifications **/

/*
  Displays a notification with the current time. Requires "notifications"
  permission in the manifest file (or calling
  "webkitNotifications.requestPermission" beforehand).
*/
function show() {
    var time = /(..)(:..)/.exec(new Date()); // The prettyprinted time.
    var hour = time[1] % 12 || 12; // The prettyprinted hour.
    var period = time[1] < 12 ? 'a.m.' : 'p.m.'; // The period of the day.
    var notification = window.webkitNotifications.createNotification(
        '48.png', // The image.
        hour + time[2] + ' ' + period, // The title.
        'Time to make the toast.' // The body.
    );
    notification.show();
}

// Conditionally initialize the options.
if (!localStorage.isInitialized) {
    localStorage.isActivated = true; // The display activation.
    localStorage.frequency = 1; // The display frequency, in minutes.
    localStorage.isInitialized = true; // The option initialization.
}

// Test for notification support.
if (window.webkitNotifications) {
    // While activated, show notifications at the display frequency.
    if (JSON.parse(localStorage.isActivated)) {
        show();
    }

    var interval = 0; // The display interval, in minutes.

    setInterval(function() {
        interval++;

        if (
            JSON.parse(localStorage.isActivated) &&
            localStorage.frequency <= interval
        ) {
            show();
            interval = 0;
        }
    }, 60000);
}

/** /Hansard Notifications **/
