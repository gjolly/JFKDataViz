const url = 'http://dataviz.gauthierjolly.com:8080';
//I can't manage to use params here
let data = JSON.stringify({
  "statements": [{
    "statement": "MATCH (p1:People)-[doc:SENDTO]->(p2:People)\
  WHERE doc.day = 4\
  RETURN p1,p2,doc\
  LIMIT 50;",
    "resultDataContents": ["graph"]
  }]
})

//I also tried with that but the i can not manage to get the good result graph format
// const url = 'http://dataviz.gauthierjolly.com:8080/db/data/cypher';
// // The data we are going to send in our request
// let data = JSON.stringify({
//   "query": "MATCH (p1:People)-[doc:SENDTO]->(p2:People)\
//   WHERE doc.day = { dayDate }\
//   RETURN p1,p2,doc",
//   "params": {
//     "dayDate": 4
//   },
// })

let fetchData = {
  method: 'POST',
  body: data,
  headers: new Headers()
}
fetchData.headers.append('Content-Type', 'text/plain; charset=UTF-8');
fetch(url, fetchData).then(r => r.json())
  .then(function(data) {
    console.log(data)
    if (!data["errors"].length) {
      let arrayGraph = data["results"][0]["data"]
      //TODO make it more efficient
      // let graph = {
      //   nodes: [],
      //   links: []
      // }
      // for (i of arrayGraph) {
      //
      //   graph["nodes"] = graph["nodes"].concat(i["graph"]["nodes"])
      //   graph["links"] = graph["links"].concat(i["graph"]["relationships"])
      // }
      // console.log(graph)

      function idIndex(a, id) {
        for (var i = 0; i < a.length; i++) {
          if (a[i].id == id) return i;
        }
        return null;
      }
      var nodes = [],
        links = [];
      data.results[0].data.forEach(function(row) {
        row.graph.nodes.forEach(function(n) {
          if (idIndex(nodes, n.id) == null)
            nodes.push({
              id: n.id.toString(),
              label: n.labels[0],
              title: n.properties.name,
              properties : n.properties
            });
        });
        links = links.concat(row.graph.relationships.map(function(r) {
          return {
            // source: idIndex(nodes, r.startNode.toString()),
            // target: idIndex(nodes, r.endNode.toString()),
            source: r.startNode.toString(),
            target: r.endNode.toString(),
            type: r.type,
            properties : r.properties
          };
        }));
      });
      let linkid=1

      for (l of links){
        l['linkid']=linkid++
      }
      viz = {
        nodes: nodes,
        links: links
      };
      console.log(viz)
      showGraph(viz )
      addElements(viz)
    }
  })
