
Log = new LogWindow(this);

Log.notify("Welcome to Amarok scripting console");

Server = new AmarokLoggingServer(Log, 9000);

Amarok.Window.addToolsMenu("display_script_log", "Display Script Log", "utilities-log-viewer");

Amarok.Window.ToolsMenu.display_script_log["triggered()"].connect(function() { 
  Log.show(); 
});

if(Environment.isDevelopmentMode()) {
  Log.show();
}