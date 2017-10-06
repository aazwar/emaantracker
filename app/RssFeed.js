import { WebBrowser } from 'expo';
import React from 'react';
import { StyleSheet, View, Image, Dimensions, Text, TouchableOpacity, ScrollView } from 'react-native';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import moment from 'moment';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Entypo } from '@expo/vector-icons';
import Rss from './rss';

class Items {
  date = '';
  title = '';
  image = '';
  desc = '';
  content = '';
  link = '';
}

function pick(string, property, stripTag = true) {
  let result;
  try {
    result = string.match(new RegExp(`<${property}>[^]*?<\/${property}>`, 'g'))[0];
    if (stripTag) {
      result = result.replace(/<.*?>/g, '');
    }
  } finally {
    return result;
  }
}

function property(string, property) {
  let result;
  try {
    result = string.match(new RegExp(`${property}=".*?"`))[0];
    result = result.substring(property.length + 2, result.length - 1);
  } finally {
    return result;
  }
}

export default class RssFeed extends React.Component {
  state = { index: 0, items: [] };

  async componentWillMount() {
    let items;
    try {
      let rss = new Rss();
      await rss.load();
      if (rss.items.length) {
        this.setState({ items: rss.items.slice(0, 3) });
      }
      let resp = await fetch('http://www.emaantracker.com/feed/', { method: 'head' });
      let lastdate = moment(resp.headers.map['last-modified'][0]);
      if (!rss.lastdate || lastdate > rss.lastdate) {
        let resp = await fetch('http://www.emaantracker.com/feed/');
        let text = await resp.text();
        items = text.match(/<item>[^]*?<\/item>/g).map(s => {
          let item = new Items();
          item.title = pick(s, 'title');
          item.date = moment(pick(s, 'pubDate').replace('+0000', 'GMT')).toDate();
          item.link = pick(s, 'link');
          let desc = pick(s, 'description', false);
          let img = desc.match(/<img.*?>/g);
          if (img) {
            img = img[0];
            let src = property(img, 'src');
            let width = parseInt(property(img, 'width'));
            let height = parseInt(property(img, 'height'));
            item.image = { src, width, height };
          }
          item.desc = desc.replace(/(<.*?>)|(Read more)/g, '');
          item.desc = item.desc.substring(0, item.desc.length - 4).replace(/&#([0-9]{1,4});/gi, function(match, numStr) {
            var num = parseInt(numStr, 10); // read num as normal number
            return String.fromCharCode(num);
          });
          return item;
        });
        rss.lastdate = lastdate;
        rss.items = items;
        rss.store();
      } else {
        items = rss.items;
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({ items: items.slice(0, 3) });
    }
  }

  _prevPage() {
    if (this.state.index) this.setState({ index: this.state.index - 1 });
    else this.setState({ index: this.state.items.length - 1 });
  }

  _nextPage() {
    if (this.state.index < this.state.items.length - 1) this.setState({ index: this.state.index + 1 });
    else this.setState({ index: 0 });
  }

  _openLink() {
    const { items, index } = this.state;
    WebBrowser.openBrowserAsync(items[index].link);
  }

  render() {
    const { footerHeight, items, index } = this.state;
    let image;
    let desc;
    let title;
    if (items[index] && footerHeight) {
      title = items[index].title;
      desc = items[index].desc;
      image = items[index].image;
    }
    return (
      <GestureRecognizer
        onLayout={event => this.setState({ footerHeight: event.nativeEvent.layout.height })}
        onSwipeLeft={_ => this._prevPage()}
        onSwipeRight={_ => this._nextPage()}
        style={{ flex: 1, height: 120 }}>
        <Grid
          style={{
            height: 90,
            alignItems: 'center',
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 30,
            paddingBottom: 5,
          }}>
          <Row>
            <Col style={{ width: image ? image.width * 90 / image.height : 0 }}>
              {image &&
                <TouchableOpacity onPress={this._openLink.bind(this)}>
                  <View
                    style={{
                      shadowColor: 'black',
                      shadowOffset: { width: 1, height: 1 },
                      elevation: 1,
                    }}>
                    <Image
                      source={{ uri: image.src }}
                      style={{
                        height: 80,
                        width: image.width * 85 / image.height,
                      }}
                    />
                  </View>
                </TouchableOpacity>}
            </Col>
            <Col style={{ flex: 1, marginLeft: 10, justifyContent: 'center' }}>
              <Text>
                <Text
                  onPress={this._openLink.bind(this)}
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: 'black',
                    textShadowColor: 'white',
                    textShadowOffset: { width: 1, height: 1 },
                  }}>
                  {title}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: 'bold',
                    color: 'red',
                    textShadowColor: 'grey',
                    textShadowOffset: { width: 0.25, height: 0.25 },
                  }}>{`\nread more ...`}</Text>
              </Text>
            </Col>
          </Row>
        </Grid>
      </GestureRecognizer>
    );
  }
}
