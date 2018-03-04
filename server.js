//

import React from 'react';
import ReactDOMServer from 'react-dom/server';

import { App, Html } from './static';

const initialData = {}

  async function fetchManifestIndex() {
  }

  fetchManifestIndex.then(

  ReactDOMServer.renderToNodeStream(
    <Html initialData={JSON.stringify(initialData)}>
      <App {...initialData} />
    </Html>
  )


var fs = require('fs');

const indexFile = fs.createWriteStream("build/index.html");
  .pipe(indexFile);

export default function() {

};
