//

import React from 'react';
import ReactDOM from 'react-dom';
import { App, Html } from './static';

//const initialData = JSON.parse(document.getElementById('initial-data').getAttribute('data-json'));

const initialData = {};

ReactDOM.hydrate(<App {...initialData} />, document.getElementById('app'));
