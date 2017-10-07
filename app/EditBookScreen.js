import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image, AsyncStorage, Alert, Platform } from 'react-native';
import { Container, Content, Header, Body, Title, Button, Left, Right } from 'native-base';
import { Icon, Form, Item, Label, Input, ListItem, CheckBox } from 'native-base';
import I18n from 'i18n-js';
import Db from './db';
import { MaterialCommunityIcons, Entypo } from './Icons';

let w = Dimensions.get('window');

export default class EditBookScreen extends React.Component {
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
      let db = new Db();
      let book = await db.load_book(this.props.navigation.state.params.book_id);
      if (book) this.setState(book);
    }
  }

  _saveBook() {
    let db = new Db();
    db.store_book(this.state);
    this.props.navigation.state.params.onGoBack();
    this.props.navigation.goBack();
  }

  _askDeleteBook() {
    Alert.alert('Delete Book', `Delete book "${this.state.title}"?\nAll reading data will be removed!`, [
      { text: I18n.t('Delete'), onPress: () => this._deleteBook() },
      { text: I18n.t('Cancel') },
    ]);
  }

  _deleteBook() {
    let db = new Db();
    db.delete_book(this.state.id);
    this.props.navigation.state.params.onGoBack();
    this.props.navigation.goBack();
  }

  componentWillUnmount() {}

  render() {
    let style = StyleSheet.create({
      input: { marginLeft: 0 },
    });
    return (
      <Image source={require('./assets/bg2.jpg')} style={{ flex: 1, width: w.width, resizeMode: 'cover' }}>
        <Container>
          <Header style={{ backgroundColor: '#A9DBDF' }}>
            <Left>
              <Button
                transparent
                onPress={() => {
                  this.props.navigation.goBack();
                }}>
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Title style={{ width: 250 }}>
                {this.props.navigation.state.params.book_id ? I18n.t('b11a') : I18n.t('b11')}
              </Title>
            </Body>
            <Right />
          </Header>
          <Content>
            <Form>
              <Item stackedLabel>
                <Label>Book Title</Label>
                <Input style={style.input} onChangeText={title => this.setState({ title })} value={this.state.title} />
              </Item>
              <Item stackedLabel>
                <Label>Author</Label>
                <Input style={style.input} onChangeText={author => this.setState({ author })} value={this.state.author} />
              </Item>
              <Item stackedLabel>
                <Label>Publisher</Label>
                <Input
                  style={style.input}
                  onChangeText={publisher => this.setState({ publisher })}
                  value={this.state.publisher}
                />
              </Item>
              <Item stackedLabel>
                <Label>Number of Pages</Label>
                <Input keyboardType="numeric" onChangeText={pages => this.setState({ pages })} value={`${this.state.pages}`} />
              </Item>
              <ListItem>
                <CheckBox
                  checked={Boolean(this.state.finished)}
                  onPress={() => this.setState({ finished: +!this.state.finished })}
                />
                <Body>
                  <Text> Finished reading this book</Text>
                </Body>
              </ListItem>
              <ListItem style={{ alignItems: 'center' }}>
                <Button iconLeft transparent primary onPress={() => this._saveBook()}>
                  <MaterialCommunityIcons name="book-plus" size={32} color="#146FD8" />
                  <Text>
                    {I18n.t('Save')}
                  </Text>
                </Button>
                {this.props.navigation.state.params.book_id
                  ? <Button iconLeft transparent onPress={() => this._askDeleteBook()}>
                      <MaterialCommunityIcons name="playlist-remove" size={32} color="#146FD8" />
                      <Text>
                        {I18n.t('Delete')}
                      </Text>
                    </Button>
                  : null}
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
