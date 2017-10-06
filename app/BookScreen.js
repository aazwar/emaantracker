import React from 'react';
import { FileSystem } from 'expo';
import { StyleSheet, Text, Dimensions, WebView } from 'react-native';
import { Container, Content, Header, Body, Title, Button, Left, Right, Icon, View } from 'native-base';

export default class BookScreen extends React.Component {
  static navigationOptions = { header: null };

  componentWillUnmount() {
    //console.log(this.webview);
  }

  render() {
    const pdf = `${FileSystem.documentDirectory}Books/${encodeURI(this.props.navigation.state.params.book.file)}`;
    return (
      <Container>
        <Header style={{ backgroundColor: '#A9DBDF',}}>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Book</Title>
          </Body>
          <Right />
        </Header>
        <WebView
          ref={r => (this.webview = r)}
          style={{
            flex: 1,
          }}
          scalesPageToFit={true}
          source={{ uri: pdf }}
        />
      </Container>
    );
  }
}
