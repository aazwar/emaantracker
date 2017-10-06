import { AsyncStorage } from 'react-native';

export default class Storable {
  async store() {
    try {
      await AsyncStorage.setItem(`@${this.constructor.name}`, JSON.stringify(this));
    } catch (error) {
      console.log(`AsyncStorage error: ${error}`);
    }
  }

  async load() {
    await AsyncStorage.getItem(`@${this.constructor.name}`).then(json => {
      let obj = JSON.parse(json);
      if (obj) this.assign(obj);
    });
  }

  values() {
    let result = {};
    let self = this;
    Object.keys(self).map(k => (result[k] = self[k]));
    return result;
  }

  assign(obj) {
    let self = this;
    Object.keys(self).map(k => {
      if (!!obj[k] || obj[k] === 0 || obj[k] === false) self[k] = obj[k];
    });
  }
}
