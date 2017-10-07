import Expo from 'expo';
import React from 'react';
import { StyleSheet, View, Image, Dimensions, AppState } from 'react-native';
import { Container, Content, Header, Body, Text, Title, Button, Left, Right, Icon, Footer, FooterTab } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';

import quran from './QuranImage';
import surah from './surah';
import Quran from './Quran';

export default class QuranScreen extends React.Component {
  static navigationOptions = { header: null };
  appState = AppState.currentState;

  constructor() {
    super();
    this.state = {
      page: 1,
      surah: `${surah[0][1]} - ${surah[0][2]}`,
    };
    this.width = Dimensions.get('window').width;
    const quranSetting = new Quran();
    quranSetting.load().then(() => this._setPage(quranSetting.page));
    this.quranSetting = quranSetting;
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    this._storeData();
  }

  _storeData() {
    this.quranSetting.page = this.state.page;
    this.quranSetting.store();
  }

  _handleAppStateChange(nextAppState) {
    if (nextAppState === 'inactive') {
      this._storeData();
    }
  }

  _setPage(page) {
    this.setState({ page, surah: this._getSurah(page) });
  }

  _nextPage() {
    if (this.state.page < 604) {
      this._setPage(this.state.page + 1);
      if (this.state.page < 603) {
        Expo.Asset.fromModule(this.state.page + 2).downloadAsync();
      }
    }
  }

  _prevPage() {
    if (this.state.page > 1) {
      this._setPage(this.state.page - 1);
      if (this.state.page > 2) {
        Expo.Asset.fromModule(this.state.page - 2).downloadAsync();
      }
    }
  }

  _getSurah(page) {
    let idx = surah.filter(c => c[0] > page)[0][1];
    idx = Math.max(idx - 2, 0);
    return `${surah[idx][1]} - ${surah[idx][2]}`;
  }

  render() {
    return (
      <GestureRecognizer
        onSwipeLeft={_ => this._prevPage()}
        onSwipeRight={_ => this._nextPage()}
        style={{ flex: 1, width: this.width }}>
        <Container>
          <Header style={{ backgroundColor: '#A9DBDF' }}>
            <Left>
              <Button transparent onPress={() => this.props.navigation.goBack()}>
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Title style={{ width: 250 }}>Quran</Title>
            </Body>
            <Right />
          </Header>
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
