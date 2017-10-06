import React from 'react';
import { StyleSheet, View, Image, Dimensions, AsyncStorage } from 'react-native';
import { Container, Content, Header, Body, Text, Title, Button, Left, Right, Icon, Footer, FooterTab } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';

const quran = {
  p1: require('./assets/quran/293.png'),
  p2: require('./assets/quran/294.png'),
  p3: require('./assets/quran/295.png'),
  p4: require('./assets/quran/296.png'),
  p5: require('./assets/quran/297.png'),
  p6: require('./assets/quran/298.png'),
  p7: require('./assets/quran/299.png'),
  p8: require('./assets/quran/300.png'),
  p9: require('./assets/quran/301.png'),
  p10: require('./assets/quran/302.png'),
  p11: require('./assets/quran/303.png'),
  p12: require('./assets/quran/304.png'),
};

export default class QuranScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Quran',
    header: (
      <Header>
        <Left>
          <Button transparent onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title style={{ width: 250 }}>Al-Kahfi</Title>
        </Body>
        <Right />
      </Header>
    ),
  });

  constructor() {
    super();
    this.state = {
      page: 1,
      surah: '18 - Al-Kahfi',
    };
    this.width = Dimensions.get('window').width;
  }

  _setPage(page) {
    this.setState({ page });
  }

  _nextPage() {
    if (this.state.page < 12) {
      this._setPage(this.state.page + 1);
    }
  }

  _prevPage() {
    if (this.state.page > 1) {
      this._setPage(this.state.page - 1);
    }
  }

  render() {
    return (
      <GestureRecognizer
        onSwipeLeft={_ => this._prevPage()}
        onSwipeRight={_ => this._nextPage()}
        style={{ flex: 1, width: this.width }}>
        <Container>
          <Image source={quran['p' + this.state.page]} style={{ flex: 1, width: this.width, resizeMode: 'stretch' }} />
          <Footer>
            <FooterTab style={{ alignItems: 'center' }}>
              <Button onPress={() => this._nextPage()} style={{ left: 5 }}>
                <Text>Next</Text>
              </Button>
              <Text bordered style={{ width: 25, textAlign: 'center' }}>
                {this.state.page}
              </Text>
              <Text style={{ width: 150, textAlign: 'center' }}>
                {this.state.surah}
              </Text>
              <Button onPress={() => this._prevPage()}>
                <Text>Prev</Text>
              </Button>
            </FooterTab>
          </Footer>
        </Container>
      </GestureRecognizer>
    );
  }
}
