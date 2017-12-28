import React, {Component} from 'react';
import {connect} from 'react-redux';
import Client from '../client/client';
import {pageChange, commentsChange, logOutUser} from '../actions'
import { Card, Icon, Header, Dimmer, Container, Grid, Image, Segment, Comment, Button, Input, Divider, TextArea } from 'semantic-ui-react';

class Related extends Component {
  render() {
    var table = null;

    if (this.props.page && this.props.page.related) {
      var top3 = this.props.page.related.slice(0,3)
      var articles = top3.map(function(article, index){

        let boundClick = this.onArticleClick.bind(this, article);

        return (
          <Grid.Row key={index}>
            <Card onClick={boundClick}>
              <Image src={article.img_url} />
              <Card.Content extra>
                <Card.Header>
                  {article.website}
                </Card.Header>
                <Card.Description>
                  {article.title}
                </Card.Description>
              </Card.Content>
            </Card>
          </Grid.Row>
        );
      }, this);

      table = (
          <Container style={{width: "80%"}}>
              <div style={{width:"100%"}}>
                <Grid centered>
                  {articles}
                </Grid>
              </div>
          </Container>
      );
    }

    return table;
  }

  onArticleClick(item, e) {
    this.props.changePage(item.url);
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
    pageChange: (page) => {
      dispatch(pageChange(page))
    },
    commentsChange: (comments) => {
      dispatch(commentsChange(comments))
    }
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(Related);
