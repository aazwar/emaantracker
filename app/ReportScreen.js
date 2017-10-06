import React from 'react';
import Expo from 'expo';
import { StyleSheet, Text, View, Dimensions, Image, Share } from 'react-native';
import { Container, Content, Header, Body, Title, Button, Left, Right, Icon } from 'native-base';
import { CheckBox, List, ListItem, Separator, Badge } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StackNavigator } from 'react-navigation';
import moment from 'moment';
import hijri from 'moment-hijri';
import Db from './db';
import DateTimePicker from 'react-native-modal-datetime-picker';
import SimpleStepper from 'react-native-simple-stepper';
import I18n from 'i18n-js';
import { FontAwesome } from '@expo/vector-icons';

import Constants from './Constants';

const styles = StyleSheet.create({
  sectionHeader: {
    fontWeight: 'bold',
    textShadowColor: 'white',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default class ReportScreen extends React.Component {
  static navigationOptions = { header: null };

  constructor() {
    super();
    this.state = {
      date: moment().date(1).toDate(),
      locale: I18n.locale,
      modalVisible: false,
      datePickerVisible: false,
      salah: [],
      salah_summary: [[], [], [], [], []],
      dhikr_summary: [0, 0, 0, 0, 0],
      quran_summary: [0, 0, 0, 0, 0],
      monthly_summary: [0, 0, 0, 0, 0],
    };
  }

  componentWillMount() {
    const { setting } = this.props.screenProps;
    I18n.locale = setting.locale;
    this.setState({ locale: setting.locale });
  }

  componentDidMount() {
    this._loadData();
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

  _lastMonth() {
    var date = moment(this.state.date).subtract(1, 'months').toDate();
    this.setState({ date }, this._loadData);
  }

  _nextMonth() {
    var date = moment(this.state.date).add(1, 'months').toDate();
    this.setState({ date }, this._loadData);
  }

  async _loadData() {
    let db = new Db();
    let data = await db.load_report(moment(this.state.date).format('YYYY-MM-DD'));
    this.setState(data);
  }

  _share() {
    const { setting } = this.props.screenProps;
    const salah = this.state.salah
      .map(s => '' + (s.salah1 + 0) + (s.salah2 + 0) + (s.salah3 + 0) + (s.salah4 + 0) + (s.salah5 + 0))
      .join('');
    const period = moment(this.state.date).format('YYMM');
    const other = this.state.monthly_summary.map(i => `${i}`).join('');
    const sum = this.state.salah_summary.reduce((a, b) => a.concat(b), []).join(',');
    const gzip = require('gzip-js');
    const base64 = require('base64-js');
    let data = period + salah + other + `${sum}|` + this.state.dhikr_summary.join('') + this.state.quran_summary.join('') + setting.fullName;
    let code = base64.fromByteArray(gzip.zip(data));
    Share.share({
      message: `Br./Sr. ${setting.fullName || 'Fulan' } has shared his Emaan Tracker report:

${Constants.emaanTrackerUrl}/pdf/report/monthly?${code}`,
      title: 'Emaan Tracker Report',
    });
  }

  render() {
    let w = Dimensions.get('window'),
      cw = w.width / 3;
    return (
      <Image source={require('./assets/bg2.jpg')} style={{ flex: 1, width: w.width, resizeMode: 'cover' }}>
        <Container>
          <DateTimePicker
            isVisible={this.state.datePickerVisible}
            onConfirm={this._datePicked.bind(this)}
            onCancel={this._hideDatePicker.bind(this)}
          />
          <Header style={{ backgroundColor: '#A9DBDF',}}>
            <Left>
              <Button transparent onPress={() => this.props.navigation.goBack()}>
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Title style={{ width: 250 }}>
                {I18n.t('Report')}
              </Title>
            </Body>
            <Right>
              <Button transparent onPress={() => this.props.navigation.navigate('Chart')}>
                <FontAwesome name="bar-chart" style={{ fontSize: 24, color: 'rgba(0,119,255,1)' }} />
              </Button>
              <Button transparent onPress={() => this._share()}>
                <FontAwesome name="share-alt" style={{ fontSize: 24, color: 'rgba(0,119,255,1)' }} />
              </Button>
            </Right>
          </Header>
          <Content ref={r => (this.container = r)}>
            <Grid>
              <Row style={{ height: 44, justifyContent: 'center' }}>
                <Grid style={{ backgroundColor: 'white', opacity: 0.6, flex: 1 }}>
                  <Col size={1} style={{ justifyContent: 'center' }}>
                    <Button
                      iconLeft
                      transparent
                      style={{ height: 28, position: 'absolute', left: 5 }}
                      onPress={this._lastMonth.bind(this)}>
                      <Icon name="arrow-back" />
                    </Button>
                  </Col>
                  <Col size={2} style={{ justifyContent: 'center' }}>
                    <View>
                      <Text style={{ textAlign: 'center', fontWeight: 'bold' }} onPress={this._showDatePicker.bind(this)}>
                        {moment(this.state.date).format('MMMM YYYY')}
                      </Text>
                      <Text style={{ textAlign: 'center' }} onPress={this._showDatePicker.bind(this)}>
                        {hijri(this.state.date).format('iMMMM iYYYY')}
                      </Text>
                    </View>
                  </Col>
                  <Col size={1} style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Button
                      iconRight
                      transparent
                      style={{ height: 28, position: 'absolute', right: 5 }}
                      onPress={this._nextMonth.bind(this)}>
                      <Icon name="arrow-forward" />
                    </Button>
                  </Col>
                </Grid>
              </Row>
              <Row>
                <Col
                  size={1}
                  style={{
                    borderBottomWidth: 1,
                    borderColor: '#35b7c7',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 14,
                      textAlign: 'center',
                    }}>
                    Day
                  </Text>
                </Col>
                {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map(i =>
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
                        fontSize: 14,
                        textAlign: 'center',
                      }}>
                      {i}
                    </Text>
                  </Col>
                )}
              </Row>
              {this.state.salah.map(d => <SalahRow key={d.date} data={d} />)}
              {[0, 1, 2, 3].map(i => <SummaryRow key={i} icon={salah_icons[i]} data={this.state.salah_summary[i]} />)}
              <SummaryRow
                bgc={'rgba(0,150,255,0.8)'}
                icon={require('./assets/icons/report-dhikr.png')}
                data={this.state.dhikr_summary}
              />
              <SummaryRow
                bgc={'rgba(0,150,255,0.8)'}
                icon={require('./assets/icons/report-quran.png')}
                data={this.state.quran_summary}
              />
              <Row>
                <Col
                  style={{
                    borderBottomWidth: 1,
                    borderColor: '#35b7c7',
                    alignItems: 'center',
                  }}>
                  <Image
                    style={{ width: 42, height: 42 }}
                    source={
                      this.state.monthly_summary[0]
                        ? require('./assets/icons/report-ilmMajlis.png')
                        : require('./assets/icons/report-ilmMajlisNO.png')
                    }
                  />
                </Col>
                <Col
                  style={{
                    borderLeftWidth: 1,
                    borderBottomWidth: 1,
                    borderColor: '#35b7c7',
                    alignItems: 'center',
                  }}>
                  <Image
                    style={{ width: 42, height: 42 }}
                    source={
                      this.state.monthly_summary[1]
                        ? require('./assets/icons/report-ayanah.png')
                        : require('./assets/icons/report-ayanahNO.png')
                    }
                  />
                </Col>
                <Col
                  style={{
                    borderLeftWidth: 1,
                    borderBottomWidth: 1,
                    borderColor: '#35b7c7',
                    alignItems: 'center',
                  }}>
                  <Image
                    style={{ width: 42, height: 42 }}
                    source={
                      this.state.monthly_summary[2]
                        ? require('./assets/icons/report-infaq.png')
                        : require('./assets/icons/report-infaqNO.png')
                    }
                  />
                </Col>
                <Col
                  style={{
                    borderLeftWidth: 1,
                    borderBottomWidth: 1,
                    borderColor: '#35b7c7',
                    alignItems: 'center',
                  }}>
                  <Image
                    style={{ width: 42, height: 42 }}
                    source={
                      this.state.monthly_summary[3]
                        ? require('./assets/icons/report-qardal-hasan.png')
                        : require('./assets/icons/report-qardal-hasanNO.png')
                    }
                  />
                </Col>
                <Col
                  style={{
                    borderLeftWidth: 1,
                    borderBottomWidth: 1,
                    borderColor: '#35b7c7',
                    alignItems: 'center',
                  }}>
                  <Image
                    style={{ width: 42, height: 42 }}
                    source={
                      this.state.monthly_summary[4]
                        ? require('./assets/icons/report-bookReading.png')
                        : require('./assets/icons/report-bookReadingNO.png')
                    }
                  />
                </Col>
              </Row>
            </Grid>
          </Content>
        </Container>
      </Image>
    );
  }
}

const salah_icons = [
  require('./assets/icons/report-withJamah.png'),
  require('./assets/icons/report-onTime.png'),
  require('./assets/icons/report-qadha.png'),
  require('./assets/icons/report-missed.png'),
];

class SalahRow extends React.Component {
  render() {
    return (
      <Row>
        <Col
          style={{
            borderBottomWidth: 1,
            borderColor: '#35b7c7',
            justifyContent: 'center',
          }}>
          <Text style={{ fontWeight: 'bold', fontSize: 12, textAlign: 'center' }}>
            {moment(this.props.data.date).date()}
          </Text>
        </Col>
        {[1, 2, 3, 4, 5].map(i =>
          <Col
            key={i}
            style={{
              borderLeftWidth: 1,
              borderBottomWidth: 1,
              borderColor: '#35b7c7',
              alignItems: 'center',
            }}>
            {this.props.data[`salah${i}`]
              ? <Image source={salah_icons[this.props.data[`salah${i}`] - 1]} style={{ width: 24, height: 24 }} />
              : null}
          </Col>
        )}
      </Row>
    );
  }
}

class SummaryRow extends React.Component {
  render() {
    return (
      <Row style={{ backgroundColor: this.props.bgc || 'rgba(46,95,115,0.8)' }}>
        <Col
          style={{
            borderBottomWidth: 1,
            borderColor: '#35b7c7',
            alignItems: 'center',
          }}>
          <Image source={this.props.icon} style={{ width: 20, height: 20, paddingTop: 4, paddingBottom: 4 }} />
        </Col>
        {[0, 1, 2, 3, 4].map(i =>
          <Col
            key={i}
            style={{
              borderLeftWidth: 1,
              borderBottomWidth: 1,
              borderColor: '#35b7c7',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 12,
                textAlign: 'center',
                color: 'white',
              }}>
              {this.props.data[i]}
            </Text>
          </Col>
        )}
      </Row>
    );
  }
}
