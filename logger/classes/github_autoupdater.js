
/**
 * 
 * @param {String} user The Github username for the repo you want to access
 * 
 * @param {String} repository The Github repository name you want to access
 * 
 * @param {Array} version An array of version numbers from major to minor.  The
 *    number of elements in this array should equal the number of capture groups
 *    in the tagPattern
 * 
 * @param {RegExp} [tagPattern=/^VERSION_(\d+)_(\d+)$/] The regular expression
 *    used to extract the version number from the 
 */
GithubAutoupdater = function(user, repository, version, tagPattern) {
  this.user = user;
  this.repository = repository;
  this.version = version;
  this.tagPattern = tagPattern || /^VERSION_(\d+)_(\d+)$/;
};

/**
 * 
 */
GithubAutoupdater.prototype.getRepositoryURL = function() {
  return sprintf("http://www.github.com/%s/%s", this.user, this.repository);
};

/**
 * 
 */
GithubAutoupdater.prototype.getRepositoryInfo = function(success) {
  var url = sprintf("http://www.github.com/api/v2/json/repos/show/%s/%s", this.user, this.repository);
  
  var manager = new QNetworkAccessManager();
  
  manager.finished.connect(function(reply) {
    var redirect = reply.attribute(QNetworkRequest.RedirectionTargetAttribute);
    
    if(redirect) {
      manager.get(new QNetworkRequest(new QUrl(redirect)));
      return;
    }
    
    var response = JSON.parse(reply.readAll().toString());
    
    success.call(null, response.repository);
  });
  
  manager.get(new QNetworkRequest(new QUrl(url)));
};

/**
 * 
 */
GithubAutoupdater.prototype.getTags = function(success) {
  var url = sprintf("http://www.github.com/api/v2/json/repos/show/%s/%s/tags", this.user, this.repository);
  
  var manager = new QNetworkAccessManager();
  
  manager.finished.connect(function(reply) {
    var redirect = reply.attribute(QNetworkRequest.RedirectionTargetAttribute);
    
    if(redirect) {
      manager.get(new QNetworkRequest(new QUrl(redirect)));
      return;
    }
    
    var response = JSON.parse(reply.readAll().toString());
    
    success.call(null, response.tags);
  });
  
  manager.get(new QNetworkRequest(new QUrl(url)));
};

/**
 * 
 */
GithubAutoupdater.prototype.checkForUpdate = function(updateExists, noUpdate) {
  var self = this;
  
  this.getTags(function(tags) {
    tags = Class.instanceVariables(tags);
    
    var versions = tags.map(function() {
      return this.match(self.tagPattern).slice(1).map(function() { return parseInt(this); })
    });
    
    function isGreaterVersion(v) {
      if(v.length != self.version.length) {
        return false;
      }
      
      for(var i = 0; i < v.length; i += 1 ) {
        if(v[i] > self.version[i]) { return true; }
      }

      return false;
    }
    
    var greatestVersion = this.version;
    for(var i = 0; i < versions.length; i += 1) {
      if(isGreaterVersion(versions[i])) { greatestVersion = versions[i]; }
    }
    
    if(greatestVersion === this.version) {
      if(noUpdate) { noUpdate(greatestVersion); }
    } else {
      if(updateExists) { updateExists(greatestVersion); }
    }
  });
};
