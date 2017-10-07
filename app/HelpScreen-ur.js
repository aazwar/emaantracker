import React from 'react';
import { StyleSheet, Text, Dimensions, WebView, Image, TouchableHighlight, Linking } from 'react-native';
import { Container, Content, Header, Body, Title, Button, Left, Right, Icon, View } from 'native-base';
import { CheckBox, List, ListItem, Separator, H1, H2, H3 } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

export default class ShareScreen extends React.Component {
  render() {
    let w = Dimensions.get('window');
    let listItem = { backgroundColor: 'transparent' };
    let styles = StyleSheet.create({
      text: { textAlign: 'right', flex: 1 },
      header: { textAlign: 'right', flex: 1 },
    });
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
          <H3 style={styles.header}>ایمان ٹریکر ایپ کا تعارف۔ ​</H3>
        </ListItem>
        <ListItem style={listItem}>
          <Grid>
            <Row>
              <Text style={styles.text}>
                {`کسی بھی فٹنس ایپ کی طرح جو آپ کی صحت اور فٹنس کا ریکارڈ رکھتا ہے۔ اسی طرح یہ ایمان ٹریکر آپ کی روز مرہ کی عبادات کا ریکارڈ رکھے گا۔ یہ آئیڈیا ہم نے قرآن کی مندرجہ ذیل آیت سے لیا ہے۔ `}
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
              <Text style={{ fontStyle: 'italic', textAlign: 'right' }}>
                {`(کامیاب ہوا وہ شخص جس نے اپنے نفس کا تزکیہ کیا۔ ( سورہ اعلی) `}
              </Text>
            </Row>
            <Row>
              <Text style={styles.text}>
                {`
اس موبائیل ایپ کے ذریعہ آپ ان  مذہبی کاموں کا روزانہ حساب و کتاب رکھ سکتے ہیں جس کو آپ نے کیا اور نہیں کیا ہے۔ اس ایپ کے استعمال سے آپ کبھی بھی سرخ نشان اپنی کارکردگی کے کالم میں نہیں دیکھنا چاہیں گے۔ یہ ایپ آپکو اپنی عبادات کو بروقت ادا کرنے پر ابھارے گا۔ انشاءالله
`}
              </Text>
            </Row>
          </Grid>
        </ListItem>
        <ListItem style={listItem}>
          <H3 style={styles.header}>ایمانی حالت</H3>
        </ListItem>
        <ListItem style={listItem}>
          <Text style={styles.text}>
            {`ایمان ٹریکر کا مقصد آپ کو سرخ اور ہرے رنگ کے ذریعہ الرٹ کرنا ہے اس وقت جب آپ اپنے فرائض اور اسلام کی دیگر ذمہ داریوں کو ٹھیک سے ادا نہ کر رہے ہوں۔ . 
`}
            <Text style={{ fontWeight: 'bold', color: 'green' }}>
              {'ہرا رنگ ( Green )'}
            </Text>
            {`
آپ کا ایمان اسٹیٹس ہرے رنگ میں ظاہر ہو گا اگر آپ نے مہینہ میں چار مرتبہ سے زیادہ اپنی نمان قضا نہ کی ہو۔ 
`}
            <Text style={{ fontWeight: 'bold' }}>
              {'ہرے اور سرخ کے درمیان۔ ( Between Green & Red )'}
            </Text>
            {`​
آپ کا ایمان اسٹیٹس سرخ اور ہرے شو کرے گا اگر آپ کی نمازیں اوسطا ایک مرتبہ ۸۰% اگر روزانہ قضا یا مس ہوئی ہوں۔ 
`}

            <Text style={{ fontWeight: 'bold', color: 'red' }}>
              {'سرخ ( Red )'}
            </Text>
            {`
اپ کا ایمان اسٹیٹس سرخ شو کرے گا اگر آپ نے ماہانہ ۲۰% یا اس سے زائد اپنی نمازوں کو قضا یا مس کیا ہو۔ 
`}
          </Text>
        </ListItem>
        <ListItem style={listItem}>
          <H3 style={styles.header}>میری عبادت ( My Prayer )</H3>
        </ListItem>
        <ListItem style={listItem}>
          <Text style={styles.text}>
            {`
				اس کالم میں آپ سے درخواست کی جاتی ہے کہ آپ اپنی نماز کی ڈیلی رپورٹ اپڈیٹ کریں۔ آپشن میں جاکر سیلکٹ کریں کہ آپ نے باجماعت  مسجد میں ادا کیا ہے یا تنہا و قضا ہوئی ہے۔ یہ تفصیلات ریکارڈ ہونگی جن کی بنیاد پر آپ کی ایمان اسٹیٹس میں رپورٹ جنریٹ ہو گی۔ ہاں یہ بات واضح رہے کہ آپ کی رپورٹ کو مخفی رکھا جائے گا۔  
`}
          </Text>
        </ListItem>
        <ListItem style={listItem}>
          <H3 style={styles.header}>میرا قرآن۔ ( My Quran )</H3>
        </ListItem>
        <ListItem style={listItem}>
          <Text style={styles.text}>{`
			  اس حصے میں آپ اپنی روزانہ کی تلاوت قرآن کی رہورٹ ڈال سکتے ہیں۔ آپشن میں یہ بھی ظاہر کر سکتے ہیں کہ آپ نے صرف تلاوت کی ہے یا ترجمہ و تفسیر کے ساتھ پڑھا ہے۔ 
نوٹ۔ بعض لوگوں کے نزدیک قرآن کو سمجھ کر پڑھنا صرف علماء کا کام ہے اور عام آدمی کو محض ان کے ذریعہ لکھی گئی کتابوں کا مطالعہ کافی ہے جو کہ بالکل غلط اور بے بنیاد بات ہے  
 
`}</Text>
        </ListItem>
        <ListItem style={listItem}>
          <H3 style={styles.header}>دیگر مصروفیات۔ ( Other Activities ) </H3>
        </ListItem>
        <ListItem style={listItem}>
          <Text style={styles.text}>{`
			  اس سیکشن میں آپ اپنی روز مرہ کی نفلی عبادات، روز انفاق فی سبیل اللہ اور صدقہ و خیرات کی تفصیل ڈال سکتے ہیں۔  
			  `}</Text>
        </ListItem>
        <ListItem style={listItem}>
          <H3 style={styles.header}>رپورٹ۔ </H3>
        </ListItem>
        <ListItem style={listItem}>
          <Text style={styles.text}>
            {`
				اس سیکشن میں آپ پنی عبادات اور دیگر چیزوں کی رپورٹ ماہانہ کی بنیاد پر دیکھ اور اپنی فیملی و دوسرے لوگوں کے ساتھ شیئر کر سکتے ہیں۔ برائے مہربانی اپنی رپورٹ کو نمود و نمائش کے مقصد کے تحت نہ شیئر کریں اور نہ ہی اس ایپ کا یہ مقصد ہے۔ 
`}
          </Text>
        </ListItem>
        <ListItem style={listItem}>
          <H3 style={styles.header}>کتب۔ ( Books )</H3>
        </ListItem>
        <ListItem style={listItem}>
          <Text style={styles.text}>
            {`
				اس سیکشن میں آپ اسلامی کتب کا مطالعہ آن لائن کرسکتے ہیں جس کی تفصیل آپ کی ماہانہ رپورٹ میں خود بخود درج ہوتی جائے گی۔
  `}
          </Text>
        </ListItem>
      </View>
    );
  }
}
