"use strict";

function loadCurrentPlayers(callback) {
    var request = $.get("http://stats.tshock.co/api/stats.php?action=CurrentPlayers", "json");

    request.done(function(e) {
        callback(e);
    });

    request.fail(function() {
        var ret = {
            code: 0,
            data: new Array()
        }
        callback(ret);
    });
}

function loadTotalServers(callback) {
    var request = $.get("http://stats.tshock.co/api/stats.php?action=TotalServers", "json");

    request.done(function(e) {
        callback(e);
    });

    request.fail(function() {
        var ret = {
            code: 0,
            data: new Array()
        }
        callback(ret);
    });
}

function loadHistory(callback) {
    var request = $.get("http://stats.tshock.co/api/stats.php?action=History", "json");

    request.done(function(e) {
        callback(e);
    });

    request.fail(function() {
        var ret = {
            code: 0,
            data: new Array()
        }
        callback(ret);
    });
}

function loadProviders(callback) {
    var request = $.get("http://stats.tshock.co/api/stats.php?action=Providers", "json");

    request.done(function(e) {
        callback(e);
    });

    request.fail(function() {
        var ret = {
            code: 0,
            data: new Array()
        }
        callback(ret);
    });
}
