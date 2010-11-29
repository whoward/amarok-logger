
LogWindow = function(parent) {
  QWidget.call(this, parent);
  this.windowTitle = "Amarok Script Log";
  
  this.layout = new QVBoxLayout(this);
  
  this.document = new QTextDocument(this);
  this.document.defaultStyleSheet = QFile.read(Amarok.Info.scriptPath() + "/stylesheet.css");
  
  this.logWidget = new QTextEdit(this);
  this.logWidget.setDocument(this.document);
  this.logWidget.readOnly = true;
  
  this.layout.addWidget(this.logWidget, 0, 1);
  
  this.resize(650,300);
};

LogWindow.prototype = new QWidget();

LogWindow.prototype.log = function(message) {
  var date = new Date();
  
  var dateString = sprintf("%02d:%02d:%02d.%d", date.getHours(), date.getMinutes(), 
                            date.getSeconds(), date.getMilliseconds());
  
  var dateHTML    = sprintf("<span class='date'>%s</span>", dateString);
  var messageHTML = sprintf("<span class='message'>%s</span>", message);
  var entryHTML   = sprintf("<div class='entry'>%s - %s</div>", dateHTML, messageHTML);
  
  this.logWidget.append(entryHTML)
  this.insertSeparator();
};

LogWindow.prototype.insertSeparator = function() {
  this.logWidget.append("<table width='100%'><tr><td><hr /></td></tr></table>");
};
