$('.menu .item')
  .tab();
$('.ui.sidebar').sidebar({
  dimPage: false,
  transition: 'overlay',
  exclusive: false,
  closable: false
});

$('#showList').click(function() {
  $('.ui.sidebar').sidebar('toggle');
});
