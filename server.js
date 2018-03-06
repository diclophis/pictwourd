//

import React from 'react';
import ReactDOMServer from 'react-dom/server';

import { App, Html } from './static';

const initialData = {}

export default function() {
  const indexH = ReactDOMServer.renderToNodeStream(
    <Html initialData={JSON.stringify(initialData)}>
      <App {...initialData} />
    </Html>
  );

  return indexH;
}
