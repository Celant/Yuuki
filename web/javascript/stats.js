"use strict"; // Fuck knows, Chris made me do it

$(window).ready(function(){ // Called once DOM is loaded (won't wait for images etc to load).
    $(function() {
        $(".dial").knob();
    })
});

window.onload = function() {
    loadCurrentPlayers(function(ret) {
        $("#current-players").text(ret.data.players);
        $("#current-slots").text(ret.data.slots);
    });
}

window.setInterval(function(){
    loadCurrentPlayers(function(ret) {
        $("#current-players").text(ret.data.players);
        $("#current-slots").text(ret.data.slots);
    });
}, 10000);

window.odometerOptions = {
    format: 'd'
}

/*
function setLoadingStatusPanel() {
    $("#botstatus").removeClass("label-success").removeClass("label-danger").text("Offline").addClass("throbber-loader");
    $("#ircstatus").removeClass("label-success").removeClass("label-danger").text("Disconnected").addClass("throbber-loader");
    $("#channels").removeClass("label-success").removeClass("label-warning").removeClass("label-danger").text("Unknown").addClass("throbber-loader");
    $("#watchedapps").removeClass("label-info").removeClass("label-warning").text("0").addClass("throbber-loader");
}

function displayStatusPanel(ret) {
    if(ret.code != 200) {
        $("#botstatus").removeClass("label-success").addClass("label-danger").text("Offline").removeClass("throbber-loader");
        $("#ircstatus").removeClass("label-success").addClass("label-danger").text("Disconnected").removeClass("throbber-loader");
        $("#channels").removeClass("label-success").removeClass("label-warning").addClass("label-danger").text("Unknown").removeClass("throbber-loader");
        $("#watchedapps").removeClass("label-info").addClass("label-warning").text("0").removeClass("throbber-loader");
    } else {
        $("#botstatus").removeClass("label-danger").addClass("label-success").text("Online").removeClass("throbber-loader");
    }

    if(ret.data.connected) {
        $("#ircstatus").removeClass("label-danger").addClass("label-success").text("Online").removeClass("throbber-loader");
    } else {
        $("#ircstatus").removeClass("label-success").addClass("label-danger").text("Offline").removeClass("throbber-loader");
    }

    $("#channels").empty();
    if(typeof ret.data.channels !== 'undefined' && ret.data.channels.length > 0) {
        $("#channels").empty();
        $("#channels").removeClass("label-warning").removeClass("label-success").removeClass("label").removeClass("throbber-loader");
        for (var channel of ret.data.channels) {
            $("#channels").append("<li><span class='label label-info channel'>" + channel + "</span></li>");
        }
    } else {
        $("#channels").removeClass("label-success").addClass("label-warning").addClass("label").text("None").removeClass("throbber-loader");
    }

    if(ret.data.apps > 0) {
        $("#watchedapps").removeClass("label-warning").addClass("label-info").text(ret.data.apps).removeClass("throbber-loader");
    } else {
        $("#watchedapps").removeClass("label-info").addClass("label-warning").text(ret.data.apps).removeClass("throbber-loader");
    }
}

function displayHistoryPanel(ret) {
    $("#recent-history").empty();
    $("#recent-history").removeClass("throbber-loader");
    if(typeof ret.data !== 'undefined' && ret.data.length > 0) {
        for (var item of ret.data) {
            var date = new Date(item.timestamp*1000);
            var formattedTime = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + (date.getUTCHours() + 1) + ":" + date.getMinutes();
            var historyItem = $("<div class='alert alert-info history-item'></div>");
            $(historyItem).appendTo("#recent-history").append("<strong>" + formattedTime + " - " + "</strong><a href='https://steamdb.info/app/" + item.appid + "/' target='_blank'>" + item.appname + "</a>");
        }

    } else {
        var historyItem = $("<div class='alert alert-warning history-item'></div>");
        $(historyItem).appendTo("#recent-history").append("<strong>There were no recent updates, or the update information could not be loaded</strong>");
    }
}

// Display a message at the top of the screen
// text - String - The text to display in the message
// type - String - The type of the message, can be 'warning', 'info', 'danger' or 'success'
function showMessage(text, type) {
    var alertDiv = $("#page-message").html("").removeClass().addClass("alert alert-" + type + " alert-dismissible");
    alertDiv.append(text);
    $("#page-message").fadeTo(5000, 500).slideUp(500, function() {
        $("#page-message").alert('close');
    })
}
*/