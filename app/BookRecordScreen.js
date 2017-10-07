import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image, AsyncStorage, Alert } from 'react-native';
import { Container, Content, Header, Body, Title, Button, Left, Right } from 'native-base';
import { Icon, Form, Item, Label, Input, ListItem, CheckBox } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import I18n from 'i18n-js';
import Db from './db';
import { MaterialCommunityIcons, Entypo } from './Icons';
import SimpleStepper from 'react-native-simple-stepper';

let w = Dimensions.get('window');

export default class BookRecordScreen extends React.Component {
  static navigationOptions = { header: null };

  constructor() {
    super();
    this.state = {
      id: 0,
      title: '',
      author: '',
      publisher: '',
      pages: '',
      finished: 0,
    };
  }

  async componentWillMount() {
    if (this.props.navigation.state.params.book_id) {
      const { date, book_id } = this.props.navigation.state.params;
      let db = new Db();
      let book = await db.load_book(book_id);
      if (book) this.setState(book);
      let pages = await db.load_reading(date, book_id);
      this.initialValue = pages;
      this.setState({ pages: `${pages}` });
    }
  }

  async _saveRecord() {
    let db = new Db();
    const { date, book_id, onGoBack } = this.props.navigation.state.params;
    await db.store_reading(date, book_id, parseInt(this.state.pages));
    onGoBack();
    this.props.navigation.goBack();
  }

  componentWillUnmount() {}

  render() {
    return (
      <Image source={require('./assets/bg2.jpg')} style={{ flex: 1, width: w.width, resizeMode: 'cover' }}>
        <Container>
          <Header style={{ backgroundColor: '#A9DBDF' }}>
            <Body>
              <Title style={{ width: 250 }}>Record Reading</Title>
            </Body>
            <Right />
          </Header>
          <Content>
            <Form>
              <Item stackedLabel>
                <Label>Book Title</Label>
                <Input onChangeText={title => this.setState({ title })} value={this.state.title} editable={false} />
              </Item>
              <Item stackedLabel last>
                <Label>Pages read this month</Label>
                <Grid>
                  <Col style={{ width: 200 }}>
                    <Input
                      keyboardType="numeric"
                      onChangeText={pages => this.setState({ pages })}
                      value={`${this.state.pages}`}
                    />
                  </Col>
                  <Col style={{ width: 80 }}>
                    <SimpleStepper
                      initialValue={this.initialValue}
                      minimumValue={0}
                      maximumValue={1000}
                      valueChanged={v => this.setState({ pages: `${v}` })}
                    />
                  </Col>
                  <Col />
                </Grid>
              </Item>
              <ListItem style={{ alignItems: 'center' }}>
                <Button iconLeft transparent primary onPress={() => this._saveRecord()}>
                  <MaterialCommunityIcons name="book-plus" size={32} color="#146FD8" />
                  <Text>
                    {I18n.t('Save')}
                  </Text>
                </Button>
                <Button iconLeft transparent onPress={() => this.props.navigation.goBack()}>
                  <Entypo name="circle-with-cross" size={32} color="#146FD8" />
                  <Text>
                    {I18n.t('Cancel')}
                  </Text>
                </Button>
              </ListItem>
            </Form>
          </Content>
        </Container>
      </Image>
    );
  }
}
