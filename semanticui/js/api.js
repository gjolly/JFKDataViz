//const url = 'http://dataviz.gauthierjolly.com:8080';
const url = 'http://localhost:7474/db/data/transaction/commit';
let data = JSON.stringify({
  "statements": [{
    "statement": "MATCH (p1:People)-[doc:SENDTO]->(p2:People)\
  WHERE doc.day = 4\
  AND p2.name <> \"NONE\"\
  AND p1.name <> \"NONE\"\
  RETURN p1,p2,doc\
  LIMIT 50;",
    "resultDataContents": ["graph"]
  }]
})


let fetchData = {
  method: 'POST',
  body: data,
  headers: new Headers()
}
fetchData.headers.append('Content-Type', 'application/json; charset=UTF-8');
fetch(url, fetchData).then(r => r.json())
  .then(function(data) {
    console.log(data)
    if (!data["errors"].length) {
      let arrayGraph = data["results"][0]["data"]

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
