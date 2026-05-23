import React, { useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, Grid2X2, Heart, RotateCcw, Sparkles, Star, Sun, Undo2 } from "lucide-react";
import DhikrCard from "./components/DhikrCard.jsx";
import EmptyState from "./components/EmptyState.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import { surahMeta, tasbeehPhrases } from "./data";
import { fetchAllDhikr, fetchQuranChapters, fetchQuranPage } from "./services/islamicApi";

const views = {
  adhkar: { label: "الأذكار", title: "وردك اليومي بهدوء", icon: Sun },
  quran: { label: "القرآن", title: "اقرأ ما تيسر لك", icon: BookOpen },
  tasbeeh: { label: "السبحة", title: "ذكر مستمر وبسيط", icon: Sparkles },
  favorites: { label: "المفضلة", title: "محفوظات قريبة", icon: Heart }
};

const BASMALA = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
const ISTIADHA = "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ";
const FEATURED_COLLECTIONS = ["morning", "evening", "after-prayer", "before-sleep"];

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

export default function App() {
  const [activeView, setActiveView] = useState("adhkar");
  const [category, setCategory] = useState("morning");
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
  const [quranPage, setQuranPage] = useState(1);
  const [pageVerses, setPageVerses] = useState([]);
  const [loading, setLoading] = useState({ dhikr: true, quran: true });
  const [errors, setErrors] = useState({ dhikr: "", quran: "" });
  const [counts, setCounts] = useState(() => readDailyCounts());
  const [favorites, setFavorites] = useState(() => readStorage("hirz-favorites", []));
  const [tasbeeh, setTasbeeh] = useState(0);
  const [theme, setTheme] = useState(() => localStorage.getItem("hirz-theme") || "light");
  const [activeDhikrIndex, setActiveDhikrIndex] = useState(0);
  const [showMoreCollections, setShowMoreCollections] = useState(false);
  const touchStartX = useRef(null);
  const quranTouchStartX = useRef(null);
  const quranPageCache = useRef(new Map());

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("hirz-theme", theme);
  }, [theme]);

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
  const completedCount = dhikrItems.filter((item) => (counts[item.id] || 0) >= item.target).length;
  const progress = dhikrItems.length ? Math.round((completedCount / dhikrItems.length) * 100) : 0;
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

  const featuredCategories = useMemo(() => {
    return dhikrCategories.filter((item) => FEATURED_COLLECTIONS.includes(item.id));
  }, [dhikrCategories]);

  const moreCategories = useMemo(() => {
    return dhikrCategories.filter((item) => !FEATURED_COLLECTIONS.includes(item.id));
  }, [dhikrCategories]);

  const activeDhikrItem = filteredDhikr[activeDhikrIndex] || filteredDhikr[0];
  const filteredCompletedCount = filteredDhikr.filter((item) => (counts[item.id] || 0) >= item.target).length;
  const filteredProgress = filteredDhikr.length ? Math.round((filteredCompletedCount / filteredDhikr.length) * 100) : 0;

  useEffect(() => {
    setActiveDhikrIndex(0);
  }, [category, query]);

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

  function toggleFavorite(id) {
    saveFavorites(favorites.includes(id) ? favorites.filter((item) => item !== id) : [...favorites, id]);
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
    setActiveDhikrIndex((current) => (filteredDhikr.length ? Math.min(current + 1, filteredDhikr.length - 1) : 0));
  }

  function goToPreviousDhikr() {
    setActiveDhikrIndex((current) => Math.max(current - 1, 0));
  }

  function handleDhikrTouchStart(event) {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  }

  function handleDhikrTouchEnd(event) {
    if (touchStartX.current === null) {
      return;
    }
    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 46) {
      return;
    }
    if (delta > 0) {
      goToNextDhikr();
    } else {
      goToPreviousDhikr();
    }
  }

  function goToNextQuranPage() {
    setQuranPage((page) => Math.min(604, page + 1));
  }

  function goToPreviousQuranPage() {
    setQuranPage((page) => Math.max(1, page - 1));
  }

  function handleQuranTouchStart(event) {
    quranTouchStartX.current = event.touches[0]?.clientX ?? null;
  }

  function handleQuranTouchEnd(event) {
    if (quranTouchStartX.current === null) {
      return;
    }
    const endX = event.changedTouches[0]?.clientX ?? quranTouchStartX.current;
    const delta = endX - quranTouchStartX.current;
    quranTouchStartX.current = null;
    if (Math.abs(delta) < 54) {
      return;
    }
    if (delta > 0) {
      goToNextQuranPage();
    } else {
      goToPreviousQuranPage();
    }
  }

  return (
    <div className="app-shell">
      <Sidebar
        views={views}
        activeView={activeView}
        progress={progress}
        theme={theme}
        onThemeToggle={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
        onViewChange={setActiveView}
      />

      <main className="content">
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
              <span>ورد اليوم</span>
              <strong>{progress}%</strong>
              <div className="progress-track" aria-hidden="true">
                <div style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </section>

        {activeView === "adhkar" && (
          <section className="view-stack">
            {dhikrCategories.length > 0 && (
              <div className="collection-panel">
                <div className="collection-grid">
                  {featuredCategories.map((item) => (
                    <button
                      className={`collection-card ${category === item.id ? "active" : ""}`}
                      type="button"
                      key={item.id}
                      aria-pressed={category === item.id}
                      onClick={() => setCategory(item.id)}
                    >
                      <strong>{item.label}</strong>
                      <span>{item.description}</span>
                      <small>{formatDhikrCount(item.count)}</small>
                    </button>
                  ))}
                  <button className={`collection-card more-card ${showMoreCollections ? "active" : ""}`} type="button" onClick={() => setShowMoreCollections((current) => !current)}>
                    <Grid2X2 size={22} aria-hidden="true" />
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
                        aria-pressed={category === item.id}
                        onClick={() => setCategory(item.id)}
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
                <div className="dhikr-reader" onTouchStart={handleDhikrTouchStart} onTouchEnd={handleDhikrTouchEnd}>
                  <div className="dhikr-live-progress" aria-label="تقدم القسم الحالي">
                    <span>تقدم هذا الورد</span>
                    <strong>{filteredProgress}%</strong>
                    <div className="progress-track" aria-hidden="true">
                      <div style={{ width: `${filteredProgress}%` }} />
                    </div>
                  </div>
                  <div className="dhikr-reader-meta">
                    <span>{activeDhikrIndex + 1} من {filteredDhikr.length}</span>
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
            <div className="surah-list" aria-label="السور">
              {filteredSurahs.map((surah) => (
                <button
                  className={`surah-item ${surah.id === selectedSurah ? "active" : ""}`}
                  type="button"
                  key={surah.id}
                  onClick={() => {
                    setSelectedSurah(surah.id);
                    setQuranPage(surah.pageStart || 1);
                  }}
                >
                  <strong>{surah.name}</strong>
                  <span>{surah.pageStart}</span>
                </button>
              ))}
            </div>

            <article className="mushaf-panel">
              <div className="reader-head">
                <div>
                  <p className="eyebrow">{activeSurah.revelation} - {activeSurah.versesCount} آية</p>
                  <h3>{activeSurah.name}</h3>
                </div>
                <button
                  className={`icon-btn ${favorites.includes(activeSurah.id) ? "active" : ""}`}
                  type="button"
                  onClick={() => toggleFavorite(activeSurah.id)}
                  aria-label="إضافة السورة للمفضلة"
                >
                  <Star size={20} fill="currentColor" />
                </button>
              </div>
              <div className="mushaf-page" onTouchStart={handleQuranTouchStart} onTouchEnd={handleQuranTouchEnd}>
                {loading.quran ? (
                  <EmptyState text="جاري تحميل المصحف كاملًا من المصدر..." />
                ) : errors.quran ? (
                  <EmptyState text={errors.quran} />
                ) : !pageVerses.length ? (
                  <EmptyState text="لم تظهر آيات هذه السورة بعد. أعد تحميل الصفحة أو تحقق من الاتصال." />
                ) : (
                  <div className="mushaf-text">
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
            <span>ورد اليوم</span>
            <strong>{progress}%</strong>
            <div className="progress-track" aria-hidden="true">
              <div style={{ width: `${progress}%` }} />
            </div>
          </div>

          <button className="smart-footer-theme" type="button" onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}>
            {theme === "dark" ? "الوضع النهاري" : "الوضع الليلي"}
          </button>

          <div className="smart-footer-dedication">
            <span>صدقة جارية</span>
            <p>لروح جدي وجدتي</p>
            <div className="memorial-names">
              <strong>عبد الرحمن محمد أحمد</strong>
              <strong>ست النور محمد عثمان</strong>
            </div>
            <p className="memorial-dua">ولجميع أموات المسلمين</p>
          </div>

          <p className="smart-footer-copyright">تصميم وتطوير: محمد عادل حسن طه</p>
        </footer>
      </main>
    </div>
  );
}
