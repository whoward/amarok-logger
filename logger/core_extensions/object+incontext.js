
/**
 * Calls the given function in the context of the current object
 * @param {Function} callback
 * @returns the result of the callback
 */
Object.prototype.inContext = function(callback) {
  return callback.call(this);
};
