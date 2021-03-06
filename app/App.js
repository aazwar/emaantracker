import React from 'react';
import { StyleSheet, Text, View, StatusBar, Platform, AppState } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Geocoder from 'react-native-geocoder';
import FileSystem from 'react-native-fs';

import HomeScreen from './HomeScreen';
import QiblaScreen from './QiblaScreen';
import BookScreen from './BookScreen';
import BookListScreen from './BookListScreen';
import PrayerTimeScreen from './PrayerTimeScreen';
import QuranScreen from './QuranTextScreen';
import MyQuranScreen from './MyQuranScreen';
import ReportScreen from './ReportScreen';
import MyPrayerScreen from './MyPrayerScreen';
import DhikrScreen from './DhikrScreen';
import SettingScreen from './SettingScreen';
import ActivityScreen from './ActivityScreen';
import ChartScreen from './ChartScreen';
import HelpScreen from './HelpScreen';
import ShareScreen from './ShareScreen';
import ManageBookScreen from './ManageBookScreen';

import Constants from './Constants';
import Db from './db';
import Setting from './Setting';
import EMNotification from './EMNotification';
import { getToken } from './Registration';

const AppNavigator = StackNavigator(
  {
    Home: { screen: HomeScreen },
    Qibla: { screen: QiblaScreen },
    Book: { screen: BookScreen },
    BookList: { screen: BookListScreen },
    Quran: { screen: QuranScreen },
    MyQuran: { screen: MyQuranScreen },
    Report: { screen: ReportScreen },
    MyPrayer: { screen: MyPrayerScreen },
    PrayerTime: { screen: PrayerTimeScreen },
    Setting: { screen: SettingScreen },
    Activity: { screen: ActivityScreen },
    Chart: { screen: ChartScreen },
    Dhikr: { screen: DhikrScreen },
    Help: { screen: HelpScreen },
    Share: { screen: ShareScreen },
    ManageBook: { screen: ManageBookScreen },
  },
  {
    ...Platform.select({
      ios: {
        mode: 'modal',
        headerMode: 'float',
      },
      android: {
        mode: 'card',
        headerMode: 'screen',
        cardStyle: {
          paddingTop: StatusBar.currentHeight,
        },
      },
    }),
  }
);

export default class App extends React.Component {
  appState = AppState.currentState;
  state = { ready: false };

  constructor() {
    super();
    this.setting = new Setting();
    this.notification = new EMNotification();
    Promise.all([this.setting.load(), this._checkBook(), this._updateLocation()]).then(() =>
      this.setState({ ready: true }, () => this._checkNotification())
    );
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange.bind(this));
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange.bind(this));
  }

  _handleAppStateChange(nextAppState) {
    if (nextAppState === 'inactive') {
      this.setting.store();
      this.notification.store();
    }
  }

  _updateLocation() {
    //navigator.geolocation.requestAuthorization();
    navigator.geolocation.getCurrentPosition(
      loc => {
        this.setting.location = [loc.coords.latitude, loc.coords.longitude];
        this._checkNotification();
        Geocoder.geocodePosition({ lat: this.setting.location[0], lng: this.setting.location[1] }).then(geo => {
          this.setting.reverseGeocode = geo;
        });
      },
      error => alert(error.message),
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 3600 * 1000 }
    );
  }

  async _checkNotification() {
    let setting = this.setting;
    let db = new Db();
    await db.check();
    if (!setting.doneDbMigration) {
      setTimeout(() => {
        db.migrate();
        setting.doneDbMigration = true;
        setting.store();
      }, 500);
    }

    let status = await db.eman_status();
    let notification = this.notification;
    await notification.load();
    notification.test();
    await notification.initSchedule();
    await notification.schedulePrayerNotification(setting, 3);
  }

  async _checkBook() {
    const bookDir = FileSystem.DocumentDirectoryPath + '/Books';
    if (!await FileSystem.exists(bookDir)) await FileSystem.mkdir(bookDir);
    if (!await FileSystem.exists(`${bookDir}/books.json`)) {
      FileSystem.downloadFile({
        fromUrl: Constants.emaanTrackerUrl + '/book/meta',
        toFile: bookDir + '/books.json',
      });
    }
  }

  render() {
    if (!this.state.ready) return null;

    return (
      <AppNavigator onNavigationStateChange={null} screenProps={{ setting: this.setting }} /> // <----- Here
    );
  }
}
