import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { message: 'server' };
  }

  async componentDidMount() {
    let manifestIndexJson = await import(
      './build/index.manifest/manifest.json'
    );
    console.log("fart");
    this.setState({ message: 'cheze' + manifestIndexJson[0]["filename"] });
  }

  async onFoo() {
    let randomInt = 999; //(parseInt(Math.random() * 100) + 1);
    let jsonFileToLoad = './build/index.manifest/' + randomInt.toString() + '.json'

    //import otherJson from './build/index.manifest/999.json';

    //let otherJson = await import(/* webpackChunkName: 'cheeze' */ `./build/index.manifest/${randomInt}.json`);
    let otherJson = await import(/* webpackChunkName: 'cheez' */ './build/index.manifest/999.json');

    console.log(randomInt, jsonFileToLoad);

    //let fooContext = require.context("cheeze", false, regExp = /^\.json$/);
    //console.log(fooContext, fooContext.keys());

    //.import

    //let otherJson = await System.import(
    //  /* 
    //    webpackMode: "lazy", 
    //    webpackChunkName: "cheeze"
    //  */
    //  '999.json'
    //);

    //await import otherJson from jsonFileToLoad;

    console.log("cheeese", otherJson['results'][0]['indexNumber'], randomInt, otherJson);
    //this.setState({ message: 'cheze' + manifestIndexJson[0]["filename"] });
  }

  render() {
    let { message } = this.state;
    return (
      <div className="App" onClick={this.onFoo}>
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
        <script src="ui.static.js"></script>
      </body>
    </html>
  );
};

export { App, Html };
