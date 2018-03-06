import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { message: '' };
  }

  async componentDidMount() {
    this.setState({ message: 'loading...' });
    if (typeof(window) != 'undefined') {
      console.log("fart");
      let manifestIndexJson = await import(
        './build/index.manifest/manifest.json'
      );
      this.setState({ message: manifestIndexJson[0]["filename"] });
    }
  }

  render() {
    let { message } = this.state;
    return (
      <div className="App">
        <p className="App-intro">
          { message }
        </p>
      </div>
    );
  }
}

const Html = (props) => {
  return (
    <html>
      <head>
        <meta httpEquiv="Content-Type" content="text/html;charset=utf-8"/>
        <title>App</title>
      </head>
      <body>
        <div id="app">{props.children}</div>
        <script src="3.static.js"></script>
      </body>
    </html>
  );
};

export { App, Html };
