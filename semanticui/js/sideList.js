function addElements(elements) {
  addNodes(elements.nodes)
  addDocuments(elements.links)
  addAgencies("Agency")
}

function addNodes(nodes) {
  let mainDetails = document.createElement("details");
  let mainSummary = document.createElement("summary");
  let textMainSummary = document.createTextNode("People");
  let mainUl = document.createElement("ul");
  for (n of nodes) {
    let liContainer = document.createElement("li");
    liContainer.setAttribute("id", "listnode"+n.id)
    let detailsEl = document.createElement("details");
    let detailSummary = document.createElement("summary");
    let textDetailSummary = document.createTextNode(n.title);
    let textEl = document.createElement("p");
    let textCont = document.createTextNode("Agency : " + n.properties.agency)
    textEl.appendChild(textCont)
    let buttonShow=document.createElement("button")
    buttonShow.appendChild(document.createTextNode("Show/Hide"))
    detailSummary.appendChild(textDetailSummary)
    detailsEl.appendChild(detailSummary);
    detailsEl.appendChild(textEl)
    detailsEl.appendChild(buttonShow)
    liContainer.appendChild(detailsEl);
    liContainer.onmouseover = function(){
      let nodeId = this.id.substring(4);
      $("#"+nodeId).d3Mouseover();
    }
    liContainer.onmouseout = function(){
      let nodeId = this.id.substring(4);
      $("#"+nodeId).d3Mouseout();
    }
    mainUl.appendChild(liContainer);
  }
  mainSummary.appendChild(textMainSummary);
  mainDetails.appendChild(mainSummary);
  mainDetails.appendChild(mainUl);
  document.getElementById("sidebar").appendChild(mainDetails);
}

function addDocuments(documents) {
  let mainDetails = document.createElement("details");
  let mainSummary = document.createElement("summary");
  let textMainSummary = document.createTextNode("Documents");
  let mainUl = document.createElement("ul");
  for (n of documents) {
    let liContainer = document.createElement("li");
    liContainer.setAttribute("id", "listlink"+n.linkid)
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
    addText(textEl,cont)
    let buttonShow=document.createElement("button")
    buttonShow.appendChild(document.createTextNode("Show/Hide"))
    detailSummary.appendChild(textDetailSummary)
    detailsEl.appendChild(detailSummary);
    detailsEl.appendChild(textEl)
    detailsEl.appendChild(buttonShow)
    liContainer.appendChild(detailsEl);
    liContainer.onmouseover = function(){
      let linkId = this.id.substring(4);
      $("#"+linkId).d3Mouseover();
    }
    liContainer.onmouseout = function(){
      let linkId = this.id.substring(4);
      $("#"+linkId).d3Mouseout();
    }
    mainUl.appendChild(liContainer);
  }
  mainSummary.appendChild(textMainSummary);
  mainDetails.appendChild(mainSummary);
  mainDetails.appendChild(mainUl);
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

jQuery.fn.d3Mouseover = function () {
  this.each(function (i, e) {
    var evt = new MouseEvent("mouseover");
    e.dispatchEvent(evt);
  });
};

jQuery.fn.d3Mouseout = function () {
  this.each(function (i, e) {
    var evt = new MouseEvent("mouseout");
    e.dispatchEvent(evt);
  });
};
