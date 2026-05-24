import { surahMeta } from "../data";
import { supplementalCollections, supplementalDuas } from "../supplementalDuas";

const API_BASE = "https://api.islamic.app/v1";
const QURAN_API_BASE = "https://api.quran.com/api/v4";

export const dhikrCollections = [
  { id: "morning", label: "أذكار الصباح", description: "ورد بداية اليوم", shortcut: "morning" },
  { id: "evening", label: "أذكار المساء", description: "ورد نهاية اليوم", shortcut: "evening" },
  { id: "after-prayer", label: "أذكار بعد الصلاة", description: "بعد السلام", shortcut: "after-prayer" },
  { id: "before-sleep", label: "أذكار النوم", description: "قبل النوم", shortcut: "before-sleep" },
  { id: "waking-up", label: "أذكار الاستيقاظ", description: "بداية الاستيقاظ", shortcut: "waking-up" },
  { id: "protection", label: "أذكار التحصين", description: "حفظ وطمأنينة", shortcut: "protection" },
  { id: "forgiveness", label: "الاستغفار", description: "دعاء ومغفرة", shortcut: "forgiveness" },
  { id: "travel", label: "أذكار السفر", description: "الخروج والرجوع", shortcut: "travel" },
  { id: "dhul-hijjah", label: "فضل العشر من ذي الحجة", description: "تكبير وتهليل وعمل صالح", shortcut: null }
];

const dhulHijjahItems = [
  {
    id: "dhul-hijjah-1",
    category: "فضل العشر من ذي الحجة",
    categoryNumber: 900,
    duaNumber: 1,
    text: "ما من أيام العمل الصالح فيها أحب إلى الله من هذه الأيام.",
    note: "قالوا: يا رسول الله، ولا الجهاد في سبيل الله؟ قال: ولا الجهاد في سبيل الله إلا رجل خرج بنفسه وماله فلم يرجع من ذلك بشيء. رواه البخاري.",
    target: null,
    kind: "guidance",
    collectionId: "dhul-hijjah",
    collectionLabel: "فضل العشر من ذي الحجة"
  },
  {
    id: "dhul-hijjah-2",
    category: "فضل العشر من ذي الحجة",
    categoryNumber: 900,
    duaNumber: 2,
    text: "الله أكبر، الله أكبر، لا إله إلا الله، الله أكبر، الله أكبر، ولله الحمد.",
    note: "من صيغ التكبير المشهورة في عشر ذي الحجة وأيام التشريق، والمقصود الإكثار منها بلا عدد محدد.",
    target: null,
    kind: "guidance",
    collectionId: "dhul-hijjah",
    collectionLabel: "فضل العشر من ذي الحجة"
  },
  {
    id: "dhul-hijjah-3",
    category: "فضل العشر من ذي الحجة",
    categoryNumber: 900,
    duaNumber: 3,
    text: "فأكثروا فيهن من التهليل والتكبير والتحميد.",
    note: "ورد في فضل أيام العشر الحث على الإكثار من التهليل والتكبير والتحميد، فهي أبواب ذكر لا عدادات ثابتة.",
    target: null,
    kind: "guidance",
    collectionId: "dhul-hijjah",
    collectionLabel: "فضل العشر من ذي الحجة"
  },
  {
    id: "dhul-hijjah-4",
    category: "فضل العشر من ذي الحجة",
    categoryNumber: 900,
    duaNumber: 4,
    text: "لا إله إلا الله وحده لا شريك له، له الملك وله الحمد، وهو على كل شيء قدير.",
    note: "خير الدعاء دعاء يوم عرفة، وخير ما قاله النبيون: لا إله إلا الله وحده لا شريك له، له الملك وله الحمد، وهو على كل شيء قدير.",
    target: null,
    kind: "guidance",
    collectionId: "dhul-hijjah",
    collectionLabel: "فضل العشر من ذي الحجة"
  },
  {
    id: "dhul-hijjah-5",
    category: "فضل العشر من ذي الحجة",
    categoryNumber: 900,
    duaNumber: 5,
    text: "صيام يوم عرفة أحتسب على الله أن يكفر السنة التي قبله والسنة التي بعده.",
    note: "فضل صيام يوم عرفة لغير الحاج كما ورد في صحيح مسلم، وهو من أعظم أعمال العشر.",
    target: null,
    kind: "guidance",
    collectionId: "dhul-hijjah",
    collectionLabel: "فضل العشر من ذي الحجة"
  }
];

const afterPrayerItems = [
  {
    id: "after-prayer-istighfar",
    category: "أذكار بعد الصلاة",
    categoryNumber: 3,
    duaNumber: 1,
    order: 1,
    text: "أستغفر الله",
    note: "من الذكر الثابت عند الانصراف من الصلاة. رواه مسلم.",
    source: "صحيح مسلم",
    target: 3,
    kind: "dhikr",
    collectionId: "after-prayer",
    collectionLabel: "أذكار بعد الصلاة"
  },
  {
    id: "after-prayer-salam",
    category: "أذكار بعد الصلاة",
    categoryNumber: 3,
    duaNumber: 2,
    order: 2,
    text: "اللهم أنت السلام، ومنك السلام، تباركت يا ذا الجلال والإكرام",
    note: "من الذكر الثابت بعد السلام من الصلاة في صحيح مسلم.",
    source: "صحيح مسلم",
    target: 1,
    kind: "dhikr",
    collectionId: "after-prayer",
    collectionLabel: "أذكار بعد الصلاة"
  },
  {
    id: "after-prayer-subhanallah",
    category: "أذكار بعد الصلاة",
    categoryNumber: 3,
    duaNumber: 3,
    order: 3,
    text: "سبحان الله",
    note: "من حديث أبي هريرة رضي الله عنه: من سبح الله دبر كل صلاة ثلاثًا وثلاثين. رواه مسلم.",
    source: "صحيح مسلم",
    target: 33,
    kind: "dhikr",
    collectionId: "after-prayer",
    collectionLabel: "أذكار بعد الصلاة"
  },
  {
    id: "after-prayer-alhamdulillah",
    category: "أذكار بعد الصلاة",
    categoryNumber: 3,
    duaNumber: 4,
    order: 4,
    text: "الحمد لله",
    note: "من حديث أبي هريرة رضي الله عنه: وحمد الله ثلاثًا وثلاثين. رواه مسلم.",
    source: "صحيح مسلم",
    target: 33,
    kind: "dhikr",
    collectionId: "after-prayer",
    collectionLabel: "أذكار بعد الصلاة"
  },
  {
    id: "after-prayer-allahuakbar",
    category: "أذكار بعد الصلاة",
    categoryNumber: 3,
    duaNumber: 5,
    order: 5,
    text: "الله أكبر",
    note: "من حديث أبي هريرة رضي الله عنه: وكبر الله ثلاثًا وثلاثين. رواه مسلم.",
    source: "صحيح مسلم",
    target: 33,
    kind: "dhikr",
    collectionId: "after-prayer",
    collectionLabel: "أذكار بعد الصلاة"
  },
  {
    id: "after-prayer-tahleel",
    category: "أذكار بعد الصلاة",
    categoryNumber: 3,
    duaNumber: 6,
    order: 6,
    text: "لا إله إلا الله وحده لا شريك له، له الملك وله الحمد، وهو على كل شيء قدير",
    note: "تمام حديث التسبيح والتحميد والتكبير بعد الصلاة: غفرت خطاياه وإن كانت مثل زبد البحر. رواه مسلم.",
    source: "صحيح مسلم",
    target: 1,
    kind: "dhikr",
    collectionId: "after-prayer",
    collectionLabel: "أذكار بعد الصلاة"
  },
  {
    id: "after-prayer-la-mania",
    category: "أذكار بعد الصلاة",
    categoryNumber: 3,
    duaNumber: 7,
    order: 7,
    text: "اللهم لا مانع لما أعطيت، ولا معطي لما منعت، ولا ينفع ذا الجد منك الجد",
    note: "من الأذكار الثابتة دبر الصلاة في الصحيحين.",
    source: "صحيح البخاري وصحيح مسلم",
    target: 1,
    kind: "dhikr",
    collectionId: "after-prayer",
    collectionLabel: "أذكار بعد الصلاة"
  },
  {
    id: "after-prayer-la-hawla",
    category: "أذكار بعد الصلاة",
    categoryNumber: 3,
    duaNumber: 8,
    order: 8,
    text: "لا إله إلا الله وحده لا شريك له، له الملك وله الحمد، وهو على كل شيء قدير. لا حول ولا قوة إلا بالله. لا إله إلا الله، ولا نعبد إلا إياه، له النعمة وله الفضل وله الثناء الحسن. لا إله إلا الله مخلصين له الدين ولو كره الكافرون",
    note: "من الذكر الثابت بعد الصلاة كما في صحيح مسلم.",
    source: "صحيح مسلم",
    target: 1,
    kind: "dhikr",
    collectionId: "after-prayer",
    collectionLabel: "أذكار بعد الصلاة"
  },
  {
    id: "after-prayer-help-dhikr",
    category: "أذكار بعد الصلاة",
    categoryNumber: 3,
    duaNumber: 9,
    order: 9,
    text: "اللهم أعني على ذكرك، وشكرك، وحسن عبادتك",
    note: "وصية النبي ﷺ لمعاذ رضي الله عنه أن يقولها دبر كل صلاة.",
    source: "سنن أبي داود والنسائي",
    target: 1,
    kind: "dhikr",
    collectionId: "after-prayer",
    collectionLabel: "أذكار بعد الصلاة"
  },
  {
    id: "after-prayer-ayat-kursi",
    category: "أذكار بعد الصلاة",
    categoryNumber: 3,
    duaNumber: 10,
    order: 10,
    text: "اللَّهُ لا إِلَهَ إِلا هُوَ الْحَيُّ الْقَيُّومُ، لا تَأْخُذُهُ سِنَةٌ وَلا نَوْمٌ، لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الأَرْضِ، مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلا بِإِذْنِهِ، يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ، وَلا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلا بِمَا شَاءَ، وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالأَرْضَ، وَلا يَئُودُهُ حِفْظُهُمَا، وَهُوَ الْعَلِيُّ الْعَظِيمُ",
    note: "آية الكرسي مما ورد في الذكر بعد الصلاة، وأوردها حصن المسلم في هذا الباب.",
    source: "حصن المسلم",
    target: 1,
    kind: "dhikr",
    collectionId: "after-prayer",
    collectionLabel: "أذكار بعد الصلاة"
  }
];

function makeVerifiedDhikrItems(collectionId, collectionLabel, categoryNumber, collectionOrder, items) {
  return items.map((item, index) => ({
    id: `${collectionId}-${item.id}`,
    category: collectionLabel,
    categoryNumber,
    duaNumber: index + 1,
    order: index + 1,
    text: item.text,
    note: item.note || "",
    source: item.source || "حصن المسلم",
    target: item.target,
    kind: "dhikr",
    collectionId,
    collectionLabel,
    collectionOrder
  }));
}

const morningItems = makeVerifiedDhikrItems("morning", "أذكار الصباح", 1, 1, [
  {
    id: "opening",
    text: "الحمد لله وحده، والصلاة والسلام على من لا نبي بعده",
    target: 1,
    note: "افتتاح أذكار الصباح كما أورده حصن المسلم."
  },
  {
    id: "ayat-kursi",
    text: "اللَّهُ لا إِلَهَ إِلا هُوَ الْحَيُّ الْقَيُّومُ، لا تَأْخُذُهُ سِنَةٌ وَلا نَوْمٌ، لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الأَرْضِ، مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلا بِإِذْنِهِ، يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ، وَلا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلا بِمَا شَاءَ، وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالأَرْضَ، وَلا يَئُودُهُ حِفْظُهُمَا، وَهُوَ الْعَلِيُّ الْعَظِيمُ",
    target: 1,
    source: "آية الكرسي، سورة البقرة: 255"
  },
  {
    id: "ikhlas",
    text: "قُلْ هُوَ اللَّهُ أَحَدٌ، اللَّهُ الصَّمَدُ، لَمْ يَلِدْ وَلَمْ يُولَدْ، وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
    target: 3,
    source: "سورة الإخلاص، حصن المسلم"
  },
  {
    id: "falaq",
    text: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ، مِنْ شَرِّ مَا خَلَقَ، وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ، وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ، وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ",
    target: 3,
    source: "سورة الفلق، حصن المسلم"
  },
  {
    id: "nas",
    text: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ، مَلِكِ النَّاسِ، إِلَهِ النَّاسِ، مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ، الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ، مِنَ الْجِنَّةِ وَالنَّاسِ",
    target: 3,
    source: "سورة الناس، حصن المسلم"
  },
  {
    id: "asbahna-mulk",
    text: "أصبحنا وأصبح الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له، له الملك وله الحمد، وهو على كل شيء قدير. رب أسألك خير ما في هذا اليوم وخير ما بعده، وأعوذ بك من شر ما في هذا اليوم وشر ما بعده، رب أعوذ بك من الكسل وسوء الكبر، رب أعوذ بك من عذاب في النار وعذاب في القبر",
    target: 1,
    source: "صحيح مسلم"
  },
  {
    id: "bika-asbahna",
    text: "اللهم بك أصبحنا، وبك أمسينا، وبك نحيا، وبك نموت، وإليك النشور",
    target: 1,
    source: "سنن الترمذي"
  },
  {
    id: "sayyid-istighfar",
    text: "اللهم أنت ربي لا إله إلا أنت، خلقتني وأنا عبدك، وأنا على عهدك ووعدك ما استطعت، أعوذ بك من شر ما صنعت، أبوء لك بنعمتك علي، وأبوء بذنبي، فاغفر لي، فإنه لا يغفر الذنوب إلا أنت",
    target: 1,
    source: "صحيح البخاري",
    note: "سيد الاستغفار."
  },
  {
    id: "ashhaduka",
    text: "اللهم إني أصبحت أشهدك، وأشهد حملة عرشك، وملائكتك، وجميع خلقك، أنك أنت الله لا إله إلا أنت وحدك لا شريك لك، وأن محمدًا عبدك ورسولك",
    target: 4,
    source: "سنن أبي داود"
  },
  {
    id: "nimah",
    text: "اللهم ما أصبح بي من نعمة أو بأحد من خلقك فمنك وحدك لا شريك لك، فلك الحمد ولك الشكر",
    target: 1,
    source: "سنن أبي داود"
  },
  {
    id: "hasbiyallah",
    text: "حسبي الله لا إله إلا هو، عليه توكلت، وهو رب العرش العظيم",
    target: 7,
    source: "سنن أبي داود"
  },
  {
    id: "bismillah",
    text: "بسم الله الذي لا يضر مع اسمه شيء في الأرض ولا في السماء، وهو السميع العليم",
    target: 3,
    source: "سنن أبي داود والترمذي"
  },
  {
    id: "raditu",
    text: "رضيت بالله ربًا، وبالإسلام دينًا، وبمحمد صلى الله عليه وسلم نبيًا",
    target: 3,
    source: "سنن أبي داود والترمذي"
  },
  {
    id: "hayy-qayyum",
    text: "يا حي يا قيوم، برحمتك أستغيث، أصلح لي شأني كله، ولا تكلني إلى نفسي طرفة عين",
    target: 1,
    source: "النسائي في عمل اليوم والليلة"
  },
  {
    id: "ajz-kasal",
    text: "اللهم إني أعوذ بك من الهم والحزن، وأعوذ بك من العجز والكسل، وأعوذ بك من الجبن والبخل، وأعوذ بك من غلبة الدين وقهر الرجال",
    target: 3,
    source: "سنن أبي داود",
    note: "دعاء جامع في الاستعاذة من الهم والعجز وغلبة الدين."
  },
  {
    id: "fitrah",
    text: "أصبحنا على فطرة الإسلام، وعلى كلمة الإخلاص، وعلى دين نبينا محمد صلى الله عليه وسلم، وعلى ملة أبينا إبراهيم حنيفًا مسلمًا وما كان من المشركين",
    target: 1,
    source: "مسند أحمد"
  },
  {
    id: "subhanallah-bihamdih",
    text: "سبحان الله وبحمده",
    target: 100,
    source: "صحيح مسلم"
  },
  {
    id: "tahleel",
    text: "لا إله إلا الله وحده لا شريك له، له الملك وله الحمد، وهو على كل شيء قدير",
    target: 100,
    source: "صحيح البخاري وصحيح مسلم"
  },
  {
    id: "created-count",
    text: "سبحان الله وبحمده، عدد خلقه، ورضا نفسه، وزنة عرشه، ومداد كلماته",
    target: 3,
    source: "صحيح مسلم"
  },
  {
    id: "rizq-ilm",
    text: "اللهم إني أسألك علمًا نافعًا، ورزقًا طيبًا، وعملًا متقبلًا",
    target: 1,
    source: "سنن ابن ماجه"
  },
  {
    id: "istighfar-100",
    text: "أستغفر الله وأتوب إليه",
    target: 100,
    source: "صحيح البخاري وصحيح مسلم",
    note: "كان النبي ﷺ يكثر من الاستغفار والتوبة في يومه."
  }
]);

const eveningItems = makeVerifiedDhikrItems("evening", "أذكار المساء", 2, 2, [
  {
    id: "opening",
    text: "الحمد لله وحده، والصلاة والسلام على من لا نبي بعده",
    target: 1,
    note: "افتتاح أذكار المساء كما أورده حصن المسلم."
  },
  {
    id: "ayat-kursi",
    text: "اللَّهُ لا إِلَهَ إِلا هُوَ الْحَيُّ الْقَيُّومُ، لا تَأْخُذُهُ سِنَةٌ وَلا نَوْمٌ، لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الأَرْضِ، مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلا بِإِذْنِهِ، يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ، وَلا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلا بِمَا شَاءَ، وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالأَرْضَ، وَلا يَئُودُهُ حِفْظُهُمَا، وَهُوَ الْعَلِيُّ الْعَظِيمُ",
    target: 1,
    source: "آية الكرسي، سورة البقرة: 255"
  },
  {
    id: "amanar-rasul",
    text: "آمَنَ الرَّسُولُ بِمَا أُنْزِلَ إِلَيْهِ مِنْ رَبِّهِ وَالْمُؤْمِنُونَ، كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ، لا نُفَرِّقُ بَيْنَ أَحَدٍ مِنْ رُسُلِهِ، وَقَالُوا سَمِعْنَا وَأَطَعْنَا، غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ. لا يُكَلِّفُ اللَّهُ نَفْسًا إِلا وُسْعَهَا، لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ، رَبَّنَا لا تُؤَاخِذْنَا إِنْ نَسِينَا أَوْ أَخْطَأْنَا، رَبَّنَا وَلا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِنْ قَبْلِنَا، رَبَّنَا وَلا تُحَمِّلْنَا مَا لا طَاقَةَ لَنَا بِهِ، وَاعْفُ عَنَّا، وَاغْفِرْ لَنَا، وَارْحَمْنَا، أَنْتَ مَوْلَانَا، فَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ",
    target: 1,
    source: "آخر آيتين من سورة البقرة، صحيح البخاري وصحيح مسلم",
    note: "ورد في الصحيحين أن من قرأ الآيتين من آخر سورة البقرة في ليلة كفتاه."
  },
  {
    id: "ikhlas",
    text: "قُلْ هُوَ اللَّهُ أَحَدٌ، اللَّهُ الصَّمَدُ، لَمْ يَلِدْ وَلَمْ يُولَدْ، وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
    target: 3,
    source: "سورة الإخلاص، حصن المسلم"
  },
  {
    id: "falaq",
    text: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ، مِنْ شَرِّ مَا خَلَقَ، وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ، وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ، وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ",
    target: 3,
    source: "سورة الفلق، حصن المسلم"
  },
  {
    id: "nas",
    text: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ، مَلِكِ النَّاسِ، إِلَهِ النَّاسِ، مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ، الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ، مِنَ الْجِنَّةِ وَالنَّاسِ",
    target: 3,
    source: "سورة الناس، حصن المسلم"
  },
  {
    id: "amsayna-mulk",
    text: "أمسينا وأمسى الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له، له الملك وله الحمد، وهو على كل شيء قدير. رب أسألك خير ما في هذه الليلة وخير ما بعدها، وأعوذ بك من شر ما في هذه الليلة وشر ما بعدها، رب أعوذ بك من الكسل وسوء الكبر، رب أعوذ بك من عذاب في النار وعذاب في القبر",
    target: 1,
    source: "صحيح مسلم"
  },
  {
    id: "bika-amsayna",
    text: "اللهم بك أمسينا، وبك أصبحنا، وبك نحيا، وبك نموت، وإليك المصير",
    target: 1,
    source: "سنن الترمذي"
  },
  {
    id: "sayyid-istighfar",
    text: "اللهم أنت ربي لا إله إلا أنت، خلقتني وأنا عبدك، وأنا على عهدك ووعدك ما استطعت، أعوذ بك من شر ما صنعت، أبوء لك بنعمتك علي، وأبوء بذنبي، فاغفر لي، فإنه لا يغفر الذنوب إلا أنت",
    target: 1,
    source: "صحيح البخاري",
    note: "سيد الاستغفار."
  },
  {
    id: "ashhaduka",
    text: "اللهم إني أمسيت أشهدك، وأشهد حملة عرشك، وملائكتك، وجميع خلقك، أنك أنت الله لا إله إلا أنت وحدك لا شريك لك، وأن محمدًا عبدك ورسولك",
    target: 4,
    source: "سنن أبي داود"
  },
  {
    id: "nimah",
    text: "اللهم ما أمسى بي من نعمة أو بأحد من خلقك فمنك وحدك لا شريك لك، فلك الحمد ولك الشكر",
    target: 1,
    source: "سنن أبي داود"
  },
  {
    id: "hasbiyallah",
    text: "حسبي الله لا إله إلا هو، عليه توكلت، وهو رب العرش العظيم",
    target: 7,
    source: "سنن أبي داود"
  },
  {
    id: "bismillah",
    text: "بسم الله الذي لا يضر مع اسمه شيء في الأرض ولا في السماء، وهو السميع العليم",
    target: 3,
    source: "سنن أبي داود والترمذي"
  },
  {
    id: "raditu",
    text: "رضيت بالله ربًا، وبالإسلام دينًا، وبمحمد صلى الله عليه وسلم نبيًا",
    target: 3,
    source: "سنن أبي داود والترمذي"
  },
  {
    id: "hayy-qayyum",
    text: "يا حي يا قيوم، برحمتك أستغيث، أصلح لي شأني كله، ولا تكلني إلى نفسي طرفة عين",
    target: 1,
    source: "النسائي في عمل اليوم والليلة"
  },
  {
    id: "ajz-kasal",
    text: "اللهم إني أعوذ بك من الهم والحزن، وأعوذ بك من العجز والكسل، وأعوذ بك من الجبن والبخل، وأعوذ بك من غلبة الدين وقهر الرجال",
    target: 3,
    source: "سنن أبي داود",
    note: "دعاء جامع في الاستعاذة من الهم والعجز وغلبة الدين."
  },
  {
    id: "fitrah",
    text: "أمسينا على فطرة الإسلام، وعلى كلمة الإخلاص، وعلى دين نبينا محمد صلى الله عليه وسلم، وعلى ملة أبينا إبراهيم حنيفًا مسلمًا وما كان من المشركين",
    target: 1,
    source: "مسند أحمد"
  },
  {
    id: "subhanallah-bihamdih",
    text: "سبحان الله وبحمده",
    target: 100,
    source: "صحيح مسلم"
  },
  {
    id: "tahleel",
    text: "لا إله إلا الله وحده لا شريك له، له الملك وله الحمد، وهو على كل شيء قدير",
    target: 100,
    source: "صحيح البخاري وصحيح مسلم"
  },
  {
    id: "kalimat",
    text: "أعوذ بكلمات الله التامات من شر ما خلق",
    target: 3,
    source: "صحيح مسلم"
  }
]);

const repeatWords = [
  ["مائة", 100],
  ["مئه", 100],
  ["مئة", 100],
  ["ثلاثا", 3],
  ["ثلاث", 3],
  ["ثلاثاً", 3],
  ["ثلاث مرات", 3],
  ["سبعا", 7],
  ["سبع", 7],
  ["سبعاً", 7],
  ["اربعه", 4],
  ["اربعة", 4],
  ["أربعه", 4],
  ["أربعة", 4],
  ["أربع", 4],
  ["اربع", 4],
  ["أربع مرات", 4],
  ["اربع مرات", 4],
  ["عشر", 10],
  ["عشرا", 10],
  ["عشراً", 10],
  ["ثلاثين", 30],
  ["ثلاث وثلاثين", 33],
  ["ثلاثاً وثلاثين", 33],
  ["اربعا وثلاثين", 34],
  ["أربعا وثلاثين", 34],
  ["أربعاً وثلاثين", 34]
];

async function getJson(path) {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    throw new Error(`تعذر جلب البيانات من ${path}`);
  }
  return response.json();
}

async function getQuranJson(path) {
  const response = await fetch(`${QURAN_API_BASE}${path}`);
  if (!response.ok) {
    throw new Error(`تعذر جلب بيانات المصحف من ${path}`);
  }
  return response.json();
}

function stripHtml(value = "") {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanRepeatInstruction(value = "") {
  return value
    .replace(/\s*[-–—،,؛:]?\s*(?:تكرر|يكرر|كرر|كررها|يقال|تقال)\s*(?:\(?\s*)?(?:ثلاثا وثلاثين|ثلاثاً وثلاثين|ثلاث وثلاثين|اربعا وثلاثين|أربعا وثلاثين|أربعاً وثلاثين|ثلاثين|ثلاثا|ثلاثاً|ثلاث|سبعا|سبعاً|سبع|عشرا|عشراً|عشر|مرة|مره|\d{1,3}|[٠-٩]{1,3}|[۰-۹]{1,3})\s*(?:مرات|مرة|مره)?\s*[\).،؛:]?/g, " ")
    .replace(/\(\s*(?:ثلاثا وثلاثين|ثلاثاً وثلاثين|ثلاث وثلاثين|اربعا وثلاثين|أربعا وثلاثين|أربعاً وثلاثين|ثلاثين|ثلاثا|ثلاثاً|ثلاث|سبعا|سبعاً|سبع|عشرا|عشراً|عشر|\d{1,3}|[٠-٩]{1,3}|[۰-۹]{1,3})\s*(?:مرات|مرة|مره)?\s*\)/g, " ")
    .replace(/\s+\*/g, " ")
    .replace(/\*\s+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function extractArabicReference(body = "", text = "") {
  const cleanBody = stripHtml(body);
  const cleanText = stripHtml(text);
  if (!cleanBody || cleanBody === cleanText) {
    return "";
  }
  const withoutText = cleanBody.replace(cleanText, "").replace(/\s+/g, " ").trim();
  return withoutText || cleanBody;
}

function detectRepeat(text) {
  const cleanText = stripHtml(text).replace(/[ًٌٍَُِّْـ]/g, "");
  const numericMatch = cleanText.match(/(?:\(|\s)(\d{1,3})(?:\)|\s)*(?:مرات|مرة|مره|تكرار|تكرارات)?/);
  if (numericMatch) {
    return Number(numericMatch[1]);
  }

  const match = [...repeatWords].sort((a, b) => b[0].length - a[0].length).find(([word]) => cleanText.includes(word));
  return match ? match[1] : 1;
}

function normalizeCollectionKind(collectionId, item) {
  if (collectionId === "forgiveness") {
    return {
      ...item,
      target: null,
      kind: "guidance",
      note: item.note || "الاستغفار باب مفتوح بلا عدد محدد، وما ثبت له عدد مخصوص يظهر في موضعه بنصه."
    };
  }
  return {
    ...item,
    kind: "dhikr"
  };
}

function makeDuaKey(value, fallback) {
  return String(value ?? fallback)
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "") || String(fallback);
}

function normalizeDua(dua, index = 0) {
  const categoryNumber = Number(dua.category?.number || 0);
  const duaKey = makeDuaKey(dua.number, index + 1);
  const duaNumber = Number.parseInt(String(dua.number || index + 1), 10) || index + 1;
  const rawBody = dua.ar?.body || dua.en?.body || "";
  const body = stripHtml(rawBody);
  const text = cleanRepeatInstruction(stripHtml(dua.ar?.text || body || ""));
  const note = extractArabicReference(rawBody, text);

  return {
    id: `dhikr-${categoryNumber}-${duaKey}`,
    category: dua.category?.ar || "أذكار",
    categoryNumber,
    duaNumber,
    order: index + 1,
    text,
    note,
    target: detectRepeat(`${text} ${body}`)
  };
}

function applyEveningWording(item) {
  const replacements = [
    [/اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا/g, "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا"],
    [/اللهم بك أصبحنا، وبك أمسينا/g, "اللهم بك أمسينا، وبك أصبحنا"],
    [/أَصْبَحْنَا/g, "أَمْسَيْنَا"],
    [/أصبحنا/g, "أمسينا"],
    [/وَأَصْبَحَ/g, "وَأَمْسَى"],
    [/وأصبح/g, "وأمسى"],
    [/أَصْبَحْتُ/g, "أَمْسَيْتُ"],
    [/أصبحت/g, "أمسيت"],
    [/هَذَا اليَوْم/g, "هَذِهِ اللَّيْلَة"],
    [/هذا اليوم/g, "هذه الليلة"],
    [/النُّشُور/g, "المَصِير"],
    [/النشور/g, "المصير"]
  ];

  const apply = (value) => replacements.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value || "");
  return {
    ...item,
    text: apply(item.text),
    note: apply(item.note)
  };
}

export async function fetchAllDhikr() {
  const fixedCollectionItems = {
    morning: morningItems,
    evening: eveningItems,
    "after-prayer": afterPrayerItems
  };
  const apiCollections = dhikrCollections.filter((collection) => collection.shortcut && !fixedCollectionItems[collection.id]);
  const responses = await Promise.allSettled(apiCollections.map((collection) => getJson(`/dhikr/${collection.shortcut}`)));

  const fixedCollections = dhikrCollections
    .filter((collection) => fixedCollectionItems[collection.id])
    .map((collection) => ({
      ...collection,
      count: fixedCollectionItems[collection.id].length,
      items: fixedCollectionItems[collection.id]
    }));

  const remoteCollections = responses.map((result, index) => {
    const collection = apiCollections[index];
    if (result.status !== "fulfilled") {
      return { ...collection, count: 0, items: [] };
    }
    const collectionOrder = dhikrCollections.findIndex((entry) => entry.id === collection.id) + 1;
    const items = (result.value.data?.duas || []).map((dua, duaIndex) => {
      const normalized = normalizeDua(dua, duaIndex);
      return normalizeCollectionKind(collection.id, {
        ...normalized,
        id: `${collection.id}-${normalized.id}`,
        collectionOrder,
        category: collection.label,
        collectionId: collection.id,
        collectionLabel: collection.label
      });
    });
    return { ...collection, count: items.length, items };
  });

  const collections = [...fixedCollections, ...remoteCollections].sort((a, b) => {
    return dhikrCollections.findIndex((entry) => entry.id === a.id) - dhikrCollections.findIndex((entry) => entry.id === b.id);
  });

  collections.push({
    ...dhikrCollections.find((collection) => collection.id === "dhul-hijjah"),
    count: dhulHijjahItems.length,
    items: dhulHijjahItems
  });

  supplementalCollections.forEach((collection) => {
    const items = supplementalDuas.filter((item) => item.collectionId === collection.id);
    collections.push({
      ...collection,
      count: items.length,
      items
    });
  });

  return {
    categories: collections.map(({ items, ...collection }) => collection),
    items: collections
      .flatMap((collection) => collection.items)
      .sort((a, b) => (a.collectionOrder || 99) - (b.collectionOrder || 99) || a.order - b.order || a.duaNumber - b.duaNumber)
  };
}

export async function fetchFullQuran() {
  const result = await getJson("/quran/verses/uthmani");
  const verses = result.ayahs || result.data?.ayahs || result.data?.verses || [];
  const ayahsBySurah = new Map();

  for (const ayah of verses) {
    const verseKey = ayah.verse_key || ayah.verseKey || ayah.key || "";
    const [surahNumber, ayahNumber] = verseKey.split(":").map(Number);
    const text = ayah.text || ayah.text_uthmani || ayah.verse_text || ayah.arabic || "";
    if (!surahNumber || !ayahNumber || !text) {
      continue;
    }
    if (!ayahsBySurah.has(surahNumber)) {
      ayahsBySurah.set(surahNumber, []);
    }
    ayahsBySurah.get(surahNumber).push({
      number: ayahNumber,
      text
    });
  }

  return surahMeta.map((surah) => ({
    id: `surah-${surah.number}`,
    ...surah,
    meta: `${surah.revelation} - ${surah.versesCount} آية`,
    ayahs: ayahsBySurah.get(surah.number) || []
  }));
}

function normalizeChapter(chapter) {
  const number = Number(chapter.id || chapter.chapter_number || chapter.number);
  const fallback = surahMeta[number - 1];
  const pages = chapter.pages || chapter.page_range || chapter.pages_range || fallback?.pages || [1, 1];
  const pageStart = Number(Array.isArray(pages) ? pages[0] : chapter.page_start || chapter.start_page || 1);
  const pageEnd = Number(Array.isArray(pages) ? pages[1] : chapter.page_end || chapter.end_page || pageStart);

  return {
    id: `surah-${number}`,
    number,
    name: chapter.name_arabic || chapter.name_ar || fallback?.name || `سورة ${number}`,
    revelation: chapter.revelation_place === "makkah" ? "مكية" : chapter.revelation_place === "madinah" ? "مدنية" : fallback?.revelation || "",
    versesCount: Number(chapter.verses_count || fallback?.versesCount || 0),
    pageStart,
    pageEnd,
    meta: `${pageStart}-${pageEnd} صفحة`
  };
}

export async function fetchQuranChapters() {
  const result = await getQuranJson("/chapters?language=ar");
  const chapters = result.chapters || result.data?.chapters || result.data || [];
  return chapters.map(normalizeChapter).sort((a, b) => a.number - b.number);
}

export async function fetchQuranPage(pageNumber) {
  const result = await getQuranJson(`/verses/by_page/${pageNumber}?words=false&fields=text_uthmani,page_number,juz_number&per_page=50`);
  const verses = result.verses || result.data?.verses || result.ayahs || result.data?.ayahs || [];

  return verses.map((verse) => {
    const verseKey = verse.verse_key || verse.verseKey || verse.key || "";
    const [keySurahNumber, keyAyahNumber] = verseKey.split(":").map(Number);
    const surahNumber = Number(verse.chapter_id || verse.chapterId || keySurahNumber);
    const ayahNumber = Number(verse.verse_number || verse.verseNumber || keyAyahNumber);
    return {
      key: verseKey,
      surahNumber,
      ayahNumber,
      pageNumber: Number(verse.page_number || verse.pageNumber || pageNumber),
      juzNumber: Number(verse.juz_number || verse.juzNumber || 1),
      text: verse.text_uthmani || verse.text || verse.text_uthmani_simple || verse.verse_text || ""
    };
  }).filter((verse) => verse.key && verse.text);
}

export async function fetchQuranVersePage(surahNumber, ayahNumber) {
  const result = await getQuranJson(`/verses/by_key/${surahNumber}:${ayahNumber}?fields=page_number,juz_number`);
  const verse = result.verse || result.data?.verse || result.data || {};
  return Number(verse.page_number || verse.pageNumber || 1);
}
