function showGraph(json) {
  console.log(JSON.stringify(json))
  var width = window.innerWidth,
    height = window.innerHeight

  var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);
  var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
  var force = d3.layout.force()
    .gravity(.05)
    .distance(500)
    .charge(-1)
    .size([width, height]);
  force
    .nodes(json.nodes)
    .links(json.links)
    .start();

  var link = svg.selectAll(".link")
    .data(json.links)
    .enter().append("path")
    .attr("class", "link");

  var node = svg.selectAll(".node")
    .data(json.nodes)
    .enter().append("g")
    .attr("class", "node")
    .call(force.drag);

  node.append("circle")
    .attr("r", "5");

  node.append("text")
    .attr("dx", 12)
    .attr("dy", ".35em")
    .text(function(d) {
      return d.title
    });

  force.on("tick", function() {
    link.attr("d", function(d) {
      let dx = d.target.x - d.source.x,
        dy = d.target.y - d.source.y,
        dr = Math.sqrt(dx * dx + dy * dy) / (1 + (1 / 15) * (d.linkid))

      return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
    });

    node.attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    });
  });

  link.on('mouseover', function(d) {
    div.transition()
      .duration(200)
      .style("opacity", .9);
    div.html(d.properties.fileName + "<br/>" + d.properties.day + "/" + d.properties.month + "/" + d.properties.year)
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY - 28) + "px");
    link.style('stroke-width', function(l) {
      return d.linkid === l.linkid ? 4 : 2
    })
    link.style('stroke', function(l) {
      return d.linkid === l.linkid ? "#faa" : "#aaa"
    })
  });

  link.on('mouseout', function(d) {
    div.transition()
      .duration(500)
      .style("opacity", 0);
    link.style('stroke-width', 2);
    link.style('stroke-width', 2)
    link.style('stroke', "#aaa")
  });

  node.on('mouseover', function(d) {
    div.transition()
      .duration(200)
      .style("opacity", .9);
    div.html(d.properties.name + "<br/>" + d.properties.agency)
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY - 28) + "px");

    link.style('stroke-width', function(l) {
      if (d === l.source || d === l.target)
        return 4;
      else
        return 2;
    });
  });

  // Set the stroke width back to normal when mouse leaves the node.
  node.on('mouseout', function() {
    div.transition()
      .duration(500)
      .style("opacity", 0);
    link.style('stroke-width', 2);
  });
}
