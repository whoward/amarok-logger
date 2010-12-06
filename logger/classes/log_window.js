
LogWindow = function(parent) {
  QWidget.call(this, parent);
  this.windowTitle = "Amarok Script Log";
  
  this.layout = new QVBoxLayout(this);
  this.layout.setContentsMargins(0,0,0,0);

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
    self.afterLoadedLogQueue = [];
  });
};

/**
 * Returns a list of all available themes
 */
LogWindow.getThemeList = function() {
  // find all css files in the www/theme directory
  var directory = new QDir(Amarok.Info.scriptPath() + "/www/theme");
  var files = directory.entryList(["*.css"]);
  
  // map to the basename of each of these files
  for(var i = 0; i < files.length; i += 1) {
    files[i] = files[i].replace(/\..+$/,'');
  }
  
  // return a list of all the basenames
  return files;
};

LogWindow.prototype = new QWidget();

LogWindow.prototype.setTheme = function(theme) {
  var javascript = sprintf('window.setTheme("%s")', this._escapeJavaScriptString(theme));
  this._evalWithLoadingQueue(javascript, "setTheme", arguments);
};

LogWindow.prototype.log = function(message) {
  var javascript = sprintf('Logger.info("%s")', this._escapeJavaScriptString(message));
  this._evalWithLoadingQueue(javascript, "log", arguments);
};

LogWindow.prototype.notify = function(message) {
  var javascript = sprintf('Logger.notification("%s")', this._escapeJavaScriptString(message));
  this._evalWithLoadingQueue(javascript, "notify", arguments);
};

LogWindow.prototype.error = function(message) {
  var javascript = sprintf('Logger.error("%s")', this._escapeJavaScriptString(message));
  this._evalWithLoadingQueue(javascript, "error", arguments);
};

/**
 * Converts invalid string characters to string escaped characters
 * for use in JavaScript
 * @private
 */
LogWindow.prototype._escapeJavaScriptString = function(str) {
  return str.replace(/\\/g,"\\\\").replace(/\n/g, "\\n").replace(/\r/g,"\\r")
    .replace(/\0/g,"\\0").replace(/\f/g,"\\f").replace(/\t/g,"\\t")
    .replace(/\v/g,"\\v").replace(/'/g,"\\'").replace(/"/g,"\\\"");
};

/**
 * Sends the javascript to be evaluated but only if the page is currently
 * loaded.  If it is not loaded then we add the caller and arguments to
 * a queue which will be called when the page has loaded.
 * @private
 */
LogWindow.prototype._evalWithLoadingQueue = function(javascript,caller,args) {
  if(!this.loaded) {
    this.afterLoadedLogQueue.push([caller, args]);
    return;
  }
  
  this._eval(javascript);
};

/**
 * Sends javascript to the window to be evaluated on the global scope
 * @private
 */
LogWindow.prototype._eval = function(javascript) {
  this.logWidget.page().mainFrame().evaluateJavaScript(javascript);
};
