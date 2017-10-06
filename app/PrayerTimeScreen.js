import React from 'react';
import { PixelRatio, StyleSheet, Text, Image, Dimensions, AsyncStorage } from 'react-native';
import { Container, Content, Header, Body, Title, Button, Left, Right, Icon, View, ListItem } from 'native-base';
import { H1, H2, H3 } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Components from 'expo';
import moment from 'moment';
import hijri from 'moment-hijri';
require('moment-duration-format');
import DateTimePicker from 'react-native-modal-datetime-picker';
import I18n from 'i18n-js';
import _ from 'lodash';

import Db from './db';
import { getPrayerTimes } from './Util';

let w = Dimensions.get('window');
let tablet = w.width >= 768;
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

export default class PrayerTimeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor() {
    super();
    this.state = {
      salah: [0, 0, 0, 0, 0],
      dhikr: [0, 0, 0, 0, 0],
      nextPrayer: null,
      nextPrayerTime: null,
      prayTimes: ['04:00', '06:00', '12:00', '15:00', '18:00', '19:00'].map(i => moment(i, 'HH:mm')),
      date: new Date(),
      datePickerVisible: false,
      locale: I18n.locale,
    };
    this.timer = null;
    this.countDown = 0;

    this.times = ['Fajr', 'Ishraq', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

    this.prayerIcons = [
      require('./assets/icons/With-Jamah.png'),
      require('./assets/icons/On-Time.png'),
      require('./assets/icons/Qadha.png'),
      require('./assets/icons/Missed.png'),
      require('./assets/icons/Dhikr.png'),
    ];
  }

  _updatePrayerTimes() {
    let { setting } = this.props.screenProps;
    let prayTimes = getPrayerTimes(
      this.state.date,
      setting.location,
      setting.prayer.calculationMethod,
      setting.prayer.adjustment
    );
    this.setState({ prayTimes });
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(() => {
      if (!this.countDown) {
        this.findNextPrayer();
      } else {
        this.countDown--;
        this.setState({
          nextPrayerTime: moment.duration(this.countDown, 'seconds').format('HH:mm:ss'),
        });
      }
    }, 1000);
  }

  componentWillMount() {
    const { setting } = this.props.screenProps;
    I18n.locale = setting.locale;
    this.setState({ locale: setting.locale });
  }

  componentDidMount() {
    this._updatePrayerTimes();
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  findNextPrayer() {
    let now = moment();
    let i = 0;
    for (i = 0; i < 6; i++) {
      if (now < this.state.prayTimes[i]) break;
    }
    if (i > 5) {
      // greater than Isha
      i = 0;
      this.countDown = (this.state.prayTimes[0] - now) / 1000 + 86400;
    } else {
      this.countDown = (this.state.prayTimes[i] - now) / 1000;
    }
    this.setState({ nextPrayer: I18n.t(this.times[i]) });
  }

  _datePicked(date) {
    let today = new Date();
    if (moment(today).format('YYYY-MM-DD') < moment(date).format('YYYY-MM-DD')) date = today;
    this.setState({ date }, this._updatePrayerTimes());
    this._hideDatePicker();
  }

  _hideDatePicker() {
    this.setState({ datePickerVisible: false });
  }

  _showDatePicker() {
    this.setState({ datePickerVisible: true });
  }

  _yesterday() {
    var date = moment(this.state.date).subtract(1, 'days').toDate();
    this.setState({ date }, this._updatePrayerTimes());
  }

  _tomorrow() {
    var date = moment(this.state.date).add(1, 'days').toDate();
    this.setState({ date }, this._updatePrayerTimes());
  }

  render() {
    let { setting } = this.props.screenProps;
    let city = _.get(setting, 'reverseGeocode[0].city');
    let country = _.get(setting, 'reverseGeocode[0].country');
    return (
      <Image source={require('./assets/bg2.jpg')} style={{ flex: 1, width: w.width, resizeMode: 'cover' }}>
        <Container>
          <Header style={{ backgroundColor: '#A9DBDF',}}>
            <Left>
              <Button transparent onPress={() => this.props.navigation.goBack()}>
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Title style={{ width: 250 }}>
                {I18n.t('Prayer Times')}
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
              {city &&
                <Row style={{ justifyContent: 'center' }}>
                  <Text style={{ fontSize: tablet ? 40 : 24, fontWeight: 'bold' }}>
                    {city}
                  </Text>
                </Row>}
              {country &&
                <Row style={{ justifyContent: 'center' }}>
                  <Text style={{ fontSize: tablet ? 24 : 12 }}>
                    {country}
                  </Text>
                </Row>}
              <Row style={{ justifyContent: 'center', margin: 10 }}>
                <Components.LinearGradient
                  colors={['#34618C', 'grey', '#34618C']}
                  style={{
                    padding: 5,
                    paddingLeft: 30,
                    paddingRight: 30,
                    borderRadius: 15,
                  }}>
                  <Text style={styles.countdown}>{I18n.t('UPCOMING PRAYER')}</Text>
                  <Text style={styles.countdown}>
                    {this.state.nextPrayer} {this.state.nextPrayerTime}
                  </Text>
                </Components.LinearGradient>
              </Row>
              {this.times.map(t => I18n.t(t)).map((time, i) =>
                <Row key={i} style={{ padding: 10, backgroundColor: i % 2 ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)' }}>
                  {tablet && <Col style={{ width: 100 }}></Col>}
                  <Col>
                    <Text style={{ fontWeight: 'bold', fontSize: tablet ? 30 : 15 }}>
                      {time}
                    </Text>
                  </Col>
                  <Col>
                    <Text style={{ fontSize: tablet ? 32 : 16, textAlign: 'right' }}>
                      {this.state.prayTimes[i].format('hh:mm A')}
                    </Text>
                  </Col>
                  {tablet && <Col style={{ width: 100 }}></Col>}
                </Row>
              )}
            </Grid>
          </Content>
        </Container>
      </Image>
    );
  }
}
