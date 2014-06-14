(function () {
    'use strict';
    var txtPostcode;
    var btnSave;

    function save() {
        localStorage.postcode = txtPostcode.value;
        markClean();
    }

    function markDirty() {
        btnSave.disabled = false;
    }

    function markClean() {
        btnSave.disabled = true;
    }

    function init() {
        txtPostcode = document.getElementById('txt-postcode');
        btnSave = document.getElementById('btn-save');

        txtPostcode.value = localStorage.postcode || '';
        markClean();
    }

    btnSave.addEventListener('click', save);
    txtPostcode.addEventListener('change', markDirty);
    window.onload(init);
})();