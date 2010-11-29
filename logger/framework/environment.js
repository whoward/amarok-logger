
Environment = new Object();

/**
 * This somewhat hackish method determines if the plugin is currently in
 * debug mode.  When developing I create a symlink from the Amarok scripts
 * folder to my source directory.
 * 
 * A better way of telling would probably be to inspect the plugin's version
 * number - any version ending in "b" would indicate debug mode.
 */
Environment.isDevelopmentMode = function() {
  return (new QFileInfo(Amarok.Info.scriptPath())).isSymLink();
}

/**
 * Automatically loads all the files from a directory in the plugin root,
 * including subdirectories of that directory.  Only includes JavaScript files.
 */
Environment.autoload = function(source_directory) {
  var srcdir = Amarok.Info.scriptPath();
  var autodir = srcdir + "/" + source_directory;
  
  var glob_pattern = srcdir + "/**.js"
  
  var iterator = new QDirIterator(autodir, QDirIterator.IteratorFlags(QDirIterator.Subdirectories));
  
  while(iterator.hasNext()) {
    var path = iterator.next();
    
    if(!QDir.match(glob_pattern, path))
      continue;

    load_path = path.slice(srcdir.length + 1);
    
    Importer.include(load_path);
  }
};

/**
 * Determines if Amarok is running on GNOME
 */
Environment.isGnome = function() {
  return QProcess.outputOfExecution("which gnome-about") != "";
}

/**
 * Determines if Amarok is running on KDE
 */
Environment.isKDE = function() {
  return QProcess.outputOfExecution("which kde4-config") != "";
}
