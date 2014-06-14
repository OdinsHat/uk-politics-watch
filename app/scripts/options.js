(function () {
    'use strict';
    var txtPostcode;
    var btnSave;

var postcodeTextbox;
var saveButton;

init();

function init() {
  postcodeTextbox = document.getElementById("postcode");
  saveButton = document.getElementById("save-button");

  postcodeTextbox.value = localStorage.postcode || "";
  markClean();
}

function save() {
  localStorage.postcode = postcodeTextbox.value;
  markClean();
}

    btnSave.addEventListener('click', save);
    txtPostcode.addEventListener('change', markDirty);
    window.onload(init);
})();