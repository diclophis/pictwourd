//

require("@babel/register")({
  extensions: [".es6", ".es", ".jsx", ".js"]
});

server = require("./server.js");

server.default;
