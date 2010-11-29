
$(document).ready(function() {
  $("#loading").remove();
  
  Logger = new HtmlLogger("body");
});

window.onerror = function(description, page, line) {
  alert("error on page: "+description + ", page: " + page + ", line: "+line);
};

window.setTheme = function(name) {
  $("#theme").attr("href", "theme/"+name+".css");
};
