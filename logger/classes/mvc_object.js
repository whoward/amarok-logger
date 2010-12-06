/**
 * @fileoverview
 * A mixable object that allows defining attributes which are observable.
 * 
 * This object can also be extended instead of mixed and still function
 * the same way.  
 * 
 * It is important however to call the constructor on this object regardless to
 * which way you handle this.
 */

/*global MVCObject: true */
/*jslint white: false, nomen: false, onevar: false */

/**
 * Creates a new MVCObject 
 * @constructor
 */
MVCObject = function() {
  this._attributes = {};
  this._attributeValues = {};
  this._observers = {};  
};

/**
 * Assigns multiple values simultaneously using JSON data.
 * @param {Object} data An associative array of key/value pairs to assign
 */
MVCObject.prototype.massAssignValues = function(data) {
  for(var attribute in data) {
    if(this._attributes[attribute] && this._attributes[attribute].writeable) {
      var setter = "set"+attribute;
      this[setter].call(this, data[attribute]);
    }
  }
};

/**
 * Makes an attribute for this object.  While marked as "private" treat this
 * method as "protected" as it is intended to be called from the base class.
 * 
 * @private
 * @param {String} attribute Name for the attribute - please use upper camel 
 *  case so that the getters get set properly
 * @param {Object} defaultValue Default value returned when undefined
 * @param {boolean} readable True if the getter will be defined
 * @param {boolean} writeable True if the setter will be defined
 */
MVCObject.prototype._makeAttribute = function(attribute, defaultValue, readable, writeable) {
  // don't allow redefinition of an existing attribute
  if(this._attributes[attribute]) {
    throw new Error("attribute already defined: "+attribute);
  }
  
  // assign default values to the optional attributes
  var realDefaultValue = defaultValue || null;
  var realReadable     = readable     || true;
  var realWriteable    = writeable    || true;
  
  // create a descriptor for this attribute
  var descriptor = {
    "defaultValue": realDefaultValue,
    "writeable":    realWriteable,
    "readable":     realReadable
  };
  
  // assign an attribute descriptor and a list for observers of this attribute
  this._observers[attribute] = [];
  this._attributes[attribute] = descriptor;
  
  // based on read/write permissions add accessors to this object
  if(descriptor.readable) {
    this.__createReadableAccessor(attribute);
  }
  
  if(descriptor.writeable) {
    this.__createWriteableAccessor(attribute);
  }
};

/**
 * Creates a reading accessor on this object
 * 
 * @private
 * @param {String} attribute Name of the attribute to create
 */
MVCObject.prototype.__createReadableAccessor = function(attribute) {
  var accessorName = "get" + attribute;
  
  // do not redefine the method if it is already defined
  if(this.constructor.prototype[accessorName]) {
    return;
  }
  
  // otherwise define the accessor
  this.constructor.prototype[accessorName] = function() {
    return this._retrieveAttributeValue(attribute);
  };
};

/**
 * Creates a writing accessor on this object
 */
MVCObject.prototype.__createWriteableAccessor = function(attribute) {
  var accessorName = "set" + attribute;
  
  // do not redefine the method if it is already defined
  if(this.constructor.prototype[accessorName]) {
    return;
  }
  
  // otherwise define the accessor
  this.constructor.prototype[accessorName] = function(newValue) {
    var currentValue = this._attributeValues[attribute];
    
    if(currentValue !== newValue) {
      this._assignAttributeValue(attribute, newValue);
    }
  };
};

/**
 * Assigns a value with notifications to an attribute of this object
 */
MVCObject.prototype._assignAttributeValue = function(attribute, newValue) {
  this._notifyValueWillChange(attribute);
  this._attributeValues[attribute] = newValue;
  this._notifyValueDidChange(attribute); 
};

/**
 * Retrieves a value to an attribute of this object
 */
MVCObject.prototype._retrieveAttributeValue = function(attribute) {
  if(typeof(this._attributeValues[attribute]) === "undefined") {
    return this._attributes[attribute].defaultValue;
  } else {
    return this._attributeValues[attribute];
  }
};

/**
 * Adds an observer to an attribute of this object.
 */
MVCObject.prototype.addAttributeObserver = function(observer, attribute) {
  if(!this._attributes[attribute]) {
    throw new Error("undefined attribute: "+attribute);
  }
  
  this._observers[attribute].push(observer);
};

/**
 * Removes an observer for an attribute of this object.
 */
MVCObject.prototype.removeAttributeObserver = function(observer, attribute) {
  if(!this._attributes[attribute]) {
    throw new Error("undefined attribute: "+attribute);
  }
  
  for(var i = 0; i < this._observers[attribute].length; i += 1) {
    if(this._observers[attribute][i] === observer) {
      this._observers[attribute].splice(i, 1);
      return true;
    } 
  }
  
  return false;
};

/**
 * Notifies the observers that a value will change
 */
MVCObject.prototype._notifyValueWillChange = function(attribute) {
  var observers = this._observers[attribute];
  
  if(!observers) { return; }
  
  for(var i = 0; i < observers.length; i += 1) {
    if(observers[i].attributeValueWillChange) {
      observers[i].attributeValueWillChange(attribute);
    }
  }
};

/**
 * Notifies the observers that a value did change
 */
MVCObject.prototype._notifyValueDidChange = function(attribute) {
  var observers = this._observers[attribute];
  
  if(!observers) { return; }
  
  for(var i = 0; i < observers.length; i += 1) {
    if(observers[i].attributeValueDidChange) {
      observers[i].attributeValueDidChange(attribute);
    }
  }
};

/**
 * Stringifies this object
 */
MVCObject.prototype.stringify = function() {
  var message = "MVCObject";
  
  for(var attr in this._attributeValues) {
    if(attr.hasOwnProperty(attr)) {
      var value = this._attributeVales[attr];
      var defaultValue = this._attributes[attr].defaultValue;
      
      var defaultString = defaultValue ? ', default:'+defaultValue : '';
       
      var defString = '(' + defaultString + ')';
      
      message += "\n    " + attr + defString + ": " + value; 
    }
  }

  return message;
};
