function openList() {
  document.getElementById("mySidenav").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
}

function closeList() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
}

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
    liContainer.setAttribute("id",n.id)
    let detailsEl = document.createElement("details");
    let detailSummary = document.createElement("summary");
    let textDetailSummary = document.createTextNode(n.title);
    let textEl = document.createElement("p");
    let textCont = document.createTextNode("Agency : "+n.properties.agency)
    textEl.appendChild(textCont)
    detailSummary.appendChild(textDetailSummary)
    detailsEl.appendChild(detailSummary);
    detailsEl.appendChild(textEl)
    liContainer.appendChild(detailsEl);
    mainUl.appendChild(liContainer);
  }
  mainSummary.appendChild(textMainSummary);
  mainDetails.appendChild(mainSummary);
  mainDetails.appendChild(mainUl);
  document.getElementById("mySidenav").appendChild(mainDetails);
}

function addDocuments(documents) {
  let mainDetails = document.createElement("details");
  let mainSummary = document.createElement("summary");
  let textMainSummary = document.createTextNode("Documents");
  let mainUl = document.createElement("ul");
  for (n of documents) {
    let liContainer = document.createElement("li");
    liContainer.setAttribute("id",n.linkid)
    let detailsEl = document.createElement("details");
    let detailSummary = document.createElement("summary");
    let textDetailSummary = document.createTextNode(n.properties.fileName);
    let textEl = document.createElement("p");
    let cont = "File number "+n.properties.fileNum+"<br>"
    cont += "Date : "+n.properties.day+"/"+n.properties.month+"/"+n.properties.year
    if (n.properties.comments !="None") cont+="<br>Comments : "+ n.properties.comments
    if (n.properties.pageNumber !="None") cont+="<br>Number of pages  : "+ n.properties.pageNumber
    if (n.properties.pageReleased !="None") cont+="<br>Released pages  : "+ n.properties.pageReleased
    if (n.properties.recodSerie !="None") cont+="<br>Record serie  : "+ n.properties.recodSerie
    if (n.properties.recordNumber !="None") cont+="<br>Record number  : "+ n.properties.recordNumber
    if (n.properties.title !="None") cont+="<br>Title  : "+ n.properties.title
    if (n.properties.type !="None") cont+="<br>Type  : "+ n.properties.type
    let textCont = document.createTextNode(cont)
    textEl.appendChild(textCont)
    detailSummary.appendChild(textDetailSummary)
    detailsEl.appendChild(detailSummary);
    detailsEl.appendChild(textEl)
    liContainer.appendChild(detailsEl);
    mainUl.appendChild(liContainer);
  }
  mainSummary.appendChild(textMainSummary);
  mainDetails.appendChild(mainSummary);
  mainDetails.appendChild(mainUl);
  document.getElementById("mySidenav").appendChild(mainDetails);
}

function addAgencies(agencies) {

}
