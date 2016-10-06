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
        var graphDates = [];
        var graphPlayers = [];
        var graphSlots = [];
        var graphServers = [];
        
        console.log(ret.data);
        
        d3.tsv("static/data.tsv", stats.type, function(error, data) {
            if (error) throw error;
    
            stats.x.domain(d3.extent(data, function(d) { return d.date; }));
            stats.y.domain(d3.extent(data, function(d) { return d.close; }));
    
            stats.svg.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + stats.height + ")")
                .call(d3.axisBottom(stats.x));
    
            stats.svg.append("g")
                .attr("class", "axis axis--y")
                .call(d3.axisLeft(stats.y))
            .append("text")
                .attr("class", "axis-title")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Price ($)");
    
            console.log(data);
            stats.svg.append("path")
                .datum(data)
                .attr("class", "line")
                .attr("d", stats.line);
    });
        
        stats.drawChart(null);

/*
        var x = 0;
        for (var item of ret.data.history) {
            if (x % 12 == 0) {
                graphDates.push(item.timestamp);
            } else {
                graphDates.push("");
            }
            graphPlayers.push(item.players);
            graphSlots.push(item.slots);
            graphServers.push(item.servers);
            x++;
        }

        var data = {
            labels: graphDates,
            datasets: [
                {
                    label: "Players",
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "rgba(151,187,205,1)",
                    pointColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: graphPlayers
                }
            ]
        };
        // Get context with jQuery - using jQuery's .get() method.
        var ctx = $("#history").get(0).getContext("2d");
        // This will get the first returned node in the jQuery collection.
        var historyChart = new Chart(ctx).Line(data, {
            pointHitDetectionRadius: 0,
            pointDot: false,
            scaleShowVerticalLines: false,
            scaleBeginAtZero: true,
        }); */
    });
    api.loadProviders(function(ret) {
        var providers = []
        for (var item of ret.data.providers) {
            console.log(item);
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