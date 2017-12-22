function newCriteriaTag(criteriaName){
  let criteria = document.getElementById("criteria");

  // creating new anchor
  let newCrit = document.createElement("a");

  // text for the anchor
  let text = document.createTextNode(criteriaName);
  newCrit.appendChild(text);

  // adding the delete cross
  let del = document.createElement("i");
  del.className = "delete icon";
  newCrit.appendChild(del);

  // others attributes
  newCrit.id = criteriaName;
  newCrit.className = "ui label";
  newCrit.href = "#";
  newCrit.onclick = function() {deleteCriteria(this)};


  criteria.appendChild(newCrit);
}

function deleteCriteria(crit) {
    if (criteria.name == crit.innerText) {
      criteria.name = ".*";
    } else {
      criteria.document = ".*";
    }
    let data = JSON.stringify({
      "statements": [{
        "statement": researchStatement(),
        "resultDataContents": ["graph"]
      }]
    })
    crit.parentNode.removeChild(crit);
    graphFetch(url, data);
}

function deleteCriteriaTag(criteriaName){
  let crit = document.getElementById(criteriaName);
  if (crit) {
    crit.parentNode.removeChild(crit);
  }
}
