import React from 'react';
import { StyleSheet, Text, View, Slider, Image, Dimensions, Alert } from 'react-native';
import { Container, Content, Header, Body, Title, Button, Left, Right, Icon } from 'native-base';
import { Item, Label, Input } from 'native-base';
import { CheckBox, List, ListItem, Separator } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Stepper from 'react-native-simple-stepper';
import PrayerTimes from 'prayer-times';
import moment from 'moment';
import I18n from 'i18n-js';

import { CheckBox as ETCheckBox } from './ETComponents';
import Constants from './Constants';

export default class SettingScreen extends React.Component {
  static navigationOptions = { header: null };
  state = {
    fontScale: 1,
    prayTimes: ['04:00', '06:00', '12:00', '15:00', '18:00', '19:00'],
    token: null,
    email: null,
    fullName: null,
  };

  componentWillMount() {
    const { setting } = this.props.screenProps;
    this.setState(setting.values());
    I18n.locale = setting.locale;
  }

  componentDidMount() {
    this._updatePrayerTimes();
  }

  componentWillUnmount() {
    const { setting } = this.props.screenProps;
    setting.assign(this.state);
    setting.store();
  }

  _changeLocale(locale) {
    const { setting } = this.props.screenProps;
    this.setState({ locale });
    setting.locale = locale;
    I18n.locale = locale;
    setting.store();
  }

  _valueChange(time, value) {
    let prayer = this.state.prayer;
    prayer.adjustment[time] = value;
    this.setState({ prayer }, () => this._updatePrayerTimes());
  }

  _updatePrayerTimes() {
    let { setting } = this.props.screenProps;
    let prayTimes = new PrayerTimes();
    prayTimes.setMethod(this.state.prayer.calculationMethod);
    let adjustment = {};
    let pt = prayTimes.getTimes(new Date(), setting.location, 'auto', 'auto', '24h');
    let prayTimesText = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'].map((t, i) => {
      let time = moment(pt[t], 'HH:mm');
      if (this.state.prayer.adjustment[t]) {
        time.add(this.state.prayer.adjustment[t], 'minute');
      }
      return time;
    });
    this.setState({ prayTimes: prayTimesText });
  }

  async _getToken() {
    let { setting } = this.props.screenProps;
    try {
      let response = await fetch(Constants.emaanTrackerUrl + '/api/register/get-token?email=' + encodeURI(this.state.email));
      let result = await response.json();
      switch (result.status) {
        case 'registered':
          setting.token = result.token;
          Alert.alert('Success', 'Email Registered.', [{ text: 'OK', onPress: () => this.forceUpdate() }], { cancelable: false });
          break;
        case 'unconfirmed':
          Alert.alert('Error', result.message, [{ text: 'OK' }], { cancelable: false });
          break;
        default:
          Alert.alert(
            'Error',
            result.message,
            [
              {
                text: 'Yes',
                onPress: async () => {
                  let url =
                    Constants.emaanTrackerUrl +
                    encodeURI(`/api/register/new-member?name=${this.state.fullName}&email=${this.state.email}`);
                  let response = await fetch(url);
                  let result = await response.json();
                  let r = result.result;
                  Alert.alert(r.charAt(0).toUpperCase() + r.slice(1), result.message, [{ text: 'OK' }], { cancelable: false });
                },
              },
              { text: 'No' },
            ],
            { cancelable: false }
          );
      }
    } catch (e) {
      console.log(e);
      Alert.alert('Error', "Can't verify email. Make sure that you're connected to the internet", [{ text: 'OK' }], {
        cancelable: false,
      });
    }
  }

  render() {
    let { setting } = this.props.screenProps;
    const { navigate } = this.props.navigation;
    let w = Dimensions.get('window');
    const styles = StyleSheet.create({
      section: I18n.isRTL() ? { textAlign: 'right', marginRight: 10 } : { textAlign: 'left' },
      text: { textAlign: I18n.isRTL() ? 'right' : 'left' },
      label: { alignSelf: I18n.isRTL() ? 'flex-end' : 'flex-start' },
    });
    let textDirStyle = { textAlign: I18n.isRTL() ? 'right' : 'left' };
    let listItem = { backgroundColor: 'transparent' };
    return (
      <Image source={require('./assets/bg2.jpg')} style={{ flex: 1, width: w.width, resizeMode: 'cover' }}>
        <Container>
          <Header style={{ backgroundColor: '#A9DBDF' }}>
            <Left>
              <Button
                transparent
                onPress={() => {
                  this.props.navigation.state.params.onGoBack();
                  this.props.navigation.goBack();
                }}>
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Title style={{ width: 250 }}>
                {I18n.t('Settings')}
              </Title>
            </Body>
            <Right />
          </Header>
          <Content>
            <Separator bordered>
              <Text style={styles.section}>
                {I18n.t('Language')}
              </Text>
            </Separator>
            <ListItem style={listItem}>
              <CheckBox checked={this.state.locale === 'en'} onPress={() => this._changeLocale('en')} />
              <Body>
                <Text> 🇺🇸 English</Text>
              </Body>
            </ListItem>
            <ListItem style={listItem}>
              <CheckBox checked={this.state.locale === 'id'} onPress={() => this._changeLocale('id')} />
              <Body>
                <Text> 🇮🇩 Indonesia</Text>
              </Body>
            </ListItem>
            <ListItem style={listItem}>
              <CheckBox checked={this.state.locale === 'ar'} onPress={() => this._changeLocale('ar')} />
              <Body>
                <Text> 🇸🇦 عربية</Text>
              </Body>
            </ListItem>
            <ListItem style={listItem}>
              <CheckBox checked={this.state.locale === 'ur'} onPress={() => this._changeLocale('ur')} />
              <Body>
                <Text> 🇵🇰 اُردُو‎</Text>
              </Body>
            </ListItem>
            <Separator bordered>
              <Text style={styles.section}>
                {I18n.t('pinfo')}
              </Text>
            </Separator>
            <ListItem style={listItem}>
              <Item stackedLabel style={{ flex: 1 }}>
                <Label style={styles.label}>
                  {I18n.t('Full Name')}
                </Label>
                <Input
                  style={styles.text}
                  placeholder={I18n.t('Full Name Desc')}
                  onChangeText={fullName => this.setState({ fullName })}
                  value={this.state.fullName}
                  autoCorrect={false}
                  autoCapitalize="words"
                />
              </Item>
            </ListItem>
            <ListItem style={listItem}>
              <Item stackedLabel style={{ flex: 1 }}>
                <Label style={styles.label}>
                  {I18n.t('Email')}
                </Label>
                <Input
                  style={styles.text}
                  placeholder={I18n.t('Email Desc')}
                  onChangeText={email => this.setState({ email })}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoCorrect={false}
                  editable={!setting.token}
                  value={this.state.email}
                />
              </Item>
            </ListItem>

            {!setting.token &&
              <ListItem style={listItem}>
                <Grid>
                  <Row>
                    <Button primary onPress={() => this._getToken()}>
                      <Text>Register Email</Text>
                    </Button>
                  </Row>
                  <Row>
                    <Text style={{ fontStyle: 'italic' }}>
                      By registering email, you can synchronize your data to our server.
                    </Text>
                  </Row>
                </Grid>
              </ListItem>}

            <Separator bordered>
              <Text style={styles.section}>
                {I18n.t('Quran')}
              </Text>
            </Separator>
            <ListItem style={listItem}>
              <Body>
                <Text
                  style={{
                    textAlign: 'right',
                    marginBottom: 5,
                    fontFamily: 'quran',
                    fontSize: 24 * this.state.fontScale,
                  }}>
                  {'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'}
                </Text>
                <Text
                  style={{
                    marginBottom: 5,
                    fontSize: 14 * this.state.fontScale,
                  }}>
                  {'In the name of Allah, the Entirely Merciful, the Especially Merciful.'}
                </Text>
              </Body>
            </ListItem>
            <ListItem style={listItem}>
              <Body>
                <Slider
                  minimumValue={0.5}
                  maximumValue={2}
                  onValueChange={value => this.setState({ fontScale: value })}
                  value={this.state.fontScale}
                />
              </Body>
            </ListItem>
            <Separator bordered>
              <Text>Prayer Time</Text>
            </Separator>
            <ListItem style={listItem}>
              <Grid>
                <Row>
                  <Text>Calculation Method</Text>
                </Row>
                {[
                  ['MWL', 'Muslim World League'],
                  ['ISNA', 'Islamic Society of North America'],
                  ['Egypt', 'Egyptian General Authority of Survey'],
                  ['Makkah', 'Umm Al-Qura University, Makkah'],
                  ['Karachi', 'University of Islamic Sciences, Karachi'],
                  ['Tehran', 'Institute of Geophysics, University of Tehran'],
                  ['Jafari', 'Shia Ithna Ashari (Ja`fari)'],
                ].map(method => {
                  return (
                    <Row key={method[0]} style={{ alignItems: 'center' }}>
                      <Col style={{ width: 28 }}>
                        <ETCheckBox
                          checked={this.state.prayer.calculationMethod == method[0]}
                          size={24}
                          onPress={() => {
                            let prayer = this.state.prayer;
                            prayer.calculationMethod = method[0];
                            this.setState({ prayer }, () => this._updatePrayerTimes());
                          }}
                        />
                      </Col>
                      <Col>
                        <Text>
                          {method[1]}
                        </Text>
                      </Col>
                    </Row>
                  );
                })}
              </Grid>
            </ListItem>
            <ListItem style={listItem}>
              <Grid>
                {['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((time, i) =>
                  <Col key={time}>
                    <Text style={{ textAlign: 'center' }}>
                      {time}
                      {'\n'}
                      {this.state.prayTimes[i].format('HH:mm')}
                    </Text>
                  </Col>
                )}
              </Grid>
            </ListItem>
            <ListItem style={listItem}>
              <Grid>
                <Row>
                  <Text>
                    Manual Adjustment (in minutes){'\n'}
                  </Text>
                </Row>
                <Row>
                  <Col>
                    <TimeAdjustment
                      time="Fajr"
                      value={this.state.prayer.adjustment.fajr}
                      onChange={this._valueChange.bind(this)}
                    />
                  </Col>
                  <Col>
                    <TimeAdjustment
                      time="Dhuhr"
                      value={this.state.prayer.adjustment.dhuhr}
                      onChange={this._valueChange.bind(this)}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <TimeAdjustment time="Asr" value={this.state.prayer.adjustment.asr} onChange={this._valueChange.bind(this)} />
                  </Col>
                  <Col>
                    <TimeAdjustment
                      time="Maghrib"
                      value={this.state.prayer.adjustment.maghrib}
                      onChange={this._valueChange.bind(this)}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <TimeAdjustment
                      time="Isha"
                      value={this.state.prayer.adjustment.isha}
                      onChange={this._valueChange.bind(this)}
                    />
                  </Col>
                  <Col />
                </Row>
              </Grid>
            </ListItem>
          </Content>
        </Container>
      </Image>
    );
  }
}

class TimeAdjustment extends React.Component {
  render() {
    let { time, value, onChange } = this.props;
    if (isNaN(value)) value = 0;
    return (
      <Grid style={{ paddingBottom: 5, alignItems: 'center' }}>
        <Col style={{ paddingRight: 10 }}>
          <Text style={{ textAlign: 'right' }}>
            {time}: {value}
          </Text>
        </Col>
        <Col>
          <Stepper
            style={{ width: 48, height: 24 }}
            imageWidth={24}
            imageHeight={24}
            tintColor="black"
            minimumValue={-30}
            maximumValue={30}
            initialValue={value}
            valueChanged={value => onChange(time.toLowerCase(), value)}
          />
        </Col>
      </Grid>
    );
  }
}
