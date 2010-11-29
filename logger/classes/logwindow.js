
LogWindow = function(parent) {
  QWidget.call(this, parent);
  this.windowTitle = "Amarok Script Log";
  
  this.layout = new QVBoxLayout(this);

  var htmlUrl = new QUrl("file://" + Amarok.Info.scriptPath() + "/www/log.html");

  this.logWidget = new QWebView(this);
  this.logWidget.load(htmlUrl);
  
  this.layout.addWidget(this.logWidget, 0, 1);
  
  this.resize(650,300);
  
  this.loaded = false;
  this.afterLoadedLogQueue = [];
  
  var self = this;
  
  this.logWidget.loadStarted.connect(function() {
    self.loaded = false;
  });
  
  this.logWidget.loadFinished.connect(function() {
    self.loaded = true;
    for(var i = 0; i < self.afterLoadedLogQueue.length; i += 1) {
      var method = self.afterLoadedLogQueue[i][0];
      var arguments = self.afterLoadedLogQueue[i][1];
      self[method].apply(self, arguments);
    }
    //self.afterLoadedLogQueue = [];
  });
};

LogWindow.prototype = new QWidget();

LogWindow.prototype.log = function(message) {
  // if the logger page hasn't loaded yet then push this function call onto
  // a stack to call once the page has loaded
  if(!this.loaded) {
    this.afterLoadedLogQueue.push(["log", arguments]);
    return;
  }
  
  //TODO: this message really needs to be string escaped, i.e. convert " to \"
  this._eval("Logger.info('"+message+"')");
};

LogWindow.prototype.notify = function(message) {
  // if the logger page hasn't loaded yet then push this function call onto
  // a stack to call once the page has loaded
  if(!this.loaded) {
    this.afterLoadedLogQueue.push(["notify", arguments]);
    return;
  }
  
  this._eval("Logger.notification('"+message+"')");
}

LogWindow.prototype._eval = function(javascript) {
  this.logWidget.page().mainFrame().evaluateJavaScript(javascript);
};
