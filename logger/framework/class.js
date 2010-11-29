/**
 * @fileoverview
 * This file contains a static object named Class, which contains javascript
 * methods for implementing object oriented programming simply.
 */
 
/*global Class: true */
/*jslint white: false, nomen: false, onevar: false */


/**
 * Doesn't do anything, don't call it
 * @constructor
 */
Class = function() {};

/**
 * Mixes all methods from the givingClass's prototype into the receivingClass's
 * prototype.  Calls __mixed on the givingClass if it is defined.
 * 
 * From {@link http://chamnapchhorn.blogspot.com/2009/05/javascript-mixins.html}
 * 
 * Enhanced with __mixed callback added by William Howard
 * 
 * @param {Function} receivingClass
 * @param {Function} givingClass
 */
Class.mixin = function(receivingClass, givingClass) {
   for(var methodName in givingClass.prototype) {
      if(!receivingClass.prototype[methodName]) {
         receivingClass.prototype[methodName] = givingClass.prototype[methodName];
      }
   }
   
   if(givingClass.__mixed) {
     givingClass.__mixed(receivingClass);
   }
};

/**
 * Returns an array of all the instance variables
 * @param {Object} object
 */
Class.instanceVariables = function(object) {
  var result = [];
  for(var x in object) {
    if(object.hasOwnProperty(x) && typeof(object[x]) !== "function") { 
      result.push(x);
    }
  }
  return result;
};

/**
 * Returns an array of all the function names on an object
 * @param {Object} object
 */
Class.instanceMethods = function(object) {
  var result = [];
  var proto = object.constructor === Function ? object : object.constructor.prototype;
  for(var x in proto) {
    if(proto.hasOwnProperty(x) && typeof(proto[x]) === "function") { 
      result.push(x);
    }
  }
  return result;
};
