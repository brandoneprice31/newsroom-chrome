import React, {Component} from 'react';
import { Container, Grid, Image, Card } from 'semantic-ui-react';
import Client from '../client/client';

class Welcome extends Component {
  constructor(props){
    super(props);
    this.state = {
      headlines: null
    };

    this.getHeadlines();
  }

  render() {
    var headlines = null;
    if (this.state.headlines) {
      headlines = this.state.headlines.map(function (headline, index){
        return (
          <Grid.Column>
            <Card href={headline.url}>
              <Image id={'img_' + index} src={headline.img_url} onError={() => this.displayNoImg('img_' + index)} />
              <Card.Content extra>
                <Card.Header>
                  {headline.website}
                </Card.Header>
                <Card.Description>
                  {headline.title}
                </Card.Description>
              </Card.Content>
            </Card>
          </Grid.Column>
        )
      });
    }

    return (
      <Container fluid>
        <Grid centered style={{width: '100%', position:'relative', top: 0, bottom:200}}>
          <Grid.Row>
            <Grid.Column width={5} textAlign='right'>
              <h1 style={{position:'relative', top: 185}}>Welcome to</h1>
            </Grid.Column>
            <Grid.Column width={11}>
              <img src="/media/tile-marquee.png" style={{height: 560/2, width: 1400/2}} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <p style={{width:800, textAlign: 'left'}}>
              With Newsroom you have a whole new way of interacting with the internet.
              No more fact checking or excessive internet searching.  We provide related
              content instantaneously and allow you to express your thoughts on news
              articles with people around the globe.
            </p>
          </Grid.Row>
          <Grid.Row>
            <p style={{width:800, textAlign: 'left'}}>
              Get started by checking out one of these headlines and then click
              the Newsroom icon in the top left of your browser.
            </p>
          </Grid.Row>
          <Grid.Row centered>
            <Grid style={{width: 800}} columns={3}>
              {headlines}
            </Grid>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }

  getHeadlines() {
    Client.get("headlines", {},
      function (response) {
        this.setState({
          headlines: response.headlines
        });
      }.bind(this), null);
  }

  displayNoImg(id) {
    var img = document.getElementById(id);
    img.style.display='none';
  }
}

export default Welcome;
