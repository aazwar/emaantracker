import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image, ImageBackground } from 'react-native';
import { Container, Content, Header, Body, Title, Button, Left, Right, Icon } from 'native-base';
import { CheckBox, List, ListItem, Separator } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import moment from 'moment';
import hijri from 'moment-hijri';
import Db from './db';
import DateTimePicker from 'react-native-modal-datetime-picker';

import Setting from './Setting';
import I18n from 'i18n-js';
import { Ionicons, Foundation, Octicons } from './Icons';

const styles = StyleSheet.create({
  sectionHeader: {
    fontWeight: 'bold',
    textShadowColor: 'white',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  sectionFooter: {
    fontStyle: 'italic',
    textShadowColor: 'grey',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default class DailyActivityScreen extends React.Component {
  static navigationOptions = { header: null };

  constructor() {
    super();
    this.state = {
      date: new Date(),
      locale: I18n.locale,
      datePickerVisible: false,
    };
    for (i = 1; i <= 20; i++) {
      this.state[`a${i}`] = false;
    }
  }

  async componentWillMount() {
    const setting = new Setting();
    setting.load().then(() => {
      I18n.locale = setting.locale;
      this.setState({ locale: I18n.locale });
    });
  }

  componentDidMount() {
    this._loadData();
  }

  componentWillUnmount() {
    this._storeData();
  }

  _datePicked(date) {
    this.setState({ date }, this._loadData);
    this._hideDatePicker();
  }

  _hideDatePicker() {
    this.setState({ datePickerVisible: false });
  }

  _showDatePicker() {
    this.setState({ datePickerVisible: true });
  }

  _yesterday() {
    this._storeData();
    var date = moment(this.state.date).subtract(1, 'days').toDate();
    this.setState({ date }, this._loadData);
  }

  _tomorrow() {
    this._storeData();
    var date = moment(this.state.date).add(1, 'days').toDate();
    this.setState({ date }, this._loadData);
  }

  async _loadData() {
    let db = new Db();
    let data = await db.load_daily_activity_data(moment(this.state.date).format('YYYY-MM-DD'));
    this.setState(data);
  }

  _storeData() {
    let db = new Db();
    data = [];
    for (i = 1; i <= 20; i++) data.push(this.state[`a${i}`] | 0);
    db.store_daily_activity_data(moment(this.state.date).format('YYYY-MM-DD'), data);
  }

  _flip(a) {
    this.setState({ [a]: !this.state[a] });
  }

  render() {
    let w = Dimensions.get('window'),
      cw = w.width / 3;
    let listItem = { backgroundColor: 'transparent' };
    return (
      <ImageBackground source={require('./assets/bg2.jpg')} style={{ flex: 1, width: w.width }}>
        <Container>
          <DateTimePicker
            isVisible={this.state.datePickerVisible}
            onConfirm={this._datePicked.bind(this)}
            onCancel={this._hideDatePicker.bind(this)}
          />
          <Content>
            <Grid>
              <Row style={{ height: 44, justifyContent: 'center' }}>
                <Grid style={{ backgroundColor: 'white', opacity: 0.6, flex: 1 }}>
                  <Col size={1} style={{ justifyContent: 'center' }}>
                    <Button
                      iconLeft
                      transparent
                      style={{ height: 28, position: 'absolute', left: 5 }}
                      onPress={this._yesterday.bind(this)}>
                      <Icon name="arrow-back" />
                    </Button>
                  </Col>
                  <Col size={2} style={{ justifyContent: 'center' }}>
                    <View>
                      <Text style={{ textAlign: 'center', fontWeight: 'bold' }} onPress={this._showDatePicker.bind(this)}>
                        {moment(this.state.date).format('D MMMM, YYYY')}
                      </Text>
                      <Text style={{ textAlign: 'center' }} onPress={this._showDatePicker.bind(this)}>
                        {hijri(this.state.date).format('iD iMMMM, iYYYY')}
                      </Text>
                    </View>
                  </Col>
                  <Col size={1} style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Button
                      iconRight
                      transparent
                      style={{ height: 28, position: 'absolute', right: 5 }}
                      onPress={this._tomorrow.bind(this)}>
                      <Icon name="arrow-forward" />
                    </Button>
                  </Col>
                </Grid>
              </Row>
            </Grid>
            <List>
              <ListItem icon style={listItem}>
                <Left>
                  <Ionicons name="ios-cloudy-night" size={32} color="#146FD8" />
                </Left>
                <Body>
                  <Text style={styles.sectionHeader}>
                    {' '}{I18n.t('as1')}
                  </Text>
                </Body>
              </ListItem>
              <ListItem style={listItem}>
                <CheckBox checked={Boolean(this.state.a1)} onPress={() => this._flip('a1')} />
                <Body>
                  <Text>
                    {' '}{I18n.t('a1')}{' '}
                  </Text>
                </Body>
              </ListItem>
              <ListItem style={listItem}>
                <CheckBox checked={Boolean(this.state.a2)} onPress={() => this._flip('a2')} />
                <Body>
                  <Text>
                    {' '}{I18n.t('a2')}{' '}
                  </Text>
                </Body>
              </ListItem>
              <ListItem style={listItem}>
                <CheckBox checked={Boolean(this.state.a3)} onPress={() => this._flip('a3')} />
                <Body>
                  <Text>
                    {' '}{I18n.t('a3')}{' '}
                  </Text>
                </Body>
              </ListItem>
              <ListItem style={listItem}>
                <CheckBox checked={Boolean(this.state.a4)} onPress={() => this._flip('a4')} />
                <Body>
                  <Text>
                    {' '}{I18n.t('a4')}{' '}
                  </Text>
                </Body>
              </ListItem>
              <ListItem style={listItem}>
                <CheckBox checked={Boolean(this.state.a5)} onPress={() => this._flip('a5')} />
                <Body>
                  <Text>
                    {' '}{I18n.t('a5')}{' '}
                  </Text>
                </Body>
              </ListItem>
              <ListItem style={listItem}>
                <Body>
                  <Text style={styles.sectionFooter}>
                    {I18n.t('as1t')}
                  </Text>
                </Body>
              </ListItem>
              <ListItem icon style={listItem}>
                <Left>
                  <Octicons name="note" size={32} color="#146FD8" />
                </Left>
                <Body>
                  <Text style={styles.sectionHeader}>
                    {' '}{I18n.t('as2')}
                  </Text>
                </Body>
              </ListItem>
              <ListItem style={listItem}>
                <CheckBox checked={Boolean(this.state.a6)} onPress={() => this._flip('a6')} />
                <Body>
                  <Text>
                    {' '}{I18n.t('a6')}{' '}
                  </Text>
                </Body>
              </ListItem>
              <ListItem style={listItem}>
                <CheckBox checked={Boolean(this.state.a7)} onPress={() => this._flip('a7')} />
                <Body>
                  <Text>
                    {' '}{I18n.t('a7')}{' '}
                  </Text>
                </Body>
              </ListItem>
              <ListItem style={listItem}>
                <CheckBox checked={Boolean(this.state.a8)} onPress={() => this._flip('a8')} />
                <Body>
                  <Text>
                    {' '}{I18n.t('a8')}{' '}
                  </Text>
                </Body>
              </ListItem>
              <ListItem style={listItem}>
                <CheckBox checked={Boolean(this.state.a9)} onPress={() => this._flip('a9')} />
                <Body>
                  <Text>
                    {' '}{I18n.t('a9')}{' '}
                  </Text>
                </Body>
              </ListItem>
              <ListItem style={listItem}>
                <CheckBox checked={Boolean(this.state.a10)} onPress={() => this._flip('a10')} />
                <Body>
                  <Text>
                    {' '}{I18n.t('a10')}{' '}
                  </Text>
                </Body>
              </ListItem>
              <ListItem style={listItem}>
                <Body>
                  <Text style={styles.sectionFooter}>
                    {I18n.t('as2t')}
                  </Text>
                </Body>
              </ListItem>
              <ListItem icon style={listItem}>
                <Left>
                  <Foundation name="die-four" size={32} color="#146FD8" />
                </Left>
                <Body>
                  <Text style={styles.sectionHeader}>
                    {' '}{I18n.t('as3')}
                  </Text>
                </Body>
              </ListItem>
              <ListItem style={listItem}>
                <CheckBox checked={Boolean(this.state.a11)} onPress={() => this._flip('a11')} />
                <Body>
                  <Text>
                    {' '}{I18n.t('a11')}{' '}
                  </Text>
                </Body>
              </ListItem>
              <ListItem style={listItem}>
                <CheckBox checked={Boolean(this.state.a12)} onPress={() => this._flip('a12')} />
                <Body>
                  <Text>
                    {' '}{I18n.t('a12')}{' '}
                  </Text>
                </Body>
              </ListItem>
              <ListItem style={listItem}>
                <CheckBox checked={Boolean(this.state.a13)} onPress={() => this._flip('a13')} />
                <Body>
                  <Text>
                    {' '}{I18n.t('a13')}{' '}
                  </Text>
                </Body>
              </ListItem>
              <ListItem style={listItem}>
                <CheckBox checked={Boolean(this.state.a14)} onPress={() => this._flip('a14')} />
                <Body>
                  <Text>
                    {' '}{I18n.t('a14')}{' '}
                  </Text>
                </Body>
              </ListItem>
              <ListItem style={listItem}>
                <Body>
                  <Text style={styles.sectionFooter}>
                    {I18n.t('as3t')}
                  </Text>
                </Body>
              </ListItem>
            </List>
          </Content>
        </Container>
      </ImageBackground>
    );
  }
}
