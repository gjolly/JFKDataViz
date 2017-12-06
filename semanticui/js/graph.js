function showGraph(graph, init = true) {
  var lux = 0;
  var luy = 0;
  var rdx = 0;
  var rdy = 0;
  var linkedByIndex = {};
  graph.links.forEach(function(d) {
    linkedByIndex[d.source + "," + d.target] = true;
  });

  function isConnected(a, b) {
    return linkedByIndex[a.id + "," + b.id] || linkedByIndex[b.id + "," + a.id] || a.id == b.id;
  }
  if (init) {
    var svg = d3.select("#svgA").append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("id", "svgGraph");
    var g = svg.append("g")
      .attr("class", "everything")
      .attr("id", "svgGraphContainerG")
      .attr("width", d3.select("#svgA").node().clientWidth)
      .attr("height", d3.select("#svgA").node().clientHeight);

    var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .attr("id", "tooltip")
      .style("opacity", 0);

  } else {
    var svg = d3.select("#svgGraph");
    d3.select('#svgGraphContainerG').remove()
    var g = svg.append("g")
      .attr("class", "everything")
      .attr("id", "svgGraphContainerG");
    var div = d3.select('#tooltip');

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
  }

  var bounds = svg.node().getBBox();
  var parent = svg.node().parentElement;
  var fullWidth = parent.clientWidth || parent.parentNode.clientWidth,
    fullHeight = parent.clientHeight || parent.parentNode.clientHeight;
  var width = bounds.width,
    height = bounds.height;
  var midX = bounds.x + width / 2,
    midY = bounds.y + height / 2;
  var zoom_handler = d3.zoom()
    .on("zoom", zoom_actions);
  zoom_handler(svg);

  var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) {
      return d.id;
    }))
    .force("collide", d3.forceCollide(30))



  var link = g.append("g")
    .attr("class", "links")
    .selectAll("path")
    .data(graph.links)
    .enter().append("path");
  // .attr("marker-end", function(d) {
  //   return "url(#" + d.type + ")";
  // });
  link
    .attr("id", function(d) {
      return "link" + d.linkid
    })

  var node = g.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")
    .attr("r", 20)
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

  node
    .attr("id", function(d) {
      return "node" + d.id
    })

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

  //label.call(wrap, 20);

  simulation
    .nodes(graph.nodes)
    .on("tick", ticked);

  simulation.force("link")
    .links(graph.links)
    .distance(Math.sqrt(d3.select('#svgA').node().clientWidth ** 2 + d3.select('#svgA').node().clientHeight ** 2) / 8);

  resize(s = false);
  d3.select(window).on("resize", resize);

  function ticked() {
    node.attr("transform", function(d) {
      // let maxW = scaleMod*d3.select("#svgA").node().clientWidth / 2
      // let maxH = scaleMod*d3.select("#svgA").node().clientHeight / 2
      // dx = Math.abs(d.x) < maxW ? d.x : d.x > 0 ? maxW - 20 : -1 * maxW + 20
      // dy = Math.abs(d.y) < maxH ? d.y : d.y > 0 ? maxH - 20 : -1 * maxH + 20
      dx = d.x < lux ? lux + 20 : d.x > rdx ? rdx - 20 : d.x
      dy = d.y < luy ? luy + 20 : d.y > rdy ? rdy - 20 : d.y
      d.x = dx
      d.y = dy
      return "translate(" + dx + "," + dy + ")";
    });
    label.attr("x", function(d) {
        return d.x < lux ? lux + 20 : d.x > rdx ? rdx - 20 : d.x
      })
      .attr("y", function(d) {
        return d.y < luy ? luy + 20 : d.y > rdy ? rdy - 20 : d.y
      });
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
    //label.call(wrap, 20);
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
    link.style('stroke-width', 3);
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
        return;
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

  function resize(s = true) {
    var bounds = g.node().getBBox();
    var parent = g.node().parentElement;
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
      lux = scale * lux + translate[0]
      luy = scale * luy + translate[1]
      rdx = scale * rdx + translate[0]
      rdy = scale * rdy + translate[1]
      //g.attr("transform", d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
      g.transition()
        .duration(750)
        .call(zoom_handler.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));

    } else {
      lux = -1 * translate[0];
      luy = -1 * translate[1];
      rdx = translate[0];
      rdy = translate[1];
      g.transition()
        .duration(750)
        .call(zoom_handler.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(1));
      simulation.restart();
    }
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
