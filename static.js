import React from 'react';

//import manifestIndexJson from './build/index.manifest/manifest.json';

var styles = cssInJS((context) => {
  let vvv = 33;

  let foop = {
    flexContainer: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "flex-start",
      alignContent: "flex-start",
      alignItems: "flex-start"
    }
  };

  for (let i = 0; i<vvv; i++) {
    let newHeight = vvv - 15 - (i * 1.5);
    if (newHeight < 5) {
      newHeight = 5;
    }

    let primary = {
        cursor: 'pointer',
        transition: "none 0s",
        order: 0,
        margin: "0.5em", 
        flex: `0 1 ${vvv}em`, alignSelf: "auto"
    }

    if (i !=0) {
      primary['flex'] = `0 1 ${newHeight}em`;
      primary['alignSelf'] = "center";
    }

    foop['image' + i] = primary;
  }

  return foop;
});


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    await this.onFoo();
    window.addEventListener("popstate", (ev) => {
      this.setState(ev.state);
    });
  }

  async onFoo(newImage) {
    let manifestIndexJson = await import('./build/index.manifest/manifest.json');
    let randomInt = newImage ? newImage : (parseInt(Math.random() * manifestIndexJson.length) + 1);
    let jsonFileToLoad = './build/index.manifest/' + randomInt.toString() + '.json'
    let otherJson = await import(`./build/index.manifest/${randomInt}.json`);

		var stateObj = {
			manifestIndexJson: manifestIndexJson,
			relatedImages: otherJson['results'],
			activeImage: randomInt
		};

		history.pushState(stateObj, "image" + randomInt, "?id=" + randomInt);

		this.setState(stateObj);
  }

  render() {
    let newUrl = null;
    let otherImages = null;

    if (this.state.manifestIndexJson && this.state.manifestIndexJson[this.state.activeImage]) {
      newUrl = this.state.manifestIndexJson[this.state.activeImage]["filename"].replace("/home/ubuntu/pictwourd/build", "");

      let manifestIndexJson = this.state.manifestIndexJson;
      let relatedImages = this.state.relatedImages;

      if (relatedImages) {
        otherImages = relatedImages.map((otherImage, index) => {
          let otherUrl = manifestIndexJson[otherImage.indexNumber]["filename"].replace("/home/ubuntu/pictwourd/build", "");

          let newIndex = null;

          let style = styles['image' + index];

          if (index != 0) {
            newIndex = otherImage.indexNumber;
          }

          return (
            <img key={otherUrl} className={style} src={otherUrl} onClick={this.onFoo.bind(this, newIndex)}/>
          )
        });
      }
    }

    return (
      <div className={styles.flexContainer}>
        {otherImages}
      </div>
    );
  }
}

// pure functional is cooler?
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

export { App, Html };
