//

import React from 'react';
import ReactDOM from 'react-dom';

import App from './static';

const initialData = { initialImage: parseInt(window.location.search.replace("?", "")) || false };

ReactDOM.hydrate(<App {...initialData} />, document.getElementById('app'));
