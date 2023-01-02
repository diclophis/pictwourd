//

var fs = require('fs');

require("@babel/register")({
  extensions: [".js"]
});

let server = require("./server.js");

indexHtmlComponent = server.default();
const indexFile = fs.createWriteStream("build/index.template.html");
indexHtmlComponent.pipe(indexFile);
