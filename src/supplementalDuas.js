export const supplementalCollections = [
  { id: "istikhara", label: "دعاء الاستخارة", description: "طلب الخيرة", shortcut: null },
  { id: "rain-thunder", label: "أدعية المطر والرعد", description: "مطر ورعد ورياح", shortcut: null },
  { id: "distress", label: "أدعية الكرب", description: "تفريج وطمأنينة", shortcut: null },
  { id: "ease", label: "أدعية التيسير", description: "عند تعسر الأمر", shortcut: null },
  { id: "extra-protection", label: "أدعية التحصين", description: "حفظ ووقاية", shortcut: null }
];

export const supplementalDuas = [
  {
    id: "dua-istikhara",
    category: "دعاء الاستخارة",
    categoryNumber: 950,
    duaNumber: 1,
    order: 1,
    text: "اللهم إني أستخيرك بعلمك، وأستقدرك بقدرتك، وأسألك من فضلك العظيم، فإنك تقدر ولا أقدر، وتعلم ولا أعلم، وأنت علام الغيوب. اللهم إن كنت تعلم أن هذا الأمر خير لي في ديني ومعاشي وعاقبة أمري، فاقدره لي ويسره لي ثم بارك لي فيه، وإن كنت تعلم أن هذا الأمر شر لي في ديني ومعاشي وعاقبة أمري، فاصرفه عني واصرفني عنه، واقدر لي الخير حيث كان ثم أرضني به.",
    note: "دعاء الاستخارة كما ورد في حديث جابر رضي الله عنه: كان النبي ﷺ يعلمهم الاستخارة في الأمور كلها.",
    source: "صحيح البخاري",
    target: 1,
    collectionId: "istikhara",
    collectionLabel: "دعاء الاستخارة",
    tags: ["istikhara", "استخارة"]
  },
  {
    id: "dua-rain",
    category: "أدعية المطر والرعد",
    categoryNumber: 950,
    duaNumber: 2,
    order: 2,
    text: "اللهم صيبًا نافعًا.",
    note: "كان النبي ﷺ يقول عند رؤية المطر: اللهم صيبًا نافعًا.",
    source: "صحيح البخاري",
    target: 1,
    collectionId: "rain-thunder",
    collectionLabel: "أدعية المطر والرعد",
    tags: ["rain", "مطر"]
  },
  {
    id: "dua-after-rain",
    category: "أدعية المطر والرعد",
    categoryNumber: 950,
    duaNumber: 3,
    order: 3,
    text: "مُطِرْنَا بِفَضْلِ اللَّهِ وَرَحْمَتِهِ.",
    note: "ذكر يقال بعد نزول المطر إقرارًا بفضل الله ورحمته.",
    source: "صحيح البخاري وصحيح مسلم",
    target: 1,
    collectionId: "rain-thunder",
    collectionLabel: "أدعية المطر والرعد",
    tags: ["rain", "مطر"]
  },
  {
    id: "dua-thunder",
    category: "أدعية المطر والرعد",
    categoryNumber: 950,
    duaNumber: 4,
    order: 4,
    text: "سُبْحَانَ الَّذِي يُسَبِّحُ الرَّعْدُ بِحَمْدِهِ وَالْمَلَائِكَةُ مِنْ خِيفَتِهِ.",
    note: "ورد عن عبد الله بن الزبير رضي الله عنهما أنه كان يقوله إذا سمع الرعد.",
    source: "الموطأ بإسناد صحيح إلى ابن الزبير",
    target: 1,
    collectionId: "rain-thunder",
    collectionLabel: "أدعية المطر والرعد",
    tags: ["thunder", "رعد"]
  },
  {
    id: "dua-distress",
    category: "أدعية الكرب",
    categoryNumber: 950,
    duaNumber: 5,
    order: 5,
    text: "لا إله إلا أنت سبحانك إني كنت من الظالمين.",
    note: "دعاء ذي النون عليه السلام في الكرب، وقد ورد في القرآن الكريم في سورة الأنبياء.",
    source: "القرآن الكريم، سورة الأنبياء",
    target: 3,
    collectionId: "distress",
    collectionLabel: "أدعية الكرب",
    tags: ["distress", "كرب"]
  },
  {
    id: "dua-ease",
    category: "أدعية التيسير",
    categoryNumber: 950,
    duaNumber: 6,
    order: 6,
    text: "اللهم لا سهل إلا ما جعلته سهلًا، وأنت تجعل الحزن إذا شئت سهلًا.",
    note: "دعاء نافع عند تعسر الأمر، ومعناه سؤال الله تيسير الصعب.",
    source: "حسنه جمع من أهل العلم",
    target: 1,
    collectionId: "ease",
    collectionLabel: "أدعية التيسير",
    tags: ["ease", "تيسير"]
  },
  {
    id: "dua-protection-children",
    category: "أدعية التحصين",
    categoryNumber: 950,
    duaNumber: 7,
    order: 7,
    text: "أعيذك بكلمات الله التامة من كل شيطان وهامة، ومن كل عين لامة.",
    note: "كان النبي ﷺ يعوذ بها الحسن والحسين رضي الله عنهما.",
    source: "صحيح البخاري",
    target: 1,
    collectionId: "extra-protection",
    collectionLabel: "أدعية التحصين",
    tags: ["protection", "تحصين"]
  }
];
