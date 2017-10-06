import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image, AsyncStorage } from 'react-native';
import { Container, Content, Header, Body, Title, Button, Left, Right, Icon } from 'native-base';
import { CheckBox, List, ListItem, Separator, Badge } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Db from './db';
import I18n from 'i18n-js';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

let w = Dimensions.get('window');

export default class ListBookScreen extends React.Component {
  static navigationOptions = { header: null };

  constructor() {
    super();
    this.state = {
      books: [],
    };
  }

  async _update_book_list() {
    let db = new Db();
    let books = await db.book_list();
    this.setState({ books });
  }

  componentWillMount() {
    this._update_book_list();
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
                  this.props.navigation.state.params.onGoBack();
                  this.props.navigation.goBack();
                }}>
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Title style={{ width: 250 }}>
                {I18n.t('b12')}
              </Title>
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
                    {book.finished
                      ? <Badge success>
                          <Text>Finished</Text>
                        </Badge>
                      : <Badge info>
                          <Text>Reading</Text>
                        </Badge>}

                    <Icon
                      name="arrow-forward"
                      onPress={() =>
                        this.props.navigation.navigate('Edit', {
                          book_id: book.id,
                          onGoBack: () => this._update_book_list(),
                        })}
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
