import React from 'react';

//import manifestIndexJson from './build/index.manifest/manifest.json';

class App extends React.Component {
  constructor(props) {
    super(props);
  
    //this.onFooClick = () => this.onFoo();

    this.state = {};
  }

  async componentDidMount() {
    await this.onFoo();
  }

  async onFoo(newImage) {
    let manifestIndexJson = await import(
      './build/index.manifest/manifest.json'
    );

    console.log(newImage);

    let randomInt = newImage ? newImage : (parseInt(Math.random() * manifestIndexJson.length) + 1);
    let jsonFileToLoad = './build/index.manifest/' + randomInt.toString() + '.json'
    let otherJson = await import(`./build/index.manifest/${randomInt}.json`);

    this.setState({
      manifestIndexJson: manifestIndexJson,
      relatedImages: otherJson['results'],
      activeImage: randomInt
    });
  }

  render() {
    let newUrl = null;
    let otherImages = null;

    if (this.state.manifestIndexJson && this.state.manifestIndexJson[this.state.activeImage]) {
      newUrl = this.state.manifestIndexJson[this.state.activeImage]["filename"].replace("/home/ubuntu/pictwourd/build", "");

      let manifestIndexJson = this.state.manifestIndexJson;
      let relatedImages = this.state.relatedImages;

      if (relatedImages) {
        let vvv = 33;
        otherImages = relatedImages.map((otherImage, index) => {
          let otherUrl = manifestIndexJson[otherImage.indexNumber]["filename"].replace("/home/ubuntu/pictwourd/build", "");

          let style = {};

          let newHeight = vvv - 15 - (index * 1.5);
          if (newHeight < 5) {
            newHeight = 5;
          }

          let newIndex = null;

          if (index == 0) {
            style = {cursor: 'pointer', transition: "none 0s", order: 0, margin: "0.5em", flex: `0 1 ${vvv - index}em`, alignSelf: "auto"}
          } else {
            newIndex = otherImage.indexNumber;
            style = {cursor: 'pointer', transition: "none 0s", order: 0, margin: "0.5em", flex: `0 1 ${newHeight}em`, alignSelf: "center"};
          }

          return (
            <img key={otherUrl} style={style} src={otherUrl} onClick={this.onFoo.bind(this, newIndex)}/>
          )
        });
      }
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
      <div>
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
