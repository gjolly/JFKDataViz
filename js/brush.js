window.onload = () => {
  var margin = {
      top: 200,
      right: 40,
      bottom: 200,
      left: 40
    },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  // set limits
  var x = d3.scaleTime()
    .domain([new Date(1944, 0, 0), new Date(1977, 0, 0) - 1])
    .rangeRound([0, width]);

  var svg2 = d3.select("#svgB").append("svg")
    .attr("width", "100%")
    .append("g")
    .attr("width", "100%");

  svg2.append("g")
    .attr("class", "axis axis--grid")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x)
      .ticks(d3.timeYear, 1)
      .tickSize(-height)
      .tickFormat(function() {
        return null;
      }))
    .selectAll(".tick")
    .classed("tick--minor", function(d) {
      return d.getYear();
    });

  svg2.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x)
      .tickPadding(0))
    .attr("text-anchor", null)
    .selectAll("text")
    .attr("x", 0);

  svg2.append("g")
    .attr("class", "brush")
    .call(d3.brushX()
      .extent([
        [0, 0],
        [width, height]
      ])
      .on("end", brushended));

  function brushended() {
    if (!d3.event.sourceEvent) return; // Only transition after input.
    if (!d3.event.selection) return; // Ignore empty selections.
    var d0 = d3.event.selection.map(x.invert),
      d1 = d0.map(d3.timeYear.round);

    d3.select(this).transition().call(d3.event.target.move, d1.map(x));
    criteria.date1 = d1[0];
    criteria.date2 = d1[1];

    let data = JSON.stringify({
      "statements": [{
        "statement": researchStatement(),
        "resultDataContents": ["graph"]
      }]
    });

    graphFetch(url, data);
  }

}
