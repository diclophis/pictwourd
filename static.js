import React from 'react';

const App = (props) => {
  return <div>Hello {props.name}</div>;
};

const Html = (props) => {
  return (
    <html>
      <head>
        <meta httpEquiv="Content-Type" content="text/html;charset=utf-8"/>
        <title>App</title>
      </head>
      <body>
        <div id="app">{props.children}</div>
        <script src="static.js"></script>
      </body>
    </html>
  );
};

export { App, Html };
