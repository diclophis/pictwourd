//

var fs = require('fs');

require("@babel/register")({
  extensions: [".es6", ".es", ".jsx", ".js"]
});

server = require("./server.js");

indexHtmlComponent = server.default();
const indexFile = fs.createWriteStream("build/index.html");
indexHtmlComponent.pipe(indexFile);
