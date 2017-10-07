import React from 'react';
import { StyleSheet, View, Image, Text, Dimensions } from 'react-native';
import { Container, Content, Header, Footer, FooterTab, Button, Left, Right, Body, Icon, Title } from 'native-base';
import PopoverTooltip from 'react-native-popover-tooltip';
import { Col, Row, Grid } from 'react-native-easy-grid';
import moment from 'moment';

import dhikr from './Dhikir';
import Db from './db';
import { getPrayerTimes } from './Util';

export default class TextScreen extends React.Component {
  static navigationOptions = { header: null };
  start = moment();

  componentWillMount() {
    const { time } = this.props;
    this.book = dhikr(time);
  }

  componentWillUnmount() {
    if (moment().diff(this.start) > 1000 * 60 * 3) {
      // 3 minutes before considered dhikr
      this._storeDhikrData();
    }
  }

  async _storeDhikrData() {
    let { setting } = this.props;
    let prayTimes = getPrayerTimes(new Date(), setting.location, setting.prayer.calculationMethod, setting.prayer.adjustment);
    let now = moment();
    console.log(this.props);
    let field = this.props.time == 'morning' ? 'dhikr1' : 'dhikr4';

    let sql = 'SELECT * FROM salah WHERE date = ?';
    let db = new Db();
    let result = await db.select_query(sql, [moment().format('YYYY-MM-DD')]);
    if (result.length) {
      let data = result[0];
      if (!data[field]) {
        sql = `UPDATE salah SET ${field} = 1 WHERE date = ?`;
        db.execute_query(sql, [now.format('YYYY-MM-DD')]);
      }
    } else {
      let values = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      if (field == 'field1') values[5] = 1;
      else values[7] = 1;
      sql = `INSERT INTO salah VALUES (?, ${values.join(',')})`;
      db.execute_query(sql, [now.format('YYYY-MM-DD')]);
    }
  }

  render() {
    let w = Dimensions.get('window');
    return (
      <Image source={require('./assets/bg2.jpg')} style={{ width: w.width, flex: 1, resizeMode: 'cover' }}>
        <Container>
          <Content padder>
            {this.book.section.map((section, index) => {
              return (
                <Grid
                  key={index}
                  style={{
                    padding: 5,
                    backgroundColor: 'rgba(255,255,255,0.5)',
                    borderRadius: 10,
                    marginBottom: 10,
                  }}>
                  <Row>
                    <Col>
                      {section.title &&
                        <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
                          {section.title}
                        </Text>}
                    </Col>
                    <Col style={{ width: 14 }}>
                      {section.faedah &&
                        <PopoverTooltip
                          buttonComponent={<Text>ⓘ</Text>}
                          items={[
                            {
                              label: section.faedah,
                              onPress: () => {},
                            },
                          ]}
                        />}
                    </Col>
                  </Row>
                  {section.content.map((content, index) => {
                    switch (content.type) {
                      case 'arabic':
                        return (
                          <Row key={index}>
                            <View style={{ flex: 1 }}>
                              <Text
                                style={{
                                  textAlign: 'right',
                                  marginBottom: 5,
                                  fontFamily: 'Amiri Quran',
                                  fontSize: 20,
                                }}>
                                {content.text}
                              </Text>
                              {content.caption &&
                                <Text
                                  style={{
                                    fontStyle: 'italic',
                                    marginBottom: 5,
                                  }}>
                                  {content.caption}
                                </Text>}
                            </View>
                          </Row>
                        );
                        break;
                      default:
                        return (
                          <Row key={index}>
                            <Text
                              style={{
                                marginBottom: 5,
                              }}>
                              {content.text}
                            </Text>
                          </Row>
                        );
                    }
                  })}
                </Grid>
              );
            })}
            <Text>
              {'\n'}
            </Text>
          </Content>
        </Container>
      </Image>
    );
  }
}
