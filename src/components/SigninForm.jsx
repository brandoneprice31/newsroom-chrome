import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Container, Grid, Image, Segment, Comment, Button, Input, Divider, Message, Header, Icon } from 'semantic-ui-react';
var CryptoJS = require("crypto-js");

import {signInUser} from '../actions';
import Client from '../client/client';
var configAuth = require('../auth/auth');

class SigninForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      showConfirm: false,
      errMessage: null
     };

     chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => this.tabUpdated(tabId, changeInfo, tab));
  }

  render() {
    var errMessage = null;
    if (this.state.errMessage) {
      errMessage = (
        <Message negative>
          <p>{this.state.errMessage}</p>
        </Message>
      );
    }

    var arr = [
      (<img style={{height:100}} src="/media/logo.png" />),
      (<Button color='facebook' onClick={() => this.facebookClick()}>
          <Icon name='facebook' /> Facebook Connect
       </Button>),
      (<Divider horizontal>Or</Divider>),
      (<Input id="username" type="text" size="small" placeholder="username"></Input>),
      (<Input id="password" type="password" size="small" placeholder="password"></Input>),
      (<Container>
        <Button onClick={() => this.loginClick()} size='mini'>Login</Button>
        <Button onClick={() => this.signUpClick()} size='mini'>Sign-Up</Button>
      </Container>)
    ];

    if (this.state.showConfirm) {
      arr.splice(5, 0, (<Input id="confirm" type="password" size="small" placeholder="confirm password"></Input>));
    }

    return (
      <Container fluid>
        <Grid centered style={{top: 65, position: 'fixed', width:'95%'}}>
          {
            arr.map((elem, index) => (
              <Grid.Row key={index}>
                {elem}
              </Grid.Row>
            ))
          }
        </Grid>
        {errMessage}
        <Grid centered style={{bottom:20, position:'fixed', width:'95%'}}>
          <Grid.Row>
            <Header as='h3'>
              powered by <a style={{cursor: 'pointer'}} onClick={() => this.changeToNewsAPI()}>NewsAPI</a>
            </Header>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }

  facebookClick() {
    var fbRedirectURL = 'https://www.facebook.com/dialog/oauth?' +
      'client_id=' + configAuth.fb.clientID +
      '&scope=' + 'public_profile,email,user_friends' +
      '&redirect_uri=' + configAuth.fb.redirectURL

    chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
       var activeTab = arrayOfTabs[0];

       if (!activeTab.selected) {
         return;
       }

       // save the current tab
       this.props.redirectTab = activeTab;

       // access redirect url for oauth
       chrome.tabs.update(activeTab.id, {url: fbRedirectURL});
     }.bind(this));
  }

  tabUpdated(tabId, changeInfo, tab) {
    if (!this.props.redirectTab || tabId != this.props.redirectTab.id || changeInfo.status != 'complete') {
      return;
    }

    // get the response from in the content script
    chrome.tabs.sendMessage(tabId, {text: 'report_back'}, function(user) {
      var user = JSON.parse(user);
      this.saveCachedUser(user);

      // redirect to previous
      var url = this.props.redirectTab.url;
      this.props.redirectTab = null;
      chrome.tabs.update(tabId, {url: url});
    }.bind(this));
  }

  loginClick() {
    if (this.state.showConfirm) {
      this.setState({
        showConfirm: false
      });
      return;
    }

    var usernameInput = document.getElementById("username");
    var passwordInput = document.getElementById("password");

    // Check if fields are empty.
    if (usernameInput.value == "" || passwordInput.value == "") {
      this.setState({
        errMessage: 'Fields cannot be empty.'
      });
      return;
    }

    var hash = CryptoJS.SHA256(passwordInput.value).toString(CryptoJS.enc.Base64);

    // Login.
    Client.get("users/login",
      { username: usernameInput.value, password: hash },
      function (response) {
        this.saveCachedUser(response.user);
      }.bind(this),
      function (error) {
        this.setState({
          errMessage: 'Username or password is incorrect.'
        });
      }.bind(this)
    );
  }

  signUpClick() {
    // Show confirmation input.
    if (!this.state.showConfirm) {
      this.setState({
        showConfirm: true
      });
      return;
    }

    var usernameInput = document.getElementById("username");
    var passwordInput = document.getElementById("password");
    var confirmInput = document.getElementById("confirm");

    // Check if fields are empty.
    if (usernameInput.value == "" || passwordInput.value == "" || confirmInput.value == "") {
      this.setState({
        errMessage: 'Fields cannot be empty.'
      });
      return;
    }

    if (usernameInput.value.indexOf(' ') > -1) {
      this.setState({
        errMessage: 'Spaces are not allowed in usernames.'
      });
      return;
    }

    // Check if password and confirm match.
    if (passwordInput.value != confirmInput.value) {
      this.setState({
        errMessage: 'Your password and confirmation do not match.'
      });
      return;
    }

    var hash = CryptoJS.SHA256(passwordInput.value).toString(CryptoJS.enc.Base64);

    // Sign up.
    Client.post("users/",
      { username: usernameInput.value, password: hash },
      function (response) {
        this.saveCachedUser(response.user);

        chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
          var activeTab = arrayOfTabs[0];

          if (!activeTab.selected) {
            return;
          }

          chrome.tabs.update(activeTab.id, {url: './welcome.html'});
        })

      }.bind(this),
      function (error) {
        this.setState({
          errMessage: 'Username already exists.'
        });
      }.bind(this)
    );
  }

  saveCachedUser(user) {
    chrome.storage.sync.set({'user': JSON.stringify(user)}, function() {
      this.props.signInUser(user);
    }.bind(this));
  }

  changeToNewsAPI() {
    chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
     var activeTab = arrayOfTabs[0];

     if (!activeTab.selected) {
       return;
     }

     chrome.tabs.update(activeTab.id, {url: 'https://newsapi.org/'});
   });
  }
}

function mapDispatchToProps(dispatch) {
  return {
    signInUser: (user) => {
      dispatch(signInUser(user))
    }
  };
}

export default connect(null, mapDispatchToProps)(SigninForm);
