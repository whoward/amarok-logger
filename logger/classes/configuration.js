/**
 * @fileoverview
 * 
 * @requires Class
 * @requires MVCObject
 * @requires Amarok
 */
 
/*global Configuration: true, Class: false, MVCObject: false, Amarok: false */
/*jslint white: false, nomen: false, onevar: false */
 
/**
 * @constructor
 */
Configuration = function() {
  // call the "super" method on the MVC Object class
  MVCObject.call(this);
  
  // define the attributes this MVC object uses
  this._makeStringAttribute("Theme", "basic");
  this._makeIntegerAttribute("ServerPort", 9000);
  
  // Deserialize the data from the Amarok configuration
  this.deserialize();
  
  // set us up as a listener for these value changes
  this.addAttributeObserver(this, "Theme");
  this.addAttributeObserver(this, "ServerPort");
};

/**
 * Mix the MVC object helper into this class
 */
Class.mixin(Configuration, MVCObject);

/**
 * @private
 */
Configuration.prototype.serialize = function() {
  var attributes = Class.instanceVariables(this._attributes);
  
  for(var i = 0; i < attributes.length; i++) {
    var name = attributes[i];
    var value = this._attributeValues[name];
    
    this.serializeAttribute(name, value);
  }
};

/**
 * @private
 */
Configuration.prototype.deserialize = function() {
  var attributes = Class.instanceVariables(this._attributes);
  
  for(var i = 0; i < attributes.length; i++) {
    var name = attributes[i];
    var value = this.deserializeAttribute(name);
    
    this._assignAttributeValue(name, value);
  }
};

/**
 * @private
 */
Configuration.prototype.deserializeAttribute = function(name) {
  var attr = this._attributes[name];
  
  var serializedValue = Amarok.Script.readConfig(name, "");
  
  if(!serializedValue) { return attr.defaultValue; }
  
  switch(attr.type) {
    case "boolean":
      return (serializedValue === "true");
      
    case "string":
      return serializedValue;
      
    case "integer":
      return parseInt(serializedValue, 10);
      
    case "float":
      return parseFloat(serializedValue);
  }
};

/**
 * @private
 */
Configuration.prototype.serializeAttribute = function(name, value) {
  var attr = this._attributes[name];
  
  var serializedValue = null;
  
  switch(attr.type) {
    case "boolean":
      serializedValue = value + "";
      
    case "string":
      serializedValue = value;
      
    case "integer":
      serializedValue = value + "";
      
    case "float":
      serializedValue = value + "";
  }
  
  Amarok.Script.writeConfig(name, serializedValue);
};

/**
 * @private
 */
Configuration.prototype.attributeValueDidChange = function(attribute) {
  this.serialize();
};

/**
 * @private
 */
Configuration.prototype._makeBooleanAttribute = function() {
  this._makeAttribute.apply(this, arguments);
  this._attributes[arguments[0]].type = "boolean";
};

/**
 * @private
 */
Configuration.prototype._makeStringAttribute = function() {
  this._makeAttribute.apply(this, arguments);
  this._attributes[arguments[0]].type = "string";  
};

/**
 * @private
 */
Configuration.prototype._makeIntegerAttribute = function() {
  this._makeAttribute.apply(this, arguments);
  this._attributes[arguments[0]].type = "integer";
};

/**
 * @private
 */
Configuration.prototype._makeFloatAttribute = function() {
  this._makeAttribute.apply(this, arguments);
  this._attributes[arguments[0]].type = "float";
};
