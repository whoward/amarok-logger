/**
 * @fileoverview
 * 
 * @requires jQuery
 * @requires sprintf
 */
 
HtmlLogger = function(node) {
  this.node = $(node);
};

HtmlLogger.prototype.notification = function(message) {
  this.basicMessage(message).addClass("notification");
};

HtmlLogger.prototype.info = function(message) {
  this.timestampedMessage(message).addClass("info");
};

/**
 * @private
 */
HtmlLogger.prototype.basicMessage = function(msg) {
  var container = this.buildEntryContainer();
  
  this.buildMessageContainer(msg).appendTo(container);
  
  return container;
};

/**
 * @private
 */
HtmlLogger.prototype.timestampedMessage = function(msg) {
  var container = this.buildEntryContainer();
  
  this.buildDateContainer().appendTo(container);
  this.buildMessageContainer(msg).appendTo(container);
  
  return container;
};

/**
 * @private
 */
HtmlLogger.prototype.buildEntryContainer = function() {
  return $("<div/>").addClass("entry").appendTo(this.node);
};

/**
 * @private
 */
HtmlLogger.prototype.buildMessageContainer = function(msg) {
  return $("<div/>").addClass("message").html(msg);
};

/**
 * @private
 */
HtmlLogger.prototype.buildDateContainer = function() {
  return $("<div/>").addClass("date").html(this.timestampString());
};

/**
 * @private
 */
HtmlLogger.prototype.timestampString = function() {
  var now = new Date();
  return sprintf("%02d:%02d:%02d.%d", now.getHours(), 
                                      now.getMinutes(), 
                                      now.getSeconds(),
                                      now.getMilliseconds());
};
