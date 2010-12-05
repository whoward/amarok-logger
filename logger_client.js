/**
 * @fileoverview
 */

Importer.loadQtBinding("qt.core");
Importer.loadQtBinding("qt.network");

/**
 * @constructor
 */
LoggerClient = function(port) {
  // assign default values to the optional port argument
  port = port || 9000;
  
  /** the queue of messages to process once connected */
  this.afterConnectQueue = [];
  
  /** socket object for communicating with the remote plugin */
  this.socket = new QTcpSocket(null);
  
  /** @ignore */
  var self = this;
  this.socket.connected.connect(function() { 
    self.processQueue();
    self.afterConnectQueue = null;
  });
  this.socket.error.connect(function() {
    self.afterConnectQueue = null;
  });
  
  // connect to the server immediately
  this.socket.connectToHost("127.0.0.1", port);
};

LoggerClient.prototype = new QTcpSocket();
LoggerClient.protocol = {
  // the version of the protocol
  "version": "1.0",
  
  // the null character (ASCII #0) separates messages
  "messageTerminator": "\0",
  
  // the unit separator character (ASCII #31) separates fields
  "fieldSeparator": String.fromCharCode(31),
}

/**
 * Processes all messages in the connection queue
 * @private
 */
LoggerClient.prototype._processQueue = function() {
  for(var i = 0; i < this.afterConnectQueue.length; i++) {
    this._callRemote.apply(this, this.afterConnectQueue[i]);
  }
};

LoggerClient.prototype.error = function(message) {
  this._callRemoteWithConnectQueue("error", message);
};

LoggerClient.prototype.notify = function(message) {
  this._callRemoteWithConnectQueue("notify", message);
};

LoggerClient.prototype.log = function(message) {
  this._callRemoteWithConnectQueue("log", message);
};

LoggerClient.prototype._callRemoteWithConnectQueue = function() {
  if(this.afterConnectQueue && !this.socket.isValid()) {
    this.afterConnectQueue.push(arguments);
    return;
  }
  
  this._callRemote.apply(this, arguments);
};

LoggerClient.prototype._callRemote = function(remote, message) {
  var data = new QByteArray();
  var protocol = LoggerClient.protocol;
  
  // join the fields of the message by the protocol field separator
  data.append([protocol.version, remote, message].join(protocol.fieldSeparator));
  
  // append the message terminator to the stream
  data.append(protocol.messageTerminator);

  // write the data to the socket
  this.socket.write(data);
  
  data.clear();
};
