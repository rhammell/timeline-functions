// Set timespan of chart
var timespan = parseInt($('#timespan').val());

// SVG size params
var margin = {top: 40, right: 1, bottom: 50, left: 30};
var width = 960;
var height = 300;

// Define SVG
var svg = d3.select("#chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Set time domain placeholder
var t1 = new Date();
var t0 = new Date(t1.getTime() - timespan*1000);
var timeDomain = [t0, t1]

// Set scaling functions
var x = d3.scaleTime()
          .range([0, width])
          .domain(timeDomain)

var y = d3.scaleLinear()
          .range([0,height])
          .domain([-1.1,1.1])

// Line function
var line = d3.line()
    .x(function(d) { return x(d.dateObj); })
    .y(function(d) { return y(d.y); });

// Add grid lines
var gridVals = d3.range(-1,1,0.2).concat(1);
svg.append("g")
    .attr('id', 'grid-lines')
  .selectAll(".grid-line")
  .data(gridVals)
  .enter().append("line")
      .attr("class","grid-line")
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', d =>y(d))
      .attr('y2', d =>y(d))

// Container for node elements
var container = svg.append("svg")
  .attr("width", width)
  .attr("height", height)

var path = container.append("path")
  .attr("class", "line")
  
// Set axes
var xAxisBottom = d3.axisBottom().scale(x).tickSizeOuter(0);
var xAxisTop = d3.axisTop().scale(x).tickSizeOuter(0);
var yAxisLeft = d3.axisLeft().scale(y).tickSizeOuter(0);
var yAxisRight = d3.axisRight().scale(y).tickValues([]);

// Add X axis bottom
svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr('id', 'xAxisBottom')
    .attr("class", "axis")
    .call(xAxisBottom);

// Add X axis top
svg.append("g")
    .attr('id', 'xAxisTop')
    .attr("class", "x axis")
    .call(xAxisTop);

// Add Y axis left
svg.append("g")
    .attr("class", "axis")
    .call(yAxisLeft);

// Add Y axis right
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + width + ", 0)")
    .call(yAxisRight);

// Init time offset
var offset = 0;

// Return time extent to display
function getTimeExtent(){
  var now = new Date();
  var nowOffset = new Date(now.getTime() + offset);
  var dateStart = new Date(nowOffset.getTime() - timespan*1000);
  return [dateStart, nowOffset]
}

// Update chart axis and data positions
function updateChart() {

  // Update x axis with new times
  timeExtent = getTimeExtent()
  x.domain(timeExtent)
  d3.select('#xAxisBottom').call(xAxisBottom)
  d3.select('#xAxisTop').call(xAxisTop)

  // Filter out trades that are outside timeline
  trades = trades.filter(function(trade){
    return trade.dateObj >= new Date(timeExtent[1].getTime() - 60*1000);
  })

  // Show datapoints on chart if check is enabled
  if ($('#showPoints').is(':checked')) {

    // Join trade data to cirle elements
    var circles = container.selectAll('circle')
      .data(trades, d => d.timestamp);

    // Remove unbound elements
    circles.exit().remove();

    // Create new cirle elements and update positions of existing ones
    circles
      .enter()
        .append('circle')
        .attr('r', 2.5)
        .attr('cy', d => y(d.y))
      .merge(circles)
        .attr('cx', d => x(d.dateObj))
        
  } else {
    // Remove all datapoint elements
    container.selectAll('circle').remove();
  }

  // Update line data
  svg.select(".line")   // change the line
    .attr("d", line(trades));
}

// Set interval callback
d3.interval(updateChart, 15);

// Connect to websocket
var socket = io();

// Semd subscription socket message to server
function subscribe() {
  var channel = $('#channels').val();
  console.log(channel);
  socket.emit('subscribe', channel);
}

// Channel select callback to update subscription
$('#channels').change(function(){
  subscribe();
});

// Channel select callback to update subscription
$('#timespan').change(function(){
  timespan = parseInt($('#timespan').val());
});

// Send initial subscribe message to server
subscribe();

// Init trade data
var trades = []

// Callback function when socket message is received 
socket.on('timestamp', function(data) {

  // Add message data to trades
  data.dateObj = new Date(data.timestamp);
  trades.push(data)

  // Define offset
  if (offset == 0) {
    var now = new Date();
    offset = data.dateObj.getTime() - now.getTime();
  }
});