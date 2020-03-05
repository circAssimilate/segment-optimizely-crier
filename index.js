/**
 * @description UUID generator from https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 */
function __uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** !!! Export functions for unit testing; DO NOT add this to Segment !!! */
module.exports = {
  __uuidv4,
};
