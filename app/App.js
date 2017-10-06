import React from 'react';
import { StyleSheet, Text, View, StatusBar, Platform, AppState } from 'react-native';
import { StackNavigator } from 'react-navigation';

import HomeScreen from './HomeScreen';
import QiblaScreen from './QiblaScreen';
import SplashScreen from './SplashScreen';
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
    Promise.all([
      this.setting.load().then(() => this._checkNotification()),
      this._checkBook(),
    ]).then(() => this.setState({ ready: true }));
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

  async _checkNotification() {
    const { Permissions } = Expo;
    Permissions.askAsync(Permissions.NOTIFICATIONS);
    let db = new Db();
    db.check();
    let status = await db.eman_status();
    let setting = this.setting;
    let notification = this.notification;
    await notification.load();

    await notification.initSchedule();
    await notification.schedulePrayerNotification(setting, 3);
    
    /*if (!notification.repeated.length) {
      await notification.initSchedule();
    }
    if (notification.scheduled.length < 10) {
      await notification.schedulePrayerNotification(setting, 3);
    }*/
    if (!setting.token) {
      getToken(setting);
    }
  }

  async _checkBook() {
    const bookDir = FileSystem.documentDirectory + 'Books';
    let info = await FileSystem.getInfoAsync(bookDir);
    if (!info.exists) await FileSystem.makeDirectoryAsync(bookDir);
    info = await FileSystem.getInfoAsync(bookDir + '/books.json');
    if (!info.exists) {
      FileSystem.downloadAsync(Constants.emaanTrackerUrl + '/book/meta', bookDir + '/books.json');
    }
  }

  render() {
    if (!this.state.ready) return <Expo.AppLoading />;

    return (
      <AppNavigator onNavigationStateChange={null} screenProps={{ setting: this.setting }} /> // <----- Here
    );
  }
}
