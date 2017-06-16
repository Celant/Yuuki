"use strict";

/*global jQuery*/

var stats = {}

stats.chartUsers = function(chartDiv, chartLegend, series) {

  var div = jQuery(chartDiv);
  var legendContainer = jQuery(chartLegend);

  var plot = jQuery.plot(div, series, {
    series: {
      lines: {
        show: true,
        fill: false
      },
      bars: {
        show: false
      }
    },
    legend: {
      show: true,
      backgroundColor: '#c98d3',
      position: "sw",
      margin: 0,
      labelBoxBorderColor: 'black'
    },
    yaxis: {
      show: true,
      tickFormatter: (function(d) {
        return stats.nFormatter(d);
      }),
      tickColor: '#d9d9d9',
      autoscaleMargin: 0.15,
    },
    xaxis: {
      show: true,
      mode: "time",
      minTickSize: [1, "hour"],
      ticks: 20,
      labelWidth: '100',
      alignTicksWithAxis: 1,
      tickFormatter: (function(val, axis) {
        var d = new Date(val);
        var crossedDay = (axis.lastDate == null || d.getDay() != axis.lastDate.getDay())
        axis.lastDate = d;
        if (axis.ticks.length == 0 || crossedDay) {
          return '<div class="dateAxis">' + d.toLocaleDateString(navigator.language, {
            year: '2-digit',
            month: 'short',
            day: 'numeric'
          }) + '</div>';

        }
        else {
          return d.toLocaleTimeString(navigator.language, {
            hour: '2-digit',
            minute: '2-digit'
          });
        }
      }),
      lastDate: null,
      tickColor: '#ffffff'
    },
    grid: {
      hoverable: true,
      clickable: false,
      borderWidth: 0,
      backgroundColor: '#ffffff'
    }
  });

  div.bind("plothover", function(event, pos, item) {
    if (item) {
      var x = (item.datapoint[1]).toFixed(0);
      var date = new Date(item.datapoint[0]);
      jQuery("#charttooltip").html(date.toLocaleTimeString() + ' ' + x + ' Users')
        .css({
          top: item.pageY - 50,
          left: item.pageX - 45
        })
        .fadeIn(200);
    }
    else {
      jQuery("#charttooltip").hide();
    }
  });
}

stats.chartProviders = function(chartDiv, series) {

  var div = jQuery(chartDiv);

  var plot = jQuery.plot(div, series, {
    series: {
      pie: {
        show: true,
        label: {
          radius: 0.95,
          formatter: function(label, slice) {
						return "<div style='font-size:15px;text-align:center;padding:2px;color:" + slice.color + ";'>" + label + "<br/>" + Math.round(slice.percent) + "% (" + slice.data[0][1] + ")</div>";
					}
        }
      }
    },
    grid: {
      hoverable: true,
      clickable: true
    },
    legend: {
      show: false
    },
  });
}

stats.nFormatter = function(num) {
  var isNegative = false
  if (num < 0) {
    isNegative = true
  }
  num = Math.abs(num)
  var formattedNumber = 0;
  if (num >= 1000000000) {
    formattedNumber = (num / 1000000000).toFixed(1) + 'G';
  }
  else if (num >= 1000000) {
    formattedNumber = (num / 1000000).toFixed(1) + 'M';
  }
  else if (num >= 1000) {
    formattedNumber = (num / 1000).toFixed(1) + 'K';
  }
  else {
    formattedNumber = num;
  }
  if (isNegative) {
    formattedNumber = '-' + formattedNumber
  }
  return formattedNumber;
}