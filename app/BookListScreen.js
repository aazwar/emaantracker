import FileSystem from 'react-native-fs';
import React from 'react';
import { StyleSheet, Text, Image, Dimensions, Alert, TouchableOpacity, Linking, ImageBackground } from 'react-native';
import { Container, Content, Header, Body, Title, Button, Left, Right, Icon, View, Spinner, Footer } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import moment from 'moment';

import Constants from './Constants';
import Db from './db';

const dir = `${FileSystem.documentDirectoryPath}/Books/`;
const server = Constants.emaanTrackerUrl + '/images/books/';

export default class BookListScreen extends React.Component {
  static navigationOptions = { header: null };
  state = {
    loading: true,
    books: [],
  };

  async componentWillMount() {
    FileSystem.downloadFile({fromUrl: Constants.emaanTrackerUrl + '/book/meta', toFile: FileSystem.documentDirectoryPath + '/Books/books.json'}).promise(() => {
      FileSystem.readFile(FileSystem.documentDirectoryPath + '/Books/books.json');
    });
    FileSystem.readAsStringAsync(FileSystem.documentDirectory + 'Books/books.json').then(async content => {
      let books = JSON.parse(content);
      await this._downloadCover(books);
      this.setState({ loading: false, books });
    });
  }

  async _downloadCover(books) {
    let fbooks = books
      .map(b => b.books)
      .reduce((a, b) => a.concat(b), [])
      .map(c => Object.keys(c).map(k => c[k]))
      .reduce((a, b) => a.concat(b), []);
    for (cover of fbooks.map(b => b.cover)) {
      let info = await FileSystem.getInfoAsync(dir + cover);
      if (!info.exists) {
        await FileSystem.downloadAsync(server + cover, dir + cover);
      }
    }
    //Promise.all(covers).then(res => );
  }

  async _openBook(book) {
    /*let info = await FileSystem.getInfoAsync(dir + book.file);
    if (!info.exists) {
      this.setState({ loading: true });
      await FileSystem.downloadAsync(server + book.file, dir + book.file);
      this.setState({ loading: false });
    }*/
    const url = 'http://docs.google.com/viewer?embedded=true&url=' + encodeURI(server + book.file);
    //console.log(url);
    this.props.navigation.navigate('BookScreen', { url });
    /*WebBrowser.openBrowserAsync(url);*/
    let db = new Db();
    let pages = 1;
    let date = moment().format('YYYY-MM-01');
    let rec = await db.select_query('SELECT pages FROM reading WHERE date = ? AND id = 0', [date]);
    if (rec && rec.length) {
      pages += rec[0].pages;
    }
    db.store_reading(date, 0, pages);
    //Linking.openURL(dir + book.file);
    //this.props.navigation.navigate('Book', { book });
  }

  render() {
    let w = Dimensions.get('window');
    let cols = w.width >= 768 ? 4 : 3;
    let cw = w.width / cols;
    let fbooks = this.state.books.sort((a, b) => {
      if (!a) return -1;
      if (!b) return 1;
      return Boolean(a > b);
    });

    fbooks = fbooks.map(cat => {
      let books = cat.books;
      books = Object.keys(books).map(k => books[k]);
      if (cols == 4) {
        if (books.length % 4) books.push(...[{}, {}, {}, {}].splice(books.length % 4, 4));
      } else {
        if (books.length % 3) books.push(...[{}, {}, {}].splice(books.length % 3, 3));
      }
      cat.books = books;
      return cat;
    });

    return (
      <ImageBackground source={require('./assets/bg2.jpg')} style={{ width: w.width, flex: 1 }}>
        <Container>
          <Header style={{ backgroundColor: '#A9DBDF' }}>
            <Left>
              <Button transparent onPress={() => this.props.navigation.goBack()}>
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Title style={{ width: 250 }}>Books</Title>
            </Body>
            <Right>
              <Button transparent onPress={() => this.props.navigation.navigate('ManageBook')}>
                <Icon name="ios-trash" />
              </Button>
            </Right>
          </Header>
          <Content>
            {fbooks.map((cat, i) =>
              <View key={cat.category}>
                <Row>
                  <Text
                    style={{
                      textAlign: 'center',
                      textShadowColor: 'white',
                      textShadowOffset: { width: 2, height: 2 },
                      textShadowRadius: 1,
                      width: w.width,
                      marginBottom: 5,
                    }}>
                    {cat.category || 'NO CATEGORY'}
                  </Text>
                </Row>
                {_.chunk(cat.books, cols).map((row, i) =>
                  <View key={i}>
                    <Row>
                      {row.map((book, i) =>
                        <Col key={i}>
                          {!_.isEmpty(book) &&
                            <Cell
                              icon={{ uri: `${FileSystem.documentDirectory}Books/${encodeURI(book.cover)}` }}
                              caption={book.title}
                              onPress={() => this._openBook(book)}
                            />}
                        </Col>
                      )}
                    </Row>
                    <Image
                      source={require('./assets/book-shelves.png')}
                      style={{ resizeMode: 'contain', width: w.width, height: w.width * 169 / 951 }}
                    />
                  </View>
                )}
              </View>
            )}
          </Content>
          {this.state.loading &&
            <Footer style={{ alignItems: 'center' }}>
              <Left>
                <Spinner color="black" style={{ marginLeft: 10 }} />
              </Left>
              <Body>
                <Text>Syncing ...</Text>
              </Body>
              <Right />
            </Footer>}
        </Container>
      </ImageBackground>
    );
  }
}

class Cell extends React.Component {
  render() {
    let w = Dimensions.get('window');
    let cols = w.width >= 768 ? 4 : 3;
    let iw = w.width * 0.7 / cols;
    let cw = w.width / cols;
    let m = w.width * 0.15 / 6;
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginBottom: -3,
        }}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text
            style={{
              fontSize: cols == 4 ? 12 : 9,
              textAlign: 'center',
              textShadowColor: 'white',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 1,
              width: iw,
            }}>
            {this.props.caption + '\n'}
          </Text>
        </View>
        <TouchableOpacity onPress={this.props.onPress}>
          <Image style={{ width: iw, height: iw * 1.3, resizeMode: 'cover' }} source={this.props.icon} />
        </TouchableOpacity>
      </View>
    );
  }
}
