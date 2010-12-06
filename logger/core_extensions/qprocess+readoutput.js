
QProcess.outputOfExecution = function(command, timeout) {
  if(!timeout)
    timeout = 5000;
  
  proc = new QProcess();
  proc.start(command, QIODevice.OpenMode(QIODevice.ReadOnly));
  
  if(!proc.waitForFinished(timeout))
    throw new Error("process did not finish before timeout");
  
  return proc.readAllStandardOutput().toString();
};
