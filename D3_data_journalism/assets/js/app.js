// Determine SVG wrapper dimensions

var svgWidth = 1200;
var svgHeight = 660;

var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.right - margin.left;

// Create SVG Wrapper
var svg = d3.select("#scatter")
.append("svg")
.attr("width", svgWidth)
.attr("height", svgHeight);

// Add an SVG group
var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

// Get data from CSV file
d3.csv("assets/data/data.csv").then(function(censusData, err) {
    if (err) throw err;

    // Parse Data
    censusData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes
    });

    // Scales
    var xScale = d3.scaleLinear()
    .domain(d3.extent(censusData, d => d.poverty))
    .range([0, width]);

    var yScale = d3.scaleLinear()
    .domain(d3.extent(censusData, d => d.healthcare))
    .range([height, 0]);

    // Append circles to data points
    var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .classed("stateCircle", true)
    .attr("cx", xScale)
    .attr("cy", yScale)
    .attr("r", 5)
    .text(censusData, d => d.abbr);
})