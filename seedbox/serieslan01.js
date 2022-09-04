// ==UserScript==
// @name         SeriesLan 01
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://serieslan.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=serieslan.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log("Use https://addons.opera.com/en/extensions/details/copy-urls-2/ to copy all tabs from Opera");
    const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

    window.delay = millis => new Promise((resolve, reject) => {
        setTimeout(_ => resolve(), millis)
    });

    window.openLinks = async function() {
        $(".box.lista a").each(function(i) {
            var href = $(this).attr("href");
            if(href){
                setTimeout(function() {
                    window.open(href);
                }, i * 3000);
            }
        });
    }

    $("#nav").append("<button class='bt-t fr' onclick='window.openLinks()'><i class='ic u2'></i><span>Abrir Links</span></button>")


    function openViteca() {
        var vitecaUrl = $("iframe")
        var src = vitecaUrl.attr("src");
        if(src && src.includes("viteca")) {
            window.open(src);
            window.close();
        }
    }

    function openVideo() {
        var btns = document.querySelectorAll("button.selop");
        for(var i = 0; i < btns.length; i++) {
            var btn = btns[i];
            if(btn.innerText === "MEGA") {
                $(btn).click();
                setTimeout(openViteca, 5000);
            }
        }
    }
    setTimeout(openVideo, 5000);

})();
