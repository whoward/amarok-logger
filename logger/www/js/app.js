
$(document).ready(function() {
  $("#loading").remove();
  
  Logger = new HtmlLogger("body");
});

$(window).error(function() {
  alert("error on page: " + arguments.length);
});
