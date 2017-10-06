import Constants from './Constants';

const register = async setting => {
  try {
    let url = Constants.emaanTrackerUrl + encodeURI(`/api/register/new-member?name=${setting.fullName}&email=${setting.email}`);
    let response = await fetch(url);
    let result = await response.json();
    return result.result;
  } catch (e) {
    console.log(e);
  }
};

const getToken = async setting => {
  try {
    let response = await fetch(Constants.emaanTrackerUrl + '/api/register/get-token?email=' + encodeURI(setting.email));
    let result = await response.json();
    switch (result.status) {
      case 'registered':
        setting.token = result.token;
        break;
      default:
        // unconfirmed or unregistered
        break;
    }
  } catch (e) {
    console.log(e);
  }
};

export { register, getToken };
