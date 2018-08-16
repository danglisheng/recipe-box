import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

var AV = require('leancloud-storage');
var APP_ID = 'vviReOfVRQfHguttoY5x74NY-gzGzoHsz';
var APP_KEY = 'SGmYn9TrS9somcVt5aygUjXl';
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
