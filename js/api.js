//const url = 'http://dataviz.gauthierjolly.com:8080';
const url = 'http://localhost:7474/db/data/transaction/commit';
let data = JSON.stringify({
  "statements": [{
    "statement": "MATCH (p1:People)-[doc:SENDTO]->(p2:People)\
  WHERE doc.day = 4\
  AND p2.name <> \"NONE\"\
  AND p1.name <> \"NONE\"\
  RETURN p1,p2,doc\
  LIMIT 150;",
    "resultDataContents": ["graph"]
  }]
})
graphFetch(url, data);

function graphFetch(url, data) {
  let fetchData = {
    method: 'POST',
    body: data,
    headers: new Headers()
  }
  fetchData.headers.append('Content-Type', 'application/json; charset=UTF-8');
  fetch(url, fetchData).then(r => r.json())
    .then(function(data) {
      if (!data["errors"].length) {
        let arrayGraph = data["results"][0]["data"]
        viz = convertApiResult(data)
        console.log(viz)
        graphObject.showGraph(viz)
        addElements(viz)
      }
    })
}

function peopleGraph(peopleName) {
  const url = 'http://localhost:7474/db/data/transaction/commit';
  let data = JSON.stringify({
    "statements": [{
      "statement": "MATCH (p1:People)-[doc:SENDTO]->(p2:People)\
    WHERE p2.name = \""+peopleName+"\" \
    OR p1.name= \""+peopleName+"\" \
    RETURN p1,p2,doc\
    LIMIT 150;",
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
      if (!data["errors"].length) {
        let arrayGraph = data["results"][0]["data"]
        viz = convertApiResult(data)
        console.log(viz)
        graphObject.graph=viz
        graphObject.restart()
        addElements(viz)
      }
    })
}

function idIndex(a, id) {
  for (var i = 0; i < a.length; i++) {
    if (a[i].id == id) return i;
  }
  return null;
}

function convertApiResult(data) {
  var nodes = [],
    links = [];
  data.results[0].data.forEach(function(row) {
    row.graph.nodes.forEach(function(n) {
      if (idIndex(nodes, n.id) == null)
        nodes.push({
          id: n.id.toString(),
          label: n.labels[0],
          title: n.properties.name,
          properties: n.properties
        });
    });
    links = links.concat(row.graph.relationships.map(function(r) {
      return {
        source: r.startNode.toString(),
        target: r.endNode.toString(),
        type: r.type,
        properties: r.properties
      };
    }));
  });
  let linkid = 1

  for (l of links) {
    l['linkid'] = linkid++
  }
  viz = {
    nodes: nodes,
    links: links
  };
  return viz
}


$('#peoplesearch')
  .search({
    type: 'category',
    searchOnFocus: false,
    showNoResults: true,
    minCharacters: 3,
    apiSettings: {
      onResponse: function(apiResponse) {
        let
          resp = {
            results: {}
          }
        for (obj of apiResponse["results"][0]["data"]) {
          let dobj = obj["graph"]["nodes"][0]
          if (!(dobj["properties"]["agency"] in resp.results)) {
            resp.results[dobj["properties"]["agency"]] = {
              name: dobj["properties"]["agency"],
              results: []
            };
          }
          resp.results[dobj["properties"]["agency"]].results.push({
            title: dobj["properties"]["name"],
            description: "id : " + dobj["id"],
          });
        }
        return resp;
      },
      url: 'http://localhost:7474/db/data/transaction/commit',
      method: 'POST',
      beforeSend: function(settings) {
        settings.data = JSON.stringify({
          "statements": [{
            "statement": "MATCH (p1:People)\
          WHERE p1.name =~ '.*" + settings.urlData.query.toUpperCase() + ".*'\
          RETURN p1\
          LIMIT 10;",
            "resultDataContents": ["graph"]
          }]
        })
        return settings;
      },
      beforeXHR: function(xhr) {
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
      },
    },
    onSelect: function(result, response) {
      peopleGraph(result.title)
    }
  });
$('#documentsearch')
  .search({
    type: 'category',
    searchOnFocus: false,
    showNoResults: true,
    minCharacters: 3,
    apiSettings: {
      onResponse: function(apiResponse) {
        console.log(apiResponse)
        // let
        //   resp = {
        //     results: {}
        //   }
        // for (obj of apiResponse["results"][0]["data"]) {
        //   let dobj = obj["graph"]["relationships"][0]
        //   if (!(dobj["properties"]["type"] in resp.results)) {
        //     resp.results[dobj["properties"]["type"]] = {
        //       name: dobj["properties"]["type"],
        //       results: []
        //     };
        //   }
        //   resp.results[dobj["properties"]["type"]].results.push({
        //     title: dobj["properties"]["recordNumber"],
        //     description: "title : " + dobj["properties"]["title"] +
        //       "<br>recordNumber : " + dobj["properties"]["recordNumber"] +
        //       "<br>fileNum : " + dobj["properties"]["fileNum"] +
        //       "<br>fileName : " + dobj["properties"]["fileName"] +
        //       "<br>comments : " + dobj["properties"]["comments"],
        //   });
        // }
        // return resp;
        viz = convertApiResult(apiResponse)
        console.log(viz)
        graphObject.graph = viz
        graphObject.restart()
        addElements(viz)
      },
      url: 'http://localhost:7474/db/data/transaction/commit',
      method: 'POST',
      beforeSend: function(settings) {
        settings.data = JSON.stringify({
          "statements": [{
            "statement": "MATCH (p1:People)-[doc:SENDTO]->(p2:People) \
WHERE toLower(doc.comments) CONTAINS toLower(\"" + settings.urlData.query + "\") \
OR toLower(doc.fileName) CONTAINS toLower(\"" + settings.urlData.query + "\") \
OR toLower(doc.fileNum) CONTAINS toLower(\"" + settings.urlData.query + "\") \
OR toLower(doc.recordNumber) CONTAINS toLower(\"" + settings.urlData.query + "\") \
OR toLower(doc.title) CONTAINS toLower(\"" + settings.urlData.query + "\") \
AND p2.name <> \"NONE\"\
AND p1.name <> \"NONE\"\
RETURN doc \
LIMIT 150;",
            "resultDataContents": ["graph"]
          }]
        })
        return settings;
      },
      beforeXHR: function(xhr) {
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
      },
    },
    onSelect: function(result, response) {
      console.log(result, response)
    }
  });
