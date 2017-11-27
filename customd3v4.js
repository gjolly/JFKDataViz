function showGraph(graph) {
  console.log(JSON.stringify(graph))
  var width = window.innerWidth,
    height = window.innerHeight

  var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

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
    .force("center", d3.forceCenter(width / 2, height / 2));
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
    .attr("r", 5)
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

  var label = g.selectAll(".mytext")
    .data(graph.nodes)
    .enter()
    .append("text")
    .text(function(d) {
      return d.title;
    })
    .style("text-anchor", "middle")
    .style("fill", "#555")
    .style("font-family", "Arial")
    .style("font-size", 12);

  simulation
    .nodes(graph.nodes)
    .on("tick", ticked);

  simulation.force("link")
    .links(graph.links)
    .distance(500);

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
        return d.y - 10;
      });
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
    d.fx = null;
    d.fy = null;
  }


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

  function zoom_actions() {
    g.attr("transform", d3.event.transform);

  }
  link.on('click',function(d){
    window.open("https://www.archives.gov/files/research/jfk/releases/"+d.properties.fileName.toLowerCase());
  })
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
