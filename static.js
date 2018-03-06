import React from 'react';

//import manifestIndexJson from './build/index.manifest/manifest.json';

class App extends React.Component {
  constructor(props) {
    super(props);
  
    this.onFooClick = () => this.onFoo();

    this.state = {};
  }

  async componentDidMount() {
    await this.onFoo();
  }

  async onFoo() {
    let manifestIndexJson = await import(
      './build/index.manifest/manifest.json'
    );


    //let manifestIndexJson = await import(
    //  './build/index.manifest/manifest.json'
    //);

    let randomInt = (parseInt(Math.random() * manifestIndexJson.length) + 1);
    let jsonFileToLoad = './build/index.manifest/' + randomInt.toString() + '.json'
    let otherJson = await import(`./build/index.manifest/${randomInt}.json`);

    this.setState({
      manifestIndexJson: manifestIndexJson,
      relatedImages: otherJson['results'],
      activeImage: randomInt
    }); // + manifestIndexJson[0]["filename"] };

    console.log(otherJson, randomInt);

    ////import otherJson from './build/index.manifest/999.json';
    ////let otherJson = await import(/* webpackChunkName: 'cheeze' */ `./build/index.manifest/${randomInt}.json`);

    ////let fooContext = require.context("cheeze", false, regExp = /^\.json$/);
    ////console.log(fooContext, fooContext.keys());

    ////.import

    ////let otherJson = await System.import(
    ////  /* 
    ////    webpackMode: "lazy", 
    ////    webpackChunkName: "cheeze"
    ////  */
    ////  '999.json'
    ////);

    ////await import otherJson from jsonFileToLoad;

    //console.log("cheeese", otherJson['results'][0]['indexNumber'], randomInt, otherJson);
    //this.setState({ message: 'fooooo' + manifestIndexJson[0]["filename"]  + otherJson['results'][0]['indexNumber']});

  }

  render() {
    //let { message } = this.state;
    let newUrl = null;
    let otherImages = null;

    if (this.state.manifestIndexJson && this.state.manifestIndexJson[this.state.activeImage]) {
      newUrl = this.state.manifestIndexJson[this.state.activeImage]["filename"].replace("/home/ubuntu/pictwourd", "");

      let manifestIndexJson = this.state.manifestIndexJson;
      let relatedImages = this.state.relatedImages;

      if (relatedImages) {
        let vvv = 33;
        otherImages = relatedImages.map((otherImage, index) => {
          let otherUrl = manifestIndexJson[otherImage.indexNumber]["filename"].replace("/home/ubuntu/pictwourd", "");

          let style = {};

          let newHeight = vvv - 15 - (index * 1.5);
          if (newHeight < 5) {
            newHeight = 5;
          }

          if (index == 0) {
            //style = {height: "50%", margin: "0.5em 0.5em 0.5em 0.5em", clear: "none" };
            style = {order: 0, margin: "0.5em", flex: `0 1 ${vvv - index}em`, alignSelf: "auto"}
          } else {
            //style = {height: "10%", margin: "0.5em", clear: "none", verticalAlign: "bottom" };
            style = {order: 0, margin: "0.5em", flex: `0 1 ${newHeight}em`, alignSelf: "center"};
          }

          return (
            <img key={otherUrl} style={style} src={otherUrl}/>
          )
        });
      }

      console.log("WTF", newUrl);
    }

    let flexContainer = {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "flex-start",
      alignContent: "flex-start",
      alignItems: "flex-start"
    };

    return (
      <div onClick={this.onFooClick}>
        <div style={flexContainer}>
          {otherImages}
        </div>
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
