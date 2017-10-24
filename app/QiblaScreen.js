import React from 'react';
import { StyleSheet, Image, View, Dimensions, Text, DeviceEventEmitter } from 'react-native';
import { Container, Content, Header, H1, H2, H3, Left, Right, Body, Button, Icon, Title } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
//import { RNLocation as Location } from 'NativeModules';
import RNHeading from 'react-native-heading';
import qibla from './qibla';

export default class QiblaScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: (
      <Header
        style={{
          backgroundColor: '#854c0a',
        }}>
        <Left>
          <Button transparent onPress={() => navigation.goBack()}>
            <Icon style={{ color: 'white' }} name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title style={{ width: 250, color: 'white' }}>Qibla</Title>
        </Body>
        <Right />
      </Header>
    ),
  });

  constructor() {
    super();
    this.state = {
      heading: '0.0º',
      position: '0.000, 0.000',
      qibla: '0.0º',
      direction: '0 deg',
      qiblaDir: '0 deg',
    };
    this.magHeading = 0;
    this.kabaDir = 0;
  }

  async componentDidMount() {
    let { setting } = this.props.screenProps;
    const position = { lat: setting.location[0], long: setting.location[1] };
    this.kabaDir = qibla.direction(position);
    this.setState({
      qibla: `${this.kabaDir.toFixed(1)}º`,
      position: `${position.lat.toFixed(7)},${position.long.toFixed(7)}`,
    });
    
    RNHeading.start(1);
    DeviceEventEmitter.addListener('headingUpdated', data => {
      this.magHeading = data;
      //console.log(`Data: ${data}, ${typeof data.heading}`);
      const rotate = 360 - this.magHeading;
      let qibla = this.kabaDir - this.magHeading;
      if (qibla < 0) qibla += 360;
      this.setState({
        heading: `${this.magHeading}º`,
        direction: `${rotate.toFixed(1)} deg`,
        qiblaDir: `${qibla.toFixed(1)} deg`,
      });
    });
  }

  componentWillUnmount() {
    RNHeading.stop();
    DeviceEventEmitter.removeAllListeners('headingUpdated');
  }

  render() {
    let { width, height } = Dimensions.get('window');
    let styles = StyleSheet.create({
      compassImage: {
        width: width,
        height: width,
        resizeMode: 'cover',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
    });
    return (
      <Image source={require('./assets/bg-qibla.jpg')} style={{ flex: 1, width }}>
        <Container padder>
          <Grid>
            <Row
              style={{
                backgroundColor: 'transparent',
                justifyContent: 'flex-end',
                flexDirection: 'column',
              }}>
              <H3 style={{ textAlign: 'center' }}>
                Direction: {this.state.heading}
              </H3>
            </Row>
            <Row style={{ height: width }}>
              <Image
                source={require('./assets/compass-bg-qibla.png')}
                style={[styles.compassImage, { transform: [{ rotate: this.state.direction }] }]}
              />
              <Image
                source={require('./assets/qa3ba.png')}
                style={[styles.compassImage, { transform: [{ rotate: this.state.qiblaDir }] }]}
              />
              <Image
                source={require('./assets/compass-needle2.png')}
                style={[styles.compassImage, { transform: [{ rotate: this.state.qiblaDir }] }]}
              />
              <Image source={require('./assets/compass-glass.png')} style={styles.compassImage} />
            </Row>
            <Row
              style={{
                backgroundColor: 'transparent',
                justifyContent: 'center',
              }}>
              <H3 style={{ textAlign: 'center' }}>
                Position: {this.state.position}
                {'\n'}Qibla: {this.state.qibla}
              </H3>
            </Row>
          </Grid>
        </Container>
      </Image>
    );
  }
}
