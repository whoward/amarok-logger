/**
 * @fileoverview
 */
 
/**
 * @constructor
 */
OptionsDialog = function(parent) {
  QWidget.call(this, parent);
  
  this.windowTitle = "Configuration - Logger Plugin"
  
  this.theme = new QComboBox(this);
  this.theme.addItems(LogWindow.getThemeList());
  this.theme.currentIndex = this.theme.findText(Config.getTheme());
  
  this.port = new QLineEdit(Config.getServerPort(), this);
  this.port.setValidator(new QIntValidator(0, 65535, this));
  
  this.layout = new QFormLayout(this);
  this.layout.addRow("Theme",       this.theme);
  this.layout.addRow("Server Port", this.port);
  
  var self = this;
  
  this.theme["activated(QString)"].connect(function(newTheme) {
    Config.setTheme(newTheme);
    Log.setTheme(newTheme);
  });
  
  this.port.editingFinished.connect(function() {
    var newPort = parseInt(self.port.text);
    
    if(newPort === Config.getServerPort()) {
      return;
    }
    
    Amarok.alert("Your changes to the port number will take effect when you restart Amarok.");
    Config.setServerPort(newPort);
  });
};

OptionsDialog.prototype = new QWidget();
