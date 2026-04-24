// Secondary screens: Recipes, Budget, Lists overview

// ─────────────────────────────────────────────────────────────
// RECIPES SCREEN
// ─────────────────────────────────────────────────────────────
function RecipesScreen({ state, setState, onAddedToast }) {
  const [showUpload, setShowUpload] = React.useState(false);
  const recipes = [
    {
      id: 'r1', name: 'Pasta Pomodoro', time: '20 Min', servings: 2,
      emoji: '🍝', color: '#fecaca',
      tags: ['Schnell', 'Vegetarisch'],
      ingredients: [
        { name: 'Spaghetti', qty: '200g', category: 'Brot & Backwaren' },
        { name: 'Tomaten', qty: '400g', category: 'Obst & Gemüse' },
        { name: 'Knoblauch', qty: '2 Zehen', category: 'Obst & Gemüse' },
        { name: 'Basilikum', qty: '1 Bund', category: 'Obst & Gemüse' },
        { name: 'Parmesan', qty: '50g', category: 'Milchprodukte' },
      ],
    },
    {
      id: 'r2', name: 'Bunte Bowl', time: '15 Min', servings: 1,
      emoji: '🥗', color: '#bbf7d0',
      tags: ['Gesund', 'Vegan'],
      ingredients: [
        { name: 'Quinoa', qty: '100g', category: 'Brot & Backwaren' },
        { name: 'Avocado', qty: '1', category: 'Obst & Gemüse' },
        { name: 'Kichererbsen', qty: '1 Dose', category: 'Allgemein' },
        { name: 'Rucola', qty: '50g', category: 'Obst & Gemüse' },
      ],
    },
    {
      id: 'r3', name: 'French Toast', time: '10 Min', servings: 2,
      emoji: '🥞', color: '#fed7aa',
      tags: ['Frühstück'],
      ingredients: [
        { name: 'Toastbrot', qty: '4 Scheiben', category: 'Brot & Backwaren' },
        { name: 'Eier', qty: '2', category: 'Milchprodukte' },
        { name: 'Milch', qty: '100ml', category: 'Milchprodukte' },
        { name: 'Ahornsirup', qty: '-', category: 'Allgemein' },
      ],
    },
    {
      id: 'r4', name: 'Tacos al Pastor', time: '35 Min', servings: 3,
      emoji: '🌮', color: '#fde68a',
      tags: ['Würzig'],
      ingredients: [
        { name: 'Tortillas', qty: '6', category: 'Brot & Backwaren' },
        { name: 'Schweinefleisch', qty: '400g', category: 'Fleisch & Fisch' },
        { name: 'Ananas', qty: '1/2', category: 'Obst & Gemüse' },
        { name: 'Koriander', qty: '1 Bund', category: 'Obst & Gemüse' },
        { name: 'Limetten', qty: '2', category: 'Obst & Gemüse' },
      ],
    },
  ];

  const [open, setOpen] = React.useState(null);

  const addRecipe = (recipe) => {
    setState(s => ({
      ...s,
      items: [
        ...s.items,
        ...recipe.ingredients.map((ing, i) => ({
          id: 'r_' + recipe.id + '_' + i + '_' + Date.now(),
          name: ing.name, category: ing.category,
          qty: ing.qty, done: false,
          price: Math.round((Math.random() * 3 + 0.5) * 100) / 100,
          note: recipe.name,
        })),
      ],
    }));
    setOpen(null);
    onAddedToast(recipe.name);
  };

  return (
    <div style={{ padding: '8px 16px 20px' }}>
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10 }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>
              Rezepte
            </div>
            <div style={{ fontSize: 14, color: 'var(--muted)', marginTop: 2 }}>
              Tippen und Zutaten werden hinzugefügt
            </div>
          </div>
          <button onClick={() => setShowUpload(true)} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '10px 14px', borderRadius: 100,
            background: 'var(--primary)', color: 'white', border: 'none',
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
            fontFamily: 'inherit', whiteSpace: 'nowrap',
            boxShadow: '0 6px 14px -4px var(--primary)',
          }}>
            {React.cloneElement(Icons.upload, { size: 15 })}
            Rezept hochladen
          </button>
        </div>
      </div>

      {/* Featured large */}
      <div onClick={() => setOpen(recipes[0])} style={{
        background: recipes[0].color,
        borderRadius: 24, padding: '22px', marginBottom: 14,
        cursor: 'pointer', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: -10, bottom: -20,
          fontSize: 140, opacity: 0.4, lineHeight: 1,
        }}>{recipes[0].emoji}</div>
        <div style={{ position: 'relative' }}>
          <div style={{
            display: 'inline-block', fontSize: 11, fontWeight: 700,
            padding: '3px 8px', borderRadius: 100,
            background: 'rgba(0,0,0,0.1)', color: '#1f2937',
            textTransform: 'uppercase', letterSpacing: '0.05em',
            marginBottom: 8,
          }}>Vorschlag für heute</div>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', color: '#1f2937', marginBottom: 2 }}>
            {recipes[0].name}
          </div>
          <div style={{ fontSize: 13, color: '#4b5563', marginBottom: 12 }}>
            {recipes[0].time} · {recipes[0].servings} Personen · {recipes[0].ingredients.length} Zutaten
          </div>
          <button onClick={(e) => { e.stopPropagation(); addRecipe(recipes[0]); }} style={{
            padding: '10px 18px', borderRadius: 100,
            background: '#1f2937', color: 'white', border: 'none',
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
            fontFamily: 'inherit', display: 'inline-flex',
            alignItems: 'center', gap: 6,
          }}>
            {React.cloneElement(Icons.plus, { size: 16 })}
            Zur Liste hinzufügen
          </button>
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {recipes.slice(1).map(r => (
          <div key={r.id} onClick={() => setOpen(r)} style={{
            background: 'var(--card)', borderRadius: 20, padding: 14,
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(10,30,20,0.04), 0 0 0 1px var(--border)',
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: r.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, marginBottom: 10,
            }}>{r.emoji}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.01em' }}>{r.name}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
              {r.time} · {r.ingredients.length} Zutaten
            </div>
          </div>
        ))}
      </div>

      {/* Detail modal */}
      {open && (
        <div onClick={() => setOpen(null)} style={{
          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'flex-end', zIndex: 10,
          animation: 'fadeIn 0.2s ease',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: 'var(--card)', width: '100%',
            borderRadius: '24px 24px 0 0', padding: '20px 20px 20px',
            maxHeight: '85%', overflow: 'auto',
            animation: 'slideUp 0.28s cubic-bezier(.2,.9,.3,1.1)',
          }}>
            <div style={{
              width: 40, height: 4, borderRadius: 2, background: 'var(--border)',
              margin: '0 auto 16px',
            }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <div style={{
                width: 64, height: 64, borderRadius: 18,
                background: open.color, fontSize: 34,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{open.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>
                  {open.name}
                </div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>
                  {open.time} · {open.servings} Personen
                </div>
              </div>
            </div>
            <div style={{
              fontSize: 12, fontWeight: 700, color: 'var(--muted)',
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8,
            }}>{open.ingredients.length} Zutaten</div>
            <div style={{
              background: 'var(--surface)', borderRadius: 16, padding: 4, marginBottom: 16,
            }}>
              {open.ingredients.map((ing, i) => {
                const info = catFor(ing.category);
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 12px',
                    borderBottom: i < open.ingredients.length - 1 ? '1px solid var(--border)' : 'none',
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 10,
                      background: `hsl(${info.hue}, 60%, 94%)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16,
                    }}>{info.emoji}</div>
                    <div style={{ flex: 1, fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{ing.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--muted)', fontVariantNumeric: 'tabular-nums' }}>{ing.qty}</div>
                  </div>
                );
              })}
            </div>
            <button onClick={() => addRecipe(open)} style={{
              width: '100%', padding: '14px', borderRadius: 100,
              background: 'var(--primary)', color: 'white', border: 'none',
              fontSize: 15, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: '0 6px 16px -6px var(--primary)',
            }}>
              Alle {open.ingredients.length} Zutaten hinzufügen
            </button>
          </div>
        </div>
      )}

      {showUpload && (
        <ImportModal
          title="Rezept hochladen"
          subtitle="Rezeptdatei oder Foto — Zutaten werden automatisch erkannt"
          mode="recipe"
          onClose={() => setShowUpload(false)}
          onImport={(parsed) => {
            setState(s => ({
              ...s,
              items: [...s.items, ...parsed.items.map((ing, i) => ({
                id: 'rec_' + Date.now() + '_' + i,
                name: ing.name,
                category: ing.category || 'Allgemein',
                qty: ing.qty,
                done: false,
                price: ing.price || Math.round((Math.random() * 3 + 0.5) * 100) / 100,
                note: parsed.recipeName || 'Rezept',
              }))],
            }));
            setShowUpload(false);
            onAddedToast(parsed.recipeName || 'Rezept');
          }}
        />
      )}
    </div>
  );
}
function BudgetScreen({ state }) {
  const { items, budget } = state;
  const total = items.reduce((s, i) => s + (i.price || 0), 0);
  const spent = items.filter(i => i.done).reduce((s, i) => s + (i.price || 0), 0);
  const remaining = budget - total;
  const pct = Math.min(100, (total / budget) * 100);

  // Group spending by category
  const byCategory = {};
  items.forEach(i => {
    byCategory[i.category] = (byCategory[i.category] || 0) + (i.price || 0);
  });
  const sortedCats = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);

  // Mock weekly history
  const weeks = [62.40, 71.20, 58.90, total];
  const maxWeek = Math.max(...weeks);

  return (
    <div style={{ padding: '8px 16px 20px' }}>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>Budget</div>
        <div style={{ fontSize: 14, color: 'var(--muted)', marginTop: 2 }}>Diese Woche</div>
      </div>

      {/* Big number card */}
      <div style={{
        background: 'var(--card)', borderRadius: 24, padding: 20, marginBottom: 12,
        boxShadow: '0 1px 2px rgba(10,30,20,0.04), 0 0 0 1px var(--border)',
      }}>
        <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600, marginBottom: 2 }}>
          Warenkorb
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ fontSize: 44, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>
            {total.toFixed(2).replace('.', ',')}
          </span>
          <span style={{ fontSize: 20, color: 'var(--muted)', fontWeight: 600 }}>€</span>
          <span style={{ marginLeft: 'auto', fontSize: 14, color: remaining < 0 ? '#ef4444' : 'var(--primary)', fontWeight: 600 }}>
            {remaining >= 0 ? `${remaining.toFixed(2).replace('.', ',')} € übrig` : `${Math.abs(remaining).toFixed(2).replace('.', ',')} € drüber`}
          </span>
        </div>

        {/* Stacked bar */}
        <div style={{
          marginTop: 14, height: 10, background: 'var(--surface)',
          borderRadius: 100, overflow: 'hidden', display: 'flex',
        }}>
          <div style={{
            width: `${(spent / budget) * 100}%`, background: 'var(--primary)',
            transition: 'width 0.4s',
          }} />
          <div style={{
            width: `${((total - spent) / budget) * 100}%`, background: 'var(--primary-tint-strong, #a7f3d0)',
            transition: 'width 0.4s',
          }} />
        </div>
        <div style={{ display: 'flex', marginTop: 10, gap: 16, fontSize: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--primary)' }} />
            <span style={{ color: 'var(--muted)' }}>Gekauft</span>
            <span style={{ fontWeight: 600, color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>{spent.toFixed(2).replace('.', ',')} €</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--primary-tint-strong, #a7f3d0)' }} />
            <span style={{ color: 'var(--muted)' }}>Geplant</span>
            <span style={{ fontWeight: 600, color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>{(total - spent).toFixed(2).replace('.', ',')} €</span>
          </div>
          <div style={{ marginLeft: 'auto', color: 'var(--muted)', fontSize: 12 }}>
            Budget <span style={{ fontWeight: 600, color: 'var(--text)' }}>{budget} €</span>
          </div>
        </div>
      </div>

      {/* Weekly bar chart */}
      <div style={{
        background: 'var(--card)', borderRadius: 24, padding: 20, marginBottom: 12,
        boxShadow: '0 1px 2px rgba(10,30,20,0.04), 0 0 0 1px var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>Ø pro Woche</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
              {(weeks.reduce((s, w) => s + w, 0) / weeks.length).toFixed(2).replace('.', ',')} €
            </div>
          </div>
          <div style={{
            fontSize: 12, fontWeight: 600, color: '#059669',
            background: '#d1fae5', padding: '4px 10px', borderRadius: 100,
          }}>–8% vs. Vormonat</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 90, paddingBottom: 20, position: 'relative' }}>
          {weeks.map((w, i) => {
            const isActive = i === weeks.length - 1;
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: '100%',
                  height: `${(w / maxWeek) * 70}px`,
                  background: isActive ? 'var(--primary)' : 'var(--primary-tint-strong, #a7f3d0)',
                  borderRadius: 8, transition: 'height 0.4s',
                  minHeight: 8,
                }} />
                <div style={{
                  position: 'absolute', bottom: 0,
                  fontSize: 11, color: 'var(--muted)', fontWeight: 500,
                  marginTop: 6,
                }}>{['KW14', 'KW15', 'KW16', 'Jetzt'][i]}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* By category */}
      <div style={{
        background: 'var(--card)', borderRadius: 24, padding: 20,
        boxShadow: '0 1px 2px rgba(10,30,20,0.04), 0 0 0 1px var(--border)',
      }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 14, letterSpacing: '-0.01em' }}>
          Nach Kategorie
        </div>
        {sortedCats.map(([cat, amt]) => {
          const info = catFor(cat);
          const pct = (amt / total) * 100;
          return (
            <div key={cat} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 15 }}>{info.emoji}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', flex: 1 }}>{cat}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>
                  {amt.toFixed(2).replace('.', ',')} €
                </span>
              </div>
              <div style={{ height: 4, background: 'var(--surface)', borderRadius: 100, overflow: 'hidden' }}>
                <div style={{
                  width: `${pct}%`, height: '100%',
                  background: info.shade, borderRadius: 100,
                  transition: 'width 0.4s',
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// LISTS OVERVIEW
// ─────────────────────────────────────────────────────────────
function ListsScreen({ state, setState }) {
  const lists = [
    { id: 'l1', name: 'Wocheneinkauf', items: 12, done: 4, collaborators: 3, accent: '#10b981', active: true },
    { id: 'l2', name: 'Drogerie', items: 5, done: 0, collaborators: 1, accent: '#8b5cf6' },
    { id: 'l3', name: 'Geburtstag Mia', items: 8, done: 3, collaborators: 2, accent: '#f59e0b' },
    { id: 'l4', name: 'Getränke-Nachschub', items: 3, done: 3, collaborators: 1, accent: '#0ea5e9' },
  ];

  return (
    <div style={{ padding: '8px 16px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>Alle Listen</div>
          <div style={{ fontSize: 14, color: 'var(--muted)', marginTop: 2 }}>{lists.length} Listen · {lists.reduce((s, l) => s + l.items, 0)} Artikel</div>
        </div>
        <button style={{
          width: 40, height: 40, borderRadius: '50%',
          background: 'var(--primary)', color: 'white', border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', boxShadow: '0 6px 14px -4px var(--primary)',
        }}>{Icons.plus}</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {lists.map(l => {
          const pct = l.items === 0 ? 0 : Math.round((l.done / l.items) * 100);
          return (
            <div key={l.id} style={{
              background: 'var(--card)', borderRadius: 20, padding: 16,
              display: 'flex', alignItems: 'center', gap: 14,
              cursor: 'pointer', position: 'relative', overflow: 'hidden',
              boxShadow: '0 1px 2px rgba(10,30,20,0.04), 0 0 0 1px var(--border)',
            }}>
              <div style={{
                width: 4, position: 'absolute', left: 0, top: 12, bottom: 12,
                background: l.accent, borderRadius: 100,
              }} />
              <div style={{
                width: 44, height: 44, borderRadius: 14,
                background: l.accent + '20', color: l.accent,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, marginLeft: 4,
              }}>{Icons.cart}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.01em' }}>
                    {l.name}
                  </div>
                  {l.active && (
                    <div style={{
                      fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 100,
                      background: 'var(--primary-tint)', color: 'var(--primary)',
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}>Aktiv</div>
                  )}
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span>{l.done}/{l.items} erledigt</span>
                  <span>·</span>
                  <span>{l.collaborators} {l.collaborators === 1 ? 'Person' : 'Personen'}</span>
                </div>
                <div style={{
                  height: 3, background: 'var(--surface)', borderRadius: 100,
                  marginTop: 8, overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%', width: `${pct}%`,
                    background: l.accent, borderRadius: 100,
                  }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { RecipesScreen, BudgetScreen, ListsScreen });
