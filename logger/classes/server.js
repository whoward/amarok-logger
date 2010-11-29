/**
 * @fileoverview
 */
 
/*global AmarokLoggingServer: true */
/*jslint white: false, nomen: false, onevar: false */

Importer.loadQtBinding("qt.core");
Importer.loadQtBinding("qt.network");

/**
 * @constructor
 */
AmarokLoggingServer = function(handler, port) {
  // call the 'super' method for QTcpServer
  QTcpServer.call(this, null);
  
  this.handler = handler;
  
  // start up a server that only listens to localhost requests
  this.listen(new QHostAddress("127.0.0.1"), port);
  
  // check to see that the server is actually listening
  if(!this.isListening()) {
    throw new Error("Unable to bind server to port " + port);
  }
  
  // bind an event to when a client has connected
  this.newConnection.connect(this, this.connected);
};

AmarokLoggingServer.prototype = new QTcpServer();

AmarokLoggingServer.protocol = {
  // the version of the protocol
  "version": "1.0",
  
  // the null character (ASCII #0) separates messages
  "messageTerminator": "\0",
  
  // the unit separator character (ASCII #31) separates fields
  "fieldSeparator": String.fromCharCode(31),
};

AmarokLoggingServer.prototype.processInvocation = function(message) {
  var protocol = AmarokLoggingServer.protocol;
  
  try {
      // the parsed message is three fields separated by an unused character
      var data = message.split(protocol.fieldSeparator, 3);
      
      var protocolVersion = data[0];
      var remoteName      = data[1];
      var remoteMessage   = data[2];
      
      // check to see if the message's protocol version is supported
      if(protocolVersion != protocol.version) {
        Amarok.alert("connection from unsupported protocol version: "+protocolVersion);
        return;
      }
      
      // also check that the remote method is defined
      if(!this.handler[remoteName]) {
        Amarok.alert("attempted to call undefined remote method: "+remoteName);
        return;
      }
      
      this.handler[remoteName].call(this.handler, remoteMessage);
  } catch (error) {
    Amarok.alert(error);
  }
};

/**
 * Callback method for when the socket receives and incoming connection request
 */
AmarokLoggingServer.prototype.connected = function() {
  var socket = this.nextPendingConnection();
  
  var request = new QByteArray();
  var self = this;
  var protocol = AmarokLoggingServer.protocol;
  
  socket.readyRead.connect(function(){
    // read the contents of the socket into the request buffer
    request.append(socket.readAll());
    
    // read the string data from the buffer
    var content = request.toString();
    
    // we're done with the buffer - clear it
    request.clear();
    
    // count the number of messages in the buffer
    var messageCount = content.count(protocol.messageTerminator);
    
    // if there were no messages then return prematurely
    if(messageCount <= 0) { return; }
    
    // split the messages on the message terminator, only take the counted
    // number of messages - as the buffer may have appended extra characters
    // onto the end of the string
    var messages = content.split(new RegExp(protocol.messageTerminator, 'g'))
      .slice(0, messageCount);
      
    // handle each parsed message
    for(var i = 0; i < messages.length; i += 1) {
      self.processInvocation(messages[i]);
    }
  });
};
