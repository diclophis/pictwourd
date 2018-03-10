import React from 'react';
import ImagePalette from 'react-image-palette';

//import manifestIndexJson from './build/index.manifest/manifest.json';

var styles = cssInJS((context) => {
  let vvv = 28;

  let foop = {
		'$html, body': {
			margin: 0,
			padding: 0,
		},

    flexContainer: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "flex-start",
      alignContent: "flex-start",
      alignItems: "flex-start"
    }
  };

  for (let i = 0; i<32; i++) {
    let newHeight = vvv - 17 - (i * 1.75);
    if (newHeight < 5) {
      newHeight = 5;
    }

    let primary = {
        cursor: 'pointer',
        transition: "none 0s",
        order: 0,
        margin: "0.5em", 
        width: `${vvv}em`,
        flex: `0 1 ${vvv}em`, alignSelf: "auto",
    }

    if (i !=0) {
      primary['flex'] = `0 1 ${newHeight}em`;
      primary['width'] = `${newHeight}em`;
      primary['alignSelf'] = "center";
    } else {
      primary['margin-left'] = "13em";
    }

    foop['image' + i] = primary;
  }

  foop['@media only screen and (orientation: portrait)'] = {
    'image0': {
      width: `${vvv * 1.333}em`,
      flex: `0 1 ${vvv * 1.333}em`, alignSelf: "auto",
    }
  }

  return foop;
});


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    await this.onFoo(this.props.initialImage);
    window.addEventListener("popstate", (ev) => {
      console.log("popstate");
      this.setState(ev.state);
    });
  }

  async onFoo(newImage) {
    console.log("onFooStart");

    let manifestIndexJson = await import('./build/index.manifest/manifest.json');
    let randomInt = newImage ? newImage : (parseInt(Math.random() * manifestIndexJson.length) + 1);
    let jsonFileToLoad = './build/index.manifest/' + randomInt.toString() + '.json'
    let otherJson = await import(`./build/index.manifest/${randomInt}.json`);

		var stateObj = {
			manifestIndexJson: manifestIndexJson,
			relatedImages: otherJson['results'],
			activeImage: randomInt
		};

		history.pushState(stateObj, "image" + randomInt, "?" + randomInt + "");

    console.log("onFooDone");

		this.setState(stateObj);
  }

  render() {
    let newUrl = null;
    let otherImages = null;
    let firstImage = null;
    let fooop = null;

    if (this.state.manifestIndexJson && this.state.manifestIndexJson[this.state.activeImage]) {
      newUrl = this.state.manifestIndexJson[this.state.activeImage]["filename"].replace("/home/ubuntu/pictwourd/build", "");

      let manifestIndexJson = this.state.manifestIndexJson;
      let relatedImages = this.state.relatedImages;

      let filterFunA = (otherImage, index) => {
        let r = {};
        r['otherUrl'] = manifestIndexJson[otherImage.indexNumber]["filename"].replace("/home/ubuntu/pictwourd/build", "");
        r['style'] = styles['image' + index];
        r['newIndex'] = otherImage.indexNumber;
        return r;
      };

      if (relatedImages) {
        firstImage = relatedImages.map(filterFunA).find((otherImage, index) => {
          return (index == 0);
        });

        fooop = (color, alternativeColor) => {
          console.log("fooop");
          return (
            relatedImages.map(filterFunA).map((otherImage, index) => {
              let extraStyle = { };

              let img = (
                <img 
                  key={otherImage['otherUrl']} 
                  style={extraStyle} className={otherImage['style']}
                  src={otherImage['otherUrl']}
                  onClick={this.onFoo.bind(this, otherImage['newIndex'])}
                />
              );

              let span = null

              if (index == 0) {
                //extraStyle['border'] = "0.1em solid " + color;
                extraStyle['borderLeft'] = "0.33em solid " + alternativeColor;
                extraStyle['paddingLeft'] = "1em";
                span = (img);
              } else {
                span = (img);
              }

              return (span);
            })
          );
        };
      }
    }

    if (firstImage) {
      return (
        <ImagePalette image={firstImage['otherUrl']} key={firstImage['otherUrl']}>
          {({ backgroundColor, color, alternativeColor }) => (
            <div style={{backgroundColor, color, transition: "background-color 1s" }}>
              <p style={{margin: "1em", width: "11em", float: "left", position: "absolute"}}>
                <h1 style={{margin: 0}}>
                  <a style={{ color }} href="?">?</a>{firstImage['newIndex']}
                </h1>
              </p>
              <div className={styles.flexContainer}>
                {fooop(color, alternativeColor)}
              </div>
            </div>
          )}
        </ImagePalette>
      );
    } else {
      return (
        <div className={styles.flexContainer}>
        </div>
      );
    }
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
