// ==UserScript==
// @name         SeriesLan 02
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://viteca.stream/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=viteca.stream
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    console.log("Use https://addons.opera.com/en/extensions/details/copy-urls-2/ to copy all tabs from Opera");
    function openMega() {
        debugger;
        var iframe = document.getElementsByTagName("iframe")[0];
        if(iframe && iframe.src) {
            window.open(iframe.src);
            window.close();
        }
    }
    setTimeout(openMega, 5000);
})();
