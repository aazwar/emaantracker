import React from 'react';
import { StyleSheet, Text, Dimensions, WebView, Image, TouchableHighlight, Linking } from 'react-native';
import { Container, Content, Header, Body, Title, Button, Left, Right, Icon, View } from 'native-base';
import I18n from 'i18n-js';

import HelpScreenEn from './HelpScreen-en';
import HelpScreenId from './HelpScreen-id';
import HelpScreenAr from './HelpScreen-ar';
import HelpScreenUr from './HelpScreen-ur';

export default class HelpScreen extends React.Component {
  static navigationOptions = { header: null };
  
  _content() {
    const { setting } = this.props.screenProps;
    switch (setting.locale) {
      case 'id': return (<HelpScreenId/>);
      case 'ar': return (<HelpScreenAr/>);
      case 'ur': return (<HelpScreenUr/>);
    default:  return <HelpScreenEn/>;      
    }
  }
  
  render() {
      let w = Dimensions.get('window');
      return (
        <Image source={require('./assets/bg2.jpg')} style={{ flex: 1, width: w.width, resizeMode: 'cover' }}>
          <Container>
            <Header style={{ backgroundColor: '#A9DBDF',}}>
              <Left>
                <Button transparent onPress={() => this.props.navigation.goBack()}>
                  <Icon name="arrow-back" />
                </Button>
              </Left>
              <Body>
                <Title style={{ width: 250 }}>Help</Title>
              </Body>
              <Right />
            </Header>
            <Content>
              {this._content()}
            </Content>            
          </Container>
        </Image>
    )
  }
}