import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import LSMAN from './LocalStorageManager';
import {recipeIndex} from './LocalStorageManager';

const LSM=new LSMAN();
if(!LSM.get()){
	LSM.set(recipeIndex);
}
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
export {LSM };