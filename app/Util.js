import PrayerTimes from 'prayer-times';
import moment from 'moment';

export function getPrayerTimes(date, location, calculationMethod = 'MWL', adjustment = {}) {
  let prayTimes = new PrayerTimes();
  prayTimes.setMethod(calculationMethod);
  let pt = prayTimes.getTimes(date, location, 'auto', 'auto', '24h');

  return ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'].map(t => {
    let time = moment(pt[t], 'HH:mm');
    if (adjustment[t]) {
      time.add(adjustment[t], 'minute');
    }
    return time;
  });
}
