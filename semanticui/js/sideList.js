function addElements(elements) {
  addNodes(elements.nodes)
  addDocuments(elements.links)
  addAgencies("Agency")
}

var listOfRemovedNodes = {}
var listOfRemovedLinks = {}

function addNodes(nodes) {
  if (document.contains(document.getElementById("sidebarPeople"))) {
    document.getElementById("sidebarPeople").remove();
  }
  let mainDetails = document.createElement("details");
  let mainSummary = document.createElement("summary");
  let textMainSummary = document.createTextNode("People");
  let mainUl = document.createElement("ul");
  for (n of nodes) {
    let liContainer = document.createElement("li");
    liContainer.setAttribute("id", "listnode" + n.id)
    let detailsEl = document.createElement("details");
    let detailSummary = document.createElement("summary");
    let textDetailSummary = document.createTextNode(n.title);
    let textEl = document.createElement("p");
    let textCont = document.createTextNode("Agency : " + n.properties.agency)
    textEl.appendChild(textCont)
    let buttonShow = document.createElement("button")
    buttonShow.appendChild(document.createTextNode("Hide"))
    buttonShow.setAttribute("id", "buttonShowNode" + n.id)
    buttonShow.onclick = removeNodeFromSideList
    detailSummary.appendChild(textDetailSummary)
    detailsEl.appendChild(detailSummary);
    detailsEl.appendChild(textEl)
    detailsEl.appendChild(buttonShow)
    liContainer.appendChild(detailsEl);
    liContainer.onmouseover = function() {
      let nodeId = this.id.substring(4);
      $("#" + nodeId).d3Mouseover();
    }
    liContainer.onmouseout = function() {
      let nodeId = this.id.substring(4);
      $("#" + nodeId).d3Mouseout();
    }
    mainUl.appendChild(liContainer);
  }
  mainSummary.appendChild(textMainSummary);
  mainDetails.appendChild(mainSummary);
  mainDetails.appendChild(mainUl);
  mainDetails.setAttribute("id", "sidebarPeople")
  document.getElementById("sidebar").appendChild(mainDetails);
}

function addDocuments(documents) {
  if (document.contains(document.getElementById("sidebarDocument"))) {
    document.getElementById("sidebarDocument").remove();
  }
  let mainDetails = document.createElement("details");
  let mainSummary = document.createElement("summary");
  let textMainSummary = document.createTextNode("Documents");
  let mainUl = document.createElement("ul");
  for (n of documents) {
    let liContainer = document.createElement("li");
    liContainer.setAttribute("id", "listlink" + n.linkid)
    let detailsEl = document.createElement("details");
    let detailSummary = document.createElement("summary");
    let textDetailSummary = document.createTextNode(n.properties.fileName);
    let textEl = document.createElement("p");
    let cont = "File number " + n.properties.fileNum + "<br>"
    cont += "Date : " + n.properties.day + "/" + n.properties.month + "/" + n.properties.year
    if (n.properties.comments != "None") cont += "<br>Comments : " + n.properties.comments
    if (n.properties.pageNumber != "None") cont += "<br>Number of pages  : " + n.properties.pageNumber
    if (n.properties.pageReleased != "None") cont += "<br>Released pages  : " + n.properties.pageReleased
    if (n.properties.recodSerie != "None") cont += "<br>Record serie  : " + n.properties.recodSerie
    if (n.properties.recordNumber != "None") cont += "<br>Record number  : " + n.properties.recordNumber
    if (n.properties.title != "None") cont += "<br>Title  : " + n.properties.title
    if (n.properties.type != "None") cont += "<br>Type  : " + n.properties.type
    // let textCont = document.createTextNode(cont)
    // textEl.appendChild(textCont)
    addText(textEl, cont)
    let buttonShow = document.createElement("button")
    buttonShow.appendChild(document.createTextNode("Hide"))
    buttonShow.setAttribute("id", "buttonShowLink" + n.linkid)
    buttonShow.onclick = removeLinkFromSideList
    detailSummary.appendChild(textDetailSummary)
    detailsEl.appendChild(detailSummary);
    detailsEl.appendChild(textEl)
    detailsEl.appendChild(buttonShow)
    liContainer.appendChild(detailsEl);
    liContainer.onmouseover = function() {
      let linkId = this.id.substring(4);
      $("#" + linkId).d3Mouseover();
    }
    liContainer.onmouseout = function() {
      let linkId = this.id.substring(4);
      $("#" + linkId).d3Mouseout();
    }
    mainUl.appendChild(liContainer);
  }
  mainSummary.appendChild(textMainSummary);
  mainDetails.appendChild(mainSummary);
  mainDetails.appendChild(mainUl);
  mainDetails.setAttribute("id", "sidebarDocument")
  document.getElementById("sidebar").appendChild(mainDetails);
}

function addAgencies(agencies) {

}

function addText(node, text) {
  var t = text.split(/\s*<br ?\/?>\s*/i),
    i;
  if (t[0].length > 0) {
    node.appendChild(document.createTextNode(t[0]));
  }
  for (i = 1; i < t.length; i++) {
    node.appendChild(document.createElement('BR'));
    if (t[i].length > 0) {
      node.appendChild(document.createTextNode(t[i]));
    }
  }
}

jQuery.fn.d3Mouseover = function() {
  this.each(function(i, e) {
    var evt = new MouseEvent("Listmouseover");
    e.dispatchEvent(evt);
  });
};

jQuery.fn.d3Mouseout = function() {
  this.each(function(i, e) {
    var evt = new MouseEvent("Listmouseout");
    e.dispatchEvent(evt);
  });
};

function removeNodeFromSideList() {
  let button = document.getElementById(this.id);
  let associatedId = this.id.substring(14);
  if (associatedId in listOfRemovedNodes) {
    graphObject.graph.nodes.push(listOfRemovedNodes[associatedId]["Node"])
    for (let l of listOfRemovedNodes[associatedId]["links"]) {
      graphObject.graph.links.push(l)
      let but = document.getElementById("buttonShowLink" + l.linkid)
      but.innerHTML = "Hide"
      but.disabled = false
    }
    graphObject.restart()
    button.innerHTML = "Hide"
    delete listOfRemovedNodes[associatedId]
  } else {
    let objToAdd = {}
    let linkToRemove = []
    objToAdd["links"] = []
    for (let l of graphObject.graph.links) {
      if (l.source.id == associatedId ||  l.target.id == associatedId) {
        objToAdd["links"].push(l)
        linkToRemove.push(l.linkid)
        let but = document.getElementById("buttonShowLink" + l.linkid)
        but.innerHTML = "Show"
        but.disabled = true
      }
    }
    for (const [key, l] of Object.entries(listOfRemovedLinks)) {
      if (l.source.id == associatedId ||  l.target.id == associatedId) {
        objToAdd["links"].push(l)
        linkToRemove.push(l.linkid)
        let but = document.getElementById("buttonShowLink" + l.linkid)
        but.innerHTML = "Show"
        but.disabled = true
        delete listOfRemovedLinks[key]
      }
    }
    graphObject.graph.nodes = graphObject.graph.nodes.filter(function(el) {
      if (el.id == associatedId) {
        objToAdd["Node"] = el
        console.log(el)
        listOfRemovedNodes[associatedId] = objToAdd
      }
      return el.id != associatedId
    })
    graphObject.graph.links = graphObject.graph.links.filter(l => !(linkToRemove.includes(l.linkid)))
    graphObject.restart()
    button.innerHTML = "Show"
  }
}

function removeLinkFromSideList() {
  let button = document.getElementById(this.id);
  let associatedId = this.id.substring(14);
  if (associatedId in listOfRemovedLinks) {
    graphObject.graph.links.push(listOfRemovedLinks[associatedId])
    graphObject.restart()
    button.innerHTML = "Hide"
    delete listOfRemovedLinks[associatedId]
  } else {
    graphObject.graph.links = graphObject.graph.links.filter(function(el) {
      if (el.linkid == associatedId) {
        listOfRemovedLinks[associatedId] = el
      }
      return el.linkid != associatedId
    })
    graphObject.restart()
    button.innerHTML = "Show"
  }
}
