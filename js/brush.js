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


  var zoom = d3.zoom()
    .translateExtent([
      [0, 0],
      [width, height]
    ])
    .extent([
      [0, 0],
      [width, height]
    ])
    .on("zoom", zoomed);

  var svg2 = d3.select("#svgB").append("svg")
    .attr("width", "100%")
    .append("g")
      .attr("width", "100%");

  svg2.call(zoom);
  axisBottom1 = d3.axisBottom(x)
    .tickSize(-height)
    .tickFormat(function() {
      return null;
    });
  axisBottom2 = d3.axisBottom(x)
    .tickPadding(0);
  g1 = svg2.append("g")
    .attr("class", "axis axis--grid")
    .attr("transform", "translate(0," + height + ")");
  g1
    .call(axisBottom1)
    .selectAll(".tick")
    .classed("tick--minor", function(d) {
      return d.getYear();
    })

  g2 = svg2.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")");
  g2
    .call(axisBottom2)
    .attr("text-anchor", null)
    .selectAll("text")
    .attr("x", 1);

  brush = svg2.append("g")
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
    // if (d1[0] >= d1[1]) {
    //   d1[0] = d3.timeYear.floor(d0[0]);
    //   d1[1] = d3.timeYear.offset(d1[0]);
    // }
    // d3.select(this).transition().call(d3.event.target.move, d1.map(x));
    return d1[0], d1[1]
  }

  function zoomed() {
    var t = d3.event.transform;
    x.domain(t.rescaleX(x).domain());
    g2.call(axisBottom2);
    g1.call(axisBottom1);
  }

}
