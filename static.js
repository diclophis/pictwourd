import React from 'react';
import manifestIndexJson from './build/index.manifest/manifest.json';

class App extends React.Component {
  constructor(props) {
    super(props);
  
    this.onFooClick = () => this.onFoo();

    this.state = { message: 'cheze' + manifestIndexJson[0]["filename"] };
  }

  async componentDidMount() {
    let manifestIndexJson = await import(
      './build/index.manifest/manifest.json'
    );
    console.log("fart");
    this.setState({ message: 'bizzzzz' + manifestIndexJson[0]["filename"] });
  }

  async onFoo() {
    let randomInt = (parseInt(Math.random() * 100) + 1);

    let jsonFileToLoad = './build/index.manifest/' + randomInt.toString() + '.json'
    //import otherJson from './build/index.manifest/999.json';
    //let otherJson = await import(/* webpackChunkName: 'cheeze' */ `./build/index.manifest/${randomInt}.json`);

    let otherJson = await import(`./build/index.manifest/${randomInt}.json`);

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
    this.setState({ message: 'fooooo' + manifestIndexJson[0]["filename"]  + otherJson['results'][0]['indexNumber']});
  }

  render() {
    let { message } = this.state;
    return (
      <div className="App" onClick={this.onFooClick}>
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
      </body>
    </html>
  );
};

export { App, Html };
