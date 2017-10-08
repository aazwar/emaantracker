import React from 'react';
import { PixelRatio, StyleSheet, Text, Image, Dimensions, ImageBackground } from 'react-native';
import { Container, Content, Header, Body, Title, Button, Left, Right, Icon, View } from 'native-base';
import { H1, H2, H3 } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import PrayerTimes from 'prayer-times';
import moment from 'moment';
import hijri from 'moment-hijri';
require('moment-duration-format');
import DateTimePicker from 'react-native-modal-datetime-picker';
import Db from './db';

import I18n from 'i18n-js';
import { CheckBox } from './ETComponents';

let w = Dimensions.get('window');
let scale = Math.sqrt(w.width / 320 * PixelRatio.get());
let icw = parseInt(w.width / 6.5);

const styles = StyleSheet.create({
  center: { justifyContent: 'center', alignItems: 'center' },
  header: { textAlign: 'center', fontWeight: 'bold', fontSize: 8 * scale },
  bb: { borderBottomWidth: 1, borderColor: '#35b7c7' },
  bbl: { borderLeftWidth: 1, borderBottomWidth: 1, borderColor: '#35b7c7' },
  cl: { width: 60, justifyContent: 'center' },
  check: { fontSize: 24 * scale },
  colHeader: { fontSize: 11 * scale, fontWeight: 'bold' },
  countdown: {
    fontSize: 12 * scale,
    textAlign: 'center',
    color: '#9CF1F7',
    fontWeight: 'bold',
  },
});

export default class SalahScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor() {
    super();
    this.state = {
      quran: [0, 0, 0, 0, 0],
      date: new Date(),
      datePickerVisible: false,
      locale: I18n.locale,
    };
    this.times = ['Fajr', 'Ishraq', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  }

  componentWillMount() {
    const { setting } = this.props.screenProps;
    I18n.locale = setting.locale;
    this.setState({ locale: I18n.locale });
  }

  componentDidMount() {
    this._loadData();
  }

  componentWillUnmount() {
    this._storeData().then(() => this.props.navigation.state.params.refreshStatus());
  }

  _datePicked(date) {
    this.setState({ date }, this._loadData);
    this._hideDatePicker();
  }

  _hideDatePicker() {
    this.setState({ datePickerVisible: false });
  }

  _showDatePicker() {
    this.setState({ datePickerVisible: true });
  }

  _yesterday() {
    this._storeData();
    var date = moment(this.state.date).subtract(1, 'days').toDate();
    this.setState({ date }, this._loadData);
  }

  _tomorrow() {
    this._storeData();
    var date = moment(this.state.date).add(1, 'days').toDate();
    this.setState({ date }, this._loadData);
  }

  _selectQuran(i, time) {
    let st = this.state.quran;
    st[i] = time;
    this.setState({ quran: st });
  }

  async _loadData() {
    let db = new Db();
    let data = await db.load_quran_data(moment(this.state.date).format('YYYY-MM-DD'));
    this.setState({ quran: data });
  }

  async _storeData() {
    let db = new Db();
    await db.store_quran_data(moment(this.state.date).format('YYYY-MM-DD'), this.state.quran);
  }

  render() {
    return (
      <ImageBackground source={require('./assets/bg2.jpg')} style={{ flex: 1, width: w.width }}>
        <Container>
          <Header style={{ backgroundColor: '#A9DBDF' }}>
            <Left>
              <Button transparent onPress={() => this.props.navigation.goBack()}>
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Title style={{ width: 250 }}>
                {I18n.t('My Quran')}
              </Title>
            </Body>
            <Right />
          </Header>
          <DateTimePicker
            ref={ref => (this.picker = ref)}
            date={this.state.date}
            isVisible={this.state.datePickerVisible}
            onConfirm={this._datePicked.bind(this)}
            onCancel={this._hideDatePicker.bind(this)}
          />
          <Content>
            <Grid>
              <Row style={{ height: 44, justifyContent: 'center' }}>
                <Grid style={{ backgroundColor: 'white', opacity: 0.6, flex: 1 }}>
                  <Col size={1} style={{ justifyContent: 'center' }}>
                    <Button
                      iconLeft
                      transparent
                      style={{ height: 28, position: 'absolute', left: 5 }}
                      onPress={this._yesterday.bind(this)}>
                      <Icon name="arrow-back" />
                    </Button>
                  </Col>
                  <Col size={2} style={{ justifyContent: 'center' }}>
                    <View>
                      <Text style={{ textAlign: 'center', fontWeight: 'bold' }} onPress={this._showDatePicker.bind(this)}>
                        {moment(this.state.date).format('D MMMM, YYYY')}
                      </Text>
                      <Text style={{ textAlign: 'center' }} onPress={this._showDatePicker.bind(this)}>
                        {hijri(this.state.date).format('iD iMMMM, iYYYY')}
                      </Text>
                    </View>
                  </Col>
                  <Col size={1} style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Button
                      iconRight
                      transparent
                      style={{ height: 28, position: 'absolute', right: 5 }}
                      onPress={this._tomorrow.bind(this)}>
                      <Icon name="arrow-forward" />
                    </Button>
                  </Col>
                </Grid>
              </Row>
              <Row>
                <Col size={1.5} style={[styles.cl, { borderBottomWidth: 1, borderColor: '#35b7c7' }]} />
                {['Quran Reading', 'With Translation', 'With Tafseer', 'Not Reading'].map(i =>
                  <Col
                    size={1}
                    key={'s' + i}
                    style={{
                      borderLeftWidth: 1,
                      borderBottomWidth: 1,
                      borderColor: '#35b7c7',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: 10,
                        textAlign: 'center',
                      }}>
                      {I18n.t(i)}
                    </Text>
                  </Col>
                )}
              </Row>
              {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map(t => I18n.t(t)).map((prayer, i) => {
                return (
                  <Row key={'r' + i}>
                    <Col
                      size={1.5}
                      key={'c' + i + '0'}
                      style={[styles.cl, styles.bb, { paddingTop: 7 * scale, paddingBottom: 7 * scale }]}>
                      <Text
                        style={[
                          styles.colHeader,
                          {
                            color: '#252933',
                            textAlign: I18n.isRTL() ? 'right' : 'left',
                          },
                        ]}>
                        {` ${prayer} `}
                      </Text>
                    </Col>
                    {[1, 2, 3, 0].map(time => {
                      return (
                        <Col key={'c' + i + time} style={[styles.center, styles.bbl]} size={1}>
                          <CheckBox
                            key={'s' + i + time}
                            checked={this.state.quran[i] == time}
                            onPress={() => this._selectQuran(i, time)}
                          />
                        </Col>
                      );
                    })}
                  </Row>
                );
              })}
            </Grid>
          </Content>
        </Container>
      </ImageBackground>
    );
  }
}
