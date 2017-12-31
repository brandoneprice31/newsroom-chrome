import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Container, Grid, Image, Segment, Comment, Button, Input, Divider, Message } from 'semantic-ui-react';
var CryptoJS = require("crypto-js");

import {signInUser} from '../actions';
import Client from '../client/client';

class SigninForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      showConfirm: false,
      errMessage: null
     };
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
      (<Input id="username" type="text" size="small" placeholder="username"></Input>),
      (<Input id="password" type="password" size="small" placeholder="password"></Input>),
      (<Container>
        <Button onClick={() => this.loginClick()} size='mini'>Login</Button>
        <Button onClick={() => this.signUpClick()} size='mini'>Sign-Up</Button>
      </Container>)
    ];

    if (this.state.showConfirm) {
      arr.splice(3, 0, (<Input id="confirm" type="password" size="small" placeholder="confirm password"></Input>));
    }

    return (
      <Container fluid>
        <Grid centered style={{top: 100, position: 'fixed', width:'95%'}}>
          {
            arr.map((elem, index) => (
              <Grid.Row key={index}>
                {elem}
              </Grid.Row>
            ))
          }
        </Grid>
        {errMessage}
      </Container>
    );
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
}

function mapDispatchToProps(dispatch) {
  return {
    signInUser: (user) => {
      dispatch(signInUser(user))
    }
  };
}

export default connect(null, mapDispatchToProps)(SigninForm);
