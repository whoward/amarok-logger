
QByteArray.prototype.toString = function() {
  var result = "";
  for(var i = 0; i < this.length(); i++) {
    result += String.fromCharCode(this.at(i));
  }
  return result;
};
