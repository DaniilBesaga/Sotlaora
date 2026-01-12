"use client"
import { useState, useMemo, useEffect, use } from "react";
import styles from "../searchpros/SearchPros.module.css";
import { OrderDTO } from "@/types/Order";
import { SubcategoryDTO } from "@/types/ServicePrices";
import { useRouter } from "next/navigation";
import { LoginContext } from "../components/context/LoginContext";
import { Role } from "@/types/Role";

const LANGUAGES = ["Румынский", "Английский", "Русский"];

interface CategoryPillsProps {
  selectedCat: string | null;
  onSelect: (cat: string | null, sub: string | null) => void;
  CATEGORIES: SubcategoryDTO[]
}

function CategoryPillsOrders({ CATEGORIES, selectedCat, onSelect }: CategoryPillsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSub, setSelectedSub] = useState<string | null>(null);

  const {userLong} = use(LoginContext)

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
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat.id.toString())}
            className={`${styles.pill} ${selectedCategory === cat.id.toString() ? styles.pillActive : ''}`}
            aria-pressed={selectedCategory === cat.id.toString()}
            aria-expanded={selectedCategory === cat.id.toString()}
            title={cat.id.toString()}
          >
            {cat.title}
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

// --- 1. Filter State Interface ---
interface FiltersState {
  priceMin: number | '';
  priceMax: number | '';
  dateRange: 'any' | '24h' | '3d' | '7d';
  types: {
    [Location.AtClients]: boolean;
    [Location.AtPros]: boolean;
    [Location.Online]: boolean;
  };
  maxDistanceKm: number | ''; // Empty string = no limit
  userLat: number | null;     // Current user latitude
  userLng: number | null;     // Current user longitude
}

// --- 2. Filters Panel Component ---
interface FiltersPanelProps {
  state: FiltersState;
  setState: React.Dispatch<React.SetStateAction<FiltersState>>;
  onApply: () => void;
  onClear: () => void;
}

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; 
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c; 
}

function deg2rad(deg: number) { return deg * (Math.PI/180); }

function FiltersPanelOrders({ state, setState, onApply, onClear }: FiltersPanelProps) {
  const handleTypeChange = (type: Location) => {
    setState(s => ({
      ...s,
      types: { ...s.types, [type]: !s.types[type] }
    }));
  };

  // Mock getting user location (In real app, use navigator.geolocation)
  const detectLocation = () => {
    // Mock Brasov coords for demo
    setState(s => ({ ...s, userLat: 45.657974, userLng: 25.601198 })); 
    alert("Местоположение определено (Mock: Brasov)");
  };

  return (
    <aside className={styles.filtersPanel}>
      <h4 className={styles.filtersTitle}>Фильтры</h4>

      {/* 1. Price */}
      <div className={styles.filterGroup}>
        <label className={styles.fieldLabel}>Бюджет (RON)</label>
        <div className={styles.row}>
          <input
            type="number"
            value={state.priceMin}
            onChange={(e) => setState(s => ({ ...s, priceMin: e.target.value ? Number(e.target.value) : '' }))}
            className={styles.inputNumber}
            placeholder="От"
          />
          <span style={{color:'#9ca3af'}}>-</span>
          <input
            type="number"
            value={state.priceMax}
            onChange={(e) => setState(s => ({ ...s, priceMax: e.target.value ? Number(e.target.value) : '' }))}
            className={styles.inputNumber}
            placeholder="До"
          />
        </div>
      </div>

      {/* 2. Date Posted */}
      <div className={styles.filterGroup}>
        <label className={styles.fieldLabel}>Дата публикации</label>
        <select 
          className={styles.selectInput}
          value={state.dateRange}
          onChange={(e) => setState(s => ({ ...s, dateRange: e.target.value as any }))}
        >
          <option value="any">За все время</option>
          <option value="24h">За 24 часа</option>
          <option value="3d">За 3 дня</option>
          <option value="7d">За неделю</option>
        </select>
      </div>

      {/* 3. Location Type */}
      <div className={styles.filterGroup}>
        <label className={styles.fieldLabel}>Место выполнения</label>
        <div className={styles.checkboxStack}>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" checked={state.types[Location.AtClients]} onChange={() => handleTypeChange(Location.AtClients)} />
            У клиента
          </label>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" checked={state.types[Location.AtPros]} onChange={() => handleTypeChange(Location.AtPros)} />
            У мастера
          </label>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" checked={state.types[Location.Online]} onChange={() => handleTypeChange(Location.Online)} />
            Онлайн
          </label>
        </div>
      </div>

      {/* 4. Distance */}
      <div className={styles.filterGroup}>
        <label className={styles.fieldLabel}>Расстояние (км)</label>
        <div className={styles.row}>
           <input
            type="number"
            value={state.maxDistanceKm}
            onChange={(e) => setState(s => ({ ...s, maxDistanceKm: e.target.value ? Number(e.target.value) : '' }))}
            className={styles.inputNumber}
            placeholder="Макс км"
            disabled={!state.userLat} 
          />
          <button onClick={detectLocation} className={styles.locationBtn} title="Мое местоположение">
            📍
          </button>
        </div>
        {!state.userLat && <div className={styles.hintText}>Укажите локацию для поиска по радиусу</div>}
      </div>

      <div className={styles.actionsRow}>
        <button onClick={onApply} className={styles.applyBtn}>Применить</button>
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

  const {userLong} = use(LoginContext)

  const router = useRouter()

  return (
    <article className={`${styles.card} ${styles.cardExpanded}`} onClick={() => router.push(`/orders/${order.id}`)}>
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

          {userLong?.role === Role.Pro && <div style={{marginLeft: "auto", display: "flex", gap: 8}}>
            <button onClick={() => onMessage(order)} className={styles.chatBtn}>Сообщение</button>
            <button onClick={() => onApply(order)} className={styles.bookBtn}>Откликнуться</button>
            <button onClick={() => onSave(order)} className={styles.chatBtn}>Сохранить</button>
          </div>}
        </div>
      </div>
    </article>
  );
}

export default function SearchOrdersSection() {
  // Data State
  const [ordersData, setOrdersData] = useState<OrderDTO[]>([]);
  const [categoriesData, setCategoriesData] = useState<SubcategoryDTO[]>([]);
  
  // Search State
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Filters State
  const [filters, setFilters] = useState<FiltersState>({
    priceMin: '',
    priceMax: '',
    dateRange: 'any',
    types: {
      [Location.AtClients]: true,
      [Location.AtPros]: true,
      [Location.Online]: true,
    },
    maxDistanceKm: '',
    userLat: null,
    userLng: null
  });

  const [selectedSub, setSelectedSub] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [quickActive, setQuickActive] = useState<string[]>([]);

  useEffect(() => {
    const init = async () => {
        const [resOrders, resCats] = await Promise.all([
            fetch('http://localhost:5221/api/order/get-all-without-pro'),
            fetch('http://localhost:5221/api/category/with-subcategories')
        ]);
        const orders = await resOrders.json();
        const cats = await resCats.json();
        setOrdersData(orders);
        setCategoriesData(cats);
    };
    init();
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

  const filteredOrders = useMemo(() => {
    return ordersData.filter(order => {
      

      return true;
    });
  }, [ordersData, query, selectedCategory, filters]);

  // --- Handlers ---
  const clearFilters = () => {
    setFilters({
        priceMin: '', priceMax: '', dateRange: 'any',
        types: { [Location.AtClients]: true, [Location.AtPros]: true, [Location.Online]: true },
        maxDistanceKm: '', userLat: filters.userLat, userLng: filters.userLng // Keep location
    });
  };

  return (
    <div className={styles.container}>
      {/* Categories (Same as before) */}
      <CategoryPillsOrders 
        CATEGORIES={categoriesData} 
        selectedCat={selectedCategory} 
        onSelect={(c) => setSelectedCategory(c)} 
      />

      {/* Top Search Bar */}
      <div className={styles.topCard}>
        <div className={styles.topRow}>
          <input 
            className={styles.input} 
            placeholder="Поиск по названию..." 
            value={query} 
            onChange={e => setQuery(e.target.value)} 
          />
          {/* Location input removed here since we have explicit distance filter now, 
              or keep it for simple text match on 'city' field */}
          <button className={styles.filtersBtnMobile} onClick={() => setShowFiltersMobile(true)}>
             Фильтры
          </button>
        </div>
      </div>

      <div className={styles.grid} style={{display:'flex', gap: 20}}>
        
        {/* Filters Panel (Desktop) */}
        {!showFiltersMobile && <div className={styles.desktopFilters}>
            <FiltersPanelOrders 
              state={filters} 
              setState={setFilters} 
              onApply={() => {}} 
              onClear={clearFilters} 
            />
        </div>}

        {/* Results */}
        <div className={styles.resultsList} style={{flex: 1}}>
           <div className={styles.resultsHeader}>
              <div className={styles.resultCount}>Найдено: {filteredOrders.length}</div>
           </div>
           
           <div style={{display:'flex', flexDirection:'column', gap: 16}}>
             {filteredOrders.length > 0 ? (
               filteredOrders.map(order => (
                 <OrderCard 
                   key={order.id} 
                   order={order} 
                   onApply={()=>{}} 
                   onSave={()=>{}} 
                   onMessage={()=>{}} 
                 />
               ))
             ) : (
               <div className={styles.emptyState}>Нет подходящих заказов</div>
             )}
           </div>
        </div>

      </div>

      {/* Mobile Modal Logic (Same as before) */}
      {showFiltersMobile && (
         <div className={styles.modalBackdrop} onClick={() => setShowFiltersMobile(false)}>
            <div className={styles.modalPanel} onClick={e => e.stopPropagation()}>
               {/* Mobile Filters Panel Instance */}<div className={styles.dragHandle} />
               <FiltersPanelOrders 
                  state={filters} 
                  setState={setFilters} 
                  onApply={() => setShowFiltersMobile(false)} 
                  onClear={clearFilters} 
               />
            </div>
         </div>
      )}
    </div>
  );
}
