//

import React from 'react';
import ReactDOMServer from 'react-dom/server';

import { App, Html } from './static';

import { manifestIndexJson as cs } from './build/index.manifest/manifest.json';

const initialData = {}

async function fetchManifestIndex() {
  const { manifestIndexJsonCs } = await Promise.resolve({ manifestIndexJson: cs });

  const indexH = ReactDOMServer.renderToNodeStream(
    <Html initialData={JSON.stringify(initialData)}>
      <App {...initialData} />
    </Html>
  );

  return indexH;
}

//var fs = require('fs');
//const indexFile = fs.createWriteStream("build/index.html");
fetchManifestIndex().then(indexHtmlComponent => {
  console.log("wtf");
  //indexHtmlComponent.pipe(indexFile);
});

export default function() {
};
