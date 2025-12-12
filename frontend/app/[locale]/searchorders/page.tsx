"use client"
import { useState, useMemo, useEffect } from "react";
import styles from "../searchpros/SearchPros.module.css";
import { OrderDTO } from "@/types/Order";

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
};

const LANGUAGES = ["Румынский", "Английский", "Русский"];

interface CategoryPillsProps {
  selectedCat: string | null;
  onSelect: (cat: string | null, sub: string | null) => void;
}

function CategoryPillsOrders({ selectedCat, onSelect }: CategoryPillsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSub, setSelectedSub] = useState<string | null>(null);

  function handleCategoryClick(cat: string) {
    setSelectedSub(null);
    setSelectedCategory((prev) => (prev === cat ? null : cat));
    onSelect(cat, null);
  }

  function handleSubClick(cat: string, sub: string) {
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
            {CATEGORIES[selectedCategory as keyof typeof CATEGORIES].map((sub) => (
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

interface QuickChipsProps {
  chips: Array<{ id: string; label: string }>;
  active: string[];
  onToggle: (id: string) => void;
}

function QuickChips({ chips, active, onToggle }: QuickChipsProps) {
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

interface FiltersState {
  priceMin: number;
  priceMax: number;
  maxAgeDays: number;
  remoteAllowed: boolean;
  inPerson: boolean;
  languages: string[];
}

interface FiltersPanelProps {
  state: FiltersState;
  setState: React.Dispatch<React.SetStateAction<FiltersState>>;
  onApply: () => void;
  onClear: () => void;
}

function FiltersPanelOrders({ state, setState, onApply, onClear }: FiltersPanelProps) {
  const toggleLanguage = (lang: string) => {
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

interface OrderCardProps {
  order: OrderDTO;
  onApply: (order: OrderDTO) => void;
  onSave: (order: OrderDTO) => void;
  onMessage: (order: OrderDTO) => void;
}

function OrderCard({ order, onApply, onSave, onMessage }: OrderCardProps) {
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
            <div className={styles.servicesText}>{order.description}</div>
          </div>

          <div className={styles.priceBlock}>
            <div className={styles.priceValue}>
              {order.price} RON
            </div>
            <div className={styles.distanceText}>{order.location?.city || 'N/A'}</div>
          </div>
        </div>

        <p className={styles.bio}>{order.additionalComment || order.description}</p>

        <div className={styles.statsRow}>
          <div className={styles.smallText}>Опубликовано: {postedStr}</div>
          <div className={styles.smallText}>Статус: {order.status}</div>

          <div style={{marginLeft: "auto", display: "flex", gap: 8}}>
            <button onClick={() => onMessage(order)} className={styles.chatBtn}>Сообщение</button>
            <button onClick={() => onApply(order)} className={styles.bookBtn}>Откликнуться</button>
            <button onClick={() => onSave(order)} className={styles.chatBtn}>Сохранить</button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function SearchOrdersSection() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSub, setSelectedSub] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [quickActive, setQuickActive] = useState<string[]>([]);

  const [ordersData, setOrdersData] = useState<OrderDTO[]>([]);

  const [filters, setFilters] = useState<FiltersState>({
    priceMin: 0,
    priceMax: 1000,
    maxAgeDays: 30,
    remoteAllowed: false,
    inPerson: true,
    languages: []
  });

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch('http://localhost:5221/api/order/get-all-without-pro');
      const data = await res.json();
      console.log('Fetched orders:', data);
      setOrdersData(data);
    }
    fetchOrders();
  }, []);

  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  const QUICK_CHIPS = [
    { id: "nearby", label: "Рядом" },
    { id: "urgent", label: "Срочно" },
    { id: "new", label: "Новые" },
    { id: "highPay", label: "Высокий бюджет" }
  ];

  function toggleChip(id: string) {
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

    return ordersData.filter((o) => {
      if (query && !(`${o.title} ${o.description}`).toLowerCase().includes(query.toLowerCase())) return false;
      if (filters.priceMin && o.price < filters.priceMin) return false;
      if (filters.priceMax && o.price > filters.priceMax) return false;

      if (filters.maxAgeDays) {
        const posted = new Date(o.postedAt);
        const ageDays = (now.getTime() - posted.getTime()) / (1000 * 60 * 60 * 24);
        if (ageDays > filters.maxAgeDays) return false;
      }

      if (quickActive.includes("highPay") && o.price < 50) return false;

      return true;
    });
  }, [ordersData, query, filters, quickActive]);

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
