
LogWindow = function(parent) {
  QWidget.call(this, parent);
  this.windowTitle = "Amarok Script Log";
  
  this.layout = new QVBoxLayout(this);

  var htmlUrl = new QUrl("file://" + Amarok.Info.scriptPath() + "/www/log.html");

  this.logWidget = new QWebView(this);
  this.logWidget.load(htmlUrl);
  
  this.layout.addWidget(this.logWidget, 0, 1);
  
  this.resize(650,300);
};

LogWindow.prototype = new QWidget();

LogWindow.prototype.log = function(message) {
  //TODO: this message really needs to be string escaped, i.e. convert " to \"
  this._eval("Logger.info('"+message+"')");
};

LogWindow.prototype._eval = function(javascript) {
  this.logWidget.page().mainFrame().evaluateJavaScript(javascript);
};
