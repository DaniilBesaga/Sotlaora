"use client"
import React, { useState, useMemo, useEffect } from "react";
import styles from "./SearchPros.module.css";
import { Category } from "@/types/Category";
import { ProCardDTO } from "@/types/ProDTO";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";

// --- CUSTOM SELECT COMPONENT ---
// Replaces standard <select> to match the modern design
function CustomSelect({ options, value, onChange, placeholder = "Select" }) {
  const [isOpen, setIsOpen] = useState(false);

  // Helper to get the display label from the value
  const getLabel = () => {
    // If options are objects { label, value }
    const found = options.find((o) => (o.value || o) === value);
    if (found) return found.label || found.value || found;
    return placeholder;
  };

  return (
    <div className={styles.customSelect}>
      <div 
        className={`${styles.selectTrigger} ${isOpen ? styles.selectTriggerActive : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{getLabel()}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>

      <div className={`${styles.optionsMenu} ${isOpen ? styles.optionsMenuOpen : ''}`}>
        {options.map((opt, idx) => {
          const optValue = typeof opt === 'object' ? opt.value : opt;
          const optLabel = typeof opt === 'object' ? opt.label : opt;
          const isSelected = value === optValue;

          return (
            <div 
              key={idx}
              className={`${styles.option} ${isSelected ? styles.optionSelected : ''}`}
              onClick={() => {
                onChange(optValue);
                setIsOpen(false);
              }}
            >
              {optLabel}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- MAIN COMPONENTS ---

function CategoryPills({selected, onSelect }) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
     const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5221/api/category/with-subcategories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSub, setSelectedSub] = useState(0);

  function handleCategoryClick(cat) {
    setSelectedSub(0);
    setSelectedCategory((prev) => (prev === cat ? "" : cat));
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
        {categories.map((cat) => (
          <button
            key={cat.title}
            onClick={() => handleCategoryClick(cat.title)}
            className={`${styles.pill} ${selectedCategory === cat.title ? styles.pillActive : ''}`}
            aria-pressed={selectedCategory === cat.title}
            aria-expanded={selectedCategory === cat.title}
            title={cat.title}
          >
            {cat.title}
          </button>
        ))}
      </div>

      {/* Subcategories block (visible when a category selected) */}
      {selectedCategory && (
        <div className={styles.subBlock}>
          <h3 className={styles.subTitle}>{selectedCategory}</h3>

          <div className={styles.subGrid}>
            {categories.find(cat => cat.title === selectedCategory)?.subcategories.map((sub) => (
              <button
                key={sub.id}
                className={`${styles.subItem} ${selectedSub === sub.id ? styles.subItemActive : ''}`}
                onClick={() => handleSubClick(selectedCategory, sub.id)}
              >
                {sub.title}
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

  const ratingOptions = [
    { label: "Любой", value: 0 },
    { label: "4.0+", value: 4 },
    { label: "4.5+", value: 4.5 },
    { label: "4.8+", value: 4.8 },
  ];

  return (
    <aside className={styles.filtersPanel}>
      <h4 className={styles.filtersTitle}>Фильтры</h4>

      <div className={styles.filterGroup}>
        <label className={styles.fieldLabel}>Цена (RON за {state.priceUnit})</label>
        <div className={styles.row}>
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
        {/* REPLACED <select> WITH CustomSelect */}
        <CustomSelect 
            options={ratingOptions}
            value={state.ratingMin}
            onChange={(val) => setState((s) => ({ ...s, ratingMin: val }))}
        />
      </div>

      <div className={styles.actionsRow}>
        <button onClick={onApply} className={styles.applyBtn}>Применить</button>
        <button onClick={onClear} className={styles.clearBtn}>Сброс</button>
      </div>
    </aside>
  );
}

function PerformerCard({ p, variant = "expanded", onChat, onBook } : { p: ProCardDTO, variant: "compact" | "expanded", onChat: (p: ProCardDTO) => void, onBook: (p: ProCardDTO) => void }) {
  const router = useRouter();
  return (
    <article className={`${styles.card} ${variant === "compact" ? styles.cardCompact : styles.cardExpanded}`}
    onClick={() => router.push(`/propublicprofile`)}>
      <img src="/images/pros/1.jpg" className={styles.avatar}/>
      <div className={styles.performerMain}>
        <div className={styles.titleRow}>
          <div>
            <h5 className={styles.name}>{p.userName}</h5>
            <div className={styles.servicesText}>{p.subcategoriesDTO.map(sc => sc.title).join(" • ")}</div>
          </div>
          <div className={styles.priceBlock}>
            <div className={styles.priceValue}>{p.price}</div>
            <div className={styles.distanceText}>{p.location ? `${p.location} km` : p.location}</div>
          </div>
        </div>

        {variant === "expanded" && (
          <>
            <p className={styles.bio}>{p.description}</p>
            <div className={styles.statsRow}>
              <div className={styles.smallText}>{p.rating} ★ ({p.reviewsCount})</div>
              {p.verifiedIdentity && (<div className={styles.safetyNote}>
                <ShieldCheck size={14} />
                Личность подтверждена
              </div>)}

              <div className={styles.actions}>
                <a href={`/propublicprofile/${p.proId}`} className={styles.chatBtn}>Профиль</a>
                <a onClick={(e) => {
                    e.stopPropagation();
                    onBook(p);
                }} className={styles.bookBtn}>Заказать</a>
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
  
  // Added state for Sorting
  const [sortOption, setSortOption] = useState("Рекомендованные");

  const [pros, setPros] = useState<ProCardDTO[]>([]);

  useEffect(() => {
     const fetchPros = async () => {
      try {
        const response = await fetch('http://localhost:5221/api/pro/all-pros', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const data = await response.json();
        console.log('Fetched pros:', data);
        setPros(data);
      } catch (error) {
        console.error('Error fetching pros:', error);
      }
    };

    fetchPros();
  }, []);

  const [filters, setFilters] = useState({
    price: 0,
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
      price: 0,
      priceUnit: "час",
      ratingMin: 0,
      urgencyHours: 0,
      employment: [],
      languages: [],
      verified: false
    });
  }

  const filtered = useMemo(() => {
    // Basic filtering logic here
    // Sorting logic can be added here based on `sortOption`
    return pros.filter((p) => {
      return true;
    });
  }, [selectedCategory, query, filters, quickActive, pros, sortOption]);

  const router = useRouter()

  const sortOptions = [
    "Рекомендованные",
    "Цена ↑",
    "Цена ↓",
    "Рейтинг",
    "Быстрота ответа"
  ];

  return (
    <div className={styles.container}>
      <CategoryPills selected={selectedCategory} onSelect={(c) => setSelectedCategory((s) => (s === c ? null : c))} />

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
              
              {/* REPLACED <select> WITH CustomSelect */}
              <div style={{ width: '200px' }}>
                <CustomSelect 
                    options={sortOptions}
                    value={sortOption}
                    onChange={(val) => setSortOption(val)}
                />
              </div>
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
                  onBook={(perf) => {localStorage.setItem('proId', perf.proId.toString()); router.push('/create-order')}}
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