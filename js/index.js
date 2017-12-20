$('.menu .item')
  .tab();
$('.ui.sidebar').sidebar({
  dimPage: false,
  transition: 'push',
  exclusive: false,
  closable: false
});
$('.ui.sidebar').sidebar('toggle');
$('#showList').click(function() {
  $('.ui.sidebar').sidebar('toggle');
});
$('.ui.accordion').accordion({
  selector: {
    trigger: '.title .qs'
  }
});

$('#closeSideList').click(function() {
  $('.ui.sidebar').sidebar('toggle');
});
