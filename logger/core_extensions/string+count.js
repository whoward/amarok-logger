
String.prototype.count = function(c) {
  var count = 0;
  for(var i = 0; i < this.length; i += 1) {
    if(this[i] === c) { count += 1; }
  }
  return count;
};
