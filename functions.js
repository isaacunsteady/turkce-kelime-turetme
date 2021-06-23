module.exports = (client) => {

  
  client.getRandomInt = (min, max) => {
    (min = Number(min)), (max = Number(max));
    return min + Math.floor((max - min) * Math.random());
  };
  client.clean = text => {
    if (typeof text !== "string")
    text = require("util").inspect(text, { depth: 0 });
	  text = text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
	  return text;
  };

  client.chunkArray = (arr, chunkSize) => {
    const chunks = [];
    let currentChunk = [];
    for (let i = 0; i < arr.length; i++) {
      currentChunk.push(arr[i]);
      if ((i !== 0 && i % chunkSize === 0) || i === arr.length - 1) {
        chunks.push(currentChunk);
        currentChunk = [];
      };
    };
    return chunks;
  };
   
  Array.prototype.chunk = function(chunk_size) {
    let myArray = Array.from(this);
    let tempArray = [];
    for (let index = 0; index < myArray.length; index += chunk_size) {
      let chunk = myArray.slice(index, index + chunk_size);
      tempArray.push(chunk);
    };
    return tempArray;
  };
   
  Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
      what = a[--L];
      while ((ax = this.indexOf(what)) !== -1) {
        this.splice(ax, 1);
      };
    };
  return this;
  };
};