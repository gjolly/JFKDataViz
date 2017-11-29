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
    .domain([new Date(1944, 0, 0), new Date(1974, 0, 0) - 1])
    .rangeRound([0, width]);

  var svg2 = d3.select("#svgB").append("svg")
    .attr("width", "90%")
    .attr("height", "10%")
    .append("g");

  svg2.append("g")
    .attr("class", "axis axis--grid")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x)
      .ticks(d3.timeYear) // One row per x year
      .tickSize(-height)
      .tickFormat(function() {
        return null;
      }))
    .selectAll(".tick")
    .classed("tick--minor", function(d) {
      return d.getYear();
    })

  svg2.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x)
      .ticks(d3.timeYear)
      .tickPadding(0))
    .attr("text-anchor", null)
    .selectAll("text")
    .attr("x", 1);

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

    // If empty when rounded, use floor & ceil instead.
    if (d1[0] >= d1[1]) {
      d1[0] = d3.timeYear.floor(d0[0]);
      d1[1] = d3.timeYear.offset(d1[0]);
    }
    d3.select(this).transition().call(d3.event.target.move, d1.map(x));
    return d1[0], d1[1]
  }

  // "MATCH (p1:People)-[doc:SENDTO]->(p2:People)\
  // WHERE doc.year > d1 and doc.year < d2\
  // RETURN p1,p2,doc\
  // LIMIT 15",
}
