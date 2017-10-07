import React from 'react';
import { PixelRatio, StyleSheet, Text, Image, Dimensions, AsyncStorage } from 'react-native';
import { Container, Content, Header, Body, Title, Button, Left, Right, Icon, View } from 'native-base';
import { H1, H2, H3 } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import hijri from 'moment-hijri';
require('moment-duration-format');
import DateTimePicker from 'react-native-modal-datetime-picker';
import I18n from 'i18n-js';
import Db from './db';
import { getPrayerTimes } from './Util';
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
  countdown: { fontSize: 12 * scale, textAlign: 'center', color: '#9CF1F7', fontWeight: 'bold' },
});

export default class MyPrayerScreen extends React.Component {
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
    this._loadData();
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this._storeData().then(() => this.props.navigation.state.params.refreshStatus());
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
    if (moment(this.state.date).format('YYYY-MM-DD') < moment().format('YYYY-MM-DD')) {
      this._storeData();
      var date = moment(this.state.date).add(1, 'days').toDate();
      this.setState({ date }, this._loadData);
    }
  }

  _selectSalah(i, time) {
    let st = this.state.salah;
    st[i] = time;
    this.setState({ salah: st });
  }

  _flipDhikr(i) {
    let d = this.state.dhikr;
    d[i] = !d[i];
    this.setState({ dhikr: d });
  }

  async _loadData() {
    let db = new Db();
    let data = await db.load_salah_data(moment(this.state.date).format('YYYY-MM-DD'));
    this.setState({ salah: data.salah, dhikr: data.dhikr });
  }

  async _storeData() {
    let db = new Db();
    await db.store_salah_data(moment(this.state.date).format('YYYY-MM-DD'), this.state.salah, this.state.dhikr);
  }

  render() {
    return (
      <Image source={require('./assets/bg2.jpg')} style={{ flex: 1, width: w.width, resizeMode: 'cover' }}>
        <Container>
          <Header style={{ backgroundColor: '#A9DBDF' }}>
            <Left>
              <Button transparent onPress={() => this.props.navigation.goBack()}>
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Title style={{ width: 250 }}>
                {I18n.t('My Prayers')}
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
                {[0, 1, 2, 3, 4].map(i =>
                  <Col
                    size={1}
                    key={'s' + i}
                    style={{ borderLeftWidth: 1, borderBottomWidth: 1, borderColor: '#35b7c7', justifyContent: 'center' }}>
                    <Image source={this.prayerIcons[i]} style={{ flex: 1, resizeMode: 'cover', width: icw, height: icw }} />
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
                      <Text style={[styles.colHeader, { color: '#252933', textAlign: I18n.isRTL() ? 'right' : 'left' }]}>
                        {` ${prayer}`}
                      </Text>
                    </Col>
                    {[1, 2, 3, 4].map(time =>
                      <Col key={'c' + i + time} style={[styles.center, styles.bbl]} size={1}>
                        <CheckBox
                          key={'s' + i + time}
                          checked={this.state.salah[i] == time}
                          onPress={() => this._selectSalah(i, time)}
                        />
                      </Col>
                    )}
                    <Col key={'c' + i + '5'} style={[styles.center, styles.bbl, { backgroundColor: 'rgba(0,0,0,0.1)' }]}>
                      <CheckBox key={'d' + i} checked={this.state.dhikr[i]} onPress={() => this._flipDhikr(i)} />
                    </Col>
                  </Row>
                );
              })}
              <Row style={{ justifyContent: 'center', margin: 10 }}>
                <LinearGradient
                  colors={['#34618C', 'grey', '#34618C']}
                  style={{ padding: 5, paddingLeft: 30, paddingRight: 30, borderRadius: 15 }}>
                  <Text style={styles.countdown}>
                    {I18n.t('UPCOMING PRAYER')}
                  </Text>
                  <Text style={styles.countdown}>
                    {this.state.nextPrayer} {this.state.nextPrayerTime}
                  </Text>
                </LinearGradient>
              </Row>
              <Row>
                <View style={{ flex: 1 }}>
                  <Grid>
                    {this.times.map(t => I18n.t(t)).map((time, i) => {
                      return (
                        <Col key={time}>
                          <Text style={{ fontSize: 8 * scale, textAlign: 'center', color: 'green', fontWeight: 'bold' }}>
                            {time}
                          </Text>
                          <Text style={{ fontSize: 10 * scale, textAlign: 'center' }}>
                            {this.state.prayTimes[i].format('hh:mm')}
                            {'\n'}
                            {this.state.prayTimes[i].format('A')}
                          </Text>
                        </Col>
                      );
                    })}
                  </Grid>
                </View>
              </Row>
            </Grid>
          </Content>
        </Container>
      </Image>
    );
  }
}
