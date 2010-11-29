
Error.prototype.displayWithAmarok = function() {
  Amarok.alert(this.stringifyForLog());
};

Error.prototype.stringifyForLog = function() {
  err = "Error: " + this.toString() + "\n"
  
  if (this.name)
    err += "Error Name: " + this.name + "\n";
    
  if (this.message)
    err += "Message: " + this.message + "\n";
    
  if (this.fileName)
    err +="File: " + this.fileName + "\n";
    
  if (this.lineNumber)
    err += "Line: " + this.lineNumber + "\n";
    
  if (this.stack)
    err += "stack:\n" + this.stack + "\n";
    
  return err;  
};
