function playStory() {
  $('.basic.slide1.modal')
    .modal('setting', 'closable', false)
    .modal('show');
}

function event1() {
  btn = document.getElementById("storyBtn");
  icon = document.getElementById("storyIcon").cloneNode();
  btn.innerText = "Continue";

  icon.className = "right icon arrow"
  btn.appendChild(icon);
  btn.onclick = () => slide2();

  criteria.name = "WATSON MARVIN";
  criteria.date1 = new Date(1963, 1, 1);
  criteria.date2 = new Date(1964, 1, 1);

  newCriteriaTag("WATSON MARVIN");

  let data = JSON.stringify({
    "statements": [{
      "statement": researchStatement(),
      "resultDataContents": ["graph"]
    }]
  });

  graphFetch(url, data);
}

function slide2(){
  $('.basic.slide2.modal')
    .modal('setting', 'closable', false)
    .modal('show');
}


function event2() {
  btn = document.getElementById("storyBtn");
  btn.onclick = () => slide3();

  criteria.name = '.*'
  criteria.document = ".*MEXICO.*";
  criteria.date1 = new Date(1950, 1, 1);
  criteria.date2 = new Date(1960, 1, 1);

  deleteCriteriaTag("WATSON MARVIN");
  newCriteriaTag("MEXICO");

  let data = JSON.stringify({
    "statements": [{
      "statement": researchStatement(),
      "resultDataContents": ["graph"]
    }]
  });

  graphFetch(url, data);
}

function slide3(){
  $('.basic.slide3.modal')
    .modal('setting', 'closable', false)
    .modal('show');
}

function event3() {
  btn = document.getElementById("storyBtn");
  btn.onclick = () => slide4();

  criteria.document = '.*'
  criteria.name = "BELMONT A H ";
  criteria.date1 = new Date(1963, 1, 1);
  criteria.date2 = new Date(1965, 1, 1);
  console.log(criteria);

  deleteCriteriaTag("MEXICO");
  newCriteriaTag("BELMONT A H");

  let data = JSON.stringify({
    "statements": [{
      "statement": researchStatement(),
      "resultDataContents": ["graph"]
    }]
  });

  graphFetch(url, data);
}

function slide4(){
  $('.basic.slide3.modal')
    .modal('setting', 'closable', false)
    .modal('show');
}

function endStory() {
  criteria.document = '.*'
  criteria.name = ".*";
  criteria.date1 = new Date(1955, 1, 1);
  criteria.date2 = new Date(1970, 1, 1);
  deleteCriteriaTag("BELMONT A H ");

  btn = document.getElementById("storyBtn");
  icon = document.getElementById("storyIcon").cloneNode();
  btn.innerText = "Play Story";

  icon.className = "right icon play"
  btn.appendChild(icon);
  btn.onclick = () => playStory();
}
