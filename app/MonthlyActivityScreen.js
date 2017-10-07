import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import { Container, Content, Header, Body, Title, Button, Left, Right, Icon } from 'native-base';
import { CheckBox, List, ListItem, Separator, Badge } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StackNavigator } from 'react-navigation';
import moment from 'moment';
import hijri from 'moment-hijri';
import Db from './db';
import DateTimePicker from 'react-native-modal-datetime-picker';
import SimpleStepper from 'react-native-simple-stepper';
import I18n from 'i18n-js';
import { FontAwesome, MaterialCommunityIcons } from './Icons';

import Setting from './Setting';
import EditBookScreen from './EditBookScreen';
import ListBookScreen from './ListBookScreen';
import BookRecordScreen from './BookRecordScreen';

const styles = StyleSheet.create({
  sectionHeader: {
    fontWeight: 'bold',
    textShadowColor: 'white',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

class MonthlyActivityScreenRoot extends React.Component {
  static navigationOptions = { header: null };

  constructor() {
    super();
    this.state = {
      date: moment().date(1).toDate(),
      locale: I18n.locale,
      modalVisible: false,
      datePickerVisible: false,
      books: [],
    };
    for (i = 1; i <= 20; i++) {
      this.state[`a${i}`] = false;
    }
  }

  componentWillMount() {
    const { setting } = this.props.screenProps;
    I18n.locale = setting.locale;
    this.setState({ locale: I18n.locale });
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

  _lastMonth() {
    this._storeData();
    var date = moment(this.state.date).subtract(1, 'months').toDate();
    this.setState({ date }, this._loadData);
  }

  _nextMonth() {
    this._storeData();
    var date = moment(this.state.date).add(1, 'months').toDate();
    this.setState({ date }, this._loadData);
  }

  async _loadData() {
    let db = new Db();
    let data = await db.load_monthly_activity_data(moment(this.state.date).format('YYYY-MM-DD'));
    this.setState(data);
    let books = await db.active_book_list(moment(this.state.date).format('YYYY-MM-DD'));
    this.setState({ books });
  }

  _storeData() {
    let db = new Db();
    data = [];
    for (i = 1; i <= 20; i++) data.push(+this.state[`a${i}`]);
    db.store_monthly_activity_data(moment(this.state.date).format('YYYY-MM-DD'), data);
  }

  _flip(s) {
    this.setState({ [s]: !this.state[s] });
  }

  async _update_book_list() {
    let db = new Db();
    let books = await db.active_book_list(moment(this.state.date).format('YYYY-MM-DD'));
    this.setState({ books });
  }

  render() {
    let w = Dimensions.get('window'),
      cw = w.width / 3;
    let listItem = { backgroundColor: 'transparent' };
    return (
      <Image source={require('./assets/bg2.jpg')} style={{ flex: 1, width: w.width, resizeMode: 'cover' }}>
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
                      onPress={this._lastMonth.bind(this)}>
                      <Icon name="arrow-back" />
                    </Button>
                  </Col>
                  <Col size={2} style={{ justifyContent: 'center' }}>
                    <View>
                      <Text style={{ textAlign: 'center', fontWeight: 'bold' }} onPress={this._showDatePicker.bind(this)}>
                        {moment(this.state.date).format('MMMM YYYY')}
                      </Text>
                      <Text style={{ textAlign: 'center' }} onPress={this._showDatePicker.bind(this)}>
                        {hijri(this.state.date).format('iMMMM iYYYY')}
                      </Text>
                    </View>
                  </Col>
                  <Col size={1} style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Button
                      iconRight
                      transparent
                      style={{ height: 28, position: 'absolute', right: 5 }}
                      onPress={this._nextMonth.bind(this)}>
                      <Icon name="arrow-forward" />
                    </Button>
                  </Col>
                </Grid>
              </Row>
            </Grid>
            <List>
              <ListItem icon style={listItem}>
                <Left>
                  <FontAwesome name="group" size={32} color="#146FD8" />
                </Left>
                <Body>
                  <Text style={styles.sectionHeader}>
                    {' '}{I18n.t('bs1')}
                  </Text>
                </Body>
              </ListItem>
              <ListItem style={listItem}>
                <CheckBox checked={Boolean(this.state.a1)} onPress={() => this._flip('a1')} />
                <Body>
                  <Text>
                    {' '}{I18n.t('b1')}{' '}
                  </Text>
                </Body>
              </ListItem>
              <ListItem style={listItem}>
                <CheckBox checked={Boolean(this.state.a2)} onPress={() => this._flip('a2')} />
                <Body>
                  <Text>
                    {' '}{I18n.t('b2')}{' '}
                  </Text>
                </Body>
              </ListItem>
              <ListItem style={listItem}>
                <CheckBox checked={Boolean(this.state.a3)} onPress={() => this._flip('a3')} />
                <Body>
                  <Text>
                    {' '}{I18n.t('b3')}{' '}
                  </Text>
                </Body>
              </ListItem>
              <ListItem icon style={listItem}>
                <Left>
                  <MaterialCommunityIcons name="human-greeting" size={32} color="#146FD8" />
                </Left>
                <Body>
                  <Text style={styles.sectionHeader}>
                    {' '}{I18n.t('bs2')}
                  </Text>
                </Body>
              </ListItem>
              <ListItem style={listItem}>
                <CheckBox checked={Boolean(this.state.a4)} onPress={() => this._flip('a4')} />
                <Body>
                  <Text>
                    {' '}{I18n.t('b4')}{' '}
                  </Text>
                </Body>
              </ListItem>
              <ListItem style={listItem}>
                <CheckBox checked={Boolean(this.state.a5)} onPress={() => this._flip('a5')} />
                <Body>
                  <Text>
                    {' '}{I18n.t('b5')}{' '}
                  </Text>
                </Body>
              </ListItem>
              <ListItem style={listItem}>
                <CheckBox checked={Boolean(this.state.a6)} onPress={() => this._flip('a6')} />
                <Body>
                  <Text>
                    {' '}{I18n.t('b6')}{' '}
                  </Text>
                </Body>
              </ListItem>
              <ListItem style={listItem}>
                <CheckBox checked={Boolean(this.state.a7)} onPress={() => this._flip('a7')} />
                <Body>
                  <Text>
                    {' '}{I18n.t('b7')}{' '}
                  </Text>
                </Body>
              </ListItem>
              <ListItem icon style={listItem}>
                <Left>
                  <FontAwesome name="dollar" size={32} color="#146FD8" />
                </Left>
                <Body>
                  <Text style={styles.sectionHeader}>
                    {' '}{I18n.t('bs3')}
                  </Text>
                </Body>
              </ListItem>
              <ListItem style={listItem}>
                <CheckBox checked={Boolean(this.state.a8)} onPress={() => this._flip('a8')} />
                <Body>
                  <Text>
                    {' '}{I18n.t('b8')}{' '}
                  </Text>
                </Body>
              </ListItem>
              <ListItem style={listItem}>
                <CheckBox checked={Boolean(this.state.a9)} onPress={() => this._flip('a9')} />
                <Body>
                  <Text>
                    {' '}{I18n.t('b9')}{' '}
                  </Text>
                </Body>
              </ListItem>
              <ListItem style={listItem}>
                <CheckBox checked={Boolean(this.state.a10)} onPress={() => this._flip('a10')} />
                <Body>
                  <Text>
                    {' '}{I18n.t('b10')}{' '}
                  </Text>
                </Body>
              </ListItem>
              <ListItem icon style={listItem}>
                <Left>
                  <MaterialCommunityIcons name="book-open-page-variant" size={32} color="#146FD8" />
                </Left>
                <Body>
                  <Text style={styles.sectionHeader}>
                    {' '}{I18n.t('bs4')}
                  </Text>
                </Body>
              </ListItem>
              <List
                dataArray={this.state.books}
                renderRow={book =>
                  <ListItem icon style={listItem}>
                    <Left>
                      <MaterialCommunityIcons name="book-open" color="#146FD8" />
                    </Left>
                    <Body>
                      <Text>
                        {book.title}
                      </Text>
                    </Body>
                    <Right>
                      <Badge success>
                        <Text>
                          {book.pages}p
                        </Text>
                      </Badge>
                      <Icon
                        name="arrow-forward"
                        onPress={() =>
                          this.props.navigation.navigate('Record', {
                            book_id: book.id,
                            date: moment(this.state.date).format('YYYY-MM-DD'),
                            onGoBack: () => this._update_book_list(),
                          })}
                      />
                    </Right>
                  </ListItem>}
              />
              <ListItem style={listItem}>
                <Button
                  iconLeft
                  transparent
                  bordered
                  onPress={() =>
                    this.props.navigation.navigate('Register', {
                      book_id: 0,
                      onGoBack: () => this._update_book_list(),
                    })}>
                  <MaterialCommunityIcons name="book-plus" size={32} color="#146FD8" />
                  <Text>
                    {I18n.t('b11')}
                  </Text>
                </Button>
                <Button transparent>
                  <Text> </Text>
                </Button>
                <Button
                  iconLeft
                  transparent
                  bordered
                  onPress={() =>
                    this.props.navigation.navigate('List', {
                      onGoBack: () => this._update_book_list(),
                    })}>
                  <FontAwesome name="list" size={32} color="#146FD8" />
                  <Text>
                    {' '}{I18n.t('b12')}
                  </Text>
                </Button>
              </ListItem>
            </List>
          </Content>
        </Container>
      </Image>
    );
  }
}

const AppNavigator = StackNavigator({
  Root: { screen: MonthlyActivityScreenRoot },
  Register: { screen: EditBookScreen },
  Edit: { screen: EditBookScreen },
  List: { screen: ListBookScreen },
  Record: { screen: BookRecordScreen },
});

export default class MonthlyActivityScreen extends React.Component {
  state = { ready: false };

  constructor() {
    super();
    this.setting = new Setting();
    Promise.all([this.setting.load()]).then(() => this.setState({ ready: true }));
  }

  render() {
    if (!this.state.ready) return <Expo.AppLoading />;

    return (
      <AppNavigator onNavigationStateChange={null} screenProps={{ setting: this.setting }} /> // <----- Here
    );
  }
}
