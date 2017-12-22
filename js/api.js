const url = 'https://dataviz.gauthierjolly.com:8080';
// const url = 'http://localhost:7474/db/data/transaction/commit';
var criteria = {date1: new Date('1900-01-01'),
                date2: new Date('1970-01-01'),
                document: '.*',
                name: '.*'
              };

var showNone = false;
var showWhithheld = false;

function displayWhithheld(checkbox) {
  showWhithheld = checkbox.checked;
  let data = JSON.stringify({
    "statements": [{
      "statement": researchStatement(),
      "resultDataContents": ["graph"]
    }]
  });

  graphFetch(url, data);
}

function displayNone(checkbox) {
  showNone = checkbox.checked;
  let data = JSON.stringify({
    "statements": [{
      "statement": researchStatement(),
      "resultDataContents": ["graph"]
    }]
  });

  graphFetch(url, data);
}

function researchStatement() {
  let s = "MATCH (p1:People)-[doc:SENDTO]->(p2:People)\
  WHERE (doc.year >= " + criteria.date1.getFullYear() + "\
  AND doc.year < " + criteria.date2.getFullYear() + ") \
  AND (toLower(doc.comments) =~ toLower(\"" + criteria.document + "\") \
  OR toLower(doc.fileName) =~ toLower(\"" + criteria.document + "\") \
  OR toLower(doc.fileNum) =~ toLower(\"" + criteria.document + "\") \
  OR toLower(doc.recordNumber) =~ toLower(\"" + criteria.document + "\") \
  OR toLower(doc.title) =~ toLower(\"" + criteria.document + "\")) \
  AND (p2.name =~ \"" + criteria.name + "\" \
  OR p1.name =~ \"" + criteria.name + "\") \
  AND p1.name <> p2.name ";
  s += showNone ? "":"AND p2.name <> \"NONE\" AND p1.name <> \"NONE\" ";
  s += showWhithheld ? "":"AND p2.name <> \"WHITHELD\" AND p1.name <> \"WHITHELD\" ";
  s += "RETURN p1, p2, doc LIMIT 50;";
  console.log("Reasearch statement: " + s);
  return s;
}

let data = JSON.stringify({
  "statements": [{
    "statement": researchStatement(),
    "resultDataContents": ["graph"]
  }]
})
graphFetch(url, data, first = true);

function graphFetch(url, data, first = false) {
  console.log(criteria);
  let fetchData = {
    method: 'POST',
    body: data,
    headers: new Headers()
  }
  // fetchData.headers.append('Content-Type', 'application/json; charset=UTF-8');
  fetchData.headers.append('Content-Type', 'text/plain; charset=UTF-8');
  fetch(url, fetchData).then(r => r.json())
    .then(function(data) {
      console.log(data["errors"])
      if (!data["errors"].length) {
        let arrayGraph = data["results"][0]["data"]
        viz = convertApiResult(data)
        console.log(viz)
        if (first) {
          graphObject.showGraph(viz)
        } else {
          graphObject.graph = viz
          graphObject.restart()
        }
        addElements(viz)
      }
    })
}

function changeGraph() {
  // const url = 'http://localhost:7474/db/data/transaction/commit';
  const url = "https://dataviz.gauthierjolly.com:8080"
  let data = JSON.stringify({
    "statements": [{
      "statement": "MATCH (p1:People)-[doc:SENDTO]->(p2:People)\
    WHERE p2.name = \"" + peopleName + "\" \
    OR p1.name= \"" + peopleName + "\" \
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
  // fetchData.headers.append('Content-Type', 'application/json; charset=UTF-8');
  fetchData.headers.append('Content-Type', 'text/plain; charset=UTF-8');
  fetch(url, fetchData).then(r => r.json())
    .then(function(data) {
      if (!data["errors"].length) {
        let arrayGraph = data["results"][0]["data"]
        viz = convertApiResult(data)
        console.log(viz)
        graphObject.graph = viz
        graphObject.restart()
        addElements(viz)
      }
    })
}

function peopleGraph(peopleName) {
  // const url = 'http://localhost:7474/db/data/transaction/commit';
  const url = "https://dataviz.gauthierjolly.com:8080"
  criteria.name =  peopleName;
  let data = JSON.stringify({
    "statements": [{
      "statement": researchStatement(),
      "resultDataContents": ["graph"]
    }]
  })
  let fetchData = {
    method: 'POST',
    body: data,
    headers: new Headers()
  }
  // fetchData.headers.append('Content-Type', 'application/json; charset=UTF-8');
  fetchData.headers.append('Content-Type', 'text/plain; charset=UTF-8');
  fetch(url, fetchData).then(r => r.json())
    .then(function(data) {
      if (!data["errors"].length) {
        let arrayGraph = data["results"][0]["data"]
        viz = convertApiResult(data)
        console.log(viz)
        graphObject.graph = viz
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
    minCharacters: 2,
    apiSettings: {
      onResponse: function(apiResponse) {
        let
          resp = {
            results: {}
          }
        console.log(resp.results);
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
      // url: 'http://localhost:7474/db/data/transaction/commit',
      url: url,
      method: 'POST',
      beforeSend: function(settings) {
        console.log(criteria.name);
        name = settings.urlData.query;
        if (criteria.name != '.*') {
            console.log(criteria.name);
            deleteCriteriaTag(criteria.name);
            criteria.name = '.*';
        }
        settings.data = JSON.stringify({
          "statements": [{
            "statement": "MATCH (p1:People)\
            WHERE p1.name =~ '.*" + name.toUpperCase() + ".*' \
            RETURN p1\
            LIMIT 10;",
            "resultDataContents": ["graph"]
          }]
        })
        console.log(settings.data);
        return settings;
      },
      beforeXHR: function(xhr) {
        // xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xhr.setRequestHeader('Content-Type', 'text/plain; charset=UTF-8');
      },
    },
    onSelect: function(result, response) {
      newCriteriaTag(result.title);
      criteria.name = result.title;
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
      // url: 'http://localhost:7474/db/data/transaction/commit',
      url: url,
      method: 'POST',
      beforeSend: function(settings) {
        if (criteria.document != '.*') {
            deleteCriteriaTag(criteria.document.substr(2, criteria.document.length - 4));
        }
        newCriteriaTag(settings.urlData.query);
        criteria.document = '.*' + settings.urlData.query + '.*';
        settings.data = JSON.stringify({
          "statements": [{
            "statement": researchStatement(),
            "resultDataContents": ["graph"]
          }]
        })
        return settings;
      },
      beforeXHR: function(xhr) {
        // xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xhr.setRequestHeader('Content-Type', 'text/plain; charset=UTF-8');
      },
    },
    onSelect: function(result, response) {
      console.log(result, response)
    }
  });

function makeReqAndShow(req) {

}
