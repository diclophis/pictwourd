//

const initialData = {}

//// pure functional is cooler?
const Html = (props) => {
  return (
    <html>
      <head>
        <meta httpEquiv="Content-Type" content="text/html;charset=utf-8"/>
        <title>App</title>
        <link rel="stylesheet" href="bundle.css"/>
      </head>
      <body>
        <div id="app">{props.children}</div>
      </body>
    </html>
  );
};

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from './static';

export default function() {
  const indexH = ReactDOMServer.renderToNodeStream(
    <Html initialData={JSON.stringify(initialData)}>
      <App {...initialData} />
    </Html>
  );

  return indexH;
}
