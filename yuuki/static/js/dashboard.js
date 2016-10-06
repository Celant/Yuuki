"use strict"; // Fuck knows, Chris made me do it

/*global $*/
/*global api*/
/*global stats*/
/*global d3*/

window.onload = function() {
    api.loadCurrentPlayers(function(ret) {
        $("#current-players").text(ret.data.players);
        $("#current-slots").text(ret.data.slots);
    });
    api.loadTotalServers(function(ret) {
        $("#total-servers").text(ret.data.servers);
        $("#all-servers").text(ret.data.servers);
        $("#nonempty-servers").text(ret.data.serversplayers);
    });
    api.loadHistory(function(ret) {
        var chartData = {};
        
        chartData.label = "Concurrent players";
        chartData.color = "#428bca";
        chartData.data = [];
        
        for (var item of ret.data.history) {
            var datapoint = [
                Date.parse(item.timestamp).getTime(),
                parseInt(item.players)
            ];
            chartData.data.push(datapoint);
        }
        
        console.log(JSON.stringify(chartData));
        
        stats.chartPlot( '#chartdivUsers', '#chartlegendUsers', [chartData] );
    });
    api.loadProviders(function(ret) {
        var providers = []
        for (var item of ret.data.providers) {
            var provider = {
                value: item.servers,
                color: item.color,
                highlight: item.highlight,
                label: item.providername
            }
            providers.push(provider);
        }
        // Get context with jQuery - using jQuery's .get() method.
        var ctx = $("#providers").get(0).getContext("2d");
        // This will get the first returned node in the jQuery collection.
        var providersChart = new Chart(ctx).Pie(providers);
    });
}

window.setInterval(function(){
    api.loadCurrentPlayers(function(ret) {
        $("#current-players").text(ret.data.players);
        $("#current-slots").text(ret.data.slots);
    });
    api.loadTotalServers(function(ret) {
        $("#total-servers").text(ret.data.servers);
        $("#all-servers").text(ret.data.servers);
        $("#nonempty-servers").text(ret.data.serversplayers);
    });
}, 10000);

window.odometerOptions = {
    format: 'd'
}