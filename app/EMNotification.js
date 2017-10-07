import Storable from './Storable';
import moment from 'moment';
import { getPrayerTimes } from './Util';

var Notifications = require('react-native-push-notification');

Notifications.configure({

    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function(token) {
        console.log( 'TOKEN:', token );
    },

    // (required) Called when a remote or local notification is opened or received
    onNotification: function(notification) {
        console.log( 'NOTIFICATION:', notification );
    },

    // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
    senderID: "YOUR GCM SENDER ID",

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
        alert: true,
        badge: true,
        sound: true
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
    fireDate: Date
    notification: {
      title: String,
      body: String,
      data: String
    },
    notificationId
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
    this.scheduled = this.scheduled.filter(s => s.fireDate > now);
  }

  async initSchedule() {
    await Notifications.cancelAllScheduledNotificationsAsync();
    this.scheduled = [];
    this.repeated = [];
    const ninePM = moment().set({ hour: 21, minute: 0, second: 0 }).toDate();
    const title = 'Before you sleep';
    const body = `Don't forget to have wudhu, pray witr, and check in your daily activity`;
    const notification = {
      title,
      body,
      data: ['check-in', title, body],
    };
    const notificationId = await Notifications.scheduleLocalNotificationAsync(notification, { time: ninePM, repeat: 'day' });
    this.repeated.push({
      fireDate: ninePM,
      repeat: 'day',
      notification,
      notificationId,
    });
  }

  schedulePrayerNotification(setting, days) {
    let now = moment();
    let cdate;
    if (this.scheduled.length) {
      cdate = moment(this.scheduled[this.scheduled.length - 1].fireDate).add(1, 'day').set({ hour: 0, minute: 0, second: 0 });
    } else {
      cdate = moment().set({ hour: 0, minute: 0, second: 0 });
    }
    for (let i = 0; i < days; i++) {
      let prayTimes = getPrayerTimes(cdate.toDate(), setting.location, setting.calculationMethod, setting.adjustment);
      prayTimes.splice(1, 1);
      let [date, month, year] = [cdate.get('date'), cdate.get('month'), cdate.get('year')];
      ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((time, i) => {
        prayTimes[i].set({ date, month, year });
        let body = `Assalamu Alaykum Brother/Sister${setting.fullName ? ' ' + setting.fullName : ''},
It's time for ${time} prayer, in order to keep your Emaan Status strong please take time and pray. 

May Allah make us among people of Jannah`;
        const title = `${time} time!`;
        const notification = {
          title,
          body,
          data: ['reminder', title, body],
        };
        if (prayTimes[i] > now) {
          this.schedule(prayTimes[i].toDate(), notification);
        }
      });
      cdate.add(1, 'days');
    }
  }

  /**
   * Schedule a notification
   * @param Date fireDate
   * @param notification Notification
   */

  async schedule(fireDate, notification) {
    const notificationId = await Notifications.scheduleLocalNotificationAsync(notification, { time: fireDate });
    this.scheduled.push({ fireDate, notification, notificationId });
  }
}
