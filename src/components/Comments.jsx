import React, {Component} from 'react';
import {connect} from 'react-redux';
import Client from '../client/client';
import {pageChange, commentsChange, logOutUser} from '../actions'
import { Icon, Header, Dimmer, Container, Grid, Image, Segment, Comment, Button, Input, Divider, TextArea } from 'semantic-ui-react';

class Comments extends Component {
  render() {
    var table = null;

    if (this.props.comments) {
      table = (
          <Container style={{width: "80%"}}>
            <Grid>
              <Grid.Row>
                <div style={{overflowY: "scroll", maxHeight:400, width:"100%"}}>
                  <Comment.Group>
                    {this.props.comments.map((comment) => (
                      <Comment key={comment._id}>
                        <Comment.Content>
                          <Comment.Author>{comment.user.username}</Comment.Author>
                          <Comment.Text>{comment.message}</Comment.Text>
                        </Comment.Content>
                      </Comment>
                    ))}
                  </Comment.Group>
                </div>
              </Grid.Row>
              <Grid.Row>
                <Container fluid>
                  <Grid centered>
                    <Grid.Row>
                      <TextArea placeholder=" enter a comment..." id="commentInput" type="text" size='mini' style={{borderRadius: 2, minHeight: 75, minWidth: "90%", maxWidth:"90%", maxHeight:200}}/>
                    </Grid.Row>
                    <Grid.Row>
                      <Button onClick={() => this.submitCommentClicked()} size='medium' color='blue' style={{width:"50%"}}>
                        Submit
                      </Button>
                    </Grid.Row>
                  </Grid>
                </Container>
              </Grid.Row>
            </Grid>
          </Container>
      );
    }

    return table;
  }

  submitCommentClicked() {
    var submitButton = document.getElementById('commentInput');
    var message = submitButton.value;
    submitButton.value = "";

    // Submit new comment.
    Client.post('users/' + this.props.user._id + '/pages/' + this.props.page._id + '/comments',
      { message: message },
      function (response) {

        // Get the new page comments.
        Client.get('pages', {url: this.props.page.website + this.props.page.path},
          function (response) {
            this.props.commentsChange(response.comments);
          }.bind(this),
          function (error) {
            console.log(error);
          }
        )

      }.bind(this),
      function (error) {
        console.log(error);
      }
    );
  }
}

function mapStateToProps(state) {
    return {
        comments: state.comments,
        user: state.user,
        page: state.page
    };
}


function mapDispatchToProps(dispatch) {
  return {
    commentsChange: (comments) => {
      dispatch(commentsChange(comments))
    }
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(Comments);
