# CLAUDE.md – Einkaufslisten-App "Frisch"

## Projekt-Überblick

Dies ist eine moderne Einkaufslisten-Web-App namens **Frisch**. Das Ziel ist, das bestehende funktionale Backend (Datenbank, Echtzeit-Sync, Auth) mit dem neuen UI-Design aus dem `/design_handoff/`-Ordner zusammenzuführen.

## Tech-Stack (empfohlen)

- **Frontend**: React 18+ (oder Next.js 14+ für SSR)
- **Styling**: Tailwind CSS 4 oder CSS Modules – KEINE Component Libraries wie MUI/Chakra
- **State**: Zustand oder React Context (leichtgewichtig)
- **Realtime**: bestehende Sync-Lösung beibehalten (Supabase Realtime / Firebase / WebSockets)
- **Auth**: bestehende Auth beibehalten
- **Datenbank**: bestehende DB beibehalten

## Design-System

Alle Design-Tokens sind in `/design_handoff/design-tokens.json` definiert. Nutze sie als Single Source of Truth.

### Themes
Die App unterstützt 4 Themes: `fresh` (Standard), `warm`, `dark`, `mono`. Jedes Theme definiert CSS Custom Properties. Siehe `design-tokens.json` für alle Werte.

### Typografie
- **Primär-Font**: `Geist` (Google Fonts) — Fallback: `Inter`, `system-ui`, `sans-serif`
- **Gewichte**: 400 (Body), 500 (Medium), 600 (Semibold), 700 (Bold)
- **Keine Fonts kleiner als 11px verwenden**

### Icons
Alle Icons sind Stroke-basierte SVGs (24x24 viewBox, strokeWidth 2, round caps/joins). Siehe `components.jsx` für alle Icon-Pfade. In Produktion: Lucide Icons als Drop-in-Replacement verwenden.

## Screens & Features

### 1. Aktive Einkaufsliste (Hauptscreen)
- Hero-Card mit Fortschritt, Live-Collaborator-Avatare, Budget-Anzeige
- Artikel gruppiert nach Kategorien (kollapsierbar)
- Swipe-to-Delete auf Items
- Animated Checkbox mit Durchstreich-Animation
- Add-Bar mit Auto-Complete, Kategorie-Picker, Sprach-Button
- Quick Actions: "Liste importieren", "Aus Rezept", "Letzte Woche", "Teilen", "Sortieren"
- **Import-Modal**: Datei-Upload (TXT/CSV/JSON/MD/Foto) oder Text einfügen → Smart-Parsing → Preview → Import

### 2. Rezepte
- Featured-Rezept-Card (groß, mit Emoji-Illustration)
- Rezept-Grid (2 Spalten)
- Detail-Sheet (Bottom-Sheet mit Zutatenliste)
- "Rezept hochladen"-Button → Import-Modal im Rezept-Modus
- One-Tap "Alle Zutaten zur Liste hinzufügen"

### 3. Budget
- Großer Betrag mit Fortschrittsbalken (gekauft vs. geplant vs. Budget)
- Wochen-Balkendiagramm (KW-Vergleich)
- Aufschlüsselung nach Kategorie mit Balken

### 4. Alle Listen
- Listenübersicht mit Fortschrittsbalken, Farb-Akzent, Collaborator-Count
- "Aktiv"-Badge für die aktuelle Liste
- FAB zum Erstellen neuer Listen

## Kategorien

Die App nutzt feste Kategorien mit Emoji + Farbzuordnung:

| Kategorie         | Emoji | Farbe   |
|-------------------|-------|---------|
| Obst & Gemüse     | 🥬    | #4ade80 |
| Milchprodukte      | 🧀    | #fbbf24 |
| Brot & Backwaren   | 🥖    | #f59e0b |
| Fleisch & Fisch    | 🥩    | #f87171 |
| Getränke           | 🥤    | #60a5fa |
| Tiefkühl           | 🧊    | #67e8f9 |
| Drogerie           | 🧴    | #c084fc |
| Haushalt           | 🧼    | #a78bfa |
| Snacks             | 🍫    | #fb923c |
| Allgemein          | 🛒    | #10b981 |

## Smart-Parsing (Import-Feature)

Der Import erkennt automatisch:
- **Mengen am Anfang**: `2x Milch`, `500g Käse`, `1.5 kg Mehl`
- **Mengen am Ende**: `Milch 1L`, `Tomaten 500g`
- **Preise**: `Käse 3,99 €`
- **Kategorien**: Keyword-basierte Zuordnung (z.B. "Milch" → Milchprodukte)
- **Formate**: Bulletpoints, Checkboxen, Markdown-Listen werden automatisch bereinigt

## Interaktionen & Animationen

- **Swipe-to-Delete**: Item nach links swipen → roter Delete-Button revealed (Threshold: 40px)
- **Checkbox**: Scale + Opacity Animation (0.18s ease)
- **Bottom-Sheets**: `slideUp` Animation (0.28s cubic-bezier(.2,.9,.3,1.1))
- **Overlays**: `fadeIn` 0.2s ease
- **Toast-Notifications**: Von unten reinsliden, 2.4s sichtbar
- **Kategorie-Collapse**: max-height Transition 0.3s ease
- **Progress-Bars**: width Transition 0.4s ease

## Datenmodell

```typescript
interface ShoppingItem {
  id: string;
  name: string;
  category: string; // aus den festen Kategorien
  qty?: string;     // "500g", "2 Stück", "1L"
  price?: number;   // in Euro
  done: boolean;
  note?: string;    // z.B. "Bio", Rezeptname
  createdAt: Date;
  updatedAt: Date;
}

interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingItem[];
  collaborators: Collaborator[];
  budget?: number;
  accent: string;   // Hex-Farbe
  active: boolean;
  createdAt: Date;
}

interface Collaborator {
  id: string;
  initial: string;
  color: string;
  online: boolean;
}

interface Recipe {
  id: string;
  name: string;
  emoji: string;
  color: string;      // Hintergrundfarbe
  time: string;        // "20 Min"
  servings: number;
  tags: string[];
  ingredients: RecipeIngredient[];
}

interface RecipeIngredient {
  name: string;
  qty: string;
  category: string;
}
```

## Ordnerstruktur (empfohlen)

```
src/
├── app/                    # Pages/Routes
│   ├── layout.tsx
│   ├── page.tsx            # → Redirect zu /list
│   ├── list/page.tsx       # Aktive Einkaufsliste
│   ├── recipes/page.tsx    # Rezepte
│   ├── budget/page.tsx     # Budget
│   └── lists/page.tsx      # Alle Listen
├── components/
│   ├── ui/                 # Basis-Komponenten
│   │   ├── Checkbox.tsx
│   │   ├── BottomSheet.tsx
│   │   ├── Toast.tsx
│   │   └── BottomTabs.tsx
│   ├── list/               # Listen-Komponenten
│   │   ├── HeroCard.tsx
│   │   ├── ItemRow.tsx
│   │   ├── CategoryGroup.tsx
│   │   ├── AddBar.tsx
│   │   └── ImportModal.tsx
│   ├── recipes/
│   │   ├── RecipeCard.tsx
│   │   ├── RecipeGrid.tsx
│   │   └── RecipeDetail.tsx
│   └── budget/
│       ├── BudgetCard.tsx
│       ├── WeeklyChart.tsx
│       └── CategoryBreakdown.tsx
├── lib/
│   ├── categories.ts       # Kategorie-Definitionen
│   ├── parser.ts           # Smart-Parsing Logik
│   └── themes.ts           # Theme-Tokens
├── hooks/
│   ├── useShoppingList.ts
│   ├── useRecipes.ts
│   └── useTheme.ts
└── design_handoff/         # Dieses Paket
```

## Wichtige Hinweise

1. **Die HTML-Dateien im Handoff sind Design-Referenzen** – nicht direkt als Produktionscode verwenden. Die Aufgabe ist, dieses Design im echten Tech-Stack nachzubauen.
2. **Das bestehende Backend beibehalten** – Auth, Datenbank, Echtzeit-Sync vom existierenden Repo übernehmen.
3. **Mobile-First** – Die App ist primär für Mobile gedacht (412px Breite), aber sollte responsive sein.
4. **Touch-Targets** – Minimum 44px für alle interaktiven Elemente.
5. **Kein Tailwind-Reset des bestehenden Designs** – wenn das Repo bereits ein CSS-Framework nutzt, Tokens anpassen statt ersetzen.
