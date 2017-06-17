"use strict";

/*global $*/

var api = {}

api.loadCurrentPlayers = function (callback) {
    var request = $.get("/api/stats/currentplayers", "json");

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

api.loadTotalServers = function (callback) {
    var request = $.get("/api/stats/totalservers", "json");

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

api.loadHistory = function (callback) {
    var request = $.get("/api/stats/history", "json");

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

api.loadProviders = function (callback) {
    var request = $.get("/api/stats/providers", "json");

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
