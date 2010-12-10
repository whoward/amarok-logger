
Array.prototype.map = function(callback) {
  var result = [];
  for(var i = 0; i < this.length; i += 1) {
    result.push(callback.call(this[i]));
  }
  return result;
};
