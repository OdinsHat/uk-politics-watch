'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
    console.log('previousVersion', details.previousVersion);
});

chrome.browserAction.setBadgeText({text: '\'Allo'});

chrome.omnibox.onInputChanged.addListener(
    function(text, suggest) {
        console.log('inputChanged (search hansard): ' + text);
        suggest([
            {content: text + ' one', description: "the first one"},
            {content: text + ' number two', description: "the second entry"}
        ]);
    }
);

chrome.omnibox.onInputEntered.addListener(
    function(text) {
        console.log('inputEntered: ' + text);
        alert('You just typed "' + text + '"');
    }
);

console.log('\'Allo \'Allo! Event Page for Browser Action');
