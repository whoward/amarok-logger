/**
 * @fileoverview
 * 
 * @requires jQuery
 * @requires sprintf
 */
 
HtmlLogger = function(node) {
  this.node = $(node);
};

HtmlLogger.prototype.info = function(message) {
  var container = $("<div/>").addClass("entry").appendTo(this.node);
  
  var now = new Date();
  var datestring = sprintf("%02d:%02d:%02d.%d", now.getHours(), 
                                      now.getMinutes(), 
                                      now.getSeconds(),
                                      now.getMilliseconds());
                                      
  $("<div/>").addClass("date").html(datestring).appendTo(container);
  $("<div/>").addClass("message").html(message).appendTo(container);
                                      
  container.addClass("info");
/*  alert("asked to log the message: "+message);
  alert("context is "+this.node.html());
  var msg = this.timestampedMessage.call(this,message);
  alert("1");
  msg.addClass("info")
  alert("2");
  msg.appendTo(this.node);
  alert("3");*/
};

HtmlLogger.prototype.timestampedMessage = function(msg) {
  alert("creating timestamp for: "+message);
  var container = this.buildEntryContainer();
  alert("a");
  this.buildDateContainer().appendTo(container);
  alert("b");
  this.buildMessageContainer(msg).appendTo(container);
  alert("c");
  return container;
};

HtmlLogger.protoype.buildEntryContainer = function() {
  return $("<div/>").addClass("entry");
};

HtmlLogger.prototype.buildMessageContainer = function(msg) {
  return $("<div/>").addClass("message").html(msg);
};

HtmlLogger.prototype.buildDateContainer = function() {
  return $("<div/>").addClass("date").html(this.timestampString());
};

HtmlLogger.prototype.timestampString = function() {
  alert("timestampString");
  var now = new Date();
  
  return now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
  
/*  return sprintf("%02d:%02d:%02d.%d", now.getHours(), 
                                      now.getMinutes(), 
                                      now.getSeconds(),
                                      now.getMilliseconds());*/
};
