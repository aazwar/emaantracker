import SQLite from 'react-native-sqlite-storage';
import moment from 'moment';
import FileSystem from 'react-native-fs';
import Setting from './Setting';

const database = 'record.db';

export default class Db {
  constructor() {
    this.db = SQLite.openDatabase(
      { name: database, location: 'default' },
      () => {},
      err => {
        console.log('SQL Error: ' + err);
      }
    );
  }

  async check() {
    await this.db.transaction(async tx => {
      /*
        Salah:
        null = no input
        1 Jamaah
        2 On Time
        3 Qadha
        4 Miss
        Dhikr
        0 or null = no dhikr
        1 Dhikr
      */
      await tx.executeSql(
        `CREATE TABLE IF NOT EXISTS salah (date DATE PRIMARY KEY NOT NULL, 
          salah1 TINYINT, salah2 TINYINT, salah3 TINYINT, salah4 TINYINT, salah5 TINYINT, 
          dhikr1 TINYINT, dhikr2 TINYINT, dhikr3 TINYINT, dhikr4 TINYINT, dhikr5 TINYINT)`
      );
      /* Quran Reading:
        0 or null =  not reading
        1 = reading
        2 = reading with translation
        3 = reading tafseer
      */
      await tx.executeSql(
        `CREATE TABLE IF NOT EXISTS quran (date DATE PRIMARY KEY NOT NULL, 
          quran1 TINYINT, quran2 TINYINT, quran3 TINYINT, quran4 TINYINT, quran5 TINYINT)`
      );
      /*
        Daily Activity:
        a1: 'Have wudhu before sleep', 
        a2: 'Read Tasbiḥ 33x, Taḥmid 33x, Takbir 34x', 
        a3: 'Read Al-Mulk', 
        a4: 'Early Sleep', 
        a5: 'Tahajjud', 
        as2: 'SUNNAH RAWĀTIB',
        a6: 'Two Rakaa before Fajr', 
        a7: 'Four Rakaa before Dhuhr', 
        a8: 'Two Rakaa after Dhuhr', 
        a9: 'Two Rakaa after Maghrib', 
        a10: 'Two Rakaa after Isha',
        as3: 'HADITH ABU BAKR',
        a11: 'Fasting', 
        a12: 'Follow Funeral', 
        a13: 'Serve food to the need', 
        a14: 'Visit the sick', 
      
      */
      await tx.executeSql(
        `CREATE TABLE IF NOT EXISTS daily_activity (date DATE PRIMARY KEY NOT NULL, 
          a1 TINYINT, a2 TINYINT, a3 TINYINT, a4 TINYINT, a5 TINYINT, a6 TINYINT, 
          a7 TINYINT, a8 TINYINT, a9 TINYINT, a10 TINYINT, a11 TINYINT, a12 TINYINT, 
          a13 TINYINT, a14 TINYINT, a15 TINYINT, a16 TINYINT, a17 TINYINT, a18 TINYINT, 
          a19 TINYINT, a20 TINYINT)`
      );
      /*
        - The date always the first day of the month
        a1: 'Attendance in Ijtema', 
        a2: 'Go to Majlis \'Ilm', 
        a3: 'Paid membership fee/Ayanah', 
        bs2: 'DAWAH ACTIVITY',
        a4: 'By print material', 
        a5: 'Via Internet (Mail/Social Media)', 
        a6: 'To close contacts', 
        a7: 'Street dawah to strangers',
        bs3: 'CHARITY',
        a8: 'Infaq fii Sabilillah',
        a9: 'Qard Al-Hasan (e.g. interest free loan)',
        a10: 'Volunteer Work',
      */
      await tx.executeSql(
        `CREATE TABLE IF NOT EXISTS monthly_activity (date DATE PRIMARY KEY NOT NULL, 
          a1 TINYINT, a2 TINYINT, a3 TINYINT, a4 TINYINT, a5 TINYINT, a6 TINYINT, 
          a7 TINYINT, a8 TINYINT, a9 TINYINT, a10 TINYINT, a11 TINYINT, a12 TINYINT, 
          a13 TINYINT, a14 TINYINT, a15 TINYINT, a16 TINYINT, a17 TINYINT, a18 TINYINT, 
          a19 TINYINT, a20 TINYINT)`
      );
      await tx.executeSql(
        `CREATE TABLE IF NOT EXISTS books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT,
        author TEXT, publisher TEXT, pages INT, finished TINYINT default 0)`
      );
      /*
        - The date always the first day of the month        
      */
      await tx.executeSql(`CREATE TABLE IF NOT EXISTS reading (date DATE, id INTEGER, pages INT, PRIMARY KEY(date, id))`);
    });
  }

  async migrate() {
    const oldDb = FileSystem.DocumentDirectoryPath + '/SQLite/record.db';
    console.log(`migrating old db: ${oldDb}`);
    let execsql = async (db, sql, params) => {
      return await db.transaction(async tx => {
        tx.executeSql(
          sql,
          params,
          (_, { insertId, rowsAffected }) => [insertId, rowsAffected],
          (_, err) => console.log(`Err: sql=${sql}, params=${params}\n${err}`)
        );
      });
    };
    if (await FileSystem.exists(oldDb)) {
      SQLite.openDatabase({ name: database, location: 'default' }, db => {
        SQLite.openDatabase({ name: 'odb', createFromLocation: oldDb }, db => {
          db.attach(database, 'cdb', async () => {
            await execsql(db, 'INSERT OR IGNORE into cdb.salah SELECT * FROM salah');
            await execsql(db, 'INSERT OR IGNORE into cdb.quran SELECT * FROM quran');
            await execsql(db, 'INSERT OR IGNORE into cdb.daily_activity SELECT * FROM daily_activity');
            await execsql(db, 'INSERT OR IGNORE into cdb.monthly_activity SELECT * FROM monthly_activity');
          });
        });
      });
    }
  }

  async select_query(sql, params) {
    return await new Promise(resolve => {
      this.db.transaction(async tx => {
        var x = await new Promise(resolve =>
          tx.executeSql(
            sql,
            params,
            (_, results) => resolve(results.rows.raw()),
            (_, err) => console.log(`Err: sql=${sql}, params=${params}\n${err}`)
          )
        );
        resolve(x);
      });
    });
  }

  async execute_query(sql, params) {
    return await this.db.transaction(async tx => {
      tx.executeSql(
        sql,
        params,
        (_, { insertId, rowsAffected }) => [insertId, rowsAffected],
        (_, err) => console.log(`Err: sql=${sql}, params=${params}\n${err}`)
      );
    });
  }

  async store_salah_data(date, salah, dhikr) {
    let sql = `INSERT OR REPLACE INTO salah VALUES('${date}',${salah.join(',')},${dhikr.map(x => x | 0).join(',')})`;
    await this.execute_query(sql);
  }

  async load_salah_data(date) {
    let data = await this.select_query(`SELECT * FROM salah WHERE date = '${date}'`, []);
    if (data && data.length) {
      let salah = [1, 2, 3, 4, 5].map(i => data[0]['salah' + i]);
      let dhikr = [1, 2, 3, 4, 5].map(i => data[0]['dhikr' + i]);
      return { salah, dhikr };
    } else {
      return { salah: [0, 0, 0, 0, 0], dhikr: [0, 0, 0, 0, 0] };
    }
  }

  /*
    Data format: array of int for each prayer time
    0: not reading
    1: Reading
    2: With Translation
    3: With Tafseer
    ex: [1,3,0,0,1]
  */
  async store_quran_data(date, quran) {
    let sql = `INSERT OR REPLACE INTO quran VALUES('${date}', ${quran.join(', ')})`;
    return await this.execute_query(sql);
  }

  async load_quran_data(date) {
    let data = await this.select_query(`SELECT * FROM quran WHERE date = '${date}'`, []);
    if (data && data.length) {
      return [1, 2, 3, 4, 5].map(i => data[0]['quran' + i]);
    } else {
      return [0, 0, 0, 0, 0];
    }
  }

  /*
    Data format: array of int[20]
    date always the first day of month
  */
  async store_daily_activity_data(date, ibada) {
    let sql = `INSERT OR REPLACE INTO daily_activity VALUES('${date}', ${ibada.join(', ')})`;
    return await this.execute_query(sql);
  }

  async load_daily_activity_data(date) {
    let data = await this.select_query(`SELECT * FROM daily_activity WHERE date = '${date}'`, []);
    if (data && data.length) {
      let d = data[0];
      delete d.date;
      return d;
    } else {
      d = {};
      for (i = 1; i <= 20; i++) {
        d[`a${i}`] = false;
      }
      return d;
    }
  }

  async store_monthly_activity_data(date, activity) {
    let sql = `INSERT OR REPLACE INTO monthly_activity VALUES('${date}', ${activity.join(', ')})`;
    return await this.execute_query(sql);
  }

  async load_monthly_activity_data(date) {
    let data = await this.select_query(`SELECT * FROM monthly_activity WHERE date = '${date}'`, []);
    if (data && data.length) {
      let d = data[0];
      delete d.date;
      return d;
    } else {
      d = {};
      for (i = 1; i <= 20; i++) {
        d[`a${i}`] = false;
      }
      return d;
    }
  }

  /*
    Book: { id, title, publisher, author, pages, finished }
    null id means insert
  */
  async store_book(book) {
    if (book.id) {
      sql = `UPDATE books SET title = ?, publisher = ?, author = ?, pages = ?, finished = ? WHERE id = ?`;
      return await this.execute_query(sql, [book.title, book.publisher, book.author, book.pages, book.finished, book.id]);
    } else {
      sql = `INSERT INTO books (title, publisher, author, pages) VALUES (?, ?, ?, ?)`;
      return await this.execute_query(sql, [book.title, book.publisher, book.author, book.pages]);
    }
  }

  delete_book(id) {
    this.db.transaction(tx => tx.executeSql('DELETE FROM books WHERE id = ?', [id]));
    this.db.transaction(tx => tx.executeSql('DELETE FROM reading WHERE id = ?', [id]));
  }

  async load_book(id) {
    sql = 'SELECT * FROM books WHERE id = ?';
    let data = await this.select_query(sql, [id]);
    if (data && data.length) {
      return data[0];
    }
  }

  async active_book_list(date) {
    return await this.select_query(
      `SELECT b.id, b.title, COALESCE(r.pages,0) as pages FROM books b
    LEFT JOIN (SELECT id, pages FROM reading WHERE date = ?) r ON b.id = r.id WHERE b.finished = 0`,
      [date]
    );
  }

  async book_list() {
    return await this.select_query(`SELECT id, title, finished FROM books ORDER BY title`);
  }

  async store_reading(date, book_id, pages) {
    sql = 'INSERT OR REPLACE INTO reading VALUES (?, ?, ?)';
    return await this.execute_query(sql, [date, book_id, pages]);
  }

  async load_reading(date, book_id) {
    let rec = await this.select_query('SELECT pages FROM reading WHERE date = ? AND id = ?', [date, book_id]);
    if (rec && rec.length) {
      return rec[0].pages;
    } else {
      return 0;
    }
  }

  // Report
  async load_report(date) {
    let ym = moment(date).format('YYYY-MM');
    let ld = moment(date).endOf('month').date();
    let dates = [];
    for (let i = 1; i <= ld; i++) {
      dates.push(i < 10 ? `${ym}-0${i}` : `${ym}-${i}`);
    }
    await this.execute_query('CREATE TEMP TABLE IF NOT EXISTS dates (date DATE, PRIMARY KEY(date))');
    await this.execute_query('DELETE FROM dates');
    let sql = 'INSERT INTO dates VALUES ' + dates.map(i => `('${i}')`).join(', ');
    await this.execute_query(sql);
    sql = `SELECT d.date, s.salah1, s.salah2, s.salah3, s.salah4, s.salah5, s.dhikr1, s.dhikr2, s.dhikr3, s.dhikr4, s.dhikr5
    FROM dates d LEFT JOIN salah s ON d.date = s.date`;
    let salah = await this.select_query(sql);
    let c = (f, v) => salah.filter(i => i[`salah${f}`] == v).length;
    let salah_summary = [
      [c(1, 1), c(2, 1), c(3, 1), c(4, 1), c(5, 1)],
      [c(1, 2), c(2, 2), c(3, 2), c(4, 2), c(5, 2)],
      [c(1, 3), c(2, 3), c(3, 3), c(4, 3), c(5, 3)],
      [c(1, 4), c(2, 4), c(3, 4), c(4, 4), c(5, 4)],
    ];
    let cym = moment().format('YYYY-MM'); // current year month
    let devider;
    if (ym == cym) {
      devider = moment().date();
    } else {
      devider = ld;
    }
    c = f => salah.filter(i => i[`dhikr${f}`]).length;
    let dhikr_summary = [c(1), c(2), c(3), c(4), c(5)].map(v => `${(v / devider * 100).toFixed(2)}%`);
    sql = `SELECT d.date, s.quran1, s.quran2, s.quran3, s.quran4, s.quran5 FROM dates d LEFT JOIN quran s ON d.date = s.date`;
    let quran = await this.select_query(sql);
    c = f => quran.filter(i => i[`quran${f}`]).length;
    let quran_summary = [c(1), c(2), c(3), c(4), c(5)].map(v => `${(v / devider * 100).toFixed(2)}%`);
    sql = `SELECT * FROM monthly_activity WHERE date = '${ym}-01'`;
    let ms = await this.select_query(sql);
    let monthly_summary;
    if (ms.length) {
      let { a1, a2, a3, a8, a9 } = ms[0];
      monthly_summary = [a2, a3, a8, a9];
    } else {
      monthly_summary = [0, 0, 0, 0];
    }
    sql = `SELECT COALESCE(SUM(pages), 0) as tpage FROM reading WHERE date = '${ym}-01'`;
    let reading = await this.select_query(sql);
    monthly_summary.push(reading[0].tpage);
    return {
      salah,
      salah_summary,
      dhikr_summary,
      quran_summary,
      monthly_summary,
    };
  }

  async monthly_summary(date, month = 6) {
    let start = moment(date).subtract(month - 1, 'months');
    let now = moment(date);
    let salah = [];
    let reading = [];
    let categories = [];
    let quran = [];
    for (i = 0; i < month; i++) {
      let r = moment(start).add(i, 'months');
      let r1 = r.format('YYYY-MM-01');
      let r2 = r.endOf('month').format('YYYY-MM-DD');
      let numOfDays = r.endOf('month').date();
      if (r.format('YYYY-MM') === now.format('YYYY-MM')) numOfDays = now.date();
      let sql = `SELECT salah1, salah2, salah3, salah4, salah5
        FROM salah WHERE date BETWEEN '${r1}' AND '${r2}'`;
      let recs = await this.select_query(sql);
      let msalah = recs
        .reduce(
          (sum, rec) => [
            (sum[0] += rec.salah1 > 0 ? 4 - rec.salah1 : 0),
            (sum[1] += rec.salah2 > 0 ? 4 - rec.salah2 : 0),
            (sum[2] += rec.salah3 > 0 ? 4 - rec.salah3 : 0),
            (sum[3] += rec.salah4 > 0 ? 4 - rec.salah4 : 0),
            (sum[4] += rec.salah5 > 0 ? 4 - rec.salah5 : 0),
          ],
          [0, 0, 0, 0, 0]
        )
        .map(i => i / numOfDays);
      salah.push(msalah);

      sql = `SELECT COALESCE(SUM(pages),0) AS value FROM reading WHERE date BETWEEN '${r1}' AND '${r2}'`;
      recs = await this.select_query(sql);
      reading.push(recs[0].value);

      sql = `SELECT quran1, quran2, quran3, quran4, quran5 FROM quran WHERE date BETWEEN '${r1}' AND '${r2}'`;
      console.log(sql);
      recs = await this.select_query(sql);
      let mquran = recs
        .reduce(
          (sum, rec) => [
            (sum[0] += rec.quran1 == 1 || rec.quran2 == 1 || rec.quran3 == 1 || rec.quran4 == 1 || rec.quran5 == 1),
            (sum[1] += rec.quran1 == 2 || rec.quran2 == 2 || rec.quran3 == 2 || rec.quran4 == 2 || rec.quran5 == 2),
            (sum[2] += rec.quran1 == 3 || rec.quran2 == 3 || rec.quran3 == 3 || rec.quran4 == 3 || rec.quran5 == 3),
          ],
          [0, 0, 0]
        )
        .map(i => i / numOfDays);
      quran.push(mquran);
      categories.push(r.month() + 1 == 1 ? r.format('YYYY') : r.format('MMM'));
    }
    salah = salah[0].map((x, i) => salah.map(x => x[i])); // transpose matrix
    quran = quran[0].map((x, i) => quran.map(x => x[i])); // transpose matrix
    return {
      salah,
      reading,
      quran,
      categories,
    };
  }

  /*
    0 = red
    1 = red/green
    2 = green
    3 = 1 star
    4 = 2 stars
    5 = 3 stars
  */
  async eman_status() {
    let start = moment().subtract(30, 'days').format('YYYY-MM-DD'); // last 30 days before today
    let end = moment().subtract(1, 'days').format('YYYY-MM-DD'); // start from yesterday
    const cond = `WHERE date BETWEEN '${start}' AND '${end}'`;

    let sql = 'SELECT MIN(date) as min_date FROM salah';
    let minDate = (await this.select_query(sql))[0].min_date;
    if (minDate === null || minDate > end) {
      return { point: 2 }; // no records or just've started today, pass green
    }

    let portion;
    if (minDate > start) {
      let days = moment.duration(moment(end).diff(moment(minDate)))._data.days + 1;
      portion = days / 30;
    } else {
      portion = 1;
    }

    sql = `SELECT salah1, salah2, salah3, salah4, salah5 FROM salah ${cond}`;
    let recs = await this.select_query(sql);
    const times = 150 * portion; // 30 days 5 prayers
    let jamaah = recs.reduce(
      (t, v) => t + (v.salah1 == 1) + (v.salah2 == 1) + (v.salah3 == 1) + (v.salah4 == 1) + (v.salah5 == 1),
      0
    );
    let ontime = recs.reduce(
      (t, v) => t + (v.salah1 == 2) + (v.salah2 == 2) + (v.salah3 == 2) + (v.salah4 == 2) + (v.salah5 == 2),
      0
    );
    let qadha = recs.reduce(
      (t, v) => t + (v.salah1 == 3) + (v.salah2 == 3) + (v.salah3 == 3) + (v.salah4 == 3) + (v.salah5 == 3),
      0
    );
    let miss = times - jamaah - ontime - qadha;
    sql = `SELECT quran1+quran2+quran3+quran4+quran5 AS quran FROM quran ${cond}`;
    recs = await this.select_query(sql);
    let quranDays = recs.filter(i => i.quran).length;
    sql = `SELECT a4+a5+a6+a7 AS dawa, a8 as infaq FROM monthly_activity ${cond}`;
    recs = await this.select_query(sql);
    let dawa, infaq;
    if (recs.length) {
      dawa = recs[0].dawa > 0;
      infaq = recs[0].infaq > 0;
    } else {
      dawa = false;
      infaq = false;
    }
    sql = `SELECT COALESCE(SUM(pages),0) as read FROM reading ${cond}`;
    recs = await this.select_query(sql);
    let reading = recs[0].read > 0;

    let point;
    //if (miss / times < 0.01 && qadha / times < 0.01 && jamaah / times >= 0.8 && quranDays / 30 / portion >= 0.5) {
    //} else if (miss / times < 0.03 && qadha / times < 0.02 && jamaah / times >= 0.45 && quranDays / 30 / portion >= 0.1) {
    if ((jamaah + ontime) / times > 0.97) {
      point = 2 + dawa + infaq + reading;
    } else if ((jamaah + ontime) / times > 0.8) {
      point = 1;
    } else {
      point = 0;
    }
    return {
      days: 30 * portion,
      jamaah,
      miss,
      ontime,
      qadha,
      quranDays,
      dawa,
      infaq,
      reading,
      'miss%': miss / times,
      'qadha%': qadha / times,
      'jamaah%': jamaah / times,
      'quran%': quranDays / 30 / portion,
      point,
    };
  }

  test() {
    let start = moment().subtract(30, 'days'); // last 30 days before today
    let end = moment().subtract(1, 'days'); // start from yesterday
    let current = start.clone();
    let dates = [];
    do {
      dates.push(current.format('YYYY-MM-DD'));
      current.add(1, 'day');
    } while (current < end);
    let sql = `INSERT OR REPLACE INTO salah VALUES ` + dates.map(d => `('${d}',1,2,1,1,1,1,1,1,1,1)`).join(',');
    sql = `INSERT OR REPLACE INTO quran VALUES ` + dates.map(d => `('${d}',1,1,1,1,1)`).join(',');
  }
}
