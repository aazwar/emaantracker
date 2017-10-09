import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, Dimensions, Alert } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Content, Item, Label, Input, Button } from 'native-base';
import { List, ListItem, Right } from 'native-base';
import AppIntro from 'react-native-app-intro';
import I18n from 'i18n-js';

import Constants from './Constants';

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
    padding: 15,
  },
  text: {
    color: '#fff',
    fontSize: 20,
  },
  white: {
    color: '#fff',
  },
});

export default class IntroScreen extends React.Component {
  state = { sending: true };

  componentWillMount() {
    let { setting } = this.props.screenProps;
    this.setState(setting.values());
  }

  _doneIntro() {
    let { setting } = this.props.screenProps;
    setting.assign(this.state);
    this.props.doneIntro();
  }

  render() {
    let { setting } = this.props.screenProps;
    let { width, height } = Dimensions.get('window');
    return (
      <AppIntro
        onDoneBtnClick={this._doneIntro.bind(this)}
        onSkipBtnClick={this._doneIntro.bind(this)}
        defaultIndex={this.state.page}>
        <View style={styles.slide} key={1}>
          <Image style={{ width, height, resizeMode: 'stretch' }} source={require('./assets/intro/intro-1.png')} />
        </View>
        <View style={styles.slide} key={2}>
          <Image style={{ width, height, resizeMode: 'stretch' }} source={require('./assets/intro/intro-2.png')} />
        </View>
        <View style={styles.slide} key={3}>
          <ImageBackground style={{ width, height }} source={require('./assets/intro/intro-bg.png')}>
            <Content padder style={{ margin: 20 }}>
              <ListItem>
                <Item stackedLabel style={{ flex: 1 }}>
                  <Label style={styles.white}>
                    {I18n.t('Full Name')}
                  </Label>
                  <Input
                    style={styles.white}
                    placeholder={I18n.t('Full Name Desc')}
                    onChangeText={fullName => this.setState({ fullName, page: 2 })}
                    value={this.state.fullName}
                    autoCorrect={false}
                    autoCapitalize="words"
                  />
                </Item>
              </ListItem>
              <ListItem>
                <Item stackedLabel style={{ flex: 1 }}>
                  <Label style={styles.white}>
                    {I18n.t('Email')}
                  </Label>
                  <Input
                    style={styles.white}
                    placeholder={I18n.t('Email Desc')}
                    onChangeText={email => this.setState({ email, page: 2 })}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoCorrect={false}
                    editable={!setting.token}
                    value={this.state.email}
                  />
                </Item>
              </ListItem>
              <ListItem>
                <Text style={styles.text}>
                  Please enter your personal information. It will be used for greeting and data synchronization only.
                </Text>
              </ListItem>
            </Content>
          </ImageBackground>
        </View>
      </AppIntro>
    );
  }
}
