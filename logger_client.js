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
  
  // call the 'super method' on QTcpSocket
  QTcpSocket.call(this, null);
  
  this.connectToHost("127.0.0.1", port);
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

LoggerClient.prototype.notify = function(message) {
  //Amarok.alert("LoggerClient - sending notify:"+message);
  this._callRemote("notify", message);
};

LoggerClient.prototype.log = function(message) {
  //Amarok.alert("LoggerClient - sending log:"+message);
  this._callRemote("log", message);
};

LoggerClient.prototype._callRemote = function(remote, message) {
  var data = new QByteArray();
  var protocol = LoggerClient.protocol;
  
  // join the fields of the message by the protocol field separator
  data.append([protocol.version, remote, message].join(protocol.fieldSeparator));
  
  // append the message terminator to the stream
  data.append(protocol.messageTerminator);

  this.write(data);  
  
  data.clear();
};
