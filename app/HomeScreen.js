import React from 'react';
import {
  StyleSheet,
  Image,
  View,
  Dimensions,
  Text,
  Alert,
  TouchableOpacity,
  Platform,
  ScrollView,
  ImageBackground,
  DeviceEventEmitter,
} from 'react-native';
import { Container, Content, Header, Body, Title, Button, List, ListItem, Right, Footer } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import PopoverTooltip from 'react-native-popover-tooltip';
import _ from 'lodash';
import I18n from 'i18n-js';
import { RNLocation as Location } from 'NativeModules';
import Geocoder from 'react-native-geocoder';

import Db from './db';
require('./Locale');
import tips from './tips';
import EMNotification from './EMNotification';
import RssFeed from './RssFeed';
//import IntroScreen from './IntroScreen';
import { register, getToken } from './Registration';

class Cell extends React.Component {
  render() {
    let w = Dimensions.get('window');
    let cols = w.width >= 768 ? 4 : 3;
    let iw = w.width * 0.7 / cols;
    let cw = w / cols;
    let m = w.width * 0.15 / 6;
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={this.props.onPress}>
          <Image style={{ width: iw, height: iw }} source={this.props.icon} />
        </TouchableOpacity>
        <Text style={{ backgroundColor: 'transparent' }}>
          {this.props.caption}
        </Text>
      </View>
    );
  }
}

const status = [
  require('./assets/status0.png'),
  require('./assets/status1.png'),
  require('./assets/status2.png'),
  require('./assets/status3.png'),
  require('./assets/status4.png'),
  require('./assets/status5.png'),
];

// prettier-ignore

export default class HomeIntro extends React.Component {
  static navigationOptions = { header: null };
  state = {
    intro: false
  }
  
  constructor() {
    super();
  }
  
  componentWillMount() {
    let { setting } = this.props.screenProps;
    this.setState({ intro: setting.intro })
  }
  
  _doneIntro() {
    let { setting } = this.props.screenProps;
    setting.intro = false;
    this.setState({ intro: false});
    register(setting).then(result => result == 'success' && getToken(setting));
    setting.store();
  }
  
  render() {
    let { setting } = this.props.screenProps;
    //if(this.state.intro) 
      //return <IntroScreen  {...this.props} doneIntro={this._doneIntro.bind(this)}/>;
    return <HomeScreen {...this.props}/> 
  }
}

class HomeScreen extends React.Component {
  static navigationOptions = { header: null };
  state = {
    locale: 'en',
    status: 2,
    showPopover: false,
    popoverRect: {},
  };

  constructor() {
    super();
    let db = new Db();
    db.check();
    db.eman_status().then(status => this.setState({ status: status.point }));
  }

  /*
    Root Navigation screen only called once. Load all Storable objects here.
  */
  componentWillMount() {
    let { setting } = this.props.screenProps;
    this.setState({ locale: setting.locale });
    I18n.locale = setting.locale;
  }

  componentDidMount() {
    //this._getLocation();
  }

  componentWillUnmount() {}

  notificationHandler(notification) {
    let [type, title, message] = notification.data;
    Alert.alert(title, message, [{ text: 'OK' }], { cancelable: false });
  }

  _getLocation() {
    let { setting } = this.props.screenProps;
    Location.requestAlwaysAuthorization();
    Location.startUpdatingLocation();
    let subscription = DeviceEventEmitter.addListener('locationUpdated', loc => {
      setting.location = [loc.coords.latitude, loc.coords.longitude];
      let position = { lat: setting.location[0], lng: setting.location[1] };
      subscription.remove();
      Location.stopUpdatingLocation();
      Geocoder.geocodePosition(position)
        .then(geocode => {
          setting.reverseGeocode = geocode;
          console.log(setting);
        })
        .catch(err => console.log(err));
    });
  }

  async _checkLocaleChange() {
    let { setting } = this.props.screenProps;
    if (setting.locale != this.state.locale) {
      I18n.locale = setting.locale;
      this.setState({ locale: setting.locale });
    }
  }

  _refreshStatus() {
    let db = new Db();
    db.eman_status().then(status => {
      this.setState({ status: status.point });
    });
  }

  render() {
    const { navigate } = this.props.navigation;
    let w = Dimensions.get('window');
    let cols = w.width >= 768 ? 4 : 3;
    let cw = w.width / cols;
    return (
      <ImageBackground source={require('./assets/bg2.jpg')} style={{ width: w.width, flex: 1 }}>
        <Container>
          <Header
            style={{
              backgroundColor: '#A9DBDF',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Image source={require('./assets/logo.png')} style={{ height: 40, width: 130, resizeMode: 'stretch' }} />
            <PopoverTooltip
              buttonComponent={
                <View>
                  <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: -3, textAlign: 'center' }}>
                    {I18n.t('Emaan Status')}
                  </Text>
                  <Image source={status[this.state.status]} style={{ height: 20, width: 80, resizeMode: 'stretch' }} />
                </View>
              }
              items={[{ label: tips[this.state.status], onPress: () => {} }]}
              tooltipContainerStyle={{ width: w.width * 0.9, marginLeft: -w.width / 40 }}
            />
          </Header>
          <Content>
            {_.chunk(
              [
                [
                  'My Prayers',
                  require('./assets/Main-MyPrayerLow.png'),
                  'MyPrayer',
                  { refreshStatus: () => this._refreshStatus() },
                ],
                ['My Quran', require('./assets/Main-MyQuranLow.png'), 'MyQuran', { refreshStatus: () => this._refreshStatus() }],
                [
                  'Other Activity',
                  require('./assets/Main-OtherActivityLow.png'),
                  'Activity',
                  { refreshStatus: () => this._refreshStatus() },
                ],
                ['Report', require('./assets/Main-ReportLow.png'), 'Report'],
                ['Quran', require('./assets/Main-QuranLow.png'), 'Quran', { refreshStatus: () => this._refreshStatus() }],
                [
                  'Prayer Times',
                  require('./assets/Main-PrayerTimeLow.png'),
                  'PrayerTime',
                  { refreshStatus: () => this._refreshStatus() },
                ],
                ['Books', require('./assets/Main-BookListLow.png'), 'BookList', { refreshStatus: () => this._refreshStatus() }],
                ['Dhikr', require('./assets/Main-DhikrLow.png'), 'Dhikr', { refreshStatus: () => this._refreshStatus() }],
                ['Qibla', require('./assets/Main-QiblaLow.png'), 'Qibla'],
                ['Settings', require('./assets/Main-SettingLow.png'), 'Setting', { onGoBack: () => this._checkLocaleChange() }],
                ['Help', require('./assets/Main-HelpLow.png'), 'Help', { refreshStatus: () => this._refreshStatus() }],
                [],
              ],
              cols
            ).map((row, i) =>
              <Row style={{ height: cw }} key={i}>
                {row.map((col, i) =>
                  <Col key={i}>
                    {col.length ? <Cell icon={col[1]} caption={I18n.t(col[0])} onPress={() => navigate(col[2], col[3])} /> : null}
                  </Col>
                )}
              </Row>
            )}
          </Content>
          <Footer
            style={{ backgroundColor: 'transparent', height: 120, borderColor: 'transparent', borderWidth: 0, elevation: 0 }}>
            <Image source={require('./assets/footer-bg.png')} style={{ height: 120, width: w.width, resizeMode: 'stretch' }}>
              <RssFeed />
            </Image>
          </Footer>
        </Container>
      </ImageBackground>
    );
  }
}
