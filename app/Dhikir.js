export default function dhikr(time) {
  // time: 'morning', 'petang'
  let dhikir = {
    title: `${time == 'morning' ? 'Morning' : 'Evening'} Dhikr`,
    section: [
      {
        content: [
          {
            text: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
            caption: `"I seek refuge in Allah from Shaitan, the accursed one." `,
            type: 'arabic',
          },
        ],
      },
      {
        title: 'Recite Ayatul Kursi',
        content: [
          {
            text: `اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ، لاَ تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ، لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ، مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلاَّ بِإِذْنِهِ، يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ، وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلاَّ بِمَا شَاءَ، وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ، وَلَا يَئُودُهُ حِفْظُهُمَا، وَهُوَ الْعَلِيُّ الْعَظِيمُ`,
            caption: `Allah! There is no god but He - the Living, The Self-subsisting, Eternal. No slumber can seize Him Nor Sleep. His are all things In the heavens and on earth. Who is there can intercede In His presence except As he permitteth? He knoweth what (appeareth to His creatures As) Before or After or Behind them. Nor shall they compass Aught of his knowledge Except as He willeth. His throne doth extend Over the heavens And on earth, and He feeleth No fatigue in guarding And preserving them, For He is the Most High. The Supreme (in glory).`,
            type: 'arabic',
          },
        ],
        remark: `Prophet Mohammad (S.A.W.) stated that a person who has recited (the underlying) in the morning, he has pleased (praised, glorified) Allah for His favours of the morning, and if he has done so in the night, he has thanked Allah for His favours of the night.

(Abu Dawood, Nisai)`,
      },
      {
        title: 'Recite surah Al-Ikhlash, Al-Falaq dan An-Naas 3x',
        content: [
          {
            text: `بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
قُلْ هُوَ اللَّهُ أَحَدٌ اللَّهُ الصَّمَدُ لَمْ يَلِدْ وَلَمْ يُولَدْ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ`,
            caption: `Say, "He is Allah, [who is] One, Allah, the Eternal Refuge. He neither begets nor is born,mNor is there to Him any equivalent."
(QS. Al-Ikhlas: 1-4) (Recite 3x)`,
            type: 'arabic',
          },
          {
            text: `بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ مِن شَرِّ مَا خَلَقَ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ  وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ`,
            caption: `Say, "I seek refuge in the Lord of daybreak From the evil of that which He created And from the evil of darkness when it settles And from the evil of the blowers in knots And from the evil of an envier when he envies."
(QS. Al-Falaq: 1-5) (Recite 3x)`,
            type: 'arabic',
          },
          {
            text: `بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
قُلْ أَعُوذُ بِرَبِّ النَّاسِ مَلِكِ النَّاسِ إِلَهِ النَّاسِ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ مِنَ الْجِنَّةِ وَ النَّاسِ`,
            caption: `“Say, "I seek refuge in the Lord of mankind, The Sovereign of mankind. The God of mankind, From the evil of the retreating whisperer - Who whispers [evil] into the breasts of mankind - From among the jinn and mankind.”
(QS. An Naas: 1-6) (Dibaca 3 x)`,
            type: 'arabic',
          },
        ],
        remark: `The recitation of Surah Ikhlaas, Surah Falaq and Surah Naas three times each in the mornings and evenings, has been encouraged in the Ahadith.
`,
      },
      {
        content: [
          time == 'morning'
            ? {
                text: `أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيْكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيْرُ. رَبِّ أَسْأَلُكَ خَيْرَ مَا فِيْ هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوْذُ بِكَ مِنْ شَرِّ مَا فِيْ هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوْذُ بِكَ مِنَ الْكَسَلِ وَسُوْءِ الْكِبَرِ، رَبِّ أَعُوْذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ`,
                caption: `“The morning has come to me and the whole universe belongs to Allah, the Lord of the worlds, O Allah, I ask of you the good of the day, it's success and aid and it's nur (celestial light) and barakaat (blessings) and seek hidayah (guidance) and seek refuge from the evil in it (this day) and from the evil of that which is to come later.” (Recite 1x)`,
                type: 'arabic',
              }
            : {
                text: `أَمْسَيْنَا وَأَمْسَى الْمُلْكُ للهِ، وَالْحَمْدُ للهِ، لَا إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُبِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا، رَبِّ أَعُوذُبِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُبِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ`,
                caption: `“The evening has come to me and the whole universe belongs to Allah who is The Lord of the worlds. O Allah, I ask of you the good of the night, it's success and aid and its nur (celestial light) and barakaat (blessings) and seek hidayat (guidance) and refuge from the evil of this night and the evil that is to come later.” (Recite 1 x)`,
                type: 'arabic',
              },
        ],
      },
      {
        content: [
          time == 'morning'
            ? {
                text: `اَللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوْتُ وَإِلَيْكَ النُّشُوْرُ`,
                caption: `“O Allah we enter the day time and the evening and die with your Qudrat (power) and to You do we return.
” (Recite 1x)`,
                type: 'arabic',
              }
            : {
                text: `اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا،وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيْرُ`,
                caption: `“O Allah we enter the night and the day and live and die with Your Qudrat (strength) and to You do we return.” (Recite 1x)`,
                type: 'arabic',
              },
        ],
      },
      {
        title: 'Recite Sayyidul Istighfar',
        content: [
          {
            text: `اَللَّهُمَّ أَنْتَ رَبِّيْ لاَ إِلَـهَ إِلاَّ أَنْتَ، خَلَقْتَنِيْ وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوْذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوْءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوْءُ بِذَنْبِيْ فَاغْفِرْ لِيْ فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوْبَ إِلاَّ أَنْتَ.`,
            caption: `“O Allah, You are my Lord. none has the right to be worshiped except You. You created me. I am Your slave. I abide to Your covenant and promise as best I can. I take refuge in You from the evil of which I committed. I acknowledge Your favour upon me. I acknowledge my sin. so forgive me, for verily none can forgive sin except You.” (Recite 1x)`,
            type: 'arabic',
          },
        ],
        remark: `Prophet Muhammad (peace be upon Him) daid, “If somebody recites it (Syyidul isfighfar) during the day with strong faith in it and dies on that day before the evening, he will be from the people of jannah and if somebody recites it at night with srong faith in it and dies before the morning he will be from the people of jannah.”
Sahih Al-Bukhari, Volume 8, Book 75, Number 318`,
      },
      {
        content: [
          time == 'morning'
            ? {
                text: `اَللَّهُمَّ إِنِّيْ أَصْبَحْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلاَئِكَتَكَ وَجَمِيْعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللهُ لاَ إِلَـهَ إِلاَّ أَنْتَ وَحْدَكَ لاَ شَرِيْكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُوْلُكَ`,
                caption: `“O Allah, I now, passing through the morning time, testify to You and I testify to the carriers of Your Throne, Your angels, and to all your creations that You are Allah; no one is God but You with no partners and that Muhammad is Your slave and Messenger.” (Recite 4x)`,
                type: 'arabic',
              }
            : {
                text: `اَللَّهُمَّ إِنِّيْ أَمْسَيْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلاَئِكَتَكَ وَجَمِيْعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللهُ لاَ إِلَـهَ إِلاَّ أَنْتَ وَحْدَكَ لاَ شَرِيْكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُوْلُكَ`,
                caption: `“O Allah, I now, passing through the evening time, testify to You and I testify to the carriers of Your Throne, Your angels, and to all your creations that You are Allah; no one is God but You with no partners and that Muhammad is Your slave and Messenger.” (Dibaca 4 x)`,
                type: 'arabic',
              },
        ],
      },
      {
        content: [
          time == 'morning'
            ? {
                text: `اللَّهُمَّ مَا أمَْسيَ بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ`,
                caption: `O Allah! Whatever blessing I have risen upon this morning is from You Alone, You have no partner. So, for You is all praise and unto You all thanks.`,
                type: 'arabic',
              }
            : {
                text: `اللَّهُمَّ مَا أمَْسيَ بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ`,
                caption: `YO Allah! Whatever blessing I have risen upon this evening is from You Alone, You have no partner. So, for You is all praise and unto You all thanks.`,
                type: 'arabic',
              },
        ],
      },
      {
        content: [
          {
            text: `اللهمّ عافني في بدني، اللهم عافني في سمعي، اللهم عافني في بصري لا إله إلا أنت. اللهم	إني أعوذ بك من الكـفر والفقر، وأعوذ بك من عذاب القبر لا إله إلا أنت.`,
            transliteration: `Allahumma ‘afini fi badani. Allahumma ‘afini fi sam’i. Allahumma ‘afini fi bashari. Allahumma inni a’udzu bika minal kufri wal faqri. Allahumma inni a’udzu bika min ‘adzabil qabri. La ilaha illa anta.`,
            caption: `“O Allah, make me healthy in my body. O Allah, preserve for me my hearing.O Allah, preserve for me my sight. There is none worthy of worship but You.
O Allah, i seek refuge in you from disbelief and poverty and i seek refuge in you from the punishment of the grave. There is none wothy of worship but you.”`,
            type: 'arabic',
          },
        ],
      },
      {
        content: [
          {
            text: `حَسْبِيَ اللّهُ لا إِلَـهَ إِلاَّ هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ`,
            caption: `“Allah is sufficient for me. None has the right to be worshiped but He, in Him I put my trust & He is the Lord of the Mighty Throne." (Recite 7x)`,
            type: 'arabic',
          },
        ],
      },
      {
        content: [
          {
            text: `اَللَّهُمَّ إِنِّيْ أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَاْلآخِرَةِ، اَللَّهُمَّ إِنِّيْ أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِيْنِيْ وَدُنْيَايَ وَأَهْلِيْ وَمَالِيْ اللَّهُمَّ اسْتُرْ عَوْرَاتِى وَآمِنْ رَوْعَاتِى. اَللَّهُمَّ احْفَظْنِيْ مِنْ بَيْنِ يَدَيَّ، وَمِنْ خَلْفِيْ، وَعَنْ يَمِيْنِيْ وَعَنْ شِمَالِيْ، وَمِنْ فَوْقِيْ، وَأَعُوْذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِيْ`,
            caption: `“O Allah, I ask You for forgiveness and well-being in this world and in the Hereafter. O Allah, I ask You for forgiveness and well-being in my religious and my worldly affairs. O Allah, conceal my faults, calm my fears, and protect me from before me and behind me, from my right and my left, and from above me, and I seek refuge in You from being taken unaware from beneath me.” (Recite 1x)`,
            type: 'arabic',
          },
        ],
      },
      {
        content: [
          {
            text: `اَللَّهُمَّ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ فَاطِرَ السَّمَاوَاتِ وَاْلأَرْضِ، رَبَّ كُلِّ شَيْءٍ وَمَلِيْكَهُ، أَشْهَدُ أَنْ لاَ إِلَـهَ إِلاَّ أَنْتَ، أَعُوْذُ بِكَ مِنْ شَرِّ نَفْسِيْ، وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ، وَأَنْ أَقْتَرِفَ عَلَى نَفْسِيْ سُوْءًا أَوْ أَجُرُّهُ إِلَى مُسْلِمٍ`,
            caption: `“O Allah! Knower of the hidden and the exposed! Creator of the heavens and the earth! Rubb of everything and every one. I bear witness that none has the right to be worshipped but You. I seek Your Protection from the evil of my own self from the evil of Satan and from the evil of Shirk to which he calls.” (Recite 1x)`,
            type: 'arabic',
          },
        ],
      },
      {
        content: [
          {
            text: `بِسْمِ اللَّهِ الَّذِى لاَ يَضُرُّ مَعَ اسْمِهِ شَىْءٌ فِى الأَرْضِ وَلاَ فِى السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِ`,
            caption: `“In the name of Allah, with Whose name nothing can cause harm on earth or in the heavens and He is The All-Hearer, The All-Knowing.” (Recite 3x)`,
            type: 'arabic',
          },
        ],
      },
      {
        content: [
          {
            text: `رَضِيْتُ بِاللهِ رَبًّا، وَبِاْلإِسْلاَمِ دِيْنًا، وَبِمُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا`,
            caption: `“I am pleased with Allah as my Lord, Islam as my Deen and Muhammad as my Prophet.” (Recite 3x)`,
            type: 'arabic',
          },
        ],
      },
      {
        content: [
          {
            text: `يَا حَيُّ يَا قَيُّوْمُ بِرَحْمَتِكَ أَسْتَغِيْثُ، وَأَصْلِحْ لِيْ شَأْنِيْ كُلَّهُ وَلاَ تَكِلْنِيْ إِلَى نَفْسِيْ طَرْفَةَ عَيْنٍ أَبَدًا`,
            caption: `“On You Who is Everliving and Sustains and Protects everything, I seek assistance through the means of your mercy, correct for me all my affairs and do not entrust me to my Nafs (myself) for the moment of a blink of an eye.” (Recite 1x)`,
            type: 'arabic',
          },
        ],
      },
      {
        content:
          time == 'morning'
            ? [
                {
                  text: `أَصْبَحْنَا عَلَى فِطْرَةِ اْلإِسْلاَمِ وَعَلَى كَلِمَةِ اْلإِخْلاَصِ، وَعَلَى دِيْنِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ، وَعَلَى مِلَّةِ أَبِيْنَا إِبْرَاهِيْمَ، حَنِيْفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِيْنَ`,
                  caption: `“We rise upon the fitrah of Islaam, and the word of pure faith, and upon the religion of our Prophet Muhammad and the religion of our forefather Ibraheem, who was a Muslim and of true faith and was not of those who associate others with Allaah” (Recite 1x)`,
                  type: 'arabic',
                },
              ]
            : null,
      },
      {
        content: [
          {
            text: `سُبْحَانَ اللهِ وَبِحَمْدِهِ`,
            transliteration: `Subhanallah wa bi-hamdih.`,
            caption: `“All Glory is to Allah and all Praise to Him” (Recite 100 x)`,
            type: 'arabic',
          },
        ],
        remark: `Narrated Abu Hurayrah (R.A) Allah's Apostle said "Whoever says, 'Subhan Allah wa bihamdihi,' one hundred times a day, will be forgiven all his sins even if they were as much as the foam of the sea.
[Bhukari Volume 8, Book 75, Number 414]`,
      },
      {
        content: [
          {
            text: `لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيْكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيْرُ`,
            caption: `“There is no god but Allah, alone, without partner. His is the sovereignty, and His the praise, and He has power over everything” (Recite 10x or 100x)`,
            type: 'arabic',
          },
        ],
        remark: `100 times a day will have a reward equivalent to the reward for freeing 10 slaves. Also, 100 deeds will be recorded for him & 100 bad deeds of his will be wiped off, & it will be a safeguard for him from Satan that day until evening, & no one will be better in deeds than such a person except he who does more than that.” 
[Bukhari, Muslim, Tirmidhi, Nasa’i and Ibn Majah]`,
      },
      {
        content:
          time == 'morning'
            ? [
                {
                  text: `سُبْحَانَ اللهِ وَبِحَمْدِهِ: عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ وَمِدَادَ كَلِمَاتِهِ`,
                  caption: `“Glory is to Allaah and praise is to Him, by the multitude of his creation, by His Pleasure, by the weight of His Throne, and by the extent of His Words.” (Recite 3x)`,
                  type: 'arabic',
                },
              ]
            : null,
        remark: `Juwairiyah (radhi Allaahu anha) reported that one day the Prophet, peace be upon him, left her apartment in the morning as she was busy observing her dawn prayer in her place of worship. He came back in the forenoon and she was still sitting there. The Prophet, peace be upon him, said to her, “You have been in the same place since I left you?” She said, “Yes.” Thereupon the Prophet, peace be upon him, said, “I recited four words three times after I left you and if these were to be weighed against what you have recited since morning these would outweigh them
[Muslim 4/2090]`,
      },
      {
        content:
          time == 'morning'
            ? [
                {
                  text: `اَللَّهُمَّ إِنِّيْ أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلاً مُتَقَبَّلاً`,
                  caption: `“O Allah! I ask You for knowledge that is of benefit, a good provision and deeds that will be accepted.” (Recite 1x after Fajr prayer)`,
                  type: 'arabic',
                },
              ]
            : null,
      },
      {
        content: [
          {
            text: `أَسْتَغْفِرُ اللهَ وَأَتُوْبُ إِلَيْهِ`,
            transliteration: `Astagh-firullah wa atuubu ilaih.`,
            caption: `“Verily, I seek the forgiveness of Allah, and I turn to Him in repentance.” (Recite 100x in a day)`,
            type: 'arabic',
          },
        ],
      },
    ],
  };
  dhikir.section = dhikir.section.filter(section => section.content);
  return dhikir;
}
