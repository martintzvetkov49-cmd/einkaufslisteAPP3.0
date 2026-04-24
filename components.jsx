// Core UI components for Frisch shopping list app
// Clean, Apple-Reminders-inspired aesthetic with fresh green accent

// ─────────────────────────────────────────────────────────────
// Icons (inline SVG, consistent stroke)
// ─────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, stroke = 2, fill = 'none', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color}
    strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    {typeof d === 'string' ? <path d={d} /> : d}
  </svg>
);

const Icons = {
  plus: <Icon d="M12 5v14M5 12h14" />,
  check: <Icon d="M5 12l5 5L20 7" stroke={2.5} />,
  cart: <Icon d={<><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.7 13.4a1.5 1.5 0 001.5 1.2h9.6a1.5 1.5 0 001.5-1.2L22 7H6" /></>} />,
  list: <Icon d={<><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3.5" cy="6" r="1" fill="currentColor"/><circle cx="3.5" cy="12" r="1" fill="currentColor"/><circle cx="3.5" cy="18" r="1" fill="currentColor"/></>} />,
  book: <Icon d="M4 19.5A2.5 2.5 0 016.5 17H20V3H6.5A2.5 2.5 0 004 5.5v14zM4 19.5A2.5 2.5 0 006.5 22H20v-5" />,
  wallet: <Icon d={<><path d="M3 7h18v13a1 1 0 01-1 1H4a1 1 0 01-1-1V7z"/><path d="M3 7V5a2 2 0 012-2h12l2 4"/><circle cx="17" cy="14" r="1.5" fill="currentColor"/></>} />,
  search: <Icon d={<><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></>} />,
  users: <Icon d={<><circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6"/><circle cx="17" cy="7" r="2.5"/><path d="M15 14c3 0 6 2 6 5"/></>} />,
  mic: <Icon d={<><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/></>} />,
  close: <Icon d="M6 6l12 12M18 6L6 18" />,
  back: <Icon d="M15 18l-6-6 6-6" />,
  more: <Icon d={<><circle cx="5" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="19" cy="12" r="1.5" fill="currentColor"/></>} />,
  trash: <Icon d="M4 7h16M9 7V4h6v3M6 7l1 13a2 2 0 002 2h6a2 2 0 002-2l1-13" />,
  chevR: <Icon d="M9 6l6 6-6 6" />,
  chevD: <Icon d="M6 9l6 6 6-6" />,
  sparkle: <Icon d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />,
  sun: <Icon d={<><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>} />,
  moon: <Icon d="M21 13A9 9 0 1111 3a7 7 0 0010 10z" />,
  euro: <Icon d={<><path d="M18 7a7 7 0 100 10"/><path d="M4 10h9M4 14h9"/></>} />,
  clock: <Icon d={<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>} />,
  filter: <Icon d="M4 5h16l-6 8v6l-4-2v-4L4 5z" />,
  share: <Icon d={<><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.2 11L16 7M8.2 13L16 17"/></>} />,
  upload: <Icon d={<><path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"/></>} />,
  doc: <Icon d={<><path d="M13 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V10l-7-7z"/><path d="M13 3v7h7"/></>} />,
  image: <Icon d={<><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/></>} />,
  magic: <Icon d={<><path d="M15 4V2M15 10V8M18 7h2M10 7h2"/><path d="M16.5 5.5L15 4l-1.5 1.5M16.5 8.5L15 10l-1.5-1.5"/><path d="M5 21l11-11-3-3L2 18l3 3z"/></>} />,
};

// ─────────────────────────────────────────────────────────────
// Category emoji + color mapping
// ─────────────────────────────────────────────────────────────
const CATS = {
  'Obst & Gemüse':  { emoji: '🥬', hue: 140, shade: '#4ade80' },
  'Milchprodukte':  { emoji: '🧀', hue: 48,  shade: '#fbbf24' },
  'Brot & Backwaren':{ emoji: '🥖', hue: 30,  shade: '#f59e0b' },
  'Fleisch & Fisch':{ emoji: '🥩', hue: 0,   shade: '#f87171' },
  'Getränke':       { emoji: '🥤', hue: 200, shade: '#60a5fa' },
  'Tiefkühl':       { emoji: '🧊', hue: 190, shade: '#67e8f9' },
  'Drogerie':       { emoji: '🧴', hue: 280, shade: '#c084fc' },
  'Haushalt':       { emoji: '🧼', hue: 220, shade: '#a78bfa' },
  'Snacks':         { emoji: '🍫', hue: 20,  shade: '#fb923c' },
  'Allgemein':      { emoji: '🛒', hue: 160, shade: '#10b981' },
};

function catFor(name) {
  return CATS[name] || CATS['Allgemein'];
}

// ─────────────────────────────────────────────────────────────
// Checkbox with animated check
// ─────────────────────────────────────────────────────────────
function Checkbox({ checked, onToggle, color = '#10b981', size = 24 }) {
  return (
    <button
      onClick={onToggle}
      style={{
        width: size, height: size, borderRadius: '50%',
        border: checked ? 'none' : '2px solid #d1d5db',
        background: checked ? color : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', flexShrink: 0, padding: 0,
        transition: 'all 0.18s ease',
        transform: checked ? 'scale(1)' : 'scale(1)',
      }}>
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none"
        stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
        style={{
          opacity: checked ? 1 : 0,
          transform: checked ? 'scale(1)' : 'scale(0.5)',
          transition: 'all 0.18s ease 0.02s',
        }}>
        <path d="M5 12l5 5L20 7"/>
      </svg>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Item row — swipe-reveals delete
// ─────────────────────────────────────────────────────────────
function ItemRow({ item, onToggle, onDelete, color }) {
  const [swipe, setSwipe] = React.useState(0);
  const [startX, setStartX] = React.useState(null);
  const [dragging, setDragging] = React.useState(false);

  const onDown = (e) => {
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    setStartX(x); setDragging(true);
  };
  const onMove = (e) => {
    if (startX === null) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const dx = Math.min(0, Math.max(-80, x - startX));
    setSwipe(dx);
  };
  const onUp = () => {
    if (swipe < -40) setSwipe(-72);
    else setSwipe(0);
    setStartX(null); setDragging(false);
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Delete action */}
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: 80,
        background: '#ef4444', display: 'flex', alignItems: 'center',
        justifyContent: 'center', color: 'white',
      }}
        onClick={() => { onDelete(); setSwipe(0); }}>
        {Icons.trash}
      </div>
      {/* Row */}
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '14px 18px', background: 'var(--card)',
          transform: `translateX(${swipe}px)`,
          transition: dragging ? 'none' : 'transform 0.25s cubic-bezier(.2,.8,.2,1)',
          position: 'relative',
        }}
        onMouseDown={onDown} onMouseMove={dragging ? onMove : undefined} onMouseUp={onUp} onMouseLeave={onUp}
        onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
      >
        <Checkbox checked={item.done} onToggle={onToggle} color={color} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 16, fontWeight: 500, color: 'var(--text)',
            textDecoration: item.done ? 'line-through' : 'none',
            opacity: item.done ? 0.45 : 1,
            transition: 'opacity 0.2s',
            letterSpacing: '-0.01em',
          }}>
            {item.name}
          </div>
          {(item.qty || item.price) && (
            <div style={{
              fontSize: 13, color: 'var(--muted)', marginTop: 2,
              opacity: item.done ? 0.4 : 0.8,
              display: 'flex', gap: 10,
            }}>
              {item.qty && <span>{item.qty}</span>}
              {item.qty && item.price && <span>·</span>}
              {item.price && <span style={{ fontVariantNumeric: 'tabular-nums' }}>{item.price.toFixed(2).replace('.', ',')} €</span>}
            </div>
          )}
        </div>
        {item.note && (
          <div style={{
            fontSize: 12, padding: '3px 8px', borderRadius: 100,
            background: 'var(--chip)', color: 'var(--muted)',
          }}>{item.note}</div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Category group (collapsible)
// ─────────────────────────────────────────────────────────────
function CategoryGroup({ name, items, onToggle, onDelete }) {
  const [open, setOpen] = React.useState(true);
  const cat = catFor(name);
  const done = items.filter(i => i.done).length;

  return (
    <div style={{
      background: 'var(--card)', borderRadius: 20,
      overflow: 'hidden', marginBottom: 14,
      boxShadow: '0 1px 2px rgba(10,30,20,0.04), 0 0 0 1px var(--border)',
    }}>
      {/* Header */}
      <button onClick={() => setOpen(!open)} style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 18px', width: '100%', border: 'none',
        background: 'transparent', cursor: 'pointer', textAlign: 'left',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 10,
          background: `hsl(${cat.hue}, 60%, 94%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18,
        }}>{cat.emoji}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.01em' }}>
            {name}
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 1 }}>
            {done}/{items.length} erledigt
          </div>
        </div>
        <div style={{
          transition: 'transform 0.2s',
          transform: open ? 'rotate(0)' : 'rotate(-90deg)',
          color: 'var(--muted)',
        }}>{Icons.chevD}</div>
      </button>
      {/* Items */}
      <div style={{
        maxHeight: open ? items.length * 80 + 20 : 0,
        overflow: 'hidden',
        transition: 'max-height 0.3s ease',
      }}>
        <div style={{ borderTop: '1px solid var(--border)' }}>
          {items.map((item, i) => (
            <div key={item.id} style={{
              borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <ItemRow
                item={item}
                color={cat.shade}
                onToggle={() => onToggle(item.id)}
                onDelete={() => onDelete(item.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Bottom tab bar
// ─────────────────────────────────────────────────────────────
function BottomTabs({ active, onChange }) {
  const tabs = [
    { id: 'list', icon: Icons.cart, label: 'Liste' },
    { id: 'recipes', icon: Icons.book, label: 'Rezepte' },
    { id: 'budget', icon: Icons.wallet, label: 'Budget' },
    { id: 'lists', icon: Icons.list, label: 'Listen' },
  ];
  return (
    <div style={{
      display: 'flex', background: 'var(--card)',
      borderTop: '1px solid var(--border)',
      padding: '8px 8px 6px',
      fontFamily: 'inherit',
    }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 3, padding: '6px 4px',
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: active === t.id ? 'var(--primary)' : 'var(--muted)',
          transition: 'color 0.15s',
        }}>
          <div style={{
            padding: '4px 14px', borderRadius: 100,
            background: active === t.id ? 'var(--primary-tint)' : 'transparent',
            transition: 'background 0.2s',
          }}>
            {React.cloneElement(t.icon, { size: 22, stroke: active === t.id ? 2.2 : 1.8 })}
          </div>
          <span style={{ fontSize: 11, fontWeight: active === t.id ? 600 : 500 }}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

Object.assign(window, {
  Icon, Icons, CATS, catFor,
  Checkbox, ItemRow, CategoryGroup, BottomTabs,
});
