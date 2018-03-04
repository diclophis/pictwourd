//

require("@babel/register")({
  presets: ['@babel/preset-env', "@babel/es2015", "@babel/react"],
  extensions: [".es6", ".es", ".jsx", ".js"]
});


server = require("./server.js");

server.default();
