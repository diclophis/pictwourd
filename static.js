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

    let linkPrimary = {
        order: 0,
        margin: "0.5em",
        alignSelf: "auto"
    }

    let imagePrimary = {
        maxWidth: '100%',
        alignSelf: "auto",
    }

    if (i !=0) {
      linkPrimary['max-width'] = "30%";
      linkPrimary['max-height'] = "27%";
      linkPrimary['alignSelf'] = "flex-start";
      linkPrimary['margin-top'] = "3em";
      linkPrimary['margin-left'] = "1em";
    } else {
      linkPrimary['flex'] = `0 1 auto`;
      linkPrimary['max-height'] = "35.5em";
      linkPrimary['max-width'] = "44%";
      linkPrimary['margin-left'] = "13em";
      linkPrimary['margin-bottom'] = "1em";
      linkPrimary['padding'] = "1em 0 1em 0";
    }

    foop['link' + i] = linkPrimary;
    foop['image' + i] = imagePrimary;
  }

  let bizz = {
  }


  for (let i = 0; i<32; i++) {
    if (i != 0) {
    bizz['link' + i] = {
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

  onLoad(newImage, ev) {
    if (ev) {
      ev.preventDefault();
    }

    if (ev.target) {
      ev.target.removeAttribute("width");
      ev.target.removeAttribute("height");
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
    let buildDir = "/home/ubuntu/pictwourd/build/";

    if (manifestIndexJson && manifestIndexJson[this.state.activeImage]) {
      newUrl = manifestIndexJson[this.state.activeImage]["filename"].replace(buildDir, "");

      let relatedImages = this.state.relatedImages;

      let filterFunA = (otherImage, index) => {
        let r = {};
        r['otherUrl'] = manifestIndexJson[otherImage.indexNumber]["filename"].replace(buildDir, "");
        r['istyle'] = styles['image' + index];
        r['lstyle'] = styles['link' + index];
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

              if (index == 0) {
                extraStyle['borderLeft'] = "0.33em solid " + alternativeColor;
                extraStyle['paddingLeft'] = "2em";
              }

              let img = (
                <a 
                  key={otherImage['otherUrl']} 
                  style={extraStyle}
                  className={otherImage['lstyle']}
                  href={`?${otherImage['newIndex']}#prime`}
                  onClick={this.onFoo.bind(this, otherImage['newIndex'])}>
                  <img 
                    className={otherImage['istyle']}
                    src={otherImage['otherUrl']}
                    
                  />
                </a>
              );

                    //onLoad={this.onLoad.bind(this, otherImage['newIndex'])}
                    //width={256}
                    //height={256}

              return (img);
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
