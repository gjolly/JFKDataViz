$('.menu .item')
  .tab();
$('.ui.sidebar').sidebar({
  dimPage: false,
  transition: 'push',
  exclusive: false,
  closable: false
});

$('#showList').click(function() {
  $('.ui.sidebar').sidebar('toggle');
});


$('#closeSideList').click(function() {
  $('.ui.sidebar').sidebar('toggle');
});
