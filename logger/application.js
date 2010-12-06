
Log = new LogWindow(this);
Log.setTheme(Config.getTheme());
Log.notify("Welcome to Amarok scripting console");

Options = new OptionsDialog(this);

Server = new AmarokLoggingServer(Log, Config.getServerPort());

Amarok.Window.addToolsMenu("display_script_log", "Display Script Log", "utilities-log-viewer");
Amarok.Window.ToolsMenu.display_script_log["triggered()"].connect(function() { 
  Log.show(); 
});

Amarok.Window.addSettingsMenu("display_script_settings", "Display Script Settings", "utilities-log-viewer");
Amarok.Window.SettingsMenu.display_script_settings["triggered()"].connect(function() {
  Options.show();
});

if(Environment.isDevelopmentMode()) {
  Log.notify("\tThis is a prerelease alpha");
  Log.notify("\tAvailable theme files: "+ LogWindow.getThemeList().join(", "));  
  
  Log.setWindowFlags(Qt.WindowFlags(Qt.WindowStaysOnTopHint));
  Log.show();
}
