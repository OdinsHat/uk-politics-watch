'use strict';

function init() {
    try {
        postcode = localStorage.postcode;

        if(postcode == undefined){
            throw new TypeError('Please set your post code in the options');
        }
        if(postcode.length <= 4){
            throw new Error("Please enter a post code in a recognisable format. For example:\n<ul><li>PE22 7DB</li><li>sk22 4pl</li></ul>");
        }
        getMPData();
    }catch(e){
        handleError(e);
    }
}

function handleError(e) {
    document.getElementById('shinymp-info').innerHTML = e.message;
}

function getMPData() {
  var xhr, postcode, resp, mpId;
  postcode = localStorage.postcode;
  if(postcode.length > 5){
      xhr = new XMLHttpRequest();
      xhr.open("GET", 'http://www.theyworkforyou.com/api/getMP?key=ABJnrLB6q9YnBnVN5rEfNKT7&postcode=' + postcode, true);
      xhr.send();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          resp = JSON.parse(xhr.responseText);
          personId = resp['person_id'];
          console.log('HERE');
          console.log(personId);

          if (resp['party'] == 'Conservative') {
            border = 'blue';
          } else if (resp['party'] == "Labour") {
            border = 'red';
          } else {
            border = 'grey';
          }
          getHansard(personId);
          constructLinks(personId);
          document.getElementById('smp-name').innerHTML = resp['first_name'] + ' ' + resp['last_name'];
          document.getElementById('smp-const').innerHTML = resp['constituency'];
          document.getElementById('smp-photo').innerHTML = '<img src="http://www.theyworkforyou.com/' + resp['image'] + '" alt="MP Photo" style="border:2 px solid ' + border + '" />';
        }else{
          console.log('XHR failed: ' + xhr);
        }
      }
  }else{
    document.getElementById('smp-general').innerHTML = '';
    document.getElementById('smp-hansard').innerHTML = '<div style="margin-left:auto;margin-right:auto;">Please set your postcode in extension options</div>';
  }
}

function constructLinks(personId) {
    var links, linkEl, xhr;
    links = {
        'bbc_profile_url':'bbc-icon.gif',
        'wikipedia_url':'wikipedia-icon.gif',
        'guardian_mp_summary':'guardian.png',
        'maiden_speech':'speech.png',
        'expenses_url': 'expenses.png'
    }
    linkEl = document.getElementById('smp-links');
    xhr = new XMLHttpRequest();
    xhr.open("GET", 'http://www.theyworkforyou.com/api/getMPInfo?key=ABJnrLB6q9YnBnVN5rEfNKT7&id=' + personId, true);
    console.log(personId);
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            resp = JSON.parse(xhr.responseText);
            for (link in links) {
                if(resp[link] != undefined){
                    if(link == 'maiden_speech'){
                        resp[link] = "http://" + resp[link].replace("uk.org.publicwhip/debate/", "www.theyworkforyou.com/debate/?id=");
                    }
                    linkEl.innerHTML += '<a href="#" onclick="chrome.tabs.create({url:\'' + resp[link] + '\'})"><img src="' + links[link] + '" /></a>';
                }
            }
        }
    }
}

function getHansard(personId) {
  var i, hxhr, resp, entries, hSec, occurTime, hCont;
  hansardUrl = 'http://www.theyworkforyou.com/api/getHansard?key=ABJnrLB6q9YnBnVN5rEfNKT7&person=' + personId;

  hxhr = new XMLHttpRequest();
  hxhr.open("GET", hansardUrl, true);
  hxhr.send();
  hxhr.onreadystatechange = function() {
    if (hxhr.readyState == 4) {
      hCont = '';
      resp = JSON.parse(hxhr.responseText);
      entries = resp['rows'];
      hSec = document.getElementById('smp-hansard');
      for (i=0;i<5;i++) {
        occurTime = new Date(resp['rows'][i]['hdate']).toDateString();
        infoURL = 'http://www.theyworkforyou.com' + resp['rows'][i]['listurl'];
        title = resp['rows'][i]['parent']['body'];
        hCont += '<h3><a href="#" onclick="chrome.tabs.create({url: \''
              + infoURL + '\'})">' + title.substring(title.indexOf(';')+1)
              + '</a>';
        if (resp['rows'][i]['video_status'] > 0) {
          hCont += '<img src="video.png" title="Has video" style="margin-left:5px;" />';
        }
        hCont += '</h3>';
        hCont += '<span class="info">' + occurTime + '</span><br />';
        hCont += resp['rows'][i]['body'];
      }
      hSec.innerHTML = hCont;
    }
  }
}
