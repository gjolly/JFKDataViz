var graphObject = {};
graphObject.showGraph = function(graph, init = true) {
  this.graph = graph
  this.lux = 0;
  this.luy = 0;
  this.rdx = 0;
  this.rdy = 0;
  this.linkedByIndex = {};
  this.graph.links.forEach(function(d) {
    graphObject.linkedByIndex[d.source + "," + d.target] = true;
  });

  if (init) {
    this.svg = d3.select("#svgA").append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("id", "svgGraph");
    this.g = this.svg.append("g")
      .attr("class", "everything")
      .attr("id", "svgGraphContainerG")
      .attr("width", d3.select("#svgA").node().clientWidth)
      .attr("height", d3.select("#svgA").node().clientHeight);

    this.div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .attr("id", "tooltip")
      .style("opacity", 0);

  } else {
    this.svg = d3.select("#svgGraph");
    d3.select('#svgGraphContainerG').remove()
    this.g = this.svg.append("g")
      .attr("class", "everything")
      .attr("id", "svgGraphContainerG");
    this.div = d3.select('#tooltip');

    this.svg.append("svg:defs").selectAll("marker")
      .data(["SENDTO"])
      .enter().append("svg:marker")
      .attr("id", String)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 15)
      .attr("refY", -1.5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("svg:path")
      .attr("d", "M0,-5L10,0L0,5");
  }

  this.zoom_handler = d3.zoom()
    .on("zoom", zoom_actions);
  this.zoom_handler(this.svg);

  this.simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) {
      return d.id;
    }))
    .force("collide", d3.forceCollide(30))



  this.link = this.g.append("g")
    .attr("class", "links")
    .selectAll("path")
    .data(this.graph.links)
    .enter().append("path");
  // .attr("marker-end", function(d) {
  //   return "url(#" + d.type + ")";
  // });
  this.link
    .attr("id", function(d) {
      return "link" + d.linkid
    })
    .on("mouseover", linkMouseOver)
    .on("mouseout", linkMouseOut)
    .on("Listmouseover", linkMouseOver)
    .on("Listmouseout", linkMouseOut)


  this.node = this.g.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(this.graph.nodes)
    .enter().append("circle")
    .attr("r", 20)
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended))
    .attr("id", function(d) {
      return "node" + d.id
    })
    .on("mouseover", nodeMouseOver)
    .on("mouseout", nodeMouseOut)
    .on("Listmouseover", ListnodeMouseOver)
    .on("Listmouseout", ListnodeMouseOut)

  this.label = this.g.selectAll(".mytext")
    .data(this.graph.nodes)
    .enter()
    .append("text")
    .text(function(d) {
      return d.title.split(' ').join('\n');
    })
    .style("text-anchor", "middle")
    .style("fill", "#555")
    .style("font-family", "Arial")
    .style("font-size", 12);


  this.simulation
    .nodes(this.graph.nodes)
    .on("tick", this.ticked);

  this.simulation.force("link")
    .links(this.graph.links)
    .distance(Math.sqrt(d3.select('#svgA').node().clientWidth ** 2 + d3.select('#svgA').node().clientHeight ** 2) / 8);

  this.resize(s = false);
  d3.select(window).on("resize", this.resize);

  this.link.on('click', function(d) {
    window.open("https://www.archives.gov/files/research/jfk/releases/" + d.properties.fileName.toLowerCase());
  })

}


graphObject.isConnected = function(a, b) {
  return this.linkedByIndex[a.id + "," + b.id] || this.linkedByIndex[b.id + "," + a.id] || a.id == b.id;
}

graphObject.restart = function() {
  graphObject.node = graphObject.node.data(graphObject.graph.nodes)
  graphObject.node.exit().remove();
  graphObject.node = graphObject.node.enter().append("circle")
    .attr("r", 20)
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended))
    .on("mouseover", nodeMouseOver)
    .on("mouseout", nodeMouseOut)
    .on("Listmouseover", ListnodeMouseOver)
    .on("Listmouseout", ListnodeMouseOut)
    .attr("id", function(d) {
      return "node" + d.id
    })
    .merge(node)

  graphObject.simulation
    .nodes(graphObject.graph.nodes)
  graphObject.simulation.alpha(1).restart();
}

graphObject.ticked = function() {
  graphObject.node.attr("transform", function(d) {
    // let maxW = scaleMod*d3.select("#svgA").node().clientWidth / 2
    // let maxH = scaleMod*d3.select("#svgA").node().clientHeight / 2
    // dx = Math.abs(d.x) < maxW ? d.x : d.x > 0 ? maxW - 20 : -1 * maxW + 20
    // dy = Math.abs(d.y) < maxH ? d.y : d.y > 0 ? maxH - 20 : -1 * maxH + 20
    dx = d.x < this.lux ? this.lux + 20 : d.x > this.rdx ? this.rdx - 20 : d.x
    dy = d.y < this.luy ? this.luy + 20 : d.y > this.rdy ? this.rdy - 20 : d.y
    d.x = dx
    d.y = dy
    return "translate(" + dx + "," + dy + ")";
  });
  graphObject.label.attr("x", function(d) {
      return d.x < this.lux ? this.lux + 20 : d.x > this.rdx ? this.rdx - 20 : d.x
    })
    .attr("y", function(d) {
      return d.y < this.luy ? this.luy + 20 : d.y > this.rdy ? this.rdy - 20 : d.y
    });
  graphObject.link.attr("d", function(d) {
    let nmLink = 0
    for (l of graphObject.graph.links) {
      if (l.source == d.source && l.target == d.target) {
        nmLink++
      }
    }
    if (nmLink == 1) {
      return "M" + d.source.x + "," + d.source.y + "L " + d.target.x + "," + d.target.y
    }
    let dx = d.target.x - d.source.x,
      dy = d.target.y - d.source.y,
      dr = Math.sqrt(dx * dx + dy * dy) / (0.1 + (1 / (0.5 * nmLink)) * (d.linkid % nmLink)),
      mx = d.source.x + dx,
      my = d.source.y + dy;
    se = Math.round(Math.random())
    return [
      "M", d.source.x, d.source.y,
      "A", dr, dr, 0, 0, d.linkid % 2, mx, my,
      "A", dr, dr, 0, 0, d.linkid % 2, d.target.x, d.target.y
    ].join(" ");
    //return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
  });
}

graphObject.resize = function(s = true) {
  var bounds = graphObject.g.node().getBBox();
  var parent = graphObject.g.node().parentElement;
  var fullWidth = parent.clientWidth || parent.parentNode.clientWidth,
    fullHeight = parent.clientHeight || parent.parentNode.clientHeight;
  var width = bounds.width,
    height = bounds.height;
  var midX = bounds.x + width / 2,
    midY = bounds.y + height / 2;
  // g.attr("width", width).attr("height", height);

  var scale = 0.75 / Math.max(width / fullWidth, height / fullHeight);
  var translate = [fullWidth / 2 - scale * midX, fullHeight / 2 - scale * midY];

  if (s) {
    this.lux = scale * this.lux + translate[0]
    this.luy = scale * this.luy + translate[1]
    this.rdx = scale * this.rdx + translate[0]
    this.rdy = scale * this.rdy + translate[1]
    //g.attr("transform", d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
    graphObject.g.transition()
      .duration(750)
      .call(graphObject.zoom_handler.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));

  } else {
    this.lux = -1 * translate[0];
    this.luy = -1 * translate[1];
    this.rdx = translate[0];
    this.rdy = translate[1];
    graphObject.g.transition()
      .duration(750)
      .call(graphObject.zoom_handler.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(1));
    graphObject.simulation.restart();
  }
}


function linkMouseOver(d) {
  graphObject.div.transition()
    .duration(200)
    .style("opacity", .9);
  graphObject.div.html(d.properties.fileName + "<br/>" + d.properties.day + "/" + d.properties.month + "/" + d.properties.year)
    .style("left", (d3.event.pageX) + "px")
    .style("top", (d3.event.pageY - 28) + "px");
  graphObject.link.style('stroke-width', function(l) {
    return d.linkid === l.linkid ? 7 : 2
  })
  graphObject.link.style('stroke', function(l) {
    return d.linkid === l.linkid ? "#faa" : "#aaa"
  })
}

function linkMouseOut(d) {
  graphObject.div.transition()
    .duration(500)
    .style("opacity", 0);
  graphObject.link.style('stroke-width', 3);
  graphObject.link.style('stroke', "#aaa")
}

function nodeMouseOver(d) {
  connectedLinks = []
  graphObject.node.style('opacity', function(l) {
    return graphObject.isConnected(d, l) ? 1 : 0.4
  })
  graphObject.node.style('stroke', function(l) {
    return graphObject.isConnected(d, l) ? "#faa" : "#fff"
  })
  graphObject.div.transition()
    .duration(200)
    .style("opacity", .9);
  graphObject.div.html(d.properties.name + "<br/>" + d.properties.agency)
    .style("left", (d3.event.pageX) + "px")
    .style("top", (d3.event.pageY - 28) + "px");

  graphObject.link.style('stroke-width', function(l) {
    if (d === l.source || d === l.target)
      return 7;
    else
      return;
  });
  graphObject.link.style('stroke', function(l) {
    if (d === l.source || d === l.target)
      return "#faa";
    else
      return "#aaa";
  });
}

// Set the stroke width back to normal when mouse leaves the node.
function nodeMouseOut() {
  graphObject.div.transition()
    .duration(500)
    .style("opacity", 0);
  graphObject.link.style('stroke-width', 5);
  graphObject.link.style('stroke', "#aaa");
  graphObject.node.style('opacity', 1);
  graphObject.node.style("stroke", "#fff")
}

function ListnodeMouseOver(d) {
  graphObject.node.style('opacity', function(l) {
    return d.id == l.id ? 1 : 0.4
  })
  graphObject.node.style('stroke', function(l) {
    return d.id == l.id ? "#faa" : "#fff"
  })
}

function ListnodeMouseOut() {
  graphObject.node.style('opacity', 1);
  graphObject.node.style("stroke", "#fff")
}

function dragstarted(d) {
  if (!d3.event.active) graphObject.simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) graphObject.simulation.alphaTarget(0);
  // d.fx = null;
  // d.fy = null;
}


function zoom_actions() {
  graphObject.g.attr("transform", d3.event.transform);
}
