// ImportModal — universal upload + parse + preview modal
// Handles: .txt, .csv, .json, .md, images (drop/pick), paste text

function ImportModal({ title, subtitle, mode, onClose, onImport }) {
  // mode: 'list' or 'recipe'
  const [file, setFile] = React.useState(null);
  const [textInput, setTextInput] = React.useState('');
  const [parsed, setParsed] = React.useState(null);
  const [stage, setStage] = React.useState('pick'); // pick | parsing | preview
  const [tab, setTab] = React.useState('file'); // file | paste
  const [dragging, setDragging] = React.useState(false);
  const fileRef = React.useRef(null);

  // Category auto-detection by keyword
  const CAT_KEYWORDS = {
    'Obst & Gemüse': ['banan', 'apfel', 'tomat', 'salat', 'gurke', 'paprika', 'kartoffel', 'zwiebel', 'knoblauch', 'zitron', 'orange', 'avocado', 'karotte', 'möhre', 'rucola', 'basilikum', 'petersilie', 'koriander', 'limette', 'beere', 'gemüse', 'obst', 'ananas', 'mango', 'spinat', 'brokkoli'],
    'Milchprodukte': ['milch', 'käse', 'joghurt', 'butter', 'sahne', 'quark', 'parmesan', 'mozzarella', 'feta', 'ei', 'eier'],
    'Brot & Backwaren': ['brot', 'brötchen', 'toast', 'baguette', 'nudel', 'pasta', 'spaghetti', 'mehl', 'reis', 'tortilla', 'quinoa'],
    'Fleisch & Fisch': ['fleisch', 'hähnchen', 'huhn', 'rind', 'schwein', 'lachs', 'fisch', 'thunfisch', 'schinken', 'wurst', 'salami', 'hackfleisch'],
    'Getränke': ['wasser', 'saft', 'cola', 'bier', 'wein', 'tee', 'kaffee', 'sprudel', 'limonade'],
    'Tiefkühl': ['tiefkühl', 'gefrier', 'eis'],
    'Drogerie': ['shampoo', 'seife', 'zahnpasta', 'creme', 'deo', 'duschgel'],
    'Haushalt': ['waschmittel', 'spülmittel', 'toilettenpapier', 'küchenrolle', 'müllbeutel', 'putz'],
    'Snacks': ['schokolade', 'chips', 'keks', 'süß', 'gumm', 'riegel', 'nuss'],
  };

  function detectCategory(name) {
    const lower = name.toLowerCase();
    for (const [cat, words] of Object.entries(CAT_KEYWORDS)) {
      if (words.some(w => lower.includes(w))) return cat;
    }
    return 'Allgemein';
  }

  // Parse quantities: "2x Milch", "500g Käse", "Milch 1L", "3 Äpfel"
  function parseLine(line) {
    let s = line.trim();
    // Skip empty, comments, headings
    if (!s || /^[#\-*=]{1,}\s*$/.test(s)) return null;
    // Strip bullets, checkboxes
    s = s.replace(/^[\s\-*•·►▸]+/, '').replace(/^\[\s*[xX ]?\s*\]\s*/, '');
    if (!s) return null;

    // qty at start: "2x", "500g", "1.5 kg", "3"
    let qty = null;
    const startMatch = s.match(/^(\d+(?:[.,]\d+)?\s*(?:x|kg|g|l|ml|stk|stück|pck|packung|dose|bund|scheiben?)?)\s+(.+)/i);
    if (startMatch) {
      qty = startMatch[1].trim();
      s = startMatch[2].trim();
    } else {
      // qty at end: "Milch 1L"
      const endMatch = s.match(/^(.+?)\s+(\d+(?:[.,]\d+)?\s*(?:kg|g|l|ml|stk|stück|pck|packung|dose|bund|scheiben?))\s*$/i);
      if (endMatch) {
        s = endMatch[1].trim();
        qty = endMatch[2].trim();
      }
    }
    // Strip trailing price
    const priceMatch = s.match(/^(.+?)\s+(\d+[.,]\d{2})\s*€?\s*$/);
    let price = null;
    if (priceMatch) {
      s = priceMatch[1].trim();
      price = parseFloat(priceMatch[2].replace(',', '.'));
    }
    if (!s || s.length < 2) return null;
    // Capitalize first letter
    s = s.charAt(0).toUpperCase() + s.slice(1);
    return { name: s, qty, price, category: detectCategory(s) };
  }

  function parseText(text) {
    const lines = text.split(/[\r\n]+/);
    const items = [];
    for (const line of lines) {
      const item = parseLine(line);
      if (item) items.push(item);
    }
    return items;
  }

  function parseJSON(text) {
    try {
      const data = JSON.parse(text);
      const arr = Array.isArray(data) ? data : (data.items || data.ingredients || []);
      return arr.map(x => {
        if (typeof x === 'string') return parseLine(x);
        return {
          name: x.name || x.title || '',
          qty: x.qty || x.quantity || x.amount || null,
          price: x.price || null,
          category: x.category || detectCategory(x.name || ''),
        };
      }).filter(x => x && x.name);
    } catch {
      return parseText(text);
    }
  }

  function parseCSV(text) {
    const rows = text.split(/\r?\n/).filter(r => r.trim());
    if (rows.length === 0) return [];
    const headers = rows[0].split(/[,;\t]/).map(h => h.trim().toLowerCase());
    const nameIdx = headers.findIndex(h => /name|artikel|produkt|item/i.test(h));
    const qtyIdx = headers.findIndex(h => /menge|qty|quantity|anzahl/i.test(h));
    const priceIdx = headers.findIndex(h => /preis|price/i.test(h));
    const catIdx = headers.findIndex(h => /kategorie|category/i.test(h));
    if (nameIdx === -1) return parseText(text);
    return rows.slice(1).map(r => {
      const cells = r.split(/[,;\t]/).map(c => c.trim());
      const name = cells[nameIdx];
      if (!name) return null;
      return {
        name,
        qty: qtyIdx >= 0 ? cells[qtyIdx] : null,
        price: priceIdx >= 0 ? parseFloat(String(cells[priceIdx]).replace(',', '.')) || null : null,
        category: catIdx >= 0 && cells[catIdx] ? cells[catIdx] : detectCategory(name),
      };
    }).filter(Boolean);
  }

  async function handleFile(f) {
    if (!f) return;
    setFile(f);
    setStage('parsing');
    // Image: simulate OCR with a reasonable demo parse
    if (f.type.startsWith('image/')) {
      await new Promise(r => setTimeout(r, 1200));
      const demo = mode === 'list'
        ? [
          { name: 'Milch', qty: '1L', category: 'Milchprodukte' },
          { name: 'Brot', qty: '1 Laib', category: 'Brot & Backwaren' },
          { name: 'Tomaten', qty: '500g', category: 'Obst & Gemüse' },
          { name: 'Käse', qty: '200g', category: 'Milchprodukte' },
          { name: 'Bananen', qty: '6 Stück', category: 'Obst & Gemüse' },
          { name: 'Olivenöl', qty: '1 Flasche', category: 'Allgemein' },
        ]
        : [
          { name: 'Pasta', qty: '400g', category: 'Brot & Backwaren' },
          { name: 'Tomaten', qty: '800g', category: 'Obst & Gemüse' },
          { name: 'Knoblauch', qty: '4 Zehen', category: 'Obst & Gemüse' },
          { name: 'Basilikum', qty: '1 Bund', category: 'Obst & Gemüse' },
          { name: 'Parmesan', qty: '100g', category: 'Milchprodukte' },
        ];
      setParsed({ items: demo, recipeName: mode === 'recipe' ? f.name.replace(/\.[^.]+$/, '') : null });
      setStage('preview');
      return;
    }
    const text = await f.text();
    await new Promise(r => setTimeout(r, 600));
    let items;
    if (/\.json$/i.test(f.name)) items = parseJSON(text);
    else if (/\.csv$/i.test(f.name)) items = parseCSV(text);
    else items = parseText(text);
    setParsed({ items, recipeName: mode === 'recipe' ? f.name.replace(/\.[^.]+$/, '') : null });
    setStage('preview');
  }

  function handlePaste() {
    if (!textInput.trim()) return;
    setStage('parsing');
    setTimeout(() => {
      const items = parseText(textInput);
      setParsed({ items, recipeName: mode === 'recipe' ? 'Neues Rezept' : null });
      setStage('preview');
    }, 400);
  }

  function toggleItem(idx) {
    setParsed(p => ({
      ...p,
      items: p.items.map((it, i) => i === idx ? { ...it, _skip: !it._skip } : it),
    }));
  }

  function confirmImport() {
    const keep = parsed.items.filter(it => !it._skip);
    onImport(mode === 'recipe' ? { ...parsed, items: keep } : keep);
  }

  const fileIcon = file && file.type.startsWith('image/') ? Icons.image : Icons.doc;

  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'flex-end', zIndex: 50,
      animation: 'fadeIn 0.2s ease',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--card)', width: '100%',
        borderRadius: '28px 28px 0 0',
        maxHeight: '90%', display: 'flex', flexDirection: 'column',
        animation: 'slideUp 0.3s cubic-bezier(.2,.9,.3,1.1)',
      }}>
        {/* Drag handle */}
        <div style={{ padding: '10px 20px 0', flexShrink: 0 }}>
          <div style={{
            width: 40, height: 4, borderRadius: 2,
            background: 'var(--border)', margin: '0 auto',
          }} />
        </div>

        {/* Header */}
        <div style={{
          padding: '14px 20px 12px', display: 'flex', alignItems: 'flex-start',
          gap: 12, flexShrink: 0,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'var(--primary-tint)', color: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            {React.cloneElement(Icons.upload, { size: 20, stroke: 2.2 })}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>
              {title}
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2, lineHeight: 1.3 }}>
              {subtitle}
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'var(--chip)', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--muted)', cursor: 'pointer', flexShrink: 0,
          }}>{React.cloneElement(Icons.close, { size: 16 })}</button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 16px' }}>
          {stage === 'pick' && (
            <>
              {/* Tab switcher */}
              <div style={{
                display: 'flex', background: 'var(--surface)', borderRadius: 12,
                padding: 3, marginBottom: 14,
              }}>
                {[
                  { id: 'file', label: 'Datei' },
                  { id: 'paste', label: 'Text einfügen' },
                ].map(t => (
                  <button key={t.id} onClick={() => setTab(t.id)} style={{
                    flex: 1, padding: '8px 10px', border: 'none',
                    background: tab === t.id ? 'var(--card)' : 'transparent',
                    color: tab === t.id ? 'var(--text)' : 'var(--muted)',
                    borderRadius: 9, fontSize: 13, fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'inherit',
                    boxShadow: tab === t.id ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                  }}>{t.label}</button>
                ))}
              </div>

              {tab === 'file' ? (
                <>
                  {/* Dropzone */}
                  <div
                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={e => {
                      e.preventDefault(); setDragging(false);
                      if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
                    }}
                    onClick={() => fileRef.current?.click()}
                    style={{
                      border: `2px dashed ${dragging ? 'var(--primary)' : 'var(--border)'}`,
                      borderRadius: 18, padding: '28px 20px',
                      background: dragging ? 'var(--primary-tint)' : 'var(--surface)',
                      textAlign: 'center', cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 14,
                      background: 'var(--card)', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--primary)', margin: '0 auto 10px',
                    }}>
                      {React.cloneElement(Icons.upload, { size: 22, stroke: 2.2 })}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.01em' }}>
                      Datei hier ablegen
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>
                      oder tippen zum Auswählen
                    </div>
                    <input ref={fileRef} type="file"
                      accept=".txt,.csv,.json,.md,image/*"
                      style={{ display: 'none' }}
                      onChange={e => handleFile(e.target.files[0])} />
                  </div>
                  {/* Supported types */}
                  <div style={{
                    display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12,
                  }}>
                    {['TXT', 'CSV', 'JSON', 'MD', 'Foto (OCR)'].map(t => (
                      <div key={t} style={{
                        padding: '4px 10px', borderRadius: 100,
                        background: 'var(--chip)', color: 'var(--muted)',
                        fontSize: 11, fontWeight: 600,
                      }}>{t}</div>
                    ))}
                  </div>
                  <div style={{
                    marginTop: 14, padding: '10px 12px', borderRadius: 12,
                    background: 'var(--surface)', display: 'flex', gap: 10,
                  }}>
                    <div style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 1 }}>
                      {React.cloneElement(Icons.magic, { size: 18 })}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
                      Kategorien, Mengen und Preise werden automatisch erkannt.
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <textarea
                    value={textInput}
                    onChange={e => setTextInput(e.target.value)}
                    placeholder={mode === 'recipe'
                      ? 'Zutaten einfügen, eine pro Zeile…\n\n200g Spaghetti\n400g Tomaten\n2 Zehen Knoblauch\n1 Bund Basilikum'
                      : 'Einkaufsliste einfügen, eine Zeile pro Artikel…\n\nMilch 1L\n500g Tomaten\n2x Brot\nKäse'}
                    rows={8}
                    style={{
                      width: '100%', padding: 14, borderRadius: 14,
                      border: '1px solid var(--border)', background: 'var(--surface)',
                      fontSize: 14, fontFamily: 'inherit',
                      color: 'var(--text)', resize: 'none',
                      outline: 'none',
                    }}
                  />
                  <button onClick={handlePaste}
                    disabled={!textInput.trim()}
                    style={{
                      width: '100%', marginTop: 10, padding: '12px',
                      borderRadius: 100, border: 'none',
                      background: textInput.trim() ? 'var(--primary)' : 'var(--chip)',
                      color: textInput.trim() ? 'white' : 'var(--muted)',
                      fontSize: 14, fontWeight: 600, cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}>Text analysieren</button>
                </>
              )}
            </>
          )}

          {stage === 'parsing' && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'var(--primary-tint)', color: 'var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 14px',
                animation: 'pulse 1.2s infinite',
              }}>
                {React.cloneElement(Icons.magic, { size: 26 })}
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>
                Wird analysiert…
              </div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
                Artikel werden erkannt und sortiert
              </div>
            </div>
          )}

          {stage === 'preview' && parsed && (
            <>
              {file && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 12,
                  background: 'var(--surface)', marginBottom: 12,
                }}>
                  <div style={{ color: 'var(--muted)' }}>
                    {React.cloneElement(fileIcon, { size: 18 })}
                  </div>
                  <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                    <div style={{
                      fontSize: 13, fontWeight: 600, color: 'var(--text)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>{file.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                      {(file.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                </div>
              )}
              <div style={{
                fontSize: 12, fontWeight: 700, color: 'var(--muted)',
                textTransform: 'uppercase', letterSpacing: '0.08em',
                marginBottom: 8, display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <span>{parsed.items.filter(i => !i._skip).length} von {parsed.items.length} Artikel</span>
                <span style={{ textTransform: 'none', fontWeight: 500, fontSize: 11 }}>
                  tippen zum Abwählen
                </span>
              </div>
              {parsed.items.length === 0 ? (
                <div style={{
                  textAlign: 'center', padding: '30px 20px',
                  background: 'var(--surface)', borderRadius: 14,
                  color: 'var(--muted)', fontSize: 13,
                }}>
                  Keine Artikel erkannt.
                </div>
              ) : (
                <div style={{
                  background: 'var(--surface)', borderRadius: 14,
                  padding: 4, marginBottom: 8,
                }}>
                  {parsed.items.map((it, i) => {
                    const info = catFor(it.category);
                    return (
                      <div key={i} onClick={() => toggleItem(i)} style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '10px 12px', cursor: 'pointer',
                        borderBottom: i < parsed.items.length - 1 ? '1px solid var(--border)' : 'none',
                        opacity: it._skip ? 0.4 : 1,
                        transition: 'opacity 0.15s',
                      }}>
                        <div style={{
                          width: 20, height: 20, borderRadius: 6,
                          border: it._skip ? '2px solid var(--border)' : 'none',
                          background: it._skip ? 'transparent' : 'var(--primary)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          {!it._skip && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></svg>
                          )}
                        </div>
                        <div style={{
                          width: 28, height: 28, borderRadius: 8,
                          background: `hsl(${info.hue}, 60%, 94%)`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 14, flexShrink: 0,
                          textDecoration: it._skip ? 'line-through' : 'none',
                        }}>{info.emoji}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: 14, fontWeight: 600, color: 'var(--text)',
                            textDecoration: it._skip ? 'line-through' : 'none',
                            letterSpacing: '-0.01em',
                          }}>{it.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>
                            {it.category}{it.qty ? ' · ' + it.qty : ''}
                          </div>
                        </div>
                        {it.price && (
                          <div style={{
                            fontSize: 12, fontWeight: 600, color: 'var(--muted)',
                            fontVariantNumeric: 'tabular-nums',
                          }}>
                            {it.price.toFixed(2).replace('.', ',')} €
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer actions */}
        {stage === 'preview' && parsed && parsed.items.length > 0 && (
          <div style={{
            padding: '12px 20px 18px', display: 'flex', gap: 8,
            borderTop: '1px solid var(--border)', flexShrink: 0,
          }}>
            <button onClick={() => { setStage('pick'); setParsed(null); setFile(null); setTextInput(''); }}
              style={{
                padding: '12px 16px', borderRadius: 100,
                background: 'var(--chip)', border: 'none',
                fontSize: 14, fontWeight: 600, color: 'var(--text)',
                cursor: 'pointer', fontFamily: 'inherit',
              }}>Zurück</button>
            <button onClick={confirmImport} style={{
              flex: 1, padding: '12px', borderRadius: 100,
              background: 'var(--primary)', color: 'white', border: 'none',
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: '0 6px 16px -6px var(--primary)',
            }}>
              {parsed.items.filter(i => !i._skip).length} {mode === 'recipe' ? 'Zutaten' : 'Artikel'} hinzufügen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { ImportModal });
