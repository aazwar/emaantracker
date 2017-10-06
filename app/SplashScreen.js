import { Expo, Font } from 'expo';
import React from 'react';
import { StyleSheet, Text, View, Image, Dimensions, Platform, StatusBar } from 'react-native';
import { Container, Content } from 'native-base';
import { StackNavigator } from 'react-navigation';

// Store width in variable
let width = Dimensions.get('window').width;
// Logo 720x246
let logoWidth = width * 0.8;
let logoHeight = 246 * width / 720 * 0.8;
let margin = width / 10;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    width: undefined,
    height: undefined,
    resizeMode: 'cover',
  },
  topContent: {
    marginTop: 50,
    marginLeft: margin,
    flex: 0.8,
    flexDirection: 'column',
  },
  textArabic: {
    fontFamily: 'Amiri',
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    width: logoWidth,
  },
  textEnglish: {
    backgroundColor: 'transparent',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    width: logoWidth,
  },
});

export default class SplashScreen extends React.Component {
  static navigationOptions = {
    title: 'Splash',
    header: null,
  };

  state = {
    isReady: false,
  };

  async componentWillMount() {
    if (Platform.OS === 'android') {
      await Font.loadAsync({
        Roboto: require('native-base/Fonts/Roboto.ttf'),
        Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      });
    }
    await Font.loadAsync({
      Amiri: require('./assets/fonts/amiri-quran.ttf'),
    });
    this.setState({ isReady: true });
  }

  render() {
    return (
      <Container>
        <Image source={require('./assets/bg2.jpg')} style={styles.container}>
          <View style={styles.topContent}>
            <Image source={require('./assets/logo.png')} style={{ width: logoWidth, height: logoHeight }} />
            {this.state.isReady
              ? <Text style={styles.textArabic}>قَدْ أَفْلَحَ مَن تَزَكَّى</Text>
              : <Text>قَدْ أَفْلَحَ مَن تَزَكَّى</Text>}
            <Text style={styles.textEnglish}>He has certainly succeeded who purifies himself</Text>
          </View>
        </Image>
      </Container>
    );
  }
}
