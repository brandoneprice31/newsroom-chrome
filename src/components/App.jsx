import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Container } from 'semantic-ui-react';

import SigninForm from '../components/SigninForm';
import NewsRoom from '../components/NewsRoom';
import {signInUser} from '../actions';

class App extends Component {
  render() {
    chrome.storage.sync.get('user', function(item){
      if (item.user == null || item.user == '') {
        return;
      }
      this.props.signInUser(JSON.parse(item.user));
    }.bind(this));

    var currDisplay = null;
    if (!this.props.user) {
      currDisplay = ( <SigninForm /> );
    } else {
      currDisplay = ( <NewsRoom /> );
    }

    return (
      <Container fluid>
        { currDisplay }
      </Container>
    );
  }
}

function mapStateToProps(state) {
    return {
        user: state.user
    };
}

function mapDispatchToProps(dispatch) {
  return {
    signInUser: (user) => {
      dispatch(signInUser(user))
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
