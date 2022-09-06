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

    var servers = {
        "mega" : "MEGA",
        "okServer" : "OK Server",
        "yourUp" : "YourUp"
    }
    console.log("Use https://addons.opera.com/en/extensions/details/copy-urls-2/ to copy all tabs from Opera");
    const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

    window.delay = millis => new Promise((resolve, reject) => {
        setTimeout(_ => resolve(), millis)
    });

    window.openLinks = async function(server) {
        $(".box.lista a").each(function(i) {
            var href = $(this).attr("href");
            if(href){
                setTimeout(function() {
                    window.open(href + "?server=" + server);
                }, i * 3000);
            }
        });
    }

    $("#nav").append("<button class='bt-t fr' onclick='window.openLinks(\"okServer\")'><i class='ic u2'></i><span>Links OK Server</span></button>")
    $("#nav").append("<button class='bt-t fr' onclick='window.openLinks(\"yourUp\")'><i class='ic u2'></i><span>Links Your UP</span></button>")
    $("#nav").append("<button class='bt-t fr' onclick='window.openLinks(\"mega\")'><i class='ic u2'></i><span>Links Mega</span></button>")


    function openViteca() {
        var vitecaUrl = $("iframe")
        var src = vitecaUrl.attr("src");
        if(src && src.includes("viteca")) {
            window.open(src);
            window.close();
        }
    }

    function openVideo() {
        debugger;
        var currentServer = getUrlVars()["server"];
        if(!currentServer) currentServer = "mega";
        var btns = document.querySelectorAll("button.selop");
        for(var i = 0; i < btns.length; i++) {
            var btn = btns[i];
            if(btn.innerText === servers[currentServer]) {
                $(btn).click();
                setTimeout(openViteca, 5000);
            }
        }
    }
    setTimeout(openVideo, 5000);


    function getUrlVars() {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++)
        {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }

})();
