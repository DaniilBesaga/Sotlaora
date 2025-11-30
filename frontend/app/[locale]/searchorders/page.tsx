"use client"
import React, { useState, useMemo } from "react";
import styles from "../searchpros/SearchPros.module.css"; // reuse same css-module

// Reuse categories from your original file or import; here we reuse CATEGORIES
// If you kept the original CATEGORIES in another file, import it instead.
const CATEGORIES = {
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
  // ... (оставьте остальные категории как в оригинале)
};

const LANGUAGES = ["Румынский", "Английский", "Русский"];

const MOCK_ORDERS = [
  {
    id: "o1",
    title: "Починить протекающий кран",
    description: "Кран капает уже несколько дней. Нужно заменить кран-буксу и устранить течь.",
    category: "Ремонт",
    sub: "Сантехника",
    budgetMin: 20,
    budgetMax: 40,
    budgetUnit: "фикс",
    location: { city: "București", distanceKm: 4.2 },
    postedAt: "2025-11-27T10:30:00Z",
    urgencyHours: 24,
    customerRating: 4.6,
    responsesCount: 1,
    remoteAllowed: false,
    languages: ["Румынский", "Русский"],
    tags: ["сантехника", "течет", "быстрый выезд"]
  },
  {
    id: "o2",
    title: "Генеральная уборка квартиры 2 camere",
    description: "После ремонта — требуются уборка, вынос мусора, мытье окон.",
    category: "Уборка",
    sub: "После ремонта",
    budgetMin: 60,
    budgetMax: 90,
    budgetUnit: "фикс",
    location: { city: "București", distanceKm: 12 },
    postedAt: "2025-11-25T08:00:00Z",
    urgencyHours: 72,
    customerRating: 4.9,
    responsesCount: 7,
    remoteAllowed: false,
    languages: ["Румынский"],
    tags: ["уборка", "послеремонт", "вывоз"]
  },
  {
    id: "o3",
    title: "Подключить лампу и розетку — вызов",
    description: "Нужен мастер для подключения потолочной лампы и одной розетки.",
    category: "Электрика",
    sub: "Розетки и выключатели",
    budgetMin: 15,
    budgetMax: 30,
    budgetUnit: "за вызов",
    location: { city: "Ilfov", distanceKm: 22 },
    postedAt: "2025-11-28T06:45:00Z",
    urgencyHours: 6,
    customerRating: 4.5,
    responsesCount: 0,
    remoteAllowed: false,
    languages: ["Румынский", "Английский"],
    tags: ["электрика", "лампа", "розетка"]
  },
  {
    id: "o4",
    title: "Онлайн-консультация по сборке мебели (инструкции)",
    description: "Есть чертежи и инструкции — нужна консультация по сборке кухни онлайн.",
    category: "Мебель",
    sub: "Установка кухни",
    budgetMin: 10,
    budgetMax: 20,
    budgetUnit: "час",
    location: { city: "Online", distanceKm: null },
    postedAt: "2025-11-26T12:00:00Z",
    urgencyHours: 48,
    customerRating: 4.2,
    responsesCount: 2,
    remoteAllowed: true,
    languages: ["Английский", "Румынский"],
    tags: ["онлайн", "сборка", "консультация"]
  }
];

function CategoryPillsOrders({ selectedCat, onSelect }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);

  function handleCategoryClick(cat) {
    setSelectedSub(null);
    setSelectedCategory((prev) => (prev === cat ? null : cat));
    onSelect(cat, null);
  }

  function handleSubClick(cat, sub) {
    setSelectedCategory(cat);
    setSelectedSub(sub);
    onSelect(cat, sub);
  }

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Найдите заказы</h1>
        <p className={styles.subtitle}>Смотрите заказы в вашей сфере и отправляйте отклики</p>
      </header>

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

function FiltersPanelOrders({ state, setState, onApply, onClear }) {
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
      <h4 className={styles.filtersTitle}>Фильтры для мастера</h4>

      <div className={styles.filterGroup}>
        <label className={styles.fieldLabel}>Бюджет (RON)</label>
        <div className={styles.row}>
          <input
            type="number"
            value={state.priceMin}
            onChange={(e) => setState((s) => ({ ...s, priceMin: Number(e.target.value) }))}
            className={styles.inputNumber}
            placeholder="Мин"
          />
        </div>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.fieldLabel}>Макс возраст заявки (дней)</label>
        <input
          type="number"
          min={0}
          value={state.maxAgeDays}
          onChange={(e) => setState((s) => ({ ...s, maxAgeDays: Number(e.target.value) }))}
          className={styles.inputNumber}
          placeholder="Например 7"
        />
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.fieldLabel}>Тип выполнения</label>
        <div className={styles.checkboxRow}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={state.remoteAllowed}
              onChange={() => setState((s) => ({ ...s, remoteAllowed: !s.remoteAllowed }))}
            />
            Онлайн (консультации)
          </label>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={state.inPerson}
              onChange={() => setState((s) => ({ ...s, inPerson: !s.inPerson }))}
            />
            На месте
          </label>
        </div>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.fieldLabel}>Языки заказчика</label>
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
        <button onClick={onApply} className={styles.applyBtn}>Показать</button>
        <button onClick={onClear} className={styles.clearBtn}>Сброс</button>
      </div>
    </aside>
  );
}

function OrderCard({ order, onApply, onSave, onMessage }) {
  const posted = new Date(order.postedAt);
  const postedStr = posted.toLocaleString();

  return (
    <article className={`${styles.card} ${styles.cardExpanded}`}>
      <div style={{width: 64, height: 64, borderRadius: 12, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700}}>
        Заказ
      </div>

      <div className={styles.performerMain}>
        <div className={styles.titleRow}>
          <div>
            <h5 className={styles.name}>{order.title}</h5>
            <div className={styles.servicesText}>{order.category} • {order.sub}</div>
          </div>

          <div className={styles.priceBlock}>
            <div className={styles.priceValue}>
              {order.budgetMin}{order.budgetUnit ? `–${order.budgetMax} ${order.budgetUnit}` : ''}
            </div>
            <div className={styles.distanceText}>{order.location?.distanceKm ? `${order.location.distanceKm} km` : order.location?.city}</div>
          </div>
        </div>

        <p className={styles.bio}>{order.description}</p>

        <div className={styles.statsRow}>
          <div className={styles.smallText}>Опубликовано: {postedStr}</div>
          <div className={styles.smallText}>Рейтинг заказчика: {order.customerRating} ★</div>
          <div className={styles.smallText}>Откликов: {order.responsesCount}</div>

          <div style={{marginLeft: "auto", display: "flex", gap: 8}}>
            <button onClick={() => onMessage(order)} className={styles.chatBtn}>Сообщение</button>
            <button onClick={() => onApply(order)} className={styles.bookBtn}>Откликнуться</button>
            <button onClick={() => onSave(order)} className={styles.chatBtn}>Сохранить</button>
          </div>
        </div>

        <div style={{marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap"}}>
          {order.tags.map(t => <span key={t} className={styles.badge}>{t}</span>)}
        </div>
      </div>
    </article>
  );
}

export default function SearchOrdersSection() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [quickActive, setQuickActive] = useState([]);

  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 1000,
    maxAgeDays: 30,
    remoteAllowed: false,
    inPerson: true,
    languages: []
  });

  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  const QUICK_CHIPS = [
    { id: "nearby", label: "Рядом" },
    { id: "urgent", label: "Срочно" },
    { id: "new", label: "Новые" },
    { id: "highPay", label: "Высокий бюджет" }
  ];

  function toggleChip(id) {
    setQuickActive((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  function applyFilters() {
    setShowFiltersMobile(false);
  }

  function clearFilters() {
    setFilters({
      priceMin: 0,
      priceMax: 1000,
      maxAgeDays: 30,
      remoteAllowed: false,
      inPerson: true,
      languages: []
    });
  }

  const filtered = useMemo(() => {
    const now = new Date();

    return MOCK_ORDERS.filter((o) => {
      if (selectedCategory && o.category !== selectedCategory) return false;
      if (selectedSub && o.sub !== selectedSub) return false;
      if (query && !(`${o.title} ${o.description} ${o.tags.join(" ")}`).toLowerCase().includes(query.toLowerCase())) return false;
      if (filters.remoteAllowed && !o.remoteAllowed) return false;
      if (!filters.inPerson && !o.remoteAllowed) return false; // if user wants only remote, inPerson=false handled above
      if (filters.languages.length && !filters.languages.every(l => o.languages.includes(l))) return false;
      if (quickActive.includes("nearby") && (o.location?.distanceKm ?? 999) > 15) return false;
      if (quickActive.includes("urgent") && o.urgencyHours > 24) return false;
      if (quickActive.includes("highPay") && o.budgetMax < 50) return false;
      if (filters.priceMin && o.budgetMax < filters.priceMin) return false;
      if (filters.priceMax && o.budgetMin > filters.priceMax) return false;

      // max age filter
      if (filters.maxAgeDays) {
        const posted = new Date(o.postedAt);
        const ageDays = (now - posted) / (1000 * 60 * 60 * 24);
        if (ageDays > filters.maxAgeDays) return false;
      }

      return true;
    });
  }, [selectedCategory, selectedSub, query, filters, quickActive]);

  return (
    <div className={styles.container}>
      <CategoryPillsOrders
        selectedCat={selectedCategory}
        onSelect={(c, s) => { setSelectedCategory(c); setSelectedSub(s); }}
      />

      <div className={styles.topCard}>
        <div className={styles.topRow}>
          <input
            className={styles.input}
            placeholder="Найти заказ — например: заменить кран"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <input
            className={`${styles.input} ${styles.locationInput}`}
            placeholder="Рядом с — город/район"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button className={styles.searchBtn}>Поиск</button>
          <button className={styles.filtersBtnMobile} onClick={() => setShowFiltersMobile(true)}>Фильтры</button>
        </div>

        <QuickChips chips={QUICK_CHIPS} active={quickActive} onToggle={toggleChip} />
      </div>

      <div className={styles.grid} style={{display: 'flex'}}>
        <FiltersPanelOrders
          state={filters}
          setState={setFilters}
          onApply={applyFilters}
          onClear={clearFilters}
        />

        <div className={styles.resultsList} style={{ width: '100%' }}>
          <div className={styles.resultsHeader}>
            <div className={styles.resultCount}>Найдено заказов: {filtered.length}</div>
            <div className={styles.sortWrap}>
              <label className={styles.smallText}>Сортировать:</label>
              <select className={styles.sortSelect}>
                <option>Новые</option>
                <option>Бюджет ↑</option>
                <option>Бюджет ↓</option>
                <option>Срочность</option>
              </select>
            </div>
          </div>

          <div>
            {filtered.length > 0 ? (
              filtered.map((o) => (
                <OrderCard
                  key={o.id}
                  order={o}
                  onApply={(order) => console.log("apply", order)}
                  onSave={(order) => console.log("save", order)}
                  onMessage={(order) => console.log("message", order)}
                />
              ))
            ) : (
              <div className={styles.emptyState}>Не найдено заказов. Попробуйте изменить фильтры.</div>
            )}
          </div>
        </div>
      </div>

      {showFiltersMobile && (
        <div className={styles.modalBackdrop} onClick={() => setShowFiltersMobile(false)}>
          <div className={styles.modalPanel} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h4 className={styles.filtersTitle}>Фильтры</h4>
              <button onClick={() => setShowFiltersMobile(false)} className={styles.smallText}>Закрыть</button>
            </div>
            <FiltersPanelOrders
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
