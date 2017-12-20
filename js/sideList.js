function addElements(elements) {
  addNodes(elements.nodes)
  addDocuments(elements.links)
  agencies = {}
  for (node of elements.nodes) {
    if (!(node["properties"]["agency"] in agencies)) {
      agencies[node["properties"]["agency"]] = []
    }
    agencies[node["properties"]["agency"]].push(node)
  }
  addAgencies(agencies)
  agenciesObj = agencies
}
var agenciesObj
var listOfRemovedNodes = {}
var listOfRemovedLinks = {}
var listOfRemovedAgencies = {}
var agenciesObjToAdd = {}

function addNodes(nodes) {
  if (document.contains(document.getElementById("sidebarPeople"))) {
    document.getElementById("sidebarPeople").remove();
  }
  let secAcco = document.createElement("div");
  secAcco.setAttribute("class","ui accordion sub")
  for (n of nodes) {
    let divt = document.createElement("div");
    divt.setAttribute("id", "listnode" + n.id)
    divt.setAttribute("class", "title")
    let divQ = document.createElement("i")
    divQ.setAttribute("class", "qsa")
    let divCheck = document.createElement("div")
    divCheck.setAttribute("class","ui slider checkbox sb")
    let inputcheck = document.createElement("input")
    inputcheck.setAttribute('type',"checkbox")
    inputcheck.setAttribute('checked',"True")
    inputcheck.setAttribute("id", "buttonShowNode" + n.id)
    inputcheck.onclick = removeNodeFromSideList
    divCheck.appendChild(inputcheck)
    divCheck.appendChild(document.createElement("label"))
    let titletext = document.createTextNode(n.title);
    divQ.appendChild(titletext)
    let divContent= document.createElement("div");
    divContent.setAttribute("class", "content")
    let textEl = document.createElement("p");
    let textCont = document.createTextNode("Agency : " + n.properties.agency)
    textEl.appendChild(textCont)
    divContent.appendChild(textEl)
    divt.onmouseover = function() {
      let nodeId = this.id.substring(4);
      $("#" + nodeId).d3Mouseover();
    }
    divt.onmouseout = function() {
      let nodeId = this.id.substring(4);
      $("#" + nodeId).d3Mouseout();
    }
    divt.appendChild(divQ)
    divt.appendChild(divCheck)
    secAcco.appendChild(divt);
    secAcco.appendChild(divContent);
  }
  let divItem = document.createElement("div")
  divItem.setAttribute("class", "item")
  let divTitle = document.createElement("div")
  divTitle.setAttribute("class", "title")
  let divQs = document.createElement("div")
  divQs.setAttribute("class", "qs")
  let labelQs = document.createElement("label")
  labelQs.appendChild(document.createTextNode("People"))
  let ilabel = document.createElement("i")
  ilabel.setAttribute("class", "ui label")
  ilabel.appendChild(document.createTextNode(graphObject.graph.nodes.length))
  let divContent=document.createElement("div")
  divContent.setAttribute("class","content")
  divContent.appendChild(secAcco)
  divQs.appendChild(labelQs)
  divQs.appendChild(ilabel)
  divTitle.appendChild(divQs)
  divItem.appendChild(divTitle)
  divItem.appendChild(divContent)
  divItem.setAttribute("id", "sidebarPeople")
  document.getElementById("accordsb").appendChild(divItem);
  $('.ui.accordion.sub').accordion({
    selector: {
      trigger: '.title .qsa'
    }
  });
}

function addDocuments(documents) {
  if (document.contains(document.getElementById("sidebarDocument"))) {
    document.getElementById("sidebarDocument").remove();
  }
  let secAcco = document.createElement("div");
  secAcco.setAttribute("class","ui accordion sub")
  for (n of documents) {
    let divt = document.createElement("div");
    divt.setAttribute("id", "listlink" + n.linkid)
    divt.setAttribute("class", "title")
    let divQ = document.createElement("i")
    divQ.setAttribute("class", "qsa")
    let divCheck = document.createElement("div")
    divCheck.setAttribute("class","ui slider checkbox sb")
    let inputcheck = document.createElement("input")
    inputcheck.setAttribute('type',"checkbox")
    inputcheck.setAttribute('checked',"True")
    inputcheck.setAttribute("id", "buttonShowLink" + n.linkid)
    inputcheck.onclick = removeLinkFromSideList
    divCheck.appendChild(inputcheck)
    divCheck.appendChild(document.createElement("label"))
    let titletext = document.createTextNode(n.properties.fileName);
    divQ.appendChild(titletext)
    let divContent= document.createElement("div");
    divContent.setAttribute("class", "content")
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
    divContent.appendChild(textEl)
    divt.onmouseover = function() {
      let linkId = this.id.substring(4);
      $("#" + linkId).d3Mouseover();
    }
    divt.onmouseout = function() {
      let linkId = this.id.substring(4);
      $("#" + linkId).d3Mouseout();
    }
    divt.appendChild(divQ)
    divt.appendChild(divCheck)
    secAcco.appendChild(divt);
    secAcco.appendChild(divContent);
  }
  let divItem = document.createElement("div")
  divItem.setAttribute("class", "item")
  let divTitle = document.createElement("div")
  divTitle.setAttribute("class", "title")
  let divQs = document.createElement("div")
  divQs.setAttribute("class", "qs")
  let labelQs = document.createElement("label")
  labelQs.appendChild(document.createTextNode("Documents"))
  let ilabel = document.createElement("i")
  ilabel.setAttribute("class", "ui label")
  ilabel.appendChild(document.createTextNode(graphObject.graph.links.length))
  let divContent=document.createElement("div")
  divContent.setAttribute("class","content")
  divContent.appendChild(secAcco)
  divQs.appendChild(labelQs)
  divQs.appendChild(ilabel)
  divTitle.appendChild(divQs)
  divItem.appendChild(divTitle)
  divItem.appendChild(divContent)
  divItem.setAttribute("id", "sidebarDocument")
  document.getElementById("accordsb").appendChild(divItem);
  $('.ui.accordion.sub').accordion({
    selector: {
      trigger: '.title .qsa'
    }
  });
}

function addAgencies(agencies) {
  if (document.contains(document.getElementById("sidebarAgency"))) {
    document.getElementById("sidebarAgency").remove();
  }
  let divContent=document.createElement("div")
  divContent.setAttribute("class","content")
  for (ag of Object.keys(agencies)) {
    let smalldi = document.createElement("div")
    smalldi.setAttribute("class","agen")
    let its = document.createElement("i");
    its.setAttribute("id", "listAgency" + ag)
    let textDetailSummary = document.createTextNode(ag);
    its.appendChild(textDetailSummary)
    let divCheck = document.createElement("div")
    divCheck.setAttribute("class","ui slider checkbox sb")
    let inputcheck = document.createElement("input")
    inputcheck.setAttribute('type',"checkbox")
    inputcheck.setAttribute('checked',"True")
    inputcheck.setAttribute("id", "buttonShowAgency" + ag)
    inputcheck.onclick = removeAgencyFromSideList
    divCheck.appendChild(inputcheck)
    divCheck.appendChild(document.createElement("label"))
    smalldi.appendChild(its)
    smalldi.appendChild(divCheck)
    its.onmouseover = function() {
      let agId = this.id.substring(10);
      $("#node" + agenciesObj[agId][0].id).d3MouseoverAgency();
    }
    its.onmouseout = function() {
      let agId = this.id.substring(10);
      $("#node" + agenciesObj[agId][0].id).d3Mouseout();
    }
      divContent.appendChild(smalldi)
  }
  let divItem = document.createElement("div")
  divItem.setAttribute("class", "item")
  let divTitle = document.createElement("div")
  divTitle.setAttribute("class", "title")
  let divQs = document.createElement("div")
  divQs.setAttribute("class", "qs")
  let labelQs = document.createElement("label")
  labelQs.appendChild(document.createTextNode("Agencies"))
  let ilabel = document.createElement("i")
  ilabel.setAttribute("class", "ui label")
  ilabel.appendChild(document.createTextNode(Object.keys(agencies).length))
  divQs.appendChild(labelQs)
  divQs.appendChild(ilabel)
  divTitle.appendChild(divQs)
  divItem.appendChild(divTitle)
  divItem.appendChild(divContent)
  divItem.setAttribute("id", "sidebarAgency")
  document.getElementById("accordsb").appendChild(divItem);
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

jQuery.fn.d3MouseoverAgency = function() {
  this.each(function(i, e) {
    var evt = new MouseEvent("ListmouseoverAgency");
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

function removeAgencyFromSideList() {
  let button = document.getElementById(this.id);
  let associatedId = this.id.substring(16)
  if (associatedId in listOfRemovedAgencies) {
    button.innerHTML = "Hide"
    for (n of agenciesObj[associatedId]) {
      let nodeId = n.id
      let buttonNode = document.getElementById("buttonShowNode" + nodeId);
      buttonNode.innerHTML = "Hide"
      buttonNode.disabled = false
      graphObject.graph.nodes.push(n)
    }
    for (obj of agenciesObjToAdd[associatedId]) {
      for (let l of obj["links"]) {
        graphObject.graph.links.push(l)
        let but = document.getElementById("buttonShowLink" + l.linkid)
        but.innerHTML = "Hide"
        but.disabled = false
      }
    }
    delete agenciesObjToAdd[associatedId]
    graphObject.restart()
    delete listOfRemovedAgencies[associatedId]
  } else {
    listOfRemovedAgencies[associatedId] = agenciesObj[associatedId]
    agenciesObjToAdd[associatedId] = []
    for (n of agenciesObj[associatedId]) {
      let nodeId = n.id
      if (nodeId in listOfRemovedNodes) {
        graphObject.graph.nodes.push(listOfRemovedNodes[nodeId]["Node"])
        for (let l of listOfRemovedNodes[nodeId]["links"]) {
          graphObject.graph.links.push(l)
          let but = document.getElementById("buttonShowLink" + l.linkid)
          but.innerHTML = "Hide"
          but.disabled = false
        }
        button.innerHTML = "Hide"
        delete listOfRemovedNodes[nodeId]
      }
      let objToAdd = {}
      objToAdd["links"] = []
      let linkToRemove = []
      for (let l of graphObject.graph.links) {
        if (l.source.id == nodeId ||  l.target.id == nodeId) {
          objToAdd["links"].push(l)
          linkToRemove.push(l.linkid)
          let but = document.getElementById("buttonShowLink" + l.linkid)
          but.innerHTML = "Show"
          but.disabled = true
        }
      }
      for (const [key, l] of Object.entries(listOfRemovedLinks)) {
        if (l.source.id == nodeId ||  l.target.id == nodeId) {
          objToAdd["links"].push(l)
          linkToRemove.push(l.linkid)
          let but = document.getElementById("buttonShowLink" + l.linkid)
          but.innerHTML = "Show"
          but.disabled = true
          delete listOfRemovedLinks[key]
        }
      }
      graphObject.graph.nodes = graphObject.graph.nodes.filter(function(el) {
        if (el.id == nodeId) {
          objToAdd["Node"] = el
          //listOfRemovedNodes[nodeId] = objToAdd
        }
        return el.id != nodeId
      })
      graphObject.graph.links = graphObject.graph.links.filter(l => !(linkToRemove.includes(l.linkid)))
      let buttonNode = document.getElementById("buttonShowNode" + nodeId);
      buttonNode.innerHTML = "Show"
      buttonNode.disabled = true
      agenciesObjToAdd[associatedId].push(objToAdd)
    }
    graphObject.restart()
    button.innerHTML = "Show"
  }
}
