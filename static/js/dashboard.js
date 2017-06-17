"use strict"; // Fuck knows, Chris made me do it

/*global jQuery*/
/*global api*/
/*global stats*/

window.onload = function() {
    api.loadCurrentPlayers(function(ret) {
        jQuery("#current-players").text(ret.cur_players);
        jQuery("#current-slots").text(ret.max_players);
    });
    api.loadTotalServers(function(ret) {
        jQuery("#total-servers").text(ret.total_servers);
        jQuery("#all-servers").text(ret.total_servers);
        jQuery("#nonempty-servers").text(ret.occupied_servers);
    });
    api.loadHistory(function(ret) {
        var chartData = [];
        var series = {};

        series.label = "Concurrent players";
        series.color = "#428bca";
        series.data = [];

        for (var item of ret.history) {
            var datapoint = [
                Date.parse(item.timestamp).getTime(),
                parseInt(item.players)
            ];
            series.data.push(datapoint);
        }
        chartData.push(series);

        stats.chartUsers('#chartdivUsers', '#chartlegendUsers', chartData);
    });
    api.loadProviders(function(ret) {
        var chartData = [];

        for (var item of ret.providers) {
            var provider = {
                data: item.servers,
                color: item.color,
                highlight: item.highlight,
                label: item.providername
            }
            chartData.push(provider);
        }
        
        stats.chartProviders('#chartdivProviders', chartData);
    });

    jQuery(function() {
        jQuery('[data-toggle="popover"]').popover()
    })
    
    if (document.documentElement.clientWidth > 900) {
        jQuery(function() {
            jQuery("<div class='chartooltip' id='charttooltip'></div>").css({
        	    position: "absolute",
        		border: "1px solid #ffdddd",
        		display: "none",
        		padding: "2px",
        		"background-color": "white",
        		color: "black",
        		"font-size": "15px",
        		opacity: "1.0",
        	}).appendTo("body");
	    });
    }
}

window.setInterval(function() {
    api.loadCurrentPlayers(function(ret) {
        jQuery("#current-players").text(ret.cur_players);
        jQuery("#current-slots").text(ret.max_players);
    });
    api.loadTotalServers(function(ret) {
        jQuery("#total-servers").text(ret.servers);
        jQuery("#all-servers").text(ret.servers);
        jQuery("#nonempty-servers").text(ret.serversplayers);
    });
}, 10000);

window.odometerOptions = {
    format: 'd'
}
