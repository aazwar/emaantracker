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
      text: { textAlign: 'right' },
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
          <H3 style={styles.header}>ماهو الغرض من تطبيق دليل الإيمان؟​</H3>
        </ListItem>
        <ListItem style={listItem}>
          <Grid>
            <Row>
              <Text style={{ textAlign: 'right' }}>
                {`مثل أى تطبيق لياقة بدنية والذى سيتابع حالة لياقتك البدنية، استعمال دليل الإيمان سبمكنك من متابعة صلواتك اليومية والعبادات.
المبدأ المبنى عليه هذا التطبيق مشتق من الآية القرآنية التى تقول :" `}
              </Text>
            </Row>
            <Row>
              <Text
                style={{
                  flex: 1,
                  textAlign: 'right',
                  fontSize: 24,
                  fontFamily: 'Amiri Quran',
                }}>{`قَدْ أَفْلَحَ مَن تَزَكَّىٰ `}</Text>
            </Row>

            <Row>
              <Text style={styles.text}>
                {`

بواسطة استخدام هذا التطبيق على جوالك ستتمكن من مراقبة مواظبتك على أداء واجباتك الدينية .
ستتمكن من وضع علامة أمام ما أنجزته ، وعلامة حمراء أمام مالم تنجزه.
بعد استخدام هذا التطبيق لبعض الوقت لن ترغب فى رؤية حالتك تتحول إلى اللون الأحمر. سيشجعك ذلك على أن تصلى بانتظام وجدية. إن شاء الله
`}
              </Text>
            </Row>
          </Grid>
        </ListItem>
        <ListItem style={listItem}>
          <H3 style={styles.header}>الحالة الإيمانية</H3>
        </ListItem>
        <ListItem style={listItem}>
          <Text style={styles.text}>
            {`الغرض من خاصية الحالة الإيمانية هو أن ترفع لك راية التحذير عندما لا تواظب على أداء الفروض، إنها تساعدك على مراقبة درجة إيمانك بإظهار الألوان الحمراء والخضراء. 

`}
            <Text style={[{ fontWeight: 'bold', color: 'green' }, styles.text]}>
              {'الأخضر'}
            </Text>
            {`يصبح لون حالتك الإيمانية أخضر إذا لم لم تفوت أو تؤدى قضاءا أكثر من أربع صلوات فى الشهر.

`}
            <Text style={{ fontWeight: 'bold' }}>
              {'بين الأخضر والأحمر'}
            </Text>
            {`​تصبح حالتك الإيمانية بين الأخضر والأحمرعندما تفوت أو تؤدى قضاءا صلاة واحدة فى المتوسط يوميا أى أن نسبة المحافظة 80%.

`}

            <Text style={{ fontWeight: 'bold', color: 'red' }}>
              {'الأحمر'}
            </Text>
            {`تتحول حالتك الإيمانية إلى اللون الأحمر عندما تفوت أو تؤدى قضاءا أكثر من20 % من الصلوات الشهرية ، مثلا مثل أن تفوت صلاة الفجر بصورة يومية.`}
          </Text>
        </ListItem>
        <ListItem style={listItem}>
          <H3 style={styles.header}>صلاتى</H3>
        </ListItem>
        <ListItem style={listItem}>
          <Text style={styles.text}>
            {`فى هذا القسم يطلب منك إدخال أنشطة صلاتك اليومية ، هناك اختيارات إذا ماكنت أديت الصلاة فى المسجد، منفردا ، قضاءا ، أو فوت الصلاة. هذه المعلومات ستسجل وستستخدم فى إعداد التقرير وتظهر الحالة الإيمانية المناسبة فى هذا التطبيق. 

ملحوظة، كل معلوماتك ستظل سرية `}
          </Text>
        </ListItem>
        <ListItem style={listItem}>
          <H3 style={styles.header}>قرآنى</H3>
        </ListItem>
        <ListItem style={listItem}>
          <Text
            style={
              styles.text
            }>{`فى هذا القسم سوف تدخل نشاطك اليومى الخاص بتلاوة وقراءة القرآن. هناك اختيارات إذا ماكنت تقرأ فقط أو تقرأ مع الترجمة أو التفسير.

ملحوظة: قطاع من المسلمين يشعر أن فهم معانى القرآن يخص فقط الفقهاء . أما باقى المسلمين فيكفى قراءة الكتب التى يكتبها العلماء والأولياء، هذا التفكير ليس خاطئا فقط ولا أساس له بل أيضا يحرم الناس من نور وهداية القرآن ويجعلهم يتبعون الممارسة الخاطئة التى تتمثل فى تقديس الأولياء.




اليوم هناك الكثير من التفاسير المتاحة سواء على صورة كتب أو على شبكة الانترنت، لذلك فضلا اقض بعض الوقت يوميا فى قراءة وفهم معانى كتاب الله.
 `}</Text>
        </ListItem>
        <ListItem style={listItem}>
          <H3 style={styles.header}>أنشطة أخرى</H3>
        </ListItem>
        <ListItem style={listItem}>
          <Text
            style={
              styles.text
            }>{`فى هذا القسم ستتمكن من إدخال أنشطتك اليومية مثل نوافل العبادات كالصيام والإنفاق والصدقات وغيرها، فضلا اقض بعض الوقت يوميا لإدخالهم.`}</Text>
        </ListItem>
        <ListItem style={listItem}>
          <H3 style={styles.header}>التقرير</H3>
        </ListItem>
        <ListItem style={listItem}>
          <Text style={styles.text}>
            {`فى هذا القسم ستستطيع أن ترى كل عباداتك فى صورة تقرير كامل بشكل شهرى . يمكنك أيضا أن ترى رسما بيانيا يوضح تحسنك أو تراجعك فى العبادات.


يمكنك أيضا أن تشارك تقريرك الشهرى مع عائلتك أو أصدقائك.
ملحوظة:  لا تشارك للتفاخر، ليس هذا  الغرض من المشاركة.`}
          </Text>
        </ListItem>
        <ListItem style={listItem}>
          <H3 style={styles.header}>الكتب</H3>
        </ListItem>
        <ListItem style={listItem}>
          <Text style={styles.text}>
            {`هذا القسم له مصادر من الكتب الإسلامية على الانترنت،  اقرأ بحرية، التطبيق سوف يحفظ سجلا لعادة القراءة لديك وسينعكس ذلك على تقاريرك.`}
          </Text>
        </ListItem>

        <ListItem style={listItem}>
          <H3 style={styles.header}>إشادة</H3>
        </ListItem>
        <ListItem style={listItem}>
          <Text style={styles.text}>
            {`من لايشكر الناس لا يشكر الله، نود أن نعبر عن جزيل شكرنا للأستاذ/ عبدالوهاب الرشود الذى أقدم طواعية لرعاية هذا المشروع الغير ربحى، ونود أن نشكر الأخ حسن نور لتيسير الدعم لهذا المشروع، وأيضا نود أن نشكر مطوربرمجياتنا أزرول أزوار الذى بدون أن نسأله ثانية أجابنا إلى كل ماطلبناه منه.

نود أيضا أن نشكر فريق اختباراتنا الرائع، الأخ عدنان تونسى ، الأخ فهيم الدين شريف، الأخ نيسار أحمد، الأخ شيخ إلياس ، الأخ طيب باوزير و الأخ إيجاز أحمد.





ندعو الله سبحانه وتعالى أن يبارك فيكم ويجزى كل منكم بمكان فى الجنة، آمين يا رب.

ونسأل لنا أن يغفر لنا أى خطأ ارتكبناه أثناء عملنا على هذا المشروع.
`}
          </Text>
        </ListItem>
      </View>
    );
  }
}
