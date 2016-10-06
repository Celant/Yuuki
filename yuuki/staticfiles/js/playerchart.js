"use strict";

/*global d3*/

var stats = {}

stats.drawChart = function(data) {
    stats.margin = {top: 20, right: 20, bottom: 30, left: 50},
    stats.width = 960 - stats.margin.left - stats.margin.right,
    stats.height = 500 - stats.margin.top - stats.margin.bottom;

    var parseTime = d3.timeParse("%d-%b-%y");
    
    stats.x = d3.scaleTime()
        .range([0, stats.width]);
    
    stats.y = d3.scaleLinear()
        .range([stats.height, 0]);
    
    stats.line = d3.line()
        .x(function(d) { return stats.x(d.date); })
        .y(function(d) { return stats.y(d.close); });
    
    stats.svg = d3.select("#player-graph").append("svg")
        .attr("width", stats.width + stats.margin.left + stats.margin.right)
        .attr("height", stats.height + stats.margin.top + stats.margin.bottom)
      .append("g")
        .attr("transform", "translate(" + stats.margin.left + "," + stats.margin.top + ")");
/*    
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
    }); */
    
    stats.type = function(d) {
      d.date = parseTime(d.date);
      d.close = +d.close;
      return d;
    }
}