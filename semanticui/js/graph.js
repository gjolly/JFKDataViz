function showGraph(graph) {
  var linkedByIndex = {};
  graph.links.forEach(function(d) {
    linkedByIndex[d.source + "," + d.target] = true;
  });

  function isConnected(a, b) {
    return linkedByIndex[a.id + "," + b.id] || linkedByIndex[b.id + "," + a.id] || a.id == b.id;
  }

  var svg = d3.select("#svgA").append("svg")
    .attr("width", "100%")
    .attr("height", "100%");
  var bounds = svg.node().getBBox();
  var parent = svg.node().parentElement;
  var fullWidth = parent.clientWidth,
    fullHeight = parent.clientHeight;
  var width = bounds.width,
    height = bounds.height;
  var midX = bounds.x + width / 2,
    midY = bounds.y + height / 2;
  var zoom_handler = d3.zoom()
    .on("zoom", zoom_actions);
  var g = svg.append("g")
    .attr("class", "everything");
  zoom_handler(svg);

  var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
  var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) {
      return d.id;
    }))
    .force("charge", d3.forceManyBody())
    .force("collide", d3.forceCollide(50))
    .force("center", d3.forceCenter(midX, midY));
  svg.append("svg:defs").selectAll("marker")
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

  var link = g.append("g")
    .attr("class", "links")
    .selectAll("path")
    .data(graph.links)
    .enter().append("path");
  // .attr("marker-end", function(d) {
  //   return "url(#" + d.type + ")";
  // });

  var node = g.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")
    .attr("r", 30)
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

  var label = g.selectAll(".mytext")
    .data(graph.nodes)
    .enter()
    .append("text")
    .text(function(d) {
      return d.title.split(' ').join('\n');
    })
    .style("text-anchor", "middle")
    .style("fill", "#555")
    .style("font-family", "Arial")
    .style("font-size", 12);

  //label.call(wrap, 30);

  simulation
    .nodes(graph.nodes)
    .on("tick", ticked);

  simulation.force("link")
    .links(graph.links)
    .distance((width * width + height * height) / 30000);

  resize();
  d3.select(window).on("resize", resize);

  function ticked() {
    link.attr("d", function(d) {
      let nmLink = 0
      for (l of graph.links) {
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

    node.attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    });
    label.attr("x", function(d) {
        return d.x;
      })
      .attr("y", function(d) {
        return d.y;
      });
    //label.call(wrap, 30);
  }

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    // d.fx = null;
    // d.fy = null;
  }


  link.on('mouseover', function(d) {
    div.transition()
      .duration(200)
      .style("opacity", .9);
    div.html(d.properties.fileName + "<br/>" + d.properties.day + "/" + d.properties.month + "/" + d.properties.year)
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY - 28) + "px");
    link.style('stroke-width', function(l) {
      return d.linkid === l.linkid ? 7 : 2
    })
    link.style('stroke', function(l) {
      return d.linkid === l.linkid ? "#faa" : "#aaa"
    })
  });

  link.on('mouseout', function(d) {
    div.transition()
      .duration(500)
      .style("opacity", 0);
    link.style('stroke-width', 5);
    link.style('stroke', "#aaa")
  });

  function zoom_actions() {
    g.attr("transform", d3.event.transform);
  }
  link.on('click', function(d) {
    window.open("https://www.archives.gov/files/research/jfk/releases/" + d.properties.fileName.toLowerCase());
  })
  node.on('mouseover', function(d) {
    connectedLinks = []
    node.style('opacity', function(l) {
      return isConnected(d, l) ? 1 : 0.4
    })
    node.style('stroke', function(l) {
      return isConnected(d, l) ? "#faa" : "#fff"
    })
    div.transition()
      .duration(200)
      .style("opacity", .9);
    div.html(d.properties.name + "<br/>" + d.properties.agency)
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY - 28) + "px");

    link.style('stroke-width', function(l) {
      if (d === l.source || d === l.target)
        return 7;
      else
        return 2;
    });
    link.style('stroke', function(l) {
      if (d === l.source || d === l.target)
        return "#faa";
      else
        return "#aaa";
    });
  });

  // Set the stroke width back to normal when mouse leaves the node.
  node.on('mouseout', function() {
    div.transition()
      .duration(500)
      .style("opacity", 0);
    link.style('stroke-width', 5);
    link.style('stroke', "#aaa");
    node.style('opacity', 1);
    node.style("stroke", "#fff")
  });

  function resize() {
    var bounds = svg.node().getBBox();
    var parent = svg.node().parentElement;
    var fullWidth = parent.clientWidth,
      fullHeight = parent.clientHeight;
    var width = bounds.width,
      height = bounds.height;
    var midX = bounds.x + width / 2,
      midY = bounds.y + height / 2;
    g.attr("width", width).attr("height", height);
    simulation.force("center")
      .x(midX)
      .y(midY);
    simulation.restart();
    var scale = 0.25 / Math.max(width / fullWidth, height / fullHeight);
    var translate = [fullWidth / 2 - scale * midX, fullHeight / 2 - scale * midY];

    // g.attr("transform", d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
    svg.transition()
      .duration(750)
      .call( zoom_handler.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) );
  }

  function wrap(text, width) {
    text.each(function() {
      var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
      }
    });
  }
}
