/**
 * @fileoverview
 * 
 * @requires jQuery
 * @requires sprintf
 */
 
HtmlLogger = function(node) {
  this.node = $(node);
};

HtmlLogger.prototype.error = function(message) {
  this.basicMessage(message).addClass("error");
};

HtmlLogger.prototype.notification = function(message) {
  this.basicMessage(message).addClass("notification");
};

var count = 0;
HtmlLogger.prototype.info = function(message) {
  this.timestampedMessage(message).addClass("info");
  
  //TODO: remove me :) i'm just a proof of concept
  count++;
  if(count > 2) {
    window.setTheme("coffee");
  }
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
  return $("<div/>").addClass("message").html(this.convertWhitespace(msg));
};

/**
 * Converts \n to <br/> and \t to <span class='tab'/>
 * @private
 */
HtmlLogger.prototype.convertWhitespace = function(msg) {
  return msg.replace(/\n/g, "<br/>").replace(/\t/g, '<span class="tab"/>');
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
  return sprintf("%02d:%02d:%02d.%03d", now.getHours(), 
                                        now.getMinutes(), 
                                        now.getSeconds(),
                                        now.getMilliseconds());
};
