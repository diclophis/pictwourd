import React from 'react';
import ImagePalette from 'react-image-palette';

import manifestIndexJson from './build/index.manifest/manifest.json';

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
      alignItems: "flex-start",
      marginLeft: "0.5em"
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
        //width: `70%`,
        //flex: `0 1 auto`,
        alignSelf: "auto",
        //maxHeight: "70%"
    }

    if (i !=0) {
      //primary['flex'] = `1 1 16em`;
      //primary['width'] = `${newHeight}em`;
      primary['max-width'] = "31%"; ////"21.23%";
      primary['max-height'] = "27%";
      primary['alignSelf'] = "flex-start";
      primary['margin-top'] = "3em";
      primary['margin-left'] = "1em";
    } else {
      primary['flex'] = `0 1 auto`;
      primary['max-height'] = "35.5em";
      primary['max-width'] = "44%";
      primary['margin-left'] = "13em";
      primary['margin-bottom'] = "1em";
      primary['padding'] = "1em 0 1em 0";
    }

    foop['image' + i] = primary;
  }

  let bizz = {
  }


  for (let i = 0; i<32; i++) {
    if (i != 0) {
    bizz['image' + i] = {
      //maxHeight: '7em'
      maxWidth: '28%'
      //width: `40%`,
      //flex: `0 1 ${vvv * 1.333}em`,
      //flex: `0 0`,
    };
    }
  }

  foop['@media only screen and (orientation: portrait)'] = bizz;

  return foop;
});

class Foox extends ImagePalette {
  render() {
    const { colors } = this.state;
    const { children, render, defaultColors } = this.props;
    const callback = render || children;
    if (!callback) {
      throw new Error(
        "ImagePaletteProvider expects a render callback either as a child or via the `render` prop"
      );
    }
    return callback(colors || defaultColors);
  }
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.lastDefaultColors = {
      backgroundColor: 'white', color: 'blue', alternativeColor: 'magenta'
    };
  }

  async componentDidMount() {
    await this.onFoo(this.props.initialImage || false);
    window.addEventListener("popstate", (ev) => {
      this.setState(ev.state);
    });
  }
  
  componentDidUpdate() {
    if (this.prime) {
      this.prime.scrollIntoView({behavior: "smooth"});
    }
  }

  async onFoo(newImage, ev) {
    if (ev) {
      ev.preventDefault();
    }

    let randomInt = (newImage === false ? (parseInt(Math.random() * manifestIndexJson.length)) : newImage);
    let jsonFileToLoad = './' + randomInt.toString() + '.json'
    let otherJson = await import(`./build/index.manifest/${randomInt}.json`);

		var stateObj = {
			relatedImages: otherJson['results'],
			activeImage: randomInt
		};

		history.pushState(stateObj, "image" + randomInt, "?" + randomInt + "#prime");

		this.setState(stateObj);
  }

  render() {
    let newUrl = null;
    let otherImages = null;
    let firstImage = null;
    let fooop = null;

    if (manifestIndexJson && manifestIndexJson[this.state.activeImage]) {
      newUrl = manifestIndexJson[this.state.activeImage]["filename"].replace("/home/ubuntu/pictwourd/build/", "");

      //let manifestIndexJson = this.state.manifestIndexJson;
      let relatedImages = this.state.relatedImages;

      let filterFunA = (otherImage, index) => {
        let r = {};
        r['otherUrl'] = manifestIndexJson[otherImage.indexNumber]["filename"].replace("/home/ubuntu/pictwourd/build/", "");
        r['style'] = styles['image' + index];
        r['newIndex'] = otherImage.indexNumber;
        return r;
      };

      if (relatedImages) {
        firstImage = relatedImages.map(filterFunA).find((otherImage, index) => {
          return (index == 0);
        });

        fooop = (color, alternativeColor) => {
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
                extraStyle['paddingLeft'] = "2em";
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
        <Foox image={firstImage['otherUrl']} key={firstImage['otherUrl']} defaultColors={this.lastDefaultColors}>
          {({ backgroundColor, color, alternativeColor }) => {
            this.lastDefaultColors = { backgroundColor: backgroundColor, color: color, alternativeColor: alternativeColor};
						return (
							<div ref={node => this.prime = node} id="prime" style={{backgroundColor, color, transition: "background-color 1s" }}>
								<p style={{margin: "1em", width: "11em", float: "left", position: "absolute"}}>
									<h1 style={{margin: 0}}>
										<a 
                      onClick={this.onFoo.bind(this, false)}
                      style={{ color }} href="?">?</a>{firstImage['newIndex']}
									</h1>
                  <span>foo</span><br/>
                  <span>bar</span><br/>
                  <span>baz</span><br/>
								</p>
								<div className={styles.flexContainer}>
									{fooop(color, alternativeColor)}
								</div>
							</div>
            );
          }}
        </Foox>
      );
    } else {
      return (
        <div ref={node => this.prime = node} id="prime" className={styles.flexContainer}>
          <p style={{margin: "1em", width: "11em", float: "left", position: "absolute"}}>
            <h1 style={{margin: 0}}>
              <a href="?">?</a> ...
            </h1>
          </p>
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
