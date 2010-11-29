
/**
 * 
 */
Object.prototype.inspect = function(depth) {
  var inspection = [];
  var variables = Class.instanceVariables(this);
  for(var i = 0; i < variables.length; i += 1) {
    var name = variables[i];
    var value = this[name];
    
    var valueString = null;
    
    if(value === null) {
      valueString = "null";
    } else {
      valueString = value.inspect ? value.inspect(depth) : value.toString();
    }
    
    inspection.push('"'+ name + '":' + valueString);
  }
  
  return "{"+inspection.join(",")+"}";
};

/**
 * 
 */
Array.prototype.inspect = function(depth) {
  if(!depth) { depth = 0; }
  if(depth > 5) { return "..."; }
  
  var elements = [];
  
  for(var i = 0; i < this.length; i += 1) {
    var value = this[i];
    elements.push(value.inspect ? value.inspect(depth) : value.toString());
  }
  
  return "["+elements.join(",")+"]";
};

/**
 * 
 */
Number.prototype.inspect = function() {
  return this.toString();
};

/**
 * 
 */
String.prototype.inspect = function() {
  return '"' + this.toString() + '"';
};

/**
 * 
 */
Boolean.prototype.inspect = function() {
  return this.toString();
};
