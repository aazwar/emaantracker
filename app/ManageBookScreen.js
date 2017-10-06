import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image, Alert } from 'react-native';
import { Container, Content, Header, Body, Title, Button, Left, Right, Icon } from 'native-base';
import { CheckBox, List, ListItem, Separator, Badge } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Db from './db';
import I18n from 'i18n-js';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { FileSystem } from 'expo';

let w = Dimensions.get('window');

export default class ManageBookScreen extends React.Component {
  static navigationOptions = { header: null };

  constructor() {
    super();
    this.state = {
      books: [],
    };
  }

  async _update_book_list() {}

  componentWillMount() {
    FileSystem.readAsStringAsync(FileSystem.documentDirectory + 'Books/books.json').then(async content => {
      let books = JSON.parse(content);
      let downloaded = [];
      Promise.all(
        books.map(async book => {
          let info = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'Books/' + encodeURIComponent(book.file));
          if (info.exists && book.title) {
            downloaded.push(book);
          }
        })
      ).then(() => this.setState({ books: downloaded }));
    });
  }

  render() {
    return (
      <Image source={require('./assets/bg2.jpg')} style={{ flex: 1, width: w.width, resizeMode: 'cover' }}>
        <Container>
          <Header style={{ backgroundColor: '#A9DBDF',}}>
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
              <Title style={{ width: 250 }}>Downloaded</Title>
            </Body>
            <Right />
          </Header>
          <Content>
            <List
              dataArray={this.state.books}
              renderRow={book =>
                <ListItem icon>
                  <Left>
                    <MaterialCommunityIcons name="book-open" color="#146FD8" />
                  </Left>
                  <Body>
                    <Text>
                      {book.title}
                    </Text>
                  </Body>
                  <Right>
                    <Icon
                      name="ios-trash"
                      onPress={() => {
                        Alert.alert(
                          'Remove Downloaded Book',
                          `Delete book:\n${book.title}?`,
                          [
                            {
                              text: 'OK',
                              onPress: () => {
                                FileSystem.deleteAsync(
                                  FileSystem.documentDirectory + 'Books/' + encodeURIComponent(book.file)
                                ).then(() => {
                                  let remining = this.state.books.filter(b => b.id != book.id);
                                  this.setState({ books: remining });
                                });
                              },
                            },
                            { text: 'Cancel' },
                          ],
                          { cancelable: false }
                        );
                      }}
                    />
                  </Right>
                </ListItem>}
            />
          </Content>
        </Container>
      </Image>
    );
  }
}
