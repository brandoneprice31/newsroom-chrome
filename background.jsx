import {wrapStore} from 'react-chrome-redux';
import allReducers from './src/reducers';
import {createStore} from 'redux';

const store = createStore(
    allReducers
);
wrapStore(store, {portName: 'newsroom'});
