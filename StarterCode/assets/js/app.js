// @TODO: YOUR CODE HERE!

// Setting up the height and weight for creating a SVG areaa, which will be the main block for our scatter plot
var svgWidth = 960;
var svgHeight = 800;

// Default chart margin areas.
var chartMargin = {
  top: 30,
  right: 30,
  bottom: 30,
  left: 30
};

// Setting up the width and height
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Using the div area ---> "#svg-area", we will append the svg, with the defined height and width
var svg = d3
  .select("#svg-area")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// chartgroup will be used for the outer layer of the scatter plot, like X axis and Y axis
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// chartgroup scatter area will be used to plot all the scatter marks for all states.
var chartGroupScatter = svg.append("g")
  .attr("transform", `translate(${chartMargin.left + 100}, ${chartMargin.top - 100})`);

//Loading the CSV File
d3.csv("data.csv", function(error, response) {

    if (error) return console.warn(error);

    //Type casting the property and healthcare
    response.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    //Scale Function for the X Coordindates
    var xScale = d3.scaleLinear()
    .domain(d3.extent(response, d => d.poverty))
    .range([0, 900]);

    //Scale functions for the Y Coordinates
    var yScale = d3.scaleLinear()
    .domain([0, d3.max(response, d => d.healthcare)])
    .range([750, 0]);

    // Create two new functions passing the scales in as arguments
    // These will be used to create the chart's axes
    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);

    //From the response object from the csv file, we will be plotting the values via cx and cy 
    chartGroupScatter.selectAll("circle")
                .data(response)
                .enter()
                .append("circle")
                .attr("cx", function(data, index) {
                    return xScale(data.poverty)
                })
                .attr("cy", function(data, index) {
                    return yScale(data.healthcare)
                })
                .attr("r", "20")
                .attr("fill", "lightblue");

    // Appending a label to each data point. This time we will be using the coordinates and add the state name
    chartGroupScatter.append("text")
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
        .attr('transform', `translate(50, 740)`)
        .call(bottomAxis);

    // Append a group for y-axis, then display it
    chartGroup
        .append("g")
        .attr('transform', `translate(50, 0)`)
        .call(leftAxis);

    // Append y-axis label
    chartGroup
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0-chartMargin.left + 10)
        .attr("x", 0 - svgHeight/2)
        .attr("dy","1em")
        .attr("class", "axis-text")
        .text("Lacks Healthcare (%)")

    // Append x-axis labels
    chartGroup
        .append("text")
        .attr(
            "transform",
            "translate(" + svgWidth / 2 + " ," + (710 + chartMargin.top + 30) + ")"
        )
        .attr("class", "axis-text")
        .text("In Poverty (%)");

});
