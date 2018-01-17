import {wrapStore} from 'react-chrome-redux';
import allReducers from './src/reducers';
import {createStore} from 'redux';

var configAuth = require('./src/auth/auth');
import {signInUser} from './src/actions'

const store = createStore(
    allReducers
);
wrapStore(store, {portName: 'newsroom'});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (!tab.selected || !tab.url.startsWith(configAuth.fb.redirectURL) || changeInfo.status != 'complete') {
    return;
  }

  chrome.tabs.sendMessage(tabId, {text: 'report_back'}, function (user) {
    var user = JSON.parse(user);
    chrome.storage.sync.set({'user': JSON.stringify(user)}, function() {
      store.dispatch(signInUser(user));

      // Open a webpage that basically says welcome to newsroom and describes how it works
    });
  });
});
