// Make chart size responsive
function makeResponsive() {

    // Select svg area
    var svgArea = d3.select("body").select("svg");

    // If area is not empty, remove data
    if (!svgArea.empty()) {
        svgArea.remove();
    }
    // SVG wrapper dimensions determined by current browser window size
    var svgWidth = window.innerWidth * 0.75;
    var svgHeight = window.innerHeight * 0.75;

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

        console.log(typeof(censusData[0].age));

        // Parse Data
        censusData.forEach(function(data) {
            data.poverty = +data.poverty;
            data.age = +data.age;
            data.income = +data.income;
            data.healthcare = +data.healthcare;
            data.obesity = +data.obesity;
            data.smokes = +data.smokes
        });

        console.log(censusData);

        // Scales
        var xScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d.poverty) -1,
            d3.max(censusData, d => d.poverty)])
        .range([0, width]);

        var yScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d.healthcare) -1,
            d3.max(censusData, d => d.healthcare)])
        .range([height, 0]);

        // Append circles to data points
        var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .classed("stateCircle", true)
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.healthcare))
        .attr("r", 15);

        var circleText = chartGroup.selectAll(".stateText")
        .data(censusData)
        .enter()
        .append("text")
        .classed("stateText", true)
        .attr("x", d => xScale(d.poverty))
        .attr("y", d => yScale(d.healthcare))
        .attr("dy", "5px")
        .text(d => d.abbr);

        // Create Axes and append to chart
        var xAxis = d3.axisBottom(xScale);
        var yAxis = d3.axisLeft(yScale);

        chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

        chartGroup.append("g")
        .call(yAxis);

        //Add Axis Labels
        chartGroup.append("text")
        .attr("transform", `translate(${width/2-margin.left}, ${height + margin.top - 10})`)
        .classed("active", true)
        .text("In Poverty (%)");

        chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left -5)
        .attr("x", 0 - (height/2))
        .attr("dy", "1em")
        .classed("active", true)
        .text("Healthcare (%)")

    });
};

// call makeResponsive when browser loads
makeResponsive();

// call makeResponsive again any time window is resized
d3.select(window).on("resize", makeResponsive);

