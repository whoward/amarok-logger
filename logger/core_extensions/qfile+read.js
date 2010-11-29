
QFile.read = function(filename) {
  var file = new QFile(filename);
  
  var openResult = file.open(QIODevice.OpenMode(QIODevice.ReadOnly));
  
  if(!openResult) {
    throw new Error("unable to open file: "+filename);
  }
  
  return file.readAll().toString();
};
