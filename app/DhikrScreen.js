import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Container, Content, Header, Body, Title, Button, Left, Right, Icon, Tab, Tabs } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import I18n from 'i18n-js';

import TextScreen from './TextScreen';

export default class ActivityScreen extends React.Component {
  static navigationOptions = { header: null };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container>
        <Header
          hasTabs
          style={{
            backgroundColor: '#A9DBDF',
          }}>
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
            <Title style={{ width: 250 }}>{I18n.t('Dhikr')}</Title>
          </Body>
          <Right />
        </Header>
        <Tabs initialPage={0}>
          <Tab heading={I18n.t('Morning')}>
            <TextScreen time="morning" setting={this.props.screenProps.setting} />
          </Tab>
          <Tab heading={I18n.t('Evening')}>
            <TextScreen time="evening" setting={this.props.screenProps.setting} />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}
