// Screens for Frisch shopping list app

// ─────────────────────────────────────────────────────────────
// Hero progress card
// ─────────────────────────────────────────────────────────────
function HeroCard({ listName, totalItems, doneItems, collaborators, totalPrice, budget }) {
  const pct = totalItems === 0 ? 0 : Math.round((doneItems / totalItems) * 100);

  return (
    <div style={{
      background: 'var(--hero-bg)',
      borderRadius: 28, padding: '22px 22px 20px',
      color: 'var(--hero-text)',
      position: 'relative', overflow: 'hidden',
      boxShadow: '0 10px 30px -12px rgba(16,64,40,0.25)',
    }}>
      {/* Decorative blur blob */}
      <div style={{
        position: 'absolute', top: -40, right: -30,
        width: 180, height: 180, borderRadius: '50%',
        background: 'var(--hero-blob)',
        filter: 'blur(30px)', opacity: 0.6,
      }} />

      <div style={{ position: 'relative' }}>
        <div style={{
          fontSize: 12, fontWeight: 600, opacity: 0.7,
          textTransform: 'uppercase', letterSpacing: '0.08em',
          marginBottom: 4,
        }}>Aktive Liste</div>
        <div style={{
          fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em',
          marginBottom: 14, lineHeight: 1.1,
        }}>{listName}</div>

        {/* Progress row */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>
            {doneItems}
          </span>
          <span style={{ fontSize: 15, opacity: 0.75 }}>von {totalItems} erledigt</span>
          <span style={{ marginLeft: 'auto', fontSize: 14, fontWeight: 600, opacity: 0.85 }}>{pct}%</span>
        </div>

        {/* Progress bar */}
        <div style={{
          height: 6, background: 'rgba(255,255,255,0.25)',
          borderRadius: 100, overflow: 'hidden', marginBottom: 16,
        }}>
          <div style={{
            height: '100%', width: `${pct}%`,
            background: 'rgba(255,255,255,0.95)',
            borderRadius: 100, transition: 'width 0.4s ease',
          }} />
        </div>

        {/* Footer row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Avatars */}
          <div style={{ display: 'flex' }}>
            {collaborators.map((c, i) => (
              <div key={i} style={{
                width: 28, height: 28, borderRadius: '50%',
                background: c.color, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700,
                border: '2px solid var(--hero-bg)',
                marginLeft: i === 0 ? 0 : -8,
              }}>{c.initial}</div>
            ))}
            <div style={{
              marginLeft: 8, fontSize: 12, opacity: 0.8, alignSelf: 'center',
            }}>
              live · {collaborators.length} aktiv
            </div>
          </div>
          {/* Price */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, opacity: 0.7, marginBottom: -2 }}>Warenkorb</div>
            <div style={{ fontSize: 16, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
              {totalPrice.toFixed(2).replace('.', ',')} €
              <span style={{ fontSize: 11, opacity: 0.65, fontWeight: 500 }}> / {budget} €</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Add-item bar (sticky at bottom of list area)
// ─────────────────────────────────────────────────────────────
function AddBar({ onAdd, categories }) {
  const [value, setValue] = React.useState('');
  const [cat, setCat] = React.useState('Allgemein');
  const [focused, setFocused] = React.useState(false);
  const [showCatPicker, setShowCatPicker] = React.useState(false);

  const suggestions = ['Milch', 'Brot', 'Bananen', 'Tomaten', 'Käse', 'Eier', 'Joghurt', 'Kaffee'];
  const filtered = value.length > 0
    ? suggestions.filter(s => s.toLowerCase().startsWith(value.toLowerCase()))
    : [];

  const submit = () => {
    if (!value.trim()) return;
    onAdd(value.trim(), cat);
    setValue('');
  };

  const catInfo = catFor(cat);

  return (
    <div style={{
      background: 'var(--card)',
      borderRadius: 24,
      boxShadow: '0 8px 24px -8px rgba(10,30,20,0.12), 0 0 0 1px var(--border)',
      overflow: 'hidden',
      transition: 'box-shadow 0.2s',
    }}>
      {/* Suggestions */}
      {focused && filtered.length > 0 && (
        <div style={{
          padding: '10px 12px 8px',
          display: 'flex', gap: 6, flexWrap: 'wrap',
          borderBottom: '1px solid var(--border)',
        }}>
          {filtered.slice(0, 4).map(s => (
            <button key={s} onMouseDown={() => { onAdd(s, cat); setValue(''); }}
              style={{
                padding: '6px 12px', borderRadius: 100,
                background: 'var(--chip)', border: 'none',
                fontSize: 13, fontWeight: 500, color: 'var(--text)',
                cursor: 'pointer',
              }}>
              {s}
            </button>
          ))}
        </div>
      )}
      {/* Input row */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '10px 10px 10px 16px', gap: 8 }}>
        <div style={{ color: 'var(--muted)', display: 'flex' }}>
          {Icons.plus}
        </div>
        <input
          value={value}
          onChange={e => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="Was brauchst du?"
          style={{
            flex: 1, border: 'none', outline: 'none',
            background: 'transparent', fontSize: 16, fontWeight: 500,
            color: 'var(--text)', fontFamily: 'inherit',
            letterSpacing: '-0.01em',
          }}
        />
        {/* Category chip */}
        <button onClick={() => setShowCatPicker(!showCatPicker)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 10px 6px 8px', borderRadius: 100,
            background: `hsl(${catInfo.hue}, 60%, 95%)`,
            border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 600, color: `hsl(${catInfo.hue}, 50%, 30%)`,
            fontFamily: 'inherit',
          }}>
          <span style={{ fontSize: 14 }}>{catInfo.emoji}</span>
          {cat}
        </button>
        {/* Voice */}
        <button style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'var(--chip)', border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--muted)', cursor: 'pointer',
        }}>
          {Icons.mic}
        </button>
      </div>

      {/* Category picker */}
      {showCatPicker && (
        <div style={{
          padding: '6px 10px 12px', display: 'flex', gap: 6,
          flexWrap: 'wrap', borderTop: '1px solid var(--border)',
        }}>
          {categories.map(c => {
            const info = catFor(c);
            const active = cat === c;
            return (
              <button key={c} onClick={() => { setCat(c); setShowCatPicker(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '6px 10px 6px 8px', borderRadius: 100,
                  background: active ? `hsl(${info.hue}, 60%, 95%)` : 'transparent',
                  border: `1px solid ${active ? 'transparent' : 'var(--border)'}`,
                  fontSize: 12, fontWeight: 600,
                  color: active ? `hsl(${info.hue}, 50%, 30%)` : 'var(--muted)',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>
                <span>{info.emoji}</span>{c}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ACTIVE LIST SCREEN
// ─────────────────────────────────────────────────────────────
function ListScreen({ state, setState }) {
  const { items, listName, collaborators, budget } = state;
  const [showImport, setShowImport] = React.useState(false);

  const toggleItem = (id) => {
    setState(s => ({
      ...s, items: s.items.map(it => it.id === id ? { ...it, done: !it.done } : it),
    }));
  };
  const deleteItem = (id) => {
    setState(s => ({ ...s, items: s.items.filter(it => it.id !== id) }));
  };
  const addItem = (name, category) => {
    setState(s => ({
      ...s,
      items: [...s.items, {
        id: 'i' + Date.now(), name, category, done: false,
        price: Math.round((Math.random() * 4 + 0.5) * 100) / 100,
      }],
    }));
  };

  // Group by category
  const groups = {};
  items.forEach(it => {
    if (!groups[it.category]) groups[it.category] = [];
    groups[it.category].push(it);
  });
  // Sort: active categories first (by most items), then completed
  const orderedCats = Object.keys(groups).sort((a, b) => {
    const aPending = groups[a].filter(i => !i.done).length;
    const bPending = groups[b].filter(i => !i.done).length;
    return bPending - aPending;
  });

  const doneCount = items.filter(i => i.done).length;
  const totalPrice = items.filter(i => !i.done).reduce((s, i) => s + (i.price || 0), 0);

  const categoryOptions = Object.keys(CATS);

  return (
    <div style={{ padding: '8px 16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <HeroCard
        listName={listName}
        totalItems={items.length}
        doneItems={doneCount}
        collaborators={collaborators}
        totalPrice={totalPrice}
        budget={budget}
      />

      <AddBar onAdd={addItem} categories={categoryOptions} />

      {/* Quick actions */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', margin: '-4px -16px 0', padding: '0 16px 4px' }}>
        <button onClick={() => setShowImport(true)} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 14px', borderRadius: 100,
          background: 'var(--primary)',
          border: 'none',
          fontSize: 13, fontWeight: 600, color: 'white',
          cursor: 'pointer', whiteSpace: 'nowrap',
          fontFamily: 'inherit',
          boxShadow: '0 4px 12px -4px var(--primary)',
        }}>
          {React.cloneElement(Icons.upload, { size: 15 })}
          Liste importieren
        </button>
        {[
          { icon: Icons.sparkle, label: 'Aus Rezept' },
          { icon: Icons.clock, label: 'Letzte Woche' },
          { icon: Icons.share, label: 'Teilen' },
          { icon: Icons.filter, label: 'Sortieren' },
        ].map((a, i) => (
          <button key={i} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 100,
            background: 'var(--card)',
            border: '1px solid var(--border)',
            fontSize: 13, fontWeight: 600, color: 'var(--text)',
            cursor: 'pointer', whiteSpace: 'nowrap',
            fontFamily: 'inherit',
          }}>
            {React.cloneElement(a.icon, { size: 15 })}
            {a.label}
          </button>
        ))}
      </div>

      {showImport && (
        <ImportModal
          title="Liste importieren"
          subtitle="Lade eine Datei hoch — wir erkennen Artikel automatisch"
          mode="list"
          onClose={() => setShowImport(false)}
          onImport={(parsed) => {
            setState(s => ({
              ...s,
              items: [...s.items, ...parsed.map((p, i) => ({
                id: 'im_' + Date.now() + '_' + i,
                name: p.name,
                category: p.category || 'Allgemein',
                qty: p.qty,
                done: false,
                price: p.price || Math.round((Math.random() * 4 + 0.5) * 100) / 100,
                note: 'Import',
              }))],
            }));
            setShowImport(false);
          }}
        />
      )}

      {/* Groups */}
      <div style={{ marginTop: 4 }}>
        {orderedCats.map(cat => (
          <CategoryGroup
            key={cat} name={cat} items={groups[cat]}
            onToggle={toggleItem} onDelete={deleteItem}
          />
        ))}
      </div>

      {items.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '50px 20px',
          color: 'var(--muted)',
        }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🛒</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>Liste ist leer</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Füge deinen ersten Artikel hinzu</div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, {
  HeroCard, AddBar, ListScreen,
});
