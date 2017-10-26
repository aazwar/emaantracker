import Storable from './Storable';
import moment from 'moment';
import { getPrayerTimes } from './Util';

var Notifications = require('react-native-push-notification');

Notifications.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function(token) {
    console.log('TOKEN:', token);
  },

  // (required) Called when a remote or local notification is opened or received
  onNotification: function(notification) {
    console.log('NOTIFICATION:', notification);
  },

  // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
  senderID: 'YOUR GCM SENDER ID',

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
      * (optional) default: true
      * - Specified if permissions (ios) and token (android and ios) will requested or not,
      * - if not, you must call PushNotificationsHandler.requestPermissions() later
      */
  requestPermissions: true,
});

/**
 * Class for handling notification
 * @author roel
 * @version $Rev$
 * @requires OtherClassName
 */

export default class EMNotification extends Storable {
  /**
    Scheduled notification Object:
  {
    id: String,
    date: Date,
    title: String,
    message: String,
    soundName: String,
  }
   */
  scheduled = [];
  repeated = [];

  /**
   * clean expired notifications
   */

  async load() {
    await super.load().then(() => this.clean());
  }

  clean() {
    let now = new Date();
    this.scheduled = this.scheduled.filter(s => s.date > now);
  }

  test() {
    Notifications.localNotificationSchedule({
      id: '124',
      title: 'Test',
      message: 'Test Message',
      date: new Date(Date.now() + 60 * 1000),
      soundName: 'athan.mp3',
    });
  }

  initSchedule() {
    Notifications.cancelAllLocalNotifications();
    this.scheduled = [];
    this.repeated = [];
    const ninePM = moment().set({ hour: 21, minute: 0, second: 0 }).toDate();
    const title = 'Before you sleep';
    const message = `Don't forget to have wudhu, pray witr, and check in your daily activity`;
    Notifications.localNotificationSchedule({
      id: '1',
      title,
      message,
      date: ninePM,
      repeatType: 'day',
    });
    this.repeated.push({
      id: '1',
      date: ninePM,
      repeat: 'day',
      title,
      message,
    });
  }

  schedulePrayerNotification(setting, days) {
    let now = moment();
    let cdate;
    if (this.scheduled.length) {
      cdate = moment(this.scheduled[this.scheduled.length - 1].date).add(1, 'day').set({ hour: 0, minute: 0, second: 0 });
    } else {
      cdate = moment().set({ hour: 0, minute: 0, second: 0 });
    }
    for (let i = 0; i < days; i++) {
      let prayTimes = getPrayerTimes(cdate.toDate(), setting.location, setting.calculationMethod, setting.adjustment);
      prayTimes.splice(1, 1);
      let [date, month, year] = [cdate.get('date'), cdate.get('month'), cdate.get('year')];
      ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((time, i) => {
        prayTimes[i].set({ date, month, year });
        const message = `Assalamu Alaykum Brother/Sister${setting.fullName ? ' ' + setting.fullName : ''},
It's time for ${time} prayer, in order to keep your Emaan Status strong please take time and pray. 

May Allah make us among people of Jannah`;
        const title = `${time} time!`;
        if (prayTimes[i] > now) {
          this.schedule(prayTimes[i].toDate(), title, message, 'athan.mp3');
        }
      });
      cdate.add(1, 'days');
    }
  }

  /**
   * Schedule a notification
   * @param Date date
   * @param notification Notification
   */

  schedule(date, title, message, soundName) {
    const id = `${this.scheduled.length + 1}`;
    Notifications.localNotificationSchedule({
      id,
      date,
      title,
      message,
      soundName,
    });
    this.scheduled.push({ id, date, title, message, soundName });
  }
}
