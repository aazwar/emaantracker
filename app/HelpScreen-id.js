import React from 'react';
import { StyleSheet, Text, Dimensions, WebView, Image, TouchableHighlight, Linking } from 'react-native';
import { Container, Content, Header, Body, Title, Button, Left, Right, Icon, View } from 'native-base';
import { CheckBox, List, ListItem, Separator, H1, H2, H3 } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

export default class ShareScreen extends React.Component {
  render() {
    let w = Dimensions.get('window');
    let listItem = { backgroundColor: 'transparent'};
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
          <H3>Apakah Aplikasi EmaanTracker itu?​</H3>
        </ListItem>
        <ListItem style={listItem}>
          <Grid>
            <Row>
              <Text>
                {`Seperti aplikasi fitness yang memantau status kebugaran, EmaanTracker membantu Anda untuk memantau ibadah dan doa keseharian Anda. Aplikasi ini diilhami oleh ayat Quran berikut:`}
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
                {`(Sungguh beruntung orang yang menyucikan diri) – Surat Al-A’la`}
              </Text>
            </Row>
            <Row>
              <Text>
                {`

Dengan aplikasi mobile ini, Anda dapat memantau kegiatan ibadah Anda. Anda dapat mencentang kegiatan yang sudah Anda lakukan. Setelah beberapa waktu menggunakan aplikasi ini, Anda akan dapat melihat warna status. Ini untuk lebih mendorong Anda mengerjakan sholat secara teratur dan lengkap, Insya Allah.`}
              </Text>
            </Row>
          </Grid>
        </ListItem>
        <ListItem style={listItem}>
          <H3>STATUS IMAN</H3>
        </ListItem>
        <ListItem style={listItem}>
          <Text>
            {`Tujuan dari Status Iman adalah untuk meningkatkan kewaspadaan ketika performansi Anda kurang dalam menjalankan kewajiban sebagai sebagai seorang muslim, dengan menunjukkan status iman dalam warna hijau dan merah.. 

`}
            <Text style={{ fontWeight: 'bold', color: 'green' }}>
              {'HIJAU'}
            </Text>
            {`
Status Iman Anda menjadi hijau bila Anda tidak melewatkan/mengerjakan sholat di luar waktu lebih dari 4x dalam 1 bulan.

`}
            <Text style={{ fontWeight: 'bold' }}>
              {'ANTARA HIJAU DAN MERAH'}
            </Text>
            {`​
Status Iman Anda menjadi antara hijau dan merah bila Anda melewatkan/mengerjakan sholat di luar waktu rata-rata 1x sehari (misalnya selalu bangun kesiangan untuk sholat Shubuh), atau 80%.

`}

            <Text style={{ fontWeight: 'bold', color: 'red' }}>
              {'MERAH'}
            </Text>
            {`
Status Iman Anda akan menjadi merah bila Anda melewatkan/mengerjakan sholat di luar waktu lebih dari 80% dalam satu bulan.`}
          </Text>
        </ListItem>
        <ListItem style={listItem}>
          <H3>Sholatku</H3>
        </ListItem>
        <ListItem style={listItem}>
          <Text>
            {`Pada bagian ini, Anda diminta untuk mengisi kegiatan sholat Anda. Anda pilihan mengerjakan sholat di Masjid, sendirian, di luar waktu, atau tidak mengerjakan. Informasi ini akan direkam dan digunakan untuk membuat laporan dan untuk perhitungan warna status iman. 

Untuk perhatian, semua informasi Anda dirahasiakan. `}
          </Text>
        </ListItem>
        <ListItem style={listItem}>
          <H3>Quranku</H3>
        </ListItem>
        <ListItem style={listItem}>
          <Text>{`Pada bagian ini, Anda diminta untuk mengisi kegiatan yang berkaitan dengan Quran. Pilihan yang disediakan adalah membaca, dengan terjemah, dengan tafsir, atau tidak membaca sama sekali. 

CATATAN: Sebagian besar muslim merasa bahwa memahami Quran adalah pekerjaan 'alim-'ulama, sedangkan mereka cukup dengan membaca buku yang ditulis oleh para 'alim-'ulama. Pemikiran tidak hanya salah dan tidak berdasar, karena akan menghilankan cahaya Al-Quran dari mereka, dan juga menjerumuskan ke dalam kultus individu terhadap 'alim-'ulama.

Sekarang ini banyak tafsir yang tersedia baik dalam bentuk buku atau online, maka mari kita luangkan waktu untuk membaca kitab Allah dan memahami maknanya.`}</Text>
        </ListItem>
        <ListItem style={listItem}>
          <H3>Kegiatan Lain</H3>
        </ListItem>
        <ListItem style={listItem}>
          <Text>{`Pada bagian ini Anda bisa mencatat aktivitas ibadah sunah seperti puasa, infak dan sedekah. Mari luangkan waktu sebentar untuk mengisinya setiap hari.`}</Text>
        </ListItem>
        <ListItem style={listItem}>
          <H3>Laporan</H3>
        </ListItem>
        <ListItem style={listItem}>
          <Text>
            {`Pada bagian ini Anda dapat melihat semua catatan ibadah secara lengkap dalam laporan bulanan. Anda dapat juga melihat grafik untuk melihat adanya perkembangan atau kemunduran dalam ibadah.

Anda dapat juga membagikan laporan bulanan kepada keluarga Anda. 
 
CATATAN: Jangan membagikan dengan niat pamer, karena bisa merusakkan pahala ibadah.`}
          </Text>
        </ListItem>
        <ListItem style={listItem}>
          <H3>BUKU</H3>
        </ListItem>
        <ListItem style={listItem}>
          <Text>
            {`Pada bagian ini ada beberapa buku-buku Islam yang bisa Anda baca. Apa yang Anda baca akan tercatat dalam laporan bulanan.`}
          </Text>
        </ListItem>
      </View>
    );
  }
}
