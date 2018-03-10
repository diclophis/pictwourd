//

import React from 'react';
import ReactDOM from 'react-dom';
import { App, Html } from './static';

const initialData = { initialImage: window.location.search.replace("?", "") };

ReactDOM.hydrate(<App {...initialData} />, document.getElementById('app'));
