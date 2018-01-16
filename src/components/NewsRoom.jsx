import React, {Component} from 'react';
import {connect} from 'react-redux';
import Client from '../client/client';
import Comments from './Comments';
import Related from './Related';
import {pageChange, commentsChange, logOutUser} from '../actions'
import { Loader, Icon, Header, Dimmer, Container, Grid, Image, Segment, Comment, Button, Input, Divider, TextArea } from 'semantic-ui-react';
import $ from 'jquery';

class NewsRoom extends Component {
  constructor(props){
    super(props);
    this.state = { showRelated: true };

    chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
     var activeTab = arrayOfTabs[0];

     if (!activeTab.selected) {
       return;
     }

     this.changeTo(activeTab.url);
   }.bind(this));
  }

  render() {
      var title = (
        <Header as='h2' style={{position: 'relative', top:20, bottom:20, left:10}}>
          Open a news article
        </Header>
      );

      if (this.props.page) {
        if (this.props.page.src_img) {
          title = (
            <Image src={this.props.page.src_img} style={{position: 'relative', top:20, bottom:20, left:10, height:70}}/>
          );
        } else {
          title = (
            <Header as='h2' style={{position: 'relative', top:20, bottom:20, left:10}}>
              {this.props.page.website}
            </Header>
          );
        }
      }

      var table = null;

      if (this.props.comments) {
        var relatedOrComments = this.state.showRelated ? (<Related changePage={(url) => this.changeTo(url)}/>) : (<Comments />);

        table = (
          <Grid.Row>
            <Grid style={{width:'100%', height:'100%'}} textAlign='center'>
              <Grid.Row>
                <Grid centered>
                  <Grid.Row>
                    <Button.Group style={{position:'relative', left:10}}>
                      <Button id="RelatedButton" active  onClick={() => this.relatedButtonClicked()}>
                        Related
                      </Button>
                      <Button id="CommentsButton" onClick={() => this.commentsButtonClicked()}>
                        Comments
                      </Button>
                    </Button.Group>
                  </Grid.Row>
                </Grid>
              </Grid.Row>
              <Grid.Row>
                {relatedOrComments}
              </Grid.Row>
            </Grid>
          </Grid.Row>
        );
      }

      return (
          <Grid divided='vertically'>
            <Grid.Row>
              <Grid textAlign='center' style={{width:'100%', height:'100%'}}>
                <Grid.Row>
                  {title}
                </Grid.Row>
                <Grid.Row>
                  <Loader id='loader' style={{position:'relative', bottom:10, width:'100%', left:'52%'}}/>
                </Grid.Row>
              </Grid>
            </Grid.Row>
              {table}
            <Grid.Row>
              <Grid centered style={{width:'100%', height:'100%', left:15, position:'relative'}}>
                <Grid.Row style={{position:'relative', top:5}}>
                    {this.props.user.username ? this.props.user.username : this.props.user.first_name + ' ' + this.props.user.last_name}
                </Grid.Row>
                <Grid.Row>
                  <Button onClick={ () => this.logOutClicked() } size='mini' style={{position:'relative', bottom:15}}>
                    Logout
                  </Button>
                </Grid.Row>
              </Grid>
            </Grid.Row>
          </Grid>
      )
  }

  changeTo(url) {
    this.pageInputChanged(url);
  }

  pageInputChanged(unparsedUrl) {
    this.setState({
      showRelated: true
    });

    var url = this.parseURL(unparsedUrl);

    if (url == null || url == "") {
      this.props.pageChange(null);
      this.props.commentsChange(null);
      return;
    }

    var loader = document.getElementById("loader");
    $(loader).addClass("active");

    // Get the page.
    Client.get("pages", { url: url },
      function (response) {
        setTimeout(function(){
          var loader = document.getElementById("loader");
          $(loader).removeClass("active");
        }, 1000);

        // Only change state if the page id changed.
        if (this.props.page && response.page._id == this.props.page._id) {
          return;
        }

        this.props.pageChange(response.page);
        this.props.commentsChange(response.comments);
      }.bind(this),
      function (error) {
        var loader = document.getElementById("loader");
        $(loader).removeClass("active");

        console.log('Error:', error);
        this.props.pageChange(null);
        this.props.commentsChange(null);
      }.bind(this)
    );
  }

  relatedButtonClicked() {
    var relatedButton = document.getElementById("RelatedButton");
    var commentsButton = document.getElementById("CommentsButton");
    $(relatedButton).addClass('active');
    $(commentsButton).removeClass('active');

    this.setState({
      showRelated: true
    });
  }

  commentsButtonClicked() {
    var relatedButton = document.getElementById("RelatedButton");
    var commentsButton = document.getElementById("CommentsButton");
    $(relatedButton).removeClass('active');
    $(commentsButton).addClass('active');

    this.setState({
      showRelated: false
    });
  }

  logOutClicked() {
    this.props.commentsChange(null);
    this.props.pageChange(null);
    chrome.storage.sync.set({'user': null}, function() {
      this.props.logOutUser();
    }.bind(this));
  }

  // Parses current url.
  parseURL(url) {
    return url;
  }
}

function mapStateToProps(state) {
    return {
        user: state.user,
        page: state.page,
        comments: state.comments
    };
}


function mapDispatchToProps(dispatch) {
  return {
    pageChange: (page) => {
      dispatch(pageChange(page))
    },
    commentsChange: (comments) => {
      dispatch(commentsChange(comments))
    },
    logOutUser: () => {
      dispatch(logOutUser())
    }
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(NewsRoom);
