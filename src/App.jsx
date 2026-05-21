import React, { useEffect, useMemo, useState } from "react";
import { BookOpen, Heart, RotateCcw, Sparkles, Star, Sun } from "lucide-react";
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

function readStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
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
  const [counts, setCounts] = useState(() => readStorage("hirz-counts", {}));
  const [favorites, setFavorites] = useState(() => readStorage("hirz-favorites", []));
  const [tasbeeh, setTasbeeh] = useState(0);
  const [theme, setTheme] = useState(() => localStorage.getItem("hirz-theme") || "light");

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
    setLoading((current) => ({ ...current, quran: true }));
    setErrors((current) => ({ ...current, quran: "" }));

    fetchQuranPage(quranPage)
      .then((verses) => {
        if (!isMounted) {
          return;
        }
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
    const firstVerse = pageVerses[0];
    if (!firstVerse?.surahNumber) {
      return;
    }
    const currentPageSurah = quranChapters.find((surah) => surah.number === firstVerse.surahNumber);
    if (currentPageSurah && currentPageSurah.id !== selectedSurah) {
      setSelectedSurah(currentPageSurah.id);
    }
  }, [pageVerses, quranChapters, selectedSurah]);

  const activeSurah = quranChapters.find((surah) => surah.id === selectedSurah) ?? quranChapters[0];
  const completedCount = dhikrItems.filter((item) => (counts[item.id] || 0) >= item.target).length;
  const progress = dhikrItems.length ? Math.round((completedCount / dhikrItems.length) * 100) : 0;

  const filteredDhikr = useMemo(() => {
    return dhikrItems.filter((item) => {
      const matchesCategory = item.collectionId === category;
      const matchesQuery = semanticMatch(`${item.category} ${item.text} ${item.note}`, query);
      return matchesCategory && matchesQuery;
    });
  }, [category, dhikrItems, query]);

  const filteredSurahs = useMemo(() => {
    return quranChapters.filter((surah) => {
      return semanticMatch(`${surah.name} ${surah.meta} ${surah.number}`, query);
    });
  }, [quranChapters, query]);

  const favoriteItems = useMemo(() => {
    const allItems = [
      ...dhikrItems.map((item) => ({ type: "ذكر", id: item.id, title: item.category, body: item.text })),
      ...quranChapters.map((item) => ({ type: "سورة", id: item.id, title: item.name, body: item.meta }))
    ];
    return allItems.filter((item) => favorites.includes(item.id));
  }, [dhikrItems, favorites, quranChapters]);

  useEffect(() => {
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
    saveCounts({
      ...counts,
      [item.id]: Math.min((counts[item.id] || 0) + 1, item.target)
    });
  }

  function resetDhikr(id) {
    const nextCounts = { ...counts };
    delete nextCounts[id];
    saveCounts(nextCounts);
  }

  function updateTasbeeh(nextValue) {
    setTasbeeh(nextValue);
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
          theme={theme}
          onThemeToggle={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
        />

        <section className="header-info-panel" aria-label="معلومات حرز">
          <div className="header-info-dedication">
            <span>صدقة جارية لروح جدي و جدتي</span>
            <strong>عبد الرحمن محمد احمد</strong>
            <strong>ست النور محمد عثمان</strong>
            <p>ولجميع أمواتنا وأموات المسلمين</p>
          </div>
          <div className="header-info-progress">
            <span>ورد اليوم</span>
            <strong>{progress}%</strong>
            <div className="progress-track" aria-hidden="true">
              <div style={{ width: `${progress}%` }} />
            </div>
          </div>
        </section>

        {activeView === "adhkar" && (
          <section className="view-stack">
            <div className="collection-grid">
              {dhikrCategories.map((item) => (
                <button
                  className={`collection-card ${category === item.id ? "active" : ""}`}
                  type="button"
                  key={item.id}
                  onClick={() => setCategory(item.id)}
                >
                  <strong>{item.label}</strong>
                  <span>{item.description}</span>
                  <small>{formatDhikrCount(item.count)}</small>
                </button>
              ))}
            </div>
            <div className="dhikr-stack">
              <div className="selected-collection-title">
                <h3>{dhikrCategories.find((item) => item.id === category)?.label || "أذكار الصباح"}</h3>
              </div>
              {loading.dhikr ? (
                <EmptyState text="جاري تحميل جميع الأذكار من المصدر..." />
              ) : errors.dhikr ? (
                <EmptyState text={errors.dhikr} />
              ) : filteredDhikr.length ? (
                filteredDhikr.map((item) => (
                  <DhikrCard
                    key={item.id}
                    item={item}
                    count={counts[item.id] || 0}
                    isFavorite={favorites.includes(item.id)}
                    onFavorite={() => toggleFavorite(item.id)}
                    onIncrement={() => incrementDhikr(item)}
                    onReset={() => resetDhikr(item.id)}
                  />
                ))
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
              <div className="mushaf-page">
                {loading.quran ? (
                  <EmptyState text="جاري تحميل المصحف كاملًا من المصدر..." />
                ) : errors.quran ? (
                  <EmptyState text={errors.quran} />
                ) : !pageVerses.length ? (
                  <EmptyState text="لم تظهر آيات هذه السورة بعد. أعد تحميل الصفحة أو تحقق من الاتصال." />
                ) : (
                  <p className="mushaf-text">
                    {pageVerses.map((ayah) => (
                      <span className="mushaf-ayah" key={ayah.key}>
                        {ayah.text}
                        <span className="mushaf-number">{ayah.ayahNumber}</span>
                      </span>
                    ))}
                  </p>
                )}
              </div>
              <div className="page-controls">
                <button className="ghost-btn" type="button" disabled={quranPage <= 1} onClick={() => setQuranPage((page) => Math.max(1, page - 1))}>
                  الصفحة السابقة
                </button>
                <strong>صفحة {quranPage} من 604</strong>
                <button className="ghost-btn" type="button" disabled={quranPage >= 604} onClick={() => setQuranPage((page) => Math.min(604, page + 1))}>
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
            <span>صدقة جارية لروح جدي و جدتي</span>
            <strong>عبد الرحمن محمد احمد</strong>
            <strong>ست النور محمد عثمان</strong>
            <p>ولجميع أمواتنا وأموات المسلمين</p>
          </div>

          <p className="smart-footer-copyright">تصميم وتطوير محمد عادل حسن طه</p>
        </footer>
      </main>
    </div>
  );
}
