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
AmarokLoggingServer.prototype.requestQueue = new Array();

/**
 * 
 */
AmarokLoggingServer.prototype.connected = function() {
  var socket = this.nextPendingConnection();
  
  var request = new QByteArray();
  var self = this;
  
  socket.readyRead.connect(function(){
    // read the contents of the socket into the request buffer
    request.append(socket.readAll());
    
    var endOfRequest = request.indexOf("\0");
    
    // if no end was detected, then return prematurely
    if(endOfRequest <= 0) { return; }
    
    try {
      var data = request.left(endOfRequest).toString();
      
      request.clear();
      
      self.handler.log.call(self.handler, data);
    } catch (error) {
      Amarok.alert(error);
    }
  });
};
