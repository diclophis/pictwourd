//
import Fs from 'fs';

import React from 'react';
import ReactDOMServer from 'react-dom/server';

import { App, Html } from './static';

const indexFile = Fs.createWriteStream("build/index.html");

const initialData = {}

export default function() {
  ReactDOMServer.renderToNodeStream(
    <Html initialData={JSON.stringify(initialData)}>
      <App {...initialData} />
    </Html>
  ).pipe(indexFile);
};
