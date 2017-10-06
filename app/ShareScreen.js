import React from 'react';
import { StyleSheet, Text, Dimensions, WebView } from 'react-native';
import { Container, Content, Header, Body, Title, Button, Left, Right, Icon, View } from 'native-base';

export default class ShareScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: (
      <Header>
        <Left>
          <Button transparent onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>Book</Title>
        </Body>
        <Right />
      </Header>
    ),
  });

  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      pageCount: 1,
    };
    this.pdf = null;
  }

  render() {
    return <Text>Share</Text>;
  }
}
