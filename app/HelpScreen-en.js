import React from 'react';
import { StyleSheet, Text, Dimensions, WebView, Image, TouchableHighlight, Linking } from 'react-native';
import { Container, Content, Header, Body, Title, Button, Left, Right, Icon, View } from 'native-base';
import { CheckBox, List, ListItem, Separator, H1, H2, H3 } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

export default class ShareScreen extends React.Component {
  render() {
    let w = Dimensions.get('window');
    let listItem = { backgroundColor: 'transparent' };
    return (
      <View>
        <ListItem style={listItem}>
          <TouchableHighlight
            onPress={() => {
              Linking.openURL("mailto:jafarsadik@gmail.com?subject=EmaanTracker%20Feedback&body=Assalamu'alaikum,%0A%0A");
            }}>
            <Image
              source={require('./assets/sponsor.png')}
              style={{ width: w.width - 30, height: (w.width - 30) * 274 / 606, resizeMode: 'contain' }}
            />
          </TouchableHighlight>
        </ListItem>
        <ListItem style={listItem}>
          <H3>What is this emaanTracker App is about ?​</H3>
        </ListItem>
        <ListItem style={listItem}>
          <Grid>
            <Row>
              <Text>
                {`Just like any Fitness App which will track your fitness status, Using EmaanTracker you will be able to track your daily prayers and Ibada’ath. 
The concept of this App was conceived by below Quranic ayah`}
              </Text>
            </Row>
            <Row>
              <Text
                style={{
                  flex: 1,
                  textAlign: 'right',
                  fontSize: 24,
                  fontFamily: 'amiri',
                }}>{`قَدْ أَفْلَحَ مَن تَزَكَّىٰ `}</Text>
            </Row>
            <Row>
              <Text style={{ fontStyle: 'italic' }}>
                {`(He has certainly succeeded who purifies himself) – Surah A’la`}
              </Text>
            </Row>
            <Row>
              <Text>
                {`

With this Mobile App, you will watch yourself about your religious duties. You will be able to tick mark what you have done and mark red what you have not. After using this application some time, you will not want to see red color in your stats. 
This will encourage you to pray more regularly and completely.  Insha Allah`}
              </Text>
            </Row>
          </Grid>
        </ListItem>
        <ListItem style={listItem}>
          <H3>EMAAN STATUS</H3>
        </ListItem>
        <ListItem style={listItem}>
          <Text>
            {`The purpose of Emaan Status is to raise the flag when you don't perform well with your obligatory duties of Islam, If helps you to track your current Emaan by showing RED and green colors. 

`}
            <Text style={{ fontWeight: 'bold', color: 'green' }}>
              {'GREEN'}
            </Text>
            {`
Your emaan status becomes green if you don't miss/qadha your prayer more than 4 times a month.

`}
            <Text style={{ fontWeight: 'bold' }}>
              {'BETWEEN GREEN AND RED'}
            </Text>
            {`​
Your emaan status becomes between green and red when you miss/qadha your prayer on average once a day, or 80%.

`}

            <Text style={{ fontWeight: 'bold', color: 'red' }}>
              {'RED'}
            </Text>
            {`
Your emaan status becomes RED when you have more than 20% miss/qadha prayer a month, e.g. you missed Fajr prayer everyday`}
          </Text>
        </ListItem>
        <ListItem style={listItem}>
          <H3>My Prayer</H3>
        </ListItem>
        <ListItem style={listItem}>
          <Text>
            {`In this section, you are requested to enter your daily salah activities, There are options to select if you prayed in Masjid, Alone, Qadha or Missed it. This information will be recorded and it will be used to generate the report and show appropriate EmaanStatus in this APP. 

Please note that, your information will be confidential. `}
          </Text>
        </ListItem>
        <ListItem style={listItem}>
          <H3>My Quran</H3>
        </ListItem>
        <ListItem style={listItem}>
          <Text>{`In this section you will enter your daily activity log concerning Quran recitation and reading. There are options to select whether you just read the Quran or you read with translation or Tafseer. 

NOTE: A section of Muslims feels that the understanding of Quran is meant only for the religious scholars. For the remaining masses it is sufficient to read the books written by the scholars or the saints. Such a thought is not only wrong and baseless but it also deprives the people of the light of Quran and has driven them to the wrong practice of saint worship.

Today there are many Tafaseer are available both in books form and online, so please spare some time and try to read the book of Allah by understanding the meaning. `}</Text>
        </ListItem>
        <ListItem style={listItem}>
          <H3>Other Activities</H3>
        </ListItem>
        <ListItem style={listItem}>
          <Text>{`In this section you will be able to daily log your activities like Nawafeel Ibadaath like Fasting, Infaq and Charity ets.  Please spare some time to enter them on day to day basis.`}</Text>
        </ListItem>
        <ListItem style={listItem}>
          <H3>Report</H3>
        </ListItem>
        <ListItem style={listItem}>
          <Text>
            {`In this section you will be able to see the whole of your Ibadaath in complete report format on monthly basis. You can also see a graph of your improvements or decline in your Ibadaath.

You can also share your monthly report with your family members or to your organization head. 
 
NOTE: Please don’t SHARE to show-off you Ibadath, It’s not meant for that purpose.`}
          </Text>
        </ListItem>
        <ListItem style={listItem}>
          <H3>BOOKS</H3>
        </ListItem>
        <ListItem style={listItem}>
          <Text>
            {`This section has online resources of Islamic books, feel free to read these books, 
  As you are reading these books, APP will keep record of your reading and will be used when you see the reports.`}
          </Text>
        </ListItem>
      </View>
    );
  }
}
