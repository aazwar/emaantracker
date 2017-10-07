import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Container, Content, Header, Body, Title, Button, Left, Right, Icon, Tab, Tabs } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

import DailyActivity from './DailyActivityScreen';
import MonthlyActivity from './MonthlyActivityScreen';

export default class ActivityScreen extends React.Component {
  static navigationOptions = { header: null };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container>
        <Header hasTabs style={{ backgroundColor: '#A9DBDF' }}>
          <Left>
            <Button
              transparent
              onPress={() => {
                this.props.navigation.state.params.refreshStatus();
                this.props.navigation.goBack();
              }}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title style={{ width: 250 }}>Other Activity</Title>
          </Body>
          <Right />
        </Header>
        <Tabs initialPage={0}>
          <Tab heading="Daily">
            <DailyActivity />
          </Tab>
          <Tab heading="Monthly">
            <MonthlyActivity />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}
