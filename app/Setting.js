import Storable from './Storable';

export default class Setting extends Storable {
  locale = 'en';
  fullName = null;
  email = null;
  token = null;
  fontScale = 1; // between 0.5 - 2
  quranTranslation = false;
  prayer = {
    calculationMethod: 'MWL', // MWL, ISNA, Egypt, Makkah, Karachi, Tehran, Jafari
    adjustment: {
      fajr: 0,
      dhuhr: 0,
      asr: 0,
      maghrib: 0,
      isha: 0,
    },
  };
  location = [-7.470475, 112.440133];
  reverseGeocode = [];
  intro = true;
  status = 2;
  doneDbMigration = false;
}
