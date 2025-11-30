"use client"
import React, { useState, useMemo } from "react";
import styles from "./SearchPros.module.css";

// Search + Filters + Results mockup
// CSS-modules are used (styles.*) — corresponds to SearchMastersSection.module.css

export const CATEGORIES = {
  "Ремонт": [
    "Косметический ремонт",
    "Ремонт стен и потолков",
    "Плиточные работы",
    "Сантехника",
    "Малярные работы"
  ],

  "Электрика": [
    "Розетки и выключатели",
    "Проводка",
    "Автоматы и щиты",
    "Освещение"
  ],

  "Установка": [
    "Сборка мебели",
    "Монтаж техники",
    "Монтаж дверей",
    "Монтаж полок и карнизов"
  ],

  "Мебель": [
    "Сборка",
    "Ремонт мебели",
    "Установка кухни"
  ],

  "Стиральная машина": [
    "Ремонт",
    "Установка",
    "Диагностика"
  ],

  "Холодильник": [
    "Ремонт",
    "Диагностика"
  ],

  "Газ (бойлер, плита, духовка)": [
    "Ремонт",
    "Установка",
    "Обслуживание"
  ],

  "Кондиционер": [
    "Установка",
    "Заправка",
    "Чистка",
    "Ремонт"
  ],

  "Замки": [
    "Вскрытие",
    "Установка замков",
    "Ремонт замков"
  ],

  "Вывоз мусора": [
    "Строительный мусор",
    "Бытовой мусор",
    "Мебель/крупногабарит"
  ],

  "Уборка": [
    "Генеральная уборка",
    "Квартиры",
    "Офисы",
    "После ремонта"
  ],

  "Транспорт, переезды и услуги": [
    "Переезд",
    "Грузчики",
    "Перевозка мебели"
  ],

  "Дезинфекция": [
    "Дезинсекция",
    "Дератизация",
    "Антибактериальная обработка"
  ],

  "Счётчики (газ, электричество, вода)": [
    "Установка",
    "Поверка",
    "Замена"
  ],

  "Почасовой мастер": [
    "Мелкие работы",
    "Муж на час"
  ],

  "Бытовая техника": [
    "Плиты",
    "Духовки",
    "Пылесосы",
    "Мелкая техника"
  ],

  "Видеонаблюдение и безопасность": [
    "Установка камер",
    "Умный дом",
    "Сигнализация"
  ],

  "Ремонт телефонов и ноутбуков": [
    "Замена экрана",
    "Батарея",
    "Диагностика"
  ]
};


const LANGUAGES = ["Румынский", "Английский"];

const MOCK_PERFORMERS = [
  {
    id: "1",
    name: "Иван Петров",
    rating: 4.9,
    reviewsCount: 124,
    priceFrom: 30,
    priceTo: 60,
    priceUnit: "час",
    services: ["Сантехника", "Монтаж"],
    location: { city: "București", distanceKm: 3.2 },
    responseTimeHours: 1,
    availability: "online",
    badges: ["verified", "pro"],
    shortBio: "Опытный сантехник — замена труб, монтаж сантехники.",
    skillsTags: ["замена труб", "монтаж унитаза", "ремонт кранов"],
    languages: ["Русский", "Румынский"]
  },
  {
    id: "2",
    name: "Maria Ionescu",
    rating: 4.7,
    reviewsCount: 58,
    priceFrom: 25,
    priceTo: 45,
    priceUnit: "час",
    services: ["Уборка"],
    location: { city: "București", distanceKm: 7.1 },
    responseTimeHours: 24,
    availability: "soon",
    badges: ["guarantee"],
    shortBio: "Быстро и качественно. Опыт: 6 лет.",
    skillsTags: ["генеральная уборка", "мойка окон"],
    languages: ["Румынский"]
  },
  {
    id: "3",
    name: "Alex Popescu",
    rating: 4.3,
    reviewsCount: 12,
    priceFrom: 15,
    priceTo: 25,
    priceUnit: "за вызов",
    services: ["Электрика"],
    location: { city: "Ilfov", distanceKm: 18 },
    responseTimeHours: 4,
    availability: "online",
    badges: [],
    shortBio: "Мелкие электромонтажные работы. Быстрый выезд.",
    skillsTags: ["розетки", "замена проводки"],
    languages: ["Румынский", "Английский"]
  }
];

function CategoryPills({ categories, selected, onSelect }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);

  function handleCategoryClick(cat) {
    setSelectedSub(null);
    setSelectedCategory((prev) => (prev === cat ? null : cat));
  }

  function handleSubClick(cat, sub) {
    setSelectedCategory(cat);
    setSelectedSub(sub);
    onSelect(cat, sub);
  }

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Выберите категорию задания</h1>
        <p className={styles.subtitle}>Мы готовы помочь вам в решении самых разнообразных задач</p>
      </header>

      {/* Top pills */}
      <div className={styles.pillsRow}>
        {Object.keys(CATEGORIES).map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`${styles.pill} ${selectedCategory === cat ? styles.pillActive : ''}`}
            aria-pressed={selectedCategory === cat}
            aria-expanded={selectedCategory === cat}
            title={cat}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Subcategories block (visible when a category selected) */}
      {selectedCategory && (
        <div className={styles.subBlock}>
          <h3 className={styles.subTitle}>{selectedCategory}</h3>

          <div className={styles.subGrid}>
            {CATEGORIES[selectedCategory].map((sub) => (
              <button
                key={sub}
                className={`${styles.subItem} ${selectedSub === sub ? styles.subItemActive : ''}`}
                onClick={() => handleSubClick(selectedCategory, sub)}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function QuickChips({ chips, active, onToggle }) {
  return (
    <div className={styles.quickChips}>
      <div className={styles.chipsRow}>
        {chips.map((chip) => (
          <button
            key={chip.id}
            onClick={() => onToggle(chip.id)}
            className={`${styles.chip} ${active.includes(chip.id) ? styles.chipActive : ""}`}
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );
}


export  function FiltersPanel({ state, setState, onApply, onClear }) {
  const toggleEmployment = (type) => {
    setState((s) => ({
      ...s,
      employment: s.employment.includes(type)
        ? s.employment.filter((x) => x !== type)
        : [...s.employment, type],
    }));
  };

  const toggleLanguage = (lang) => {
    setState((s) => ({
      ...s,
      languages: s.languages.includes(lang)
        ? s.languages.filter((x) => x !== lang)
        : [...s.languages, lang],
    }));
  };

  return (
    <aside className={styles.filtersPanel}>
      <h4 className={styles.filtersTitle}>Фильтры</h4>

      <div className={styles.filterGroup}>
        <label className={styles.fieldLabel}>Цена (RON за {state.priceUnit})</label>
        <div className={styles.row}>
          {/* <input
            type="number"
            value={state.priceMin}
            onChange={(e) => setState((s) => ({ ...s, priceMin: Number(e.target.value) }))}
            className={styles.inputNumber}
            placeholder="Мин"
          /> */}
          <input
            type="number"
            value={state.priceMax}
            onChange={(e) => setState((s) => ({ ...s, priceMax: Number(e.target.value) }))}
            className={styles.inputNumber}
            placeholder="Макс"
          />
        </div>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.fieldLabel}>Рейтинг (мин)</label>
        <select
          value={state.ratingMin}
          onChange={(e) => setState((s) => ({ ...s, ratingMin: Number(e.target.value) }))}
          className={styles.select}
        >
          <option value={0}>Любой</option>
          <option value={4}>4+</option>
          <option value={4.5}>4.5+</option>
          <option value={4.8}>4.8+</option>
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.fieldLabel}>Срочность (ответ в часах)</label>
        <input
          type="number"
          min={0}
          value={state.urgencyHours}
          onChange={(e) => setState((s) => ({ ...s, urgencyHours: Number(e.target.value) }))}
          className={styles.inputNumber}
          placeholder="Например 4"
        />
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.fieldLabel}>Тип занятости</label>
        <div className={styles.checkboxRow}>
          {["full", "part"].map((type) => (
            <label key={type} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={state.employment.includes(type)}
                onChange={() => toggleEmployment(type)}
              />
              {type === "full" ? "Полная" : "Частичная"}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.fieldLabel}>Языки</label>
        <div className={styles.languagesWrap}>
          {LANGUAGES.map((lang) => (
            <label key={lang} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={state.languages.includes(lang)}
                onChange={() => toggleLanguage(lang)}
              />
              {lang}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.actionsRow}>
        <button onClick={onApply} className={styles.applyBtn}>Применить</button>
        <button onClick={onClear} className={styles.clearBtn}>Сброс</button>
      </div>
    </aside>
  );
}

function PerformerCard({ p, variant = "expanded", onChat, onBook }) {
  return (
    <article className={`${styles.card} ${variant === "compact" ? styles.cardCompact : styles.cardExpanded}`}>
      <img src="/images/pros/1.jpg" className={styles.avatar}/>
      <div className={styles.performerMain}>
        <div className={styles.titleRow}>
          <div>
            <h5 className={styles.name}>{p.name}</h5>
            <div className={styles.servicesText}>{p.services.join(" • ")}</div>
          </div>
          <div className={styles.priceBlock}>
            <div className={styles.priceValue}>{p.priceFrom}{p.priceUnit ? ` ${p.priceUnit}` : ''}</div>
            <div className={styles.distanceText}>{p.location?.distanceKm ? `${p.location.distanceKm} km` : p.location?.city}</div>
          </div>
        </div>

        {variant === "expanded" && (
          <>
            <p className={styles.bio}>{p.shortBio}</p>
            <div className={styles.statsRow}>
              <div className={styles.smallText}>{p.rating} ★ ({p.reviewsCount})</div>
              {p.badges.map((b) => (
                <span key={b} className={styles.badge}>{b}</span>
              ))}

              <div className={styles.actions}>
                <button onClick={() => onChat(p)} className={styles.chatBtn}>Чат</button>
                <button onClick={() => onBook(p)} className={styles.bookBtn}>Заказать</button>
              </div>
            </div>
          </>
        )}
      </div>
    </article>
  );
}

export default function SearchMastersSection() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [quickActive, setQuickActive] = useState([]);

  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 1000,
    priceUnit: "час",
    ratingMin: 0,
    urgencyHours: 0,
    employment: [],
    languages: [],
    verified: false
  });

  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  const QUICK_CHIPS = [
    { id: "nearby", label: "Рядом" },
    { id: "online", label: "Онлайн сейчас" },
    { id: "withReviews", label: "Только с отзывами" },
    { id: "guarantee", label: "С гарантией" }
  ];

  function toggleChip(id) {
    setQuickActive((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  function applyFilters() {
    // можно запускать запрос на сервер или обновлять локальный стейт
    setShowFiltersMobile(false);
  }

  function clearFilters() {
    setFilters({
      priceMin: 0,
      priceMax: 1000,
      priceUnit: "час",
      ratingMin: 0,
      urgencyHours: 0,
      employment: [],
      languages: [],
      verified: false
    });
  }

  const filtered = useMemo(() => {
    return MOCK_PERFORMERS.filter((p) => {
      if (selectedCategory && !p.services.includes(selectedCategory)) return false;
      if (query && !(`${p.name} ${p.services.join(' ')} ${p.shortBio}`).toLowerCase().includes(query.toLowerCase())) return false;
      if (filters.verified && !p.badges.includes("verified")) return false;
      if (filters.ratingMin && p.rating < filters.ratingMin) return false;
      if (filters.languages.length && !filters.languages.every(l => p.languages.includes(l))) return false;
      if (filters.urgencyHours && p.responseTimeHours > filters.urgencyHours) return false;
      if (quickActive.includes("withReviews") && p.reviewsCount < 5) return false;
      if (quickActive.includes("online") && p.availability !== "online") return false;
      if (quickActive.includes("guarantee") && !p.badges.includes("guarantee")) return false;
      if (quickActive.includes("nearby") && (p.location?.distanceKm ?? 999) > 10) return false;

      const pPrice = p.priceFrom ?? 0;
      if (pPrice < filters.priceMin || pPrice > filters.priceMax) return false;

      return true;
    });
  }, [selectedCategory, query, filters, quickActive]);

  return (
    <div className={styles.container}>
      <CategoryPills categories={CATEGORIES} selected={selectedCategory} onSelect={(c) => setSelectedCategory((s) => (s === c ? null : c))} />

      <div className={styles.topCard}>
        <div className={styles.topRow}>
          <input
            className={styles.input}
            placeholder="Что нужно — например: починить кран"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <input
            className={`${styles.input} ${styles.locationInput}`}
            placeholder="Адрес"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button className={styles.searchBtn}>Поиск</button>
          <button className={styles.filtersBtnMobile} onClick={() => setShowFiltersMobile(true)}>Фильтры</button>
        </div>

        <QuickChips chips={QUICK_CHIPS} active={quickActive} onToggle={toggleChip} />
      </div>

      <div className={styles.grid} style={{display: 'flex'}}>
        
        <FiltersPanel
          state={filters}
          setState={setFilters}
          onApply={applyFilters}
          onClear={clearFilters}
        />
        
        <div className={styles.resultsList} style={{ width: '100%' }}>
        
          <div className={styles.resultsHeader}>
            <div className={styles.resultCount}>Найдено: {filtered.length}</div>
            <div className={styles.sortWrap}>
              <label className={styles.smallText}>Сортировать:</label>
              <select className={styles.sortSelect}>
                <option>Рекомендованные</option>
                <option>Цена ↑</option>
                <option>Цена ↓</option>
                <option>Рейтинг</option>
                <option>Быстрота ответа</option>
              </select>
            </div>
          </div>

          <div>
            {filtered.length > 0 ? (
              filtered.map((p) => (
                <PerformerCard
                  key={p.id}
                  p={p}
                  variant="expanded"
                  onChat={(perf) => console.log("chat", perf)}
                  onBook={(perf) => console.log("book", perf)}
                />
              ))
            ) : (
              <div className={styles.emptyState}>Ничего не найдено. Попробуйте другие фильтры.</div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filters modal */}
      {showFiltersMobile && (
        <div className={styles.modalBackdrop} onClick={() => setShowFiltersMobile(false)}>
          <div className={styles.modalPanel} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h4 className={styles.filtersTitle}>Фильтры</h4>
              <button onClick={() => setShowFiltersMobile(false)} className={styles.smallText}>Закрыть</button>
            </div>
            <FiltersPanel
              state={filters}
              setState={setFilters}
              onApply={applyFilters}
              onClear={clearFilters}
            />
          </div>
        </div>
      )}
    </div>
  );
}
