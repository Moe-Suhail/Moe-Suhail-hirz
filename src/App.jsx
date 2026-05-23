import React, { useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, Bookmark, Hash, Heart, House, Layers, List, RotateCcw, Search, Sparkles, Star, Sun, Undo2, X } from "lucide-react";
import DhikrCard from "./components/DhikrCard.jsx";
import EmptyState from "./components/EmptyState.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import { surahMeta, tasbeehPhrases } from "./data";
import { fetchAllDhikr, fetchQuranChapters, fetchQuranPage, fetchQuranVersePage } from "./services/islamicApi";

const views = {
  home: { label: "الرئيسية", title: "حِرز", icon: House },
  adhkar: { label: "الأذكار", title: "وردك اليومي بهدوء", icon: Sun },
  quran: { label: "القرآن", title: "اقرأ ما تيسر لك", icon: BookOpen },
  tasbeeh: { label: "السبحة", title: "ذكر مستمر وبسيط", icon: Sparkles },
  favorites: { label: "المفضلة", title: "محفوظات قريبة", icon: Heart }
};

const BASMALA = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
const ISTIADHA = "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ";
const FEATURED_COLLECTIONS = ["morning", "evening"];
const COPYRIGHT_TEXT = "© محمد عادل حسن طه — جميع الحقوق محفوظة";
const JUZ_NAMES = [
  "الأول",
  "الثاني",
  "الثالث",
  "الرابع",
  "الخامس",
  "السادس",
  "السابع",
  "الثامن",
  "التاسع",
  "العاشر",
  "الحادي عشر",
  "الثاني عشر",
  "الثالث عشر",
  "الرابع عشر",
  "الخامس عشر",
  "السادس عشر",
  "السابع عشر",
  "الثامن عشر",
  "التاسع عشر",
  "العشرون",
  "الحادي والعشرون",
  "الثاني والعشرون",
  "الثالث والعشرون",
  "الرابع والعشرون",
  "الخامس والعشرون",
  "السادس والعشرون",
  "السابع والعشرون",
  "الثامن والعشرون",
  "التاسع والعشرون",
  "الثلاثون"
];
const JUZ_START_PAGES = [1, 22, 42, 62, 82, 102, 121, 142, 162, 182, 201, 222, 242, 262, 282, 302, 322, 342, 362, 382, 402, 422, 442, 462, 482, 502, 522, 542, 562, 582];
const QURAN_INDEX_TABS = [
  { id: "surahs", label: "السور", icon: BookOpen },
  { id: "juz", label: "الأجزاء", icon: Layers },
  { id: "pages", label: "الصفحات", icon: Hash },
  { id: "favorites", label: "المفضلة", icon: Bookmark }
];

function readStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function todayKey() {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function readDailyCounts() {
  const dailyCounts = readStorage("hirz-counts-daily", null);
  if (dailyCounts?.date === todayKey() && dailyCounts.counts && typeof dailyCounts.counts === "object") {
    return dailyCounts.counts;
  }
  if (dailyCounts) {
    return {};
  }
  return readStorage("hirz-counts", {});
}

function normalize(value) {
  return value
    .toLowerCase()
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[ًٌٍَُِّْٰـ]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/[ؤ]/g, "و")
    .replace(/[ئ]/g, "ي")
    .replace(/[ى]/g, "ي")
    .replace(/[ة]/g, "ه")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toWesternNumber(value, fallback = 1) {
  const normalized = String(value ?? "")
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[^\d]/g, "");
  return Number(normalized) || fallback;
}

function searchTokens(value) {
  return normalize(value)
    .split(" ")
    .filter((token) => token.length > 1)
    .map((token) => token.replace(/^(ال|وال|بال|كال|فال|لل)/, "").replace(/(ه|ها|هم|كم|نا|ي)$/u, ""));
}

function semanticMatch(haystack, query) {
  const tokens = searchTokens(query);
  if (!tokens.length) {
    return true;
  }
  const normalizedHaystack = normalize(haystack);
  return tokens.every((token) => normalizedHaystack.includes(token));
}

function formatDhikrCount(count) {
  if (count === 1) {
    return "ذكر واحد";
  }
  if (count === 2) {
    return "ذكران";
  }
  if (count >= 3 && count <= 10) {
    return `${count} أذكار`;
  }
  return `${count} ذكر`;
}

function formatJuzName(juzNumber) {
  return JUZ_NAMES[juzNumber - 1] ? `الجزء ${JUZ_NAMES[juzNumber - 1]}` : "الجزء";
}

export default function App() {
  const [activeView, setActiveView] = useState("home");
  const [category, setCategory] = useState(() => localStorage.getItem("hirz-dhikr-category") || "morning");
  const [query, setQuery] = useState("");
  const [selectedSurah, setSelectedSurah] = useState("surah-1");
  const [dhikrItems, setDhikrItems] = useState([]);
  const [dhikrCategories, setDhikrCategories] = useState([]);
  const [quranChapters, setQuranChapters] = useState(() =>
    surahMeta.map((surah) => ({
      id: `surah-${surah.number}`,
      ...surah,
      pageStart: 1,
      pageEnd: 1,
      meta: `${surah.revelation} - ${surah.versesCount} آية`,
      ayahs: []
    }))
  );
  const [quranPage, setQuranPage] = useState(() => Number(readStorage("hirz-quran-page", 1)) || 1);
  const [pageVerses, setPageVerses] = useState([]);
  const [loading, setLoading] = useState({ dhikr: true, quran: true });
  const [errors, setErrors] = useState({ dhikr: "", quran: "" });
  const [counts, setCounts] = useState(() => readDailyCounts());
  const [favorites, setFavorites] = useState(() => readStorage("hirz-favorites", []));
  const [tasbeeh, setTasbeeh] = useState(0);
  const [theme, setTheme] = useState(() => localStorage.getItem("hirz-theme") || "light");
  const [activeDhikrIndex, setActiveDhikrIndex] = useState(() => Number(readStorage("hirz-dhikr-index-morning", 0)) || 0);
  const [showMoreCollections, setShowMoreCollections] = useState(false);
  const [quranIndexOpen, setQuranIndexOpen] = useState(false);
  const [quranIndexTab, setQuranIndexTab] = useState("surahs");
  const [quranIndexQuery, setQuranIndexQuery] = useState("");
  const [pageJumpInput, setPageJumpInput] = useState(() => String(Number(readStorage("hirz-quran-page", 1)) || 1));
  const [ayahJumpInput, setAyahJumpInput] = useState("");
  const [recentSurahs, setRecentSurahs] = useState(() => readStorage("hirz-recent-surahs", []));
  const [dhikrMotion, setDhikrMotion] = useState("idle");
  const touchStart = useRef(null);
  const quranTouchStart = useRef(null);
  const quranPageCache = useRef(new Map());
  const collectionRefs = useRef(new Map());
  const dhikrMotionTimeout = useRef(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("hirz-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("hirz-dhikr-category", category);
  }, [category]);

  useEffect(() => {
    return () => {
      window.clearTimeout(dhikrMotionTimeout.current);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    fetchAllDhikr()
      .then(({ categories, items }) => {
        if (!isMounted) {
          return;
        }
        setDhikrCategories(categories);
        setDhikrItems(items);
        setLoading((current) => ({ ...current, dhikr: false }));
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }
        setErrors((current) => ({ ...current, dhikr: "تعذر تحميل الأذكار من API. تحقق من الاتصال ثم أعد المحاولة." }));
        setLoading((current) => ({ ...current, dhikr: false }));
      });

    fetchQuranChapters()
      .then((chapters) => {
        if (!isMounted) {
          return;
        }
        setQuranChapters(chapters);
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }
        setQuranChapters((current) => current);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("hirz-quran-page", JSON.stringify(quranPage));
    setPageJumpInput(String(quranPage));
    [quranPage - 1, quranPage + 1].forEach((page) => {
      if (page < 1 || page > 604 || quranPageCache.current.has(page)) {
        return;
      }
      fetchQuranPage(page)
        .then((verses) => {
          quranPageCache.current.set(page, verses);
        })
        .catch(() => {});
    });
  }, [quranPage]);

  useEffect(() => {
    if (!quranIndexOpen) {
      return;
    }
    function closeOnEscape(event) {
      if (event.key === "Escape") {
        setQuranIndexOpen(false);
      }
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [quranIndexOpen]);

  useEffect(() => {
    let isMounted = true;

    if (quranPageCache.current.has(quranPage)) {
      setPageVerses(quranPageCache.current.get(quranPage));
      setLoading((current) => ({ ...current, quran: false }));
      setErrors((current) => ({ ...current, quran: "" }));
      return () => {
        isMounted = false;
      };
    }

    setLoading((current) => ({ ...current, quran: true }));
    setErrors((current) => ({ ...current, quran: "" }));

    fetchQuranPage(quranPage)
      .then((verses) => {
        if (!isMounted) {
          return;
        }
        quranPageCache.current.set(quranPage, verses);
        setPageVerses(verses);
        setLoading((current) => ({ ...current, quran: false }));
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }
        setErrors((current) => ({ ...current, quran: "تعذر تحميل صفحة المصحف. تحقق من الاتصال ثم أعد المحاولة." }));
        setLoading((current) => ({ ...current, quran: false }));
      });

    return () => {
      isMounted = false;
    };
  }, [quranPage]);

  useEffect(() => {
    const selected = quranChapters.find((surah) => surah.id === selectedSurah);
    if (selected && quranPage >= selected.pageStart && quranPage <= selected.pageEnd) {
      return;
    }

    const pageSurah =
      quranChapters.find((surah) => quranPage >= surah.pageStart && quranPage <= surah.pageEnd) ||
      quranChapters.find((surah) => surah.number === pageVerses[0]?.surahNumber);

    if (pageSurah && pageSurah.id !== selectedSurah) {
      setSelectedSurah(pageSurah.id);
    }
  }, [pageVerses, quranChapters, quranPage, selectedSurah]);

  const activeSurah = quranChapters.find((surah) => surah.id === selectedSurah) ?? quranChapters[0];
  const quranPageSurahs = useMemo(() => {
    return pageVerses.reduce((groups, ayah) => {
      let group = groups.find((entry) => entry.surahNumber === ayah.surahNumber);
      if (!group) {
        const surah = quranChapters.find((entry) => entry.number === ayah.surahNumber);
        group = {
          surahNumber: ayah.surahNumber,
          surahName: surah?.name || `سورة ${ayah.surahNumber}`,
          showIstiadhah: ayah.surahNumber === 1 && ayah.ayahNumber === 1,
          showBasmala: ayah.ayahNumber === 1 && ayah.surahNumber !== 1 && ayah.surahNumber !== 9,
          ayahs: []
        };
        groups.push(group);
      }
      group.ayahs.push(ayah);
      return groups;
    }, []);
  }, [pageVerses, quranChapters]);
  const activePageSurah = quranPageSurahs[0]?.surahName || activeSurah.name;
  const activePageJuz = pageVerses[0]?.juzNumber || 1;
  const completedCount = dhikrItems.filter((item) => (counts[item.id] || 0) >= item.target).length;
  const progress = dhikrItems.length ? Math.round((completedCount / dhikrItems.length) * 100) : 0;
  const morningItems = dhikrItems.filter((item) => item.collectionId === "morning");
  const eveningItems = dhikrItems.filter((item) => item.collectionId === "evening");
  const getProgressState = (items) => {
    const completed = items.filter((item) => (counts[item.id] || 0) >= item.target).length;
    return {
      completed,
      total: items.length,
      percent: items.length ? Math.round((completed / items.length) * 100) : 0,
      done: items.length > 0 && completed >= items.length
    };
  };
  const morningProgress = getProgressState(morningItems);
  const eveningProgress = getProgressState(eveningItems);
  const dailyCoreTotal = morningProgress.total + eveningProgress.total;
  const dailyCoreCompleted = morningProgress.completed + eveningProgress.completed;
  const dailyCoreProgress = dailyCoreTotal ? Math.round((dailyCoreCompleted / dailyCoreTotal) * 100) : progress;
  const hasSearchQuery = searchTokens(query).length > 0;

  const filteredDhikr = useMemo(() => {
    return dhikrItems.filter((item) => {
      const matchesCategory = hasSearchQuery || item.collectionId === category;
      const collection = dhikrCategories.find((entry) => entry.id === item.collectionId);
      const matchesQuery = semanticMatch(`${collection?.label || ""} ${collection?.description || ""} ${item.category} ${item.text} ${item.note}`, query);
      return matchesCategory && matchesQuery;
    });
  }, [category, dhikrCategories, dhikrItems, hasSearchQuery, query]);

  const filteredSurahs = useMemo(() => {
    return quranChapters.filter((surah) => {
      return semanticMatch(`${surah.name} ${surah.meta} ${surah.number}`, query);
    });
  }, [quranChapters, query]);

  const quranIndexSurahs = useMemo(() => {
    return quranChapters.filter((surah) => {
      const queryText = `${surah.number} ${surah.name} ${surah.revelation} ${surah.versesCount}`;
      return semanticMatch(queryText, quranIndexQuery);
    });
  }, [quranChapters, quranIndexQuery]);

  const quranFavoriteSurahs = useMemo(() => {
    return quranChapters.filter((surah) => favorites.includes(surah.id));
  }, [favorites, quranChapters]);

  const quickSurahs = useMemo(() => {
    const currentIndex = quranChapters.findIndex((surah) => surah.id === activeSurah.id);
    const candidates = [
      quranChapters[currentIndex - 1],
      activeSurah,
      quranChapters[currentIndex + 1],
      ...recentSurahs.map((id) => quranChapters.find((surah) => surah.id === id)),
      ...quranFavoriteSurahs.slice(0, 2)
    ].filter(Boolean);

    const seen = new Set();
    return candidates.filter((surah) => {
      if (seen.has(surah.id)) {
        return false;
      }
      seen.add(surah.id);
      return true;
    }).slice(0, 5);
  }, [activeSurah, quranChapters, quranFavoriteSurahs, recentSurahs]);

  const featuredCategories = useMemo(() => {
    return dhikrCategories.filter((item) => FEATURED_COLLECTIONS.includes(item.id));
  }, [dhikrCategories]);

  const moreCategories = useMemo(() => {
    return dhikrCategories.filter((item) => !FEATURED_COLLECTIONS.includes(item.id));
  }, [dhikrCategories]);

  const orderedDhikrCategories = useMemo(() => {
    return [...featuredCategories, ...moreCategories];
  }, [featuredCategories, moreCategories]);

  const activeDhikrItem = filteredDhikr[activeDhikrIndex] || filteredDhikr[0];
  const filteredCompletedCount = filteredDhikr.filter((item) => (counts[item.id] || 0) >= item.target).length;
  const filteredProgress = filteredDhikr.length ? Math.round((filteredCompletedCount / filteredDhikr.length) * 100) : 0;

  useEffect(() => {
    const storedIndex = hasSearchQuery ? 0 : Number(readStorage(`hirz-dhikr-index-${category}`, 0)) || 0;
    triggerDhikrMotion("section");
    setActiveDhikrIndex(Math.min(storedIndex, Math.max(0, filteredDhikr.length - 1)));
  }, [category, filteredDhikr.length, hasSearchQuery]);

  useEffect(() => {
    if (!hasSearchQuery && filteredDhikr.length) {
      localStorage.setItem(`hirz-dhikr-index-${category}`, JSON.stringify(activeDhikrIndex));
    }
  }, [activeDhikrIndex, category, filteredDhikr.length, hasSearchQuery]);

  useEffect(() => {
    if (activeDhikrIndex >= filteredDhikr.length) {
      setActiveDhikrIndex(Math.max(0, filteredDhikr.length - 1));
    }
  }, [activeDhikrIndex, filteredDhikr.length]);

  const favoriteItems = useMemo(() => {
    const allItems = [
      ...dhikrItems.map((item) => ({ type: "ذكر", id: item.id, title: item.category, body: item.text })),
      ...quranChapters.map((item) => ({ type: "سورة", id: item.id, title: item.name, body: item.meta }))
    ];
    return allItems.filter((item) => favorites.includes(item.id));
  }, [dhikrItems, favorites, quranChapters]);

  useEffect(() => {
    if (!dhikrItems.length) {
      return;
    }
    const validIds = new Set([...dhikrItems.map((item) => item.id), ...quranChapters.map((item) => item.id)]);
    if (!validIds.size) {
      return;
    }
    const cleanFavorites = favorites.filter((id) => validIds.has(id));
    if (cleanFavorites.length !== favorites.length) {
      setFavorites(cleanFavorites);
      localStorage.setItem("hirz-favorites", JSON.stringify(cleanFavorites));
    }
  }, [dhikrItems, favorites, quranChapters]);

  useEffect(() => {
    const validIds = new Set(dhikrItems.map((item) => item.id));
    if (!validIds.size) {
      return;
    }
    const cleanCounts = Object.fromEntries(Object.entries(counts).filter(([id]) => validIds.has(id)));
    if (Object.keys(cleanCounts).length !== Object.keys(counts).length) {
      saveCounts(cleanCounts);
    }
  }, [counts, dhikrItems]);

  function saveCounts(nextCounts) {
    setCounts(nextCounts);
    localStorage.setItem("hirz-counts-daily", JSON.stringify({ date: todayKey(), counts: nextCounts }));
    localStorage.setItem("hirz-counts", JSON.stringify(nextCounts));
  }

  function saveFavorites(nextFavorites) {
    setFavorites(nextFavorites);
    localStorage.setItem("hirz-favorites", JSON.stringify(nextFavorites));
  }

  function triggerDhikrMotion(type) {
    window.clearTimeout(dhikrMotionTimeout.current);
    setDhikrMotion(type);
    dhikrMotionTimeout.current = window.setTimeout(() => setDhikrMotion("idle"), 240);
  }

  function selectDhikrCategory(nextCategory) {
    if (!nextCategory || nextCategory === category) {
      return;
    }
    triggerDhikrMotion("section");
    setCategory(nextCategory);
    setActiveView("adhkar");
    window.requestAnimationFrame(() => {
      collectionRefs.current.get(nextCategory)?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
      });
      document.querySelector(".dhikr-stack")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function toggleFavorite(id) {
    saveFavorites(favorites.includes(id) ? favorites.filter((item) => item !== id) : [...favorites, id]);
  }

  function rememberSurah(surahId) {
    const next = [surahId, ...recentSurahs.filter((id) => id !== surahId)].slice(0, 6);
    setRecentSurahs(next);
    localStorage.setItem("hirz-recent-surahs", JSON.stringify(next));
  }

  function goToQuranPage(page) {
    const safePage = Math.min(604, Math.max(1, toWesternNumber(page, 1)));
    setQuranPage(safePage);
    window.requestAnimationFrame(() => {
      document.querySelector(".mushaf-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function selectSurah(surah, shouldClose = true) {
    setSelectedSurah(surah.id);
    rememberSurah(surah.id);
    goToQuranPage(surah.pageStart || 1);
    if (shouldClose) {
      setQuranIndexOpen(false);
    }
  }

  function selectJuz(juzNumber) {
    goToQuranPage(JUZ_START_PAGES[juzNumber - 1] || 1);
    setQuranIndexOpen(false);
  }

  function submitPageJump(event) {
    event.preventDefault();
    goToQuranPage(pageJumpInput);
    setQuranIndexOpen(false);
  }

  function submitAyahJump(event) {
    event.preventDefault();
    const ayah = Math.min(activeSurah.versesCount || 1, Math.max(1, toWesternNumber(ayahJumpInput, 1)));
    fetchQuranVersePage(activeSurah.number, ayah)
      .then((page) => {
        goToQuranPage(page);
        setQuranIndexOpen(false);
      })
      .catch(() => {
        goToQuranPage(activeSurah.pageStart || 1);
        setQuranIndexOpen(false);
      });
  }

  function incrementDhikr(item) {
    const currentCount = counts[item.id] || 0;
    const nextCount = Math.min(currentCount + 1, item.target);
    saveCounts({
      ...counts,
      [item.id]: nextCount
    });
    if (currentCount < item.target && nextCount >= item.target) {
      window.setTimeout(() => goToNextDhikr(), 260);
    }
  }

  function resetDhikr(id) {
    const nextCounts = { ...counts };
    delete nextCounts[id];
    saveCounts(nextCounts);
  }

  function restartCurrentDhikrFlow() {
    const nextCounts = { ...counts };
    filteredDhikr.forEach((item) => {
      delete nextCounts[item.id];
    });
    saveCounts(nextCounts);
    triggerDhikrMotion("previous");
    setActiveDhikrIndex(0);
    window.requestAnimationFrame(() => {
      document.querySelector(".dhikr-stack")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function updateTasbeeh(nextValue) {
    setTasbeeh(nextValue);
  }

  function submitSearch() {
    if (query.trim()) {
      setActiveView((current) => current);
      window.requestAnimationFrame(() => {
        document.querySelector(".view-stack, .reader-layout, .cards-grid")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  function goToNextDhikr() {
    triggerDhikrMotion("next");
    setActiveDhikrIndex((current) => (filteredDhikr.length ? Math.min(current + 1, filteredDhikr.length - 1) : 0));
  }

  function goToPreviousDhikr() {
    triggerDhikrMotion("previous");
    setActiveDhikrIndex((current) => Math.max(current - 1, 0));
  }

  function captureSwipeStart(event, ref, allowedSelector) {
    const touch = event.touches[0];
    const isAllowedArea = allowedSelector ? Boolean(event.target.closest?.(allowedSelector)) : true;
    ref.current = touch
      ? {
          x: touch.clientX,
          y: touch.clientY,
          isAllowedArea,
          startedOnControl: Boolean(event.target.closest?.("button, a, input, textarea, select"))
        }
      : null;
  }

  function readHorizontalSwipe(event, ref, threshold = 72) {
    const start = ref.current;
    ref.current = null;
    if (!start || !start.isAllowedArea || start.startedOnControl) {
      return 0;
    }

    const touch = event.changedTouches[0];
    if (!touch) {
      return 0;
    }

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (absX < threshold || absX < absY * 1.45 || absY > 82) {
      return 0;
    }

    return deltaX;
  }

  function handleDhikrTouchStart(event) {
    captureSwipeStart(event, touchStart, ".dhikr-card");
  }

  function handleDhikrTouchEnd(event) {
    const delta = readHorizontalSwipe(event, touchStart, 72);
    if (!delta) {
      return;
    }
    if (delta > 0) {
      goToNextDhikr();
    } else {
      goToPreviousDhikr();
    }
  }

  function goToNextQuranPage() {
    goToQuranPage(quranPage + 1);
  }

  function goToPreviousQuranPage() {
    goToQuranPage(quranPage - 1);
  }

  function handleQuranTouchStart(event) {
    captureSwipeStart(event, quranTouchStart, ".mushaf-text");
  }

  function handleQuranTouchEnd(event) {
    const delta = readHorizontalSwipe(event, quranTouchStart, 120);
    if (!delta) {
      return;
    }
    if (delta > 0) {
      goToNextQuranPage();
    } else {
      goToPreviousQuranPage();
    }
  }

  function changeView(nextView) {
    setActiveView(nextView);
    setQuranIndexOpen(false);
    if (nextView === "home") {
      setQuery("");
      window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
    } else if (nextView === "adhkar") {
      window.requestAnimationFrame(() => {
        document.querySelector(".dhikr-stack")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  const isDhikrContentView = activeView === "adhkar" || activeView === "home";
  const contentMode = [
    activeView === "quran" ? "quran-focus" : "",
    activeView === "adhkar" ? "dhikr-focus" : ""
  ].filter(Boolean).join(" ");

  return (
    <div className="app-shell">
      <Sidebar
        views={views}
        activeView={activeView}
        progress={progress}
        theme={theme}
        onThemeToggle={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
        onViewChange={changeView}
      />

      <main className={`content ${contentMode}`}>
        <Topbar
          label={views[activeView].label}
          title={views[activeView].title}
          query={query}
          searchPlaceholder={activeView === "quran" ? "ابحث باسم السورة أو الآية" : "ابحث في حرز"}
          onQueryChange={setQuery}
          onSearch={submitSearch}
          theme={theme}
          onThemeToggle={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
        />

        <section className="header-info-panel" aria-label="معلومات حرز">
          <div className="header-info-card">
            <div className="header-info-dedication">
              <span>صدقة جارية</span>
              <p>لروح جدي وجدتي</p>
              <div className="memorial-names">
                <strong>عبد الرحمن محمد أحمد</strong>
                <strong>ست النور محمد عثمان</strong>
              </div>
              <p className="memorial-dua">ولجميع أموات المسلمين</p>
            </div>
            <div className="header-info-progress">
              <div className="daily-progress-head">
                <span>ورد اليوم</span>
                <strong>{dailyCoreProgress}%</strong>
              </div>
              <div className="split-progress" aria-hidden="true">
                <div className="split-progress-half morning">
                  <span style={{ width: `${morningProgress.percent}%` }} />
                </div>
                <i className={morningProgress.done ? "done" : ""}>{morningProgress.done ? "✓" : ""}</i>
                <div className="split-progress-half evening">
                  <span style={{ width: `${eveningProgress.percent}%` }} />
                </div>
              </div>
              <div className="daily-progress-labels">
                <span>الصباح {morningProgress.percent}%</span>
                <span>المساء {eveningProgress.percent}%</span>
              </div>
            </div>
          </div>
        </section>

        {isDhikrContentView && (
          <section className="view-stack">
            {dhikrCategories.length > 0 && (
              <div className="collection-panel">
                <div className="collection-grid">
                  {featuredCategories.map((item) => (
                    <button
                      className={`collection-card ${category === item.id ? "active" : ""}`}
                      type="button"
                      key={item.id}
                      ref={(node) => {
                        if (node) {
                          collectionRefs.current.set(item.id, node);
                        } else {
                          collectionRefs.current.delete(item.id);
                        }
                      }}
                      aria-pressed={category === item.id}
                      onClick={() => selectDhikrCategory(item.id)}
                    >
                      <strong>{item.label}</strong>
                      <span>{item.description}</span>
                      <small>{formatDhikrCount(item.count)}</small>
                    </button>
                  ))}
                  <button className={`collection-card more-card ${showMoreCollections ? "active" : ""}`} type="button" onClick={() => setShowMoreCollections((current) => !current)}>
                    <strong>باقي الأذكار</strong>
                    <span>أدعية وتصنيفات أكثر</span>
                    <small>{formatDhikrCount(moreCategories.reduce((total, item) => total + item.count, 0))}</small>
                  </button>
                </div>
                {showMoreCollections && (
                  <div className="more-collections" aria-label="باقي الأذكار والأدعية">
                    {moreCategories.map((item) => (
                      <button
                        className={`collection-card compact ${category === item.id ? "active" : ""}`}
                        type="button"
                        key={item.id}
                        ref={(node) => {
                          if (node) {
                            collectionRefs.current.set(item.id, node);
                          } else {
                            collectionRefs.current.delete(item.id);
                          }
                        }}
                        aria-pressed={category === item.id}
                        onClick={() => selectDhikrCategory(item.id)}
                      >
                        <strong>{item.label}</strong>
                        <span>{item.description}</span>
                        <small>{formatDhikrCount(item.count)}</small>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div className="dhikr-stack">
              <div className="selected-collection-title">
                <h3 key={hasSearchQuery ? "search" : category}>
                  <span>القسم الحالي</span>
                  {hasSearchQuery ? "نتائج البحث" : dhikrCategories.find((item) => item.id === category)?.label || "أذكار الصباح"}
                </h3>
                <button className="restart-flow-btn" type="button" onClick={restartCurrentDhikrFlow} disabled={!filteredDhikr.length}>
                  <Undo2 size={17} aria-hidden="true" />
                  إعادة البدء
                </button>
              </div>
              {loading.dhikr ? (
                <EmptyState text="جاري تحميل جميع الأذكار من المصدر..." />
              ) : errors.dhikr ? (
                <EmptyState text={errors.dhikr} />
              ) : filteredDhikr.length ? (
                <div className={`dhikr-reader motion-${dhikrMotion}`} onTouchStart={handleDhikrTouchStart} onTouchEnd={handleDhikrTouchEnd}>
                  <div className="dhikr-reader-meta">
                    <span>{activeDhikrIndex + 1} من {filteredDhikr.length}</span>
                    <div className="section-progress" aria-label="تقدم القسم الحالي">
                      <i style={{ width: `${filteredProgress}%` }} />
                    </div>
                    <div className="dhikr-reader-dots" aria-hidden="true">
                      {filteredDhikr.slice(0, Math.min(filteredDhikr.length, 12)).map((item, index) => (
                        <span className={index === Math.min(activeDhikrIndex, 11) ? "active" : ""} key={item.id} />
                      ))}
                    </div>
                  </div>
                  <DhikrCard
                    key={activeDhikrItem.id}
                    item={activeDhikrItem}
                    count={counts[activeDhikrItem.id] || 0}
                    isFavorite={favorites.includes(activeDhikrItem.id)}
                    onFavorite={() => toggleFavorite(activeDhikrItem.id)}
                    onIncrement={() => incrementDhikr(activeDhikrItem)}
                    onReset={() => resetDhikr(activeDhikrItem.id)}
                  />
                  <div className="dhikr-reader-controls">
                    <button className="ghost-btn" type="button" onClick={goToPreviousDhikr} disabled={activeDhikrIndex <= 0}>
                      السابق
                    </button>
                    <button className="ghost-btn" type="button" onClick={goToNextDhikr} disabled={activeDhikrIndex >= filteredDhikr.length - 1}>
                      التالي
                    </button>
                  </div>
                </div>
              ) : (
                <EmptyState text="لا توجد أذكار مطابقة للبحث الحالي في هذا القسم." />
              )}
            </div>
          </section>
        )}

        {activeView === "quran" && (
          <section className="reader-layout">
            <div className="quran-nav-panel" aria-label="تنقل مختصر في المصحف">
              <button className="quran-index-trigger" type="button" onClick={() => setQuranIndexOpen(true)}>
                <List size={18} aria-hidden="true" />
                فهرس المصحف
              </button>
              <div className="surah-list quick" aria-label="السور القريبة">
                {quickSurahs.map((surah) => (
                  <button
                    className={`surah-item ${surah.id === selectedSurah ? "active" : ""}`}
                    type="button"
                    key={surah.id}
                    onClick={() => selectSurah(surah, false)}
                  >
                    <small>{surah.number}</small>
                    <strong>{surah.name}</strong>
                    <span>{surah.revelation} - {surah.versesCount} آية</span>
                  </button>
                ))}
              </div>
            </div>

            <article className="mushaf-panel">
              <div className="reader-head">
                <div>
                  <p className="eyebrow">{activeSurah.revelation} - {activeSurah.versesCount} آية</p>
                  <h3>{activeSurah.name}</h3>
                </div>
                <div className="reader-actions">
                  <button
                    className={`icon-btn ${favorites.includes(activeSurah.id) ? "active" : ""}`}
                    type="button"
                    onClick={() => toggleFavorite(activeSurah.id)}
                    aria-label="إضافة السورة للمفضلة"
                  >
                    <Star size={20} fill="currentColor" />
                  </button>
                </div>
              </div>
              <div className="mushaf-page" onTouchStart={handleQuranTouchStart} onTouchEnd={handleQuranTouchEnd}>
                {loading.quran ? (
                  <EmptyState text="جاري تحميل المصحف كاملًا من المصدر..." />
                ) : errors.quran ? (
                  <EmptyState text={errors.quran} />
                ) : !pageVerses.length ? (
                  <EmptyState text="لم تظهر آيات هذه السورة بعد. أعد تحميل الصفحة أو تحقق من الاتصال." />
                ) : (
                  <>
                    <div className="mushaf-page-meta" aria-label="بيانات الصفحة">
                      <span>{formatJuzName(activePageJuz)}</span>
                      <strong>{activePageSurah}</strong>
                    </div>
                    <div className="mushaf-text" key={`quran-page-${quranPage}`}>
                      {quranPageSurahs.map((section) => (
                        <section className="mushaf-surah-section" key={`${quranPage}-${section.surahNumber}`}>
                          {(section.showIstiadhah || section.showBasmala) && (
                            <div className="mushaf-opening">
                              <h4>{section.surahName}</h4>
                              {section.showIstiadhah && <p className="mushaf-istiadhah">{ISTIADHA}</p>}
                              {section.showBasmala && <p className="mushaf-basmala">{BASMALA}</p>}
                            </div>
                          )}
                          <p>
                            {section.ayahs.map((ayah) => (
                              <span className="mushaf-ayah" key={ayah.key}>
                                {ayah.text}
                                <span className="mushaf-number">{ayah.ayahNumber}</span>
                              </span>
                            ))}
                          </p>
                        </section>
                      ))}
                    </div>
                  </>
                )}
                {!loading.quran && !errors.quran && pageVerses.length > 0 && (
                  <div className="mushaf-page-number" aria-label={`رقم الصفحة ${quranPage}`}>
                    <span>{quranPage}</span>
                  </div>
                )}
              </div>
              <div className="page-controls">
                <button className="ghost-btn" type="button" disabled={quranPage <= 1} onClick={goToPreviousQuranPage}>
                  الصفحة السابقة
                </button>
                <strong>صفحة {quranPage} من 604</strong>
                <button className="ghost-btn" type="button" disabled={quranPage >= 604} onClick={goToNextQuranPage}>
                  الصفحة التالية
                </button>
              </div>
            </article>

            {quranIndexOpen && (
              <div className="quran-index-overlay" role="presentation" onClick={() => setQuranIndexOpen(false)}>
                <aside className="quran-index-drawer" role="dialog" aria-modal="true" aria-label="فهرس المصحف" onClick={(event) => event.stopPropagation()}>
                  <div className="quran-index-head">
                    <div>
                      <span>فهرس المصحف</span>
                      <strong>{activeSurah.name}</strong>
                    </div>
                    <button className="icon-btn" type="button" onClick={() => setQuranIndexOpen(false)} aria-label="إغلاق الفهرس">
                      <X size={19} aria-hidden="true" />
                    </button>
                  </div>

                  <form className="quran-index-search" role="search" onSubmit={(event) => event.preventDefault()}>
                    <Search size={18} aria-hidden="true" />
                    <input
                      type="search"
                      value={quranIndexQuery}
                      onChange={(event) => setQuranIndexQuery(event.target.value)}
                      placeholder="ابحث باسم السورة أو رقمها"
                    />
                  </form>

                  <div className="quran-index-tabs" role="tablist" aria-label="تبويبات فهرس المصحف">
                    {QURAN_INDEX_TABS.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          className={quranIndexTab === tab.id ? "active" : ""}
                          type="button"
                          role="tab"
                          aria-selected={quranIndexTab === tab.id}
                          key={tab.id}
                          onClick={() => setQuranIndexTab(tab.id)}
                        >
                          <Icon size={16} aria-hidden="true" />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="quran-index-body">
                    {quranIndexTab === "surahs" && (
                      <div className="surah-index-list">
                        {quranIndexSurahs.map((surah) => (
                          <button
                            className={`surah-index-item ${surah.id === selectedSurah ? "active" : ""}`}
                            type="button"
                            key={surah.id}
                            onClick={() => selectSurah(surah)}
                          >
                            <span className="surah-number">{surah.number}</span>
                            <span className="surah-index-title">
                              <strong>{surah.name}</strong>
                              <small>{surah.revelation} - {surah.versesCount} آية</small>
                            </span>
                            {surah.id === selectedSurah && <i>الحالية</i>}
                          </button>
                        ))}
                      </div>
                    )}

                    {quranIndexTab === "juz" && (
                      <div className="juz-grid">
                        {JUZ_START_PAGES.map((page, index) => (
                          <button className={activePageJuz === index + 1 ? "active" : ""} type="button" key={page} onClick={() => selectJuz(index + 1)}>
                            <strong>{formatJuzName(index + 1)}</strong>
                            <span>صفحة {page}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {quranIndexTab === "pages" && (
                      <div className="quran-jump-panel">
                        <form onSubmit={submitPageJump}>
                          <label htmlFor="quran-page-jump">انتقل إلى صفحة</label>
                          <div>
                            <input id="quran-page-jump" inputMode="numeric" min="1" max="604" value={pageJumpInput} onChange={(event) => setPageJumpInput(event.target.value)} />
                            <button className="primary-btn" type="submit">اذهب</button>
                          </div>
                        </form>
                        <form onSubmit={submitAyahJump}>
                          <label htmlFor="quran-ayah-jump">آية في {activeSurah.name}</label>
                          <div>
                            <input id="quran-ayah-jump" inputMode="numeric" min="1" max={activeSurah.versesCount || 1} value={ayahJumpInput} onChange={(event) => setAyahJumpInput(event.target.value)} placeholder={`1 - ${activeSurah.versesCount}`} />
                            <button className="ghost-btn" type="submit">انتقل</button>
                          </div>
                        </form>
                      </div>
                    )}

                    {quranIndexTab === "favorites" && (
                      <div className="surah-index-list">
                        {quranFavoriteSurahs.length ? (
                          quranFavoriteSurahs.map((surah) => (
                            <button className={`surah-index-item ${surah.id === selectedSurah ? "active" : ""}`} type="button" key={surah.id} onClick={() => selectSurah(surah)}>
                              <span className="surah-number">{surah.number}</span>
                              <span className="surah-index-title">
                                <strong>{surah.name}</strong>
                                <small>{surah.revelation} - {surah.versesCount} آية</small>
                              </span>
                              <Star size={16} fill="currentColor" aria-hidden="true" />
                            </button>
                          ))
                        ) : (
                          <EmptyState text="لم تضف سورًا للمفضلة بعد." />
                        )}
                      </div>
                    )}
                  </div>
                </aside>
              </div>
            )}
          </section>
        )}

        {activeView === "tasbeeh" && (
          <section className="tasbeeh-panel">
            <button className="tasbeeh-ring" type="button" onClick={() => updateTasbeeh(tasbeeh + 1)} aria-label="زيادة عداد السبحة">
              <span>{tasbeeh}</span>
              <small>تسبيحة</small>
            </button>
            <div className="tasbeeh-actions">
              <button className="primary-btn" type="button" onClick={() => updateTasbeeh(tasbeeh + 1)}>
                <Sparkles size={18} aria-hidden="true" />
                سبح
              </button>
              <button className="ghost-btn" type="button" onClick={() => updateTasbeeh(0)}>
                <RotateCcw size={18} aria-hidden="true" />
                إعادة
              </button>
            </div>
            <div className="tasbeeh-phrases">
              {tasbeehPhrases.map((phrase) => (
                <button className="chip" type="button" key={phrase} onClick={() => updateTasbeeh(tasbeeh + 1)}>
                  {phrase}
                </button>
              ))}
            </div>
          </section>
        )}

        {activeView === "favorites" && (
          <section className="cards-grid">
            {favoriteItems.length ? (
              favoriteItems.map((item) => (
                <article className="favorite-card" key={item.id}>
                  <div className="card-head">
                    <span className="tag">{item.type}</span>
                    <button className="icon-btn active" type="button" onClick={() => toggleFavorite(item.id)} aria-label="حذف من المفضلة">
                      <Star size={20} fill="currentColor" />
                    </button>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))
            ) : (
              <EmptyState text="لم تضف عناصر للمفضلة بعد." />
            )}
          </section>
        )}

        <footer className="smart-footer" aria-label="معلومات حرز">
          <div className="smart-footer-progress">
            <div className="daily-progress-head">
              <div className="daily-progress-title">
                <span>ورد اليوم</span>
              </div>
              <div className="daily-progress-score">
                <strong>{dailyCoreProgress}%</strong>
              </div>
            </div>
            <div className="split-progress" aria-hidden="true">
              <div className="split-progress-half morning">
                <span style={{ width: `${morningProgress.percent}%` }} />
              </div>
              <i className={morningProgress.done ? "done" : ""}>{morningProgress.done ? "✓" : ""}</i>
              <div className="split-progress-half evening">
                <span style={{ width: `${eveningProgress.percent}%` }} />
              </div>
            </div>
            <div className="daily-progress-labels">
              <span>الصباح {morningProgress.percent}%</span>
              <span>المساء {eveningProgress.percent}%</span>
            </div>
          </div>

          <div className="smart-footer-dedication">
            <span>صدقة جارية</span>
            <p>لروح جدي وجدتي</p>
            <div className="memorial-names">
              <strong>عبد الرحمن محمد أحمد</strong>
              <strong>ست النور محمد عثمان</strong>
            </div>
            <p className="memorial-dua">ولجميع أموات المسلمين</p>
          </div>

          <p className="smart-footer-copyright">{COPYRIGHT_TEXT}</p>
        </footer>
      </main>
    </div>
  );
}
