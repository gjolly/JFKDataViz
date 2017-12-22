$('select.dropdown')
  .dropdown();
function initAdvanced(){
   $('.ui.modal').modal('show');
   $('#formAdSe').form('clear');
}
$(document).ready(function() {
  //Sorry for this code if you read this, I would have loved to code something clean
  let maxField = 8;
  let addButton = $('.add_button');
  let wrapper = $('.field_wrapper');
  let x = 2;
  $(addButton).click(function() {
    if (x < maxField) {
      x++;
      addfields(wrapper, x)
      $('select.dropdown')
        .dropdown();
      $('.dropdown').dropdown('setting', 'onChange', function(value) {
        majDropdown(value, this)
      });
    }
  });
  $(wrapper).on('click', '.remove_button', function(e) {
    e.preventDefault();
    $(this).parent('div').remove();
    x--;
  });
});
$('.dropdown').dropdown('setting', 'onChange', function(value) {
  majDropdown(value, this)
});

function addfields(w, x) {
  let fieldHTML = '<div class="fields">\
        <div class="field">\
          <div class="ui sub header">Logic</div>\
          <select name="log' + x + '" id="se' + x + '" class="ui fluid search dropdown">\
        <option value="and">AND</option>\
        <option value="or">OR</option>\
        </select>\
        </div>\
        <div class="field">\
          <div class="ui sub header">Target</div>\
          <select name="one' + x + '" id="sel' + x + 'a" class="ui fluid search dropdown">\
          <option value="">Choose a field</option>\
        <option value="p1.name">Sender name</option>\
        <option value="p1.agency">Sender agency</option>\
        <option value="p2.name">Recipient name</option>\
        <option value="p2.agency">Recipient agency</option>\
        <option value="date">Date</option>\
        <option value="doc.fileName">Document file name</option>\
        <option value="doc.recordNumber">Record number</option>\
        <option value="doc.type">Document type</option>\
        <option value="doc.fileNum">Document file number</option>\
        <option value="doc.title">Document title</option>\
        <option value="doc.pageNumber">Document page number</option>\
        <option value="doc.comments">Document comments</option>\
        </select>\
        </div>\
        <div class="field">\
          <div class="ui sub header">Action</div>\
          <select name="two' + x + '" id="sel' + x + 'b" class="ui fluid search dropdown">\
          <option value="">Choose an action</option>\
          </select>\
        </div>\
        <div class="field" id="sel' + x + 'c"> \
        </div>\
        <i class="material-icons remove_button" style="vertical-align:middle; color: #F44336;">remove_circle</i>\
      </div>';
  $(w).append(fieldHTML);
  $('#formAdSe').form()
}

function majDropdown(value, that) {
  if (that.id.slice(-1) == "a") {
    let nextid = that.id.substring(0, that.id.length - 1) + 'b'
    let thirdid = that.id.substring(0, that.id.length - 1) + 'c'
    if (["p1.name", "p1.agency", "p2.name", "p2.agency", "doc.fileName", "doc.recordNumber", "doc.type",
        "doc.fileNum", "doc.title", "doc.comments"
      ].includes(value)) {
      let x = document.getElementById(nextid)
      removeOptions(x);
      let option = document.createElement("option");
      let option1 = document.createElement("option");
      let option2 = document.createElement("option");
      let option3 = document.createElement("option");
      let option4 = document.createElement("option");
      option.text = "Choose an action"
      option1.text = "equals"
      option2.text = "contains"
      option3.text = "different from"
      option4.text = "Match regex"
      option1.setAttribute("value", "equals")
      option2.setAttribute("value", "contains")
      option3.setAttribute("value", "diff")
      option4.setAttribute("value", "match")
      x.add(option)
      x.add(option1)
      x.add(option2)
      x.add(option3)
      x.add(option4)
      let y = document.getElementById(thirdid)
      removeChildren(y);
      let lab = document.createElement("LABEL")
      lab.appendChild(document.createTextNode("Value"))
      lab.setAttribute("class", "ui sub header")
      let inp = document.createElement("INPUT");
      inp.setAttribute("name", "textval" + that.id.substring(0, that.id.length - 1))
      y.appendChild(lab)
      y.appendChild(inp)
    } else {
      let x = document.getElementById(nextid)
      removeOptions(x);
      let option = document.createElement("option");
      let option1 = document.createElement("option");
      let option2 = document.createElement("option");
      let option3 = document.createElement("option");
      let option4 = document.createElement("option");
      option.text = "Choose an action"
      option1.text = "equals"
      option2.text = "greater than"
      option3.text = "less than"
      option4.text = "different from"
      option1.setAttribute("value", "equals")
      option2.setAttribute("value", "gt")
      option3.setAttribute("value", "lt")
      option4.setAttribute("value", "diff")
      x.add(option)
      x.add(option1)
      x.add(option2)
      x.add(option3)
      x.add(option4)
      let y = document.getElementById(thirdid)
      removeChildren(y)
      if (value == "date") {
        let maindiv = document.createElement("div");
        maindiv.setAttribute("class", "ui calendar")
        maindiv.setAttribute("id", thirdid + "calendar")
        let seconddiv = document.createElement("div")
        seconddiv.setAttribute("class", "ui input left icon")
        let i = document.createElement("i")
        i.setAttribute("class", "calendar icon")
        let lab = document.createElement("LABEL")
        lab.appendChild(document.createTextNode("Value"))
        lab.setAttribute("class", "ui sub header")
        let inp = document.createElement("input")
        inp.setAttribute("name", "textval" + that.id.substring(0, that.id.length - 1))
        inp.setAttribute("type", "text");
        seconddiv.appendChild(i)
        maindiv.appendChild(lab)
        seconddiv.appendChild(inp)
        maindiv.appendChild(seconddiv)
        y.appendChild(maindiv)
        $("#" + thirdid + "calendar").calendar({
          type: 'year',
          initialDate: new Date(1964, 1)
        });
      } else {
        let lab = document.createElement("LABEL")
        lab.appendChild(document.createTextNode("Value"))
        lab.setAttribute("class", "ui sub header")
        let inp = document.createElement("INPUT");
        y.appendChild(lab)
        y.appendChild(inp)
      }
    }
  }
  $('#formAdSe').form()
}

function removeOptions(selectbox) {
  var i;
  for (i = selectbox.options.length - 1; i >= 0; i--) {
    selectbox.remove(i);
  }
}

function removeChildren(node) {

  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

function valAdSe() {
  $form = $('#formAdSe')
  allFields = $form.form('get values')
  console.log(allFields)
  let query = "MATCH (p1:People)-[doc:SENDTO]->(p2:People) \
WHERE"
  let equivalTwo = {
    "equals": "=",
    "contains": "CONTAINS",
    "diff": "<>",
    "match": "=~"
  }
  let dateSel = false
  for (let prop of Object.keys(allFields)) {
    if(allFields[prop]){
      let propType = prop.substring(0, prop.length - 1)
      switch (propType) {
        case "one":
          if (allFields[prop] != "date") {
            query += " " + allFields[prop]
          } else {
            query += " " + "doc.year"
            dateSel = true
          }
          break;
        case "two":
          query += " " + equivalTwo[allFields[prop]]
          break;
        case "textvalsel":
          if (dateSel) {
            query += " " + allFields[prop]
          } else {
            query += " \"" + allFields[prop] + "\""
          }

          break;
        case "log":
          query += " " + allFields[prop]
          break;
      }
    }

  }
  query += " RETURN p1,p2,doc LIMIT 100"
  let data = JSON.stringify({
    "statements": [{
      "statement": query,
      "resultDataContents": ["graph"]
    }]
  })
  graphFetch('https://dataviz.gauthierjolly.com:8080', data)
  document.getElementById('quitAdvanced').style["display"] = "block";
  document.getElementById('peoplesearch').style["display"] = "none";
  document.getElementById('documentsearch').style["display"] = "none";
  document.getElementById('researchCriteria').style["display"] = "none";
  document.getElementById('svgB').style["display"] = "none";
}
function resumeStandard(){
  document.getElementById('quitAdvanced').style["display"] = "none";
  document.getElementById('peoplesearch').style["display"] = "block";
  document.getElementById('documentsearch').style["display"] = "block";
  document.getElementById('researchCriteria').style["display"] = "block";
  document.getElementById('svgB').style["display"] = "block";
  let data = JSON.stringify({
    "statements": [{
      "statement": researchStatement(),
      "resultDataContents": ["graph"]
    }]
  })
  graphFetch(url, data);
}
