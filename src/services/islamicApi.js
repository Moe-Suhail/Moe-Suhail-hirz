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
    text: "الله أكبر، الله أكبر، لا إله إلا الله، الله أكبر، الله أكبر، ولله الحمد.",
    note: "فضله: صيغة مشهورة للتكبير، وفيها إعلان تعظيم الله في أيام عظيمة.",
    target: 10,
    collectionId: "dhul-hijjah",
    collectionLabel: "فضل العشر من ذي الحجة"
  },
  {
    id: "dhul-hijjah-2",
    category: "فضل العشر من ذي الحجة",
    categoryNumber: 900,
    duaNumber: 2,
    text: "سبحان الله، والحمد لله، ولا إله إلا الله، والله أكبر.",
    note: "فضله: يجمع التسبيح والتحميد والتهليل والتكبير، وهي من أجل الأذكار في الأيام الفاضلة.",
    target: 10,
    collectionId: "dhul-hijjah",
    collectionLabel: "فضل العشر من ذي الحجة"
  },
  {
    id: "dhul-hijjah-3",
    category: "فضل العشر من ذي الحجة",
    categoryNumber: 900,
    duaNumber: 3,
    text: "اللهم اغفر لي وارحمني وتب علي إنك أنت التواب الرحيم.",
    note: "فضله: يكثر الدعاء والاستغفار في يوم عرفة، وصيامه لغير الحاج من آكد أعمال العشر.",
    target: 1,
    collectionId: "dhul-hijjah",
    collectionLabel: "فضل العشر من ذي الحجة"
  },
  {
    id: "dhul-hijjah-4",
    category: "فضل العشر من ذي الحجة",
    categoryNumber: 900,
    duaNumber: 4,
    text: "لا إله إلا الله وحده لا شريك له، له الملك وله الحمد، وهو على كل شيء قدير.",
    note: "فضله: من خير الدعاء والذكر، وقد ورد في معنى: خير ما قلت أنا والنبيون من قبلي.",
    target: 10,
    collectionId: "dhul-hijjah",
    collectionLabel: "فضل العشر من ذي الحجة"
  },
  {
    id: "dhul-hijjah-5",
    category: "فضل العشر من ذي الحجة",
    categoryNumber: 900,
    duaNumber: 5,
    text: "اللهم أعني على ذكرك وشكرك وحسن عبادتك.",
    note: "فضله: دعاء جامع يعين على اغتنام العشر بالصلاة والقرآن والصدقة وسائر العمل الصالح.",
    target: 1,
    collectionId: "dhul-hijjah",
    collectionLabel: "فضل العشر من ذي الحجة"
  }
];

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

  const match = repeatWords.find(([word]) => cleanText.includes(word));
  return match ? match[1] : 1;
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
  const text = stripHtml(dua.ar?.text || body || "");
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
  const apiCollections = dhikrCollections.filter((collection) => collection.shortcut);
  const responses = await Promise.allSettled(apiCollections.map((collection) => getJson(`/dhikr/${collection.shortcut}`)));

  const collections = responses.map((result, index) => {
    const collection = apiCollections[index];
    if (result.status !== "fulfilled") {
      return { ...collection, count: 0, items: [] };
    }
    const items = (result.value.data?.duas || []).map((dua, duaIndex) => {
      const normalized = normalizeDua(dua, duaIndex);
      return {
        ...normalized,
        id: `${collection.id}-${normalized.id}`,
        collectionOrder: index + 1,
        category: collection.label,
        collectionId: collection.id,
        collectionLabel: collection.label
      };
    }).map((item) => (collection.id === "evening" ? applyEveningWording(item) : item));
    return { ...collection, count: items.length, items };
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
  const result = await getQuranJson(`/verses/by_page/${pageNumber}?words=false&fields=text_uthmani,page_number&per_page=50`);
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
      text: verse.text_uthmani || verse.text || verse.text_uthmani_simple || verse.verse_text || ""
    };
  }).filter((verse) => verse.key && verse.text);
}
