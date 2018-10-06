// @TODO: YOUR CODE HERE!


// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
  top: 30,
  right: 30,
  bottom: 30,
  left: 30
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
  .select("#svg-area")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// to the margins set in the "chartMargin" object.
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);


//Loading the CSV File
d3.csv("data.csv", function(error, response) {

   // Cast the hours value to a number for each piece of tvData

    if (error) return console.warn(error);

    response.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    //Scale Function for the X Coordindates
    var xScale = d3.scaleLinear()
    .domain(d3.extent(response, d => d.poverty))
    .range([0, svgWidth]);

    //Scale functions for the Y Coordinates
    var yScale = d3.scaleLinear()
    .domain([0, d3.max(response, d => d.healthcare)])
    .range([svgHeight, 0]);

    // Create two new functions passing the scales in as arguments
    // These will be used to create the chart's axes
    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);


    chartGroup.selectAll("circle")
                .data(response)
                .enter()
                .append("circle")
                .attr("cx", function(data, index) {
                    return xScale(data.poverty)
                })
                .attr("cy", function(data, index) {
                    return yScale(data.healthcare)
                })
                .attr("r", "15")
                .attr("fill", "lightblue");

    // Appending a label to each data point
    chartGroup.append("text")
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .selectAll("tspan")
        .data(response)
        .enter()
        .append("tspan")
            .attr("x", function(data) {
                return xScale(data.poverty);
            })
            .attr("y", function(data) {
                return yScale(data.healthcare);
            })
            .text(function(data) {
                return data.abbr
            });

             // Append an SVG group for the xaxis, then display x-axis 
    chartGroup
        .append("g")
        .attr('transform', `translate(0, ${svgHeight})`)
        .call(bottomAxis);

    // Append a group for y-axis, then display it
    chartGroup.append("g").call(leftAxis);

    // Append y-axis label
    chartGroup
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0-chartMargin.left + 40)
        .attr("x", 0 - svgHeight/2)
        .attr("dy","1em")
        .attr("class", "axis-text")
        .text("Physically Active (%)")

    // Append x-axis labels
    chartGroup
        .append("text")
        .attr(
            "transform",
            "translate(" + svgWidth / 2 + " ," + (svgHeight + chartMargin.top + 30) + ")"
        )
        .attr("class", "axis-text")
        .text("In Poverty (%)");

});
