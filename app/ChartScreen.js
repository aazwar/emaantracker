import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, WebView, Image, Platform } from 'react-native';
import { Container, Content, Header, Body, Title, Button, Left, Right, Icon } from 'native-base';
import I18n from 'i18n-js';
import ChartView from 'react-native-highcharts';
import moment from 'moment';
import Db from './db';

class BarChartColumnBasic extends Component {
  static navigationOptions = { header: null };

  constructor() {
    super();
    function fontSize(size) {
      return Platform.OS == 'ios' ? size + 'em' : size * 0.75 + 'em';
    }
    this.state = {
      conf1: {
        credits: { enabled: false },
        chart: {
          type: 'column',
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          style: { fontSize: fontSize(1.2) },
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          borderRadius: 20,
        },
        title: { text: '' },
        subtitle: { text: 'Salah', style: { fontSize: fontSize(1) } },
        xAxis: [
          {
            //categories: [],
            labels: { style: { fontSize: fontSize(0.8) } },
          },
        ],
        yAxis: {
          title: { text: '' },
          max: 3,
          gridLineWidth: 0,
          labels: { format: ' ' },
          plotLines: [
            {
              color: 'black',
              label: { text: 'Jamaah' },
              value: 3,
              dashStyle: 'ShortDash',
              width: 1,
            },
            {
              color: 'black',
              label: { text: 'Alone' },
              value: 2,
              dashStyle: 'ShortDash',
              width: 1,
            },
          ],
        },
        series: [{ name: 'Salah', data: [1, 2, 3] }],
        legend: {
          itemStyle: { fontSize: fontSize(0.6) },
        },
        exporting: {
          enabled: false,
        },
      },
      conf2: {
        credits: { enabled: false },
        chart: {
          type: 'column',
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          style: { fontSize: fontSize(1.2) },
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          borderRadius: 20,
        },
        title: { text: '' },
        subtitle: { text: 'Quran Reading', style: { fontSize: fontSize(1) } },
        xAxis: [
          {
            //categories: [],
            labels: { style: { fontSize: fontSize(0.8) } },
          },
        ],
        yAxis: {
          title: { text: '' },
          gridLineWidth: 0,
          labels: { format: ' ' },
          plotLines: [
            {
              color: 'black',
              label: { text: 'Everyday Reading' },
              value: 1,
              dashStyle: 'ShortDash',
              width: 1,
            },
          ],
          softMax: 1,
        },
        series: [{ name: 'Quran', data: [0, 0, 0, 0, 0, 0] }],
        legend: {
          itemStyle: { fontSize: fontSize(0.6) },
        },
        exporting: {
          enabled: false,
        },
      },
      conf3: {
        credits: { enabled: false },
        chart: {
          type: 'column',
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          style: { fontSize: fontSize(1.2) },
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          borderRadius: 20,
        },
        title: { text: '' },
        subtitle: { text: 'Islamic Book Reading', style: { fontSize: fontSize(1) } },
        xAxis: [
          {
            //categories: [],
            labels: { style: { fontSize: fontSize(0.8) } },
          },
        ],
        yAxis: {
          title: { text: 'Pages' },
          min: 0,
        },
        series: [{ name: 'Quran', data: [0, 0, 0, 0, 0, 0] }],
        legend: {
          enabled: false,
        },
        exporting: {
          enabled: false,
        },
      },
    };
  }

  componentWillMount() {
    let db = new Db();
    db.monthly_summary(new Date()).then(summary => {
      let conf1 = this.state.conf1;
      conf1.series = [I18n.t('Fajr'), I18n.t('Dhuhr'), I18n.t('Asr'), I18n.t('Maghrib'), I18n.t('Isha')].map((v, i) => ({
        name: v,
        data: summary.salah[i],
      }));
      conf1.xAxis[0].categories = summary.categories;

      let conf2 = this.state.conf2;
      conf2.series = ['Only Reading', 'With Meaning', 'With Tafseer'].map((v, i) => ({
        name: v,
        data: summary.quran[i],
      }));
      conf2.xAxis[0].categories = summary.categories;

      let conf3 = this.state.conf3;
      conf3.series = [{ name: 'Reading', data: summary.reading }];
      conf3.xAxis[0].categories = summary.categories;
      this.setState({ conf1, conf2, conf3 });
    });
  }

  render() {
    var Highcharts = 'Highcharts';
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
              <Title style={{ width: 250 }}>Chart</Title>
            </Body>
            <Right />
          </Header>
          <Content>
            <ChartView style={{ height: 200, margin: 10 }} config={this.state.conf1} />
            <ChartView style={{ height: 200, margin: 10 }} config={this.state.conf2} />
            <ChartView style={{ height: 200, margin: 10 }} config={this.state.conf3} />
          </Content>
        </Container>
      </Image>
    );
  }
}

export default BarChartColumnBasic;
