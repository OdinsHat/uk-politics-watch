'use strict';

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

function markDirty() {
  saveButton.disabled = false;
}

function markClean() {
  saveButton.disabled = true;
}
