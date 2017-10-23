import React from 'react';
import { StyleSheet, View, Image, Dimensions, AppState, ScrollView, FlatList, Picker, Platform } from 'react-native';
import {
  Container,
  Content,
  Header,
  Body,
  Text,
  Title,
  Button,
  Left,
  Right,
  Icon,
  Footer,
  FooterTab,
  List,
  ListItem,
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import RNPicker from 'react-native-picker';
import SQLite from 'react-native-sqlite-storage';
import _ from 'lodash';
import moment from 'moment';

import surah from './surah';
import Quran from './Quran';

import Db from './db';
import { getPrayerTimes } from './Util';

//let quran = require('./quran-text.json');

export default class QuranScreen extends React.PureComponent {
  static navigationOptions = { header: null };
  appState = AppState.currentState;
  start = moment();

  constructor() {
    super();
    this.state = {
      page: 1,
      pages: [],
      surah: `${surah[0][1]} - ${surah[0][2]}`,
      pageContent: [],
      translation: false,
      refreshing: false,
      selected1: 'key0',
    };
    this.width = Dimensions.get('window').width;
    this.quranSetting = new Quran();
    this.db = SQLite.openDatabase(
      { name: 'quran.db', createFromLocation: '~quran.db' },
      () => {},
      err => {
        console.log('SQL Error: ' + err);
      }
    );
  }

  componentWillMount() {
    let { setting } = this.props.screenProps;
    this.quranSetting
      .load()
      .then(() =>
        this.setState({ fontScale: setting.fontScale, translation: setting.quranTranslation }, () =>
          this._setPage(this.quranSetting.page, setting.quranTranslation)
        )
      );
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    this._storeData();
    if (moment().diff(this.start) > 1000 * 60 * 3) {
      // 3 minutes before considered reading
      this._storeReadingData();
    }
  }

  _storeData() {
    this.quranSetting.page = this.state.page;
    this.quranSetting.store();
  }

  async _storeReadingData() {
    let { setting } = this.props.screenProps;
    let prayTimes = getPrayerTimes(new Date(), setting.location, setting.prayer.calculationMethod, setting.prayer.adjustment);
    let now = moment();
    let field;
    for (let i = 5; i > 1; i--) {
      if (now > prayTimes[i]) {
        field = 'quran' + i;
        break;
      }
    }
    if (!field) field = 'quran1';

    let sql = 'SELECT * FROM quran WHERE date = ?';
    let db = new Db();
    let result = await db.select_query(sql, [moment().format('YYYY-MM-DD')]);
    if (result.length) {
      let data = result[0];
      if (!data[field]) {
        sql = `UPDATE quran SET ${field} = 1 WHERE date = ?`;
        db.execute_query(sql, [now.format('YYYY-MM-DD')]);
      }
    } else {
      let values = [0, 0, 0, 0, 0];
      values[field.match(/\d/)[0] - 1] = 1;
      sql = `INSERT INTO quran(date, ${[1, 2, 3, 4, 5].map(i => 'quran' + i).join(',')}) 
        VALUES ('${now.format('YYYY-MM-DD')}', ${values.join(',')})`;
      db.execute_query(sql);
    }
  }

  _handleAppStateChange(nextAppState) {
    if (nextAppState === 'inactive') {
      this._storeData();
    }
  }

  async _setPage(page) {
    this.state.pages = [];
    let pageContent = await this._generatePage(page, this.state.translation);
    this.setState({ pageContent });
  }

  _setStatusBar(page) {
    this.setState({ page, surah: this._getSurah(page) });
  }

  _nextPage() {
    if (this.state.page < 604) {
      this._setPage(this.state.page + 1);
    }
  }

  _prevPage() {
    if (this.state.page > 1) {
      this._setPage(this.state.page - 1);
    }
  }

  _getSurah(page) {
    let idx = page < 604 ? surah.filter(c => c[0] > page)[0][1] : 113;
    idx = Math.max(idx - 2, 0);
    return `${surah[idx][1]} - ${surah[idx][2]}`;
  }

  async _generatePage(page, translation) {
    if (this.state.pages.includes(page)) return [];
    this.state.pages.push(page);
    return await new Promise(resolve => {
      this.db.transaction(async tx => {
        var x = await new Promise(resolve =>
          tx.executeSql(
            'SELECT * FROM text WHERE page = ?',
            [page],
            (_, results) => {
              let elements = [];
              let _array = results.rows.raw();
              elements.push({ type: 'page-start', page, id: `ps${page}` });
              if (translation) {
                _array.map((fragment, i) => {
                  if (fragment.aya == 1) {
                    elements.push({
                      type: 'surah',
                      name: `${surah[fragment.sura - 1][1]} - ${surah[fragment.sura - 1][2]}`,
                      basmalah: fragment.sura != 1 && fragment.sura != 9,
                      page,
                      id: `${i}0p${page}`,
                    });
                  }
                  elements.push({
                    type: 'aya',
                    arabic: `${fragment.ar}`,
                    english: `${fragment.aya}. ${fragment.en}`,
                    page,
                    id: `${i}p${page}`,
                  });
                });
              } else {
                let element = '';
                let i = 0;
                const pushFragment = () => {
                  if (element.length) {
                    i++;
                    elements.push({
                      type: 'ayas',
                      arabic: element,
                      page,
                      id: `${i}p${page}`,
                    });
                  }
                };
                for (const index in _array) {
                  const fragment = _array[index];
                  if (fragment.aya == 1) {
                    pushFragment();
                    element = '';
                    if (element) {
                      elements.push({
                        type: 'ayas',
                        texts: element,
                        page,
                        id: `${i}0p${page}`,
                      });
                    }
                    i++;
                    elements.push({
                      type: 'surah',
                      name: `${surah[fragment.sura - 1][1]} - ${surah[fragment.sura - 1][2]}`,
                      basmalah: fragment.sura != 1 && fragment.sura != 9,
                      page,
                      id: `${i}p${page}`,
                    });
                  }
                  element += `${fragment.ar} \uFD3F${fragment.aya}\uFD3E `;
                }
                pushFragment();
              }
              elements.push({ type: 'page-end', page, id: `pe${page}` });
              resolve(elements);
            },
            (_, err) => console.log(`Err: sql=${sql}, params=${params}\n${err}`)
          )
        );
        resolve(x);
      });
    });
  }

  render() {
    let w = Dimensions.get('window');
    let { setting } = this.props.screenProps;
    return (
      <Image source={require('./assets/quran-bgLow.jpg')} style={{ width: w.width, flex: 1, resizeMode: 'stretch' }}>
        <Container>
          <Header
            style={{
              backgroundColor: 'transparent',
            }}>
            <Left>
              <Button transparent onPress={() => this.props.navigation.goBack()}>
                <Icon style={{ color: 'white' }} name="arrow-back" />
              </Button>
            </Left>
            <Body transparent>
              <Title style={{ width: 250, color: 'white', backgroundColor: 'transparent' }}>Quran</Title>
            </Body>
            <Right>
              <Button
                transparent
                onPress={async () => {
                  let newState = !this.state.translation;
                  setting.quranTranslation = newState;
                  this.state.translation = newState;
                  this._setPage(this.state.page, this.state.translation);
                }}>
                <Icon style={{ color: 'white' }} name={this.state.translation ? 'ios-bookmarks-outline' : 'ios-book-outline'} />
              </Button>
            </Right>
          </Header>
          <FlatList
            style={{ marginLeft: 10, marginRight: 10 }}
            data={this.state.pageContent}
            keyExtractor={item => item.id}
            ref={r => (this.flatList = r)}
            removeClippedSubviews={true}
            renderItem={({ item }) => <QuranElement {...item} fontScale={setting.fontScale} />}
            onEndReached={async () => {
              let page = this.state.pageContent.length
                ? this.state.pageContent[this.state.pageContent.length - 1].page
                : this.quranSetting.page;
              if (page < 604) {
                let nextPage = await this._generatePage(page + 1, this.state.translation);
                this.setState({ pageContent: [...this.state.pageContent, ...nextPage] });
              }
            }}
            refreshing={this.state.refreshing}
            onRefresh={async () => {
              let page = this.state.pageContent.length ? this.state.pageContent[0].page : this.quranSetting.page;
              if (page > 1) {
                let prevPage = await this._generatePage(page - 1, this.state.translation);
                this.setState({ pageContent: [...prevPage, ...this.state.pageContent] });
              }
            }}
            onViewableItemsChanged={items => {
              this._setStatusBar(items.changed[0].item.page);
            }}
          />
          {Platform.OS == 'ios'
            ? <FooterIOS page={this.state.page} surahText={this.state.surah} setPage={this._setPage.bind(this)} />
            : <FooterAndroid page={this.state.page} surahText={this.state.surah} setPage={this._setPage.bind(this)} />}
        </Container>
      </Image>
    );
  }
}

class FooterAndroid extends React.Component {
  pickerData = surah.map(s => `${s[1]} - ${s[2]}`);
  render() {
    let { page, surahText, setPage } = this.props;
    return (
      <Footer style={{ backgroundColor: 'transparent' }}>
        <FooterTab style={{ alignItems: 'center', backgroundColor: 'transparent' }}>
          <Text>　</Text>
          <Picker
            selectedValue={page}
            mode="dropdown"
            prompt="Select Page"
            style={{ width: 100, color: 'white' }}
            onValueChange={page => setPage(page)}>
            {_.range(1, 604).map(i => <Picker.Item key={i} label={`${i}`} value={i} />)}
          </Picker>
          <Picker
            selectedValue={surahText.match(/\d+/)[0] - 1}
            mode="dropdown"
            prompt="Select Surah"
            style={{ width: 210, color: 'white' }}
            onValueChange={value => setPage(surah[value][0])}>
            {this.pickerData.map((v, i) => <Picker.Item key={i} label={v} value={i} />)}
          </Picker>
          <Text>　</Text>
        </FooterTab>
      </Footer>
    );
  }
}

class FooterIOS extends React.Component {
  pickerData = surah.map(s => `${s[1]} - ${s[2]}`);
  render() {
    let { page, surahText, setPage } = this.props;
    return (
      <Footer style={{ backgroundColor: 'transparent' }}>
        <RNPicker
          ref={p => (this.surahPicker = p)}
          style={{ height: 260 }}
          pickerData={this.pickerData}
          selectedValue={surahText}
          onPickerDone={value => setPage(surah[value[0].match(/\d+/)[0] - 1][0])}
        />
        <RNPicker
          ref={p => (this.pagePicker = p)}
          style={{ height: 260 }}
          pickerData={{
            '0': {
              '0': ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '1': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '2': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '3': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '4': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '5': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '6': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '7': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '8': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '9': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
            },
            '1': {
              '0': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '1': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '2': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '3': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '4': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '5': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '6': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '7': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '8': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '9': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
            },
            '2': {
              '0': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '1': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '2': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '3': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '4': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '5': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '6': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '7': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '8': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '9': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
            },
            '3': {
              '0': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '1': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '2': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '3': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '4': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '5': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '6': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '7': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '8': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '9': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
            },
            '4': {
              '0': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '1': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '2': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '3': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '4': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '5': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '6': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '7': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '8': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '9': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
            },
            '5': {
              '0': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '1': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '2': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '3': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '4': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '5': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '6': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '7': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '8': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              '9': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
            },
            '6': {
              '0': ['0', '1', '2', '3', '4'],
            },
          }}
          onPickerDone={value => setPage(parseInt(value.join('')))}
          selectedValue={('000' + page).substr(-3).split('')}
        />
        <FooterTab style={{ alignItems: 'center', backgroundColor: 'transparent' }}>
          <Text>　</Text>
          <Text bordered style={{ width: 35, textAlign: 'center', color: 'white' }} onPress={() => this.pagePicker.toggle()}>
            {page}
          </Text>
          <Text style={{ width: 150, textAlign: 'center', color: 'white' }} onPress={() => this.surahPicker.toggle()}>
            {surahText}
          </Text>
          <Text>　</Text>
        </FooterTab>
      </Footer>
    );
  }
}

class QuranElement extends React.PureComponent {
  render() {
    switch (this.props.type) {
      case 'surah':
        return (
          <View
            key={this.props.key}
            style={{
              flex: 1,
              padding: 5,
              backgroundColor: 'rgba(255,255,255,0.5)',
              borderRadius: 10,
              marginBottom: 10,
              marginRight: 15,
              marginLeft: 15,
            }}>
            <Text style={{ textAlign: 'center' }}>
              {this.props.name}
            </Text>
            {this.props.basmalah && <Text style={{ textAlign: 'center' }}>﷽</Text>}
          </View>
        );
      case 'aya':
        return (
          <View
            key={this.props.key}
            style={{
              flex: 1,
              padding: 5,
              borderRadius: 10,
              marginBottom: 10,
              marginRight: 15,
              marginLeft: 15,
              backgroundColor: 'rgba(174,216,155,0.5)',
            }}>
            <Text
              style={{
                textAlign: 'right',
                marginBottom: 5,
                fontFamily: '_PDMS_Saleem_QuranFont',
                fontSize: 24 * this.props.fontScale,
              }}>
              {this.props.arabic}
            </Text>
            <Text
              style={{
                marginBottom: 5,
                fontSize: 14 * this.props.fontScale,
              }}>
              {this.props.english}
            </Text>
          </View>
        );
      case 'page-start':
      case 'page-end':
        return (
          <View
            key={this.props.key}
            style={{
              flex: 1,
            }}>
            {/* <Text style={{ textAlign: 'center' }}>{`──────── ${this.props.page} ────────`}</Text> */}
          </View>
        );
      default:
        return (
          <View
            key={this.props.key}
            style={{
              flex: 1,
              padding: 5,
              backgroundColor: 'rgba(174,216,155,0.5)',
              borderRadius: 10,
              marginBottom: 10,
              marginRight: 15,
              marginLeft: 15,
            }}>
            <Text
              style={{
                textAlign: 'right',
                marginBottom: 5,
                fontFamily: '_PDMS_Saleem_QuranFont',
                fontSize: 24 * this.props.fontScale,
              }}>
              {this.props.arabic}
            </Text>
          </View>
        );
    }
  }
}
