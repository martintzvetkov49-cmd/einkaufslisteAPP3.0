# Handoff: Frisch – Einkaufslisten-App Redesign

## Überblick

**Frisch** ist ein modernes Redesign einer Einkaufslisten-Web-App. Das Design folgt einem clean, minimalistischen Ansatz (Apple Reminders-inspiriert) mit frischen Grüntönen als Primärfarbe. Es unterstützt 4 Themes (Fresh, Warm, Dark, Mono).

## Über die Design-Dateien

Die Dateien in diesem Paket sind **Design-Referenzen in HTML/React (JSX)** — interaktive Prototypen, die Look & Verhalten zeigen. Sie sind **kein Produktionscode**. Die Aufgabe ist, dieses Design im bestehenden Tech-Stack nachzubauen und mit dem vorhandenen Backend (Datenbank, Echtzeit-Sync, Auth) zu verbinden.

## Fidelity

**High-Fidelity (hifi)** — Pixel-perfekte Mockups mit finalen Farben, Typografie, Spacing und Interaktionen. Das Design sollte so nah wie möglich nachgebaut werden.

## Design-Dateien

| Datei | Beschreibung |
|---|---|
| `Einkaufsliste App.html` | Hauptdatei — alle Screens in einem interaktiven Prototyp |
| `components.jsx` | Basis-Komponenten: Icons, Checkbox, ItemRow, CategoryGroup, BottomTabs |
| `screens.jsx` | Hauptscreen: HeroCard, AddBar, ListScreen |
| `screens2.jsx` | Sekundäre Screens: RecipesScreen, BudgetScreen, ListsScreen |
| `import-modal.jsx` | Upload/Import-Modal mit Smart-Parsing |
| `design-tokens.json` | Alle Design-Tokens (Farben, Typo, Spacing, Animationen, Kategorien) |
| `CLAUDE.md` | Technische Anweisungen für Claude Code |

## Screens

### 1. Aktive Einkaufsliste

**Layout:** Vertikaler Stack, 16px Seitenpadding

- **Hero-Card** (oben): Gradient-Hintergrund, 28px Border-Radius
  - Listenname (26px, bold)
  - Fortschritt: `{done} von {total} erledigt` + Prozent
  - Progress-Bar (6px Höhe, weiß auf halbtransparent)
  - Footer: Collaborator-Avatare (28px Circles, überlappend -8px) + Warenkorb-Preis

- **Add-Bar**: Card mit 24px Radius
  - Plus-Icon + Textfeld "Was brauchst du?" + Kategorie-Chip + Mic-Button
  - Auto-Complete-Vorschläge (Chips über dem Input)
  - Kategorie-Picker (aufklappbar, Emoji + Name pro Chip)

- **Quick Actions**: Horizontal scrollbar
  - "Liste importieren" (Primary-Farbe, prominent)
  - "Aus Rezept", "Letzte Woche", "Teilen", "Sortieren"

- **Kategorie-Gruppen**: Cards mit 20px Radius
  - Header: Emoji-Badge (32px, 10px Radius) + Name + `{done}/{total}` + Collapse-Chevron
  - Items: Checkbox (24px Circle) + Name + Menge/Preis + optionaler Note-Chip
  - Swipe nach links → roter Delete-Button (80px)

### 2. Rezepte

- **Header**: Titel + "Rezept hochladen"-Button (Primary, Pill)
- **Featured-Card**: Großer farbiger Block (24px Radius) mit Emoji-Illustration (140px, 0.4 Opacity)
  - Badge "Vorschlag für heute"
  - Name, Zeit, Personen, Zutaten-Count
  - CTA "Zur Liste hinzufügen" (dark pill button)
- **Grid**: 2 Spalten, 10px Gap
  - Kleine Cards: Emoji-Badge (52px, 14px Radius) + Name + Meta
- **Detail-Sheet** (Bottom-Sheet): Zutaten-Liste mit One-Tap-Import

### 3. Budget

- **Hauptkarte**: Großer Betrag (44px) + verbleibend/drüber
  - Stacked Progress-Bar (gekauft + geplant)
  - Legende mit Farbpunkten
- **Wochen-Chart**: 4 Balken (KW-Vergleich), aktive Woche = Primary
- **Kategorie-Aufschlüsselung**: Emoji + Name + Betrag + Mini-Balken

### 4. Alle Listen

- **Header**: Titel + Gesamt-Stats + FAB (40px Circle, Primary)
- **Listen-Cards**: 20px Radius, farbiger Left-Accent (4px)
  - Icon-Badge (44px, 14px Radius) + Name + "Aktiv"-Badge + Stats + Progress-Bar

### 5. Import-Modal (Bottom-Sheet)

- **Tab-Switcher**: "Datei" / "Text einfügen"
- **Datei-Tab**: Drag & Drop Zone + unterstützte Formate (TXT, CSV, JSON, MD, Foto)
- **Text-Tab**: Textarea + "Text analysieren"-Button
- **Parsing-Animation**: Pulsierendes Magic-Icon
- **Preview**: Alle erkannten Artikel als selektierbare Liste mit Checkbox, Emoji, Kategorie, Menge
- **Footer**: "Zurück" + "{N} Artikel hinzufügen"-Button

## Interaktionen

| Aktion | Animation |
|---|---|
| Item abhaken | Checkbox: scale + fill 0.18s ease, Text: opacity + line-through |
| Item löschen | Swipe left (threshold 40px), reveal red delete zone 80px |
| Kategorie ein-/ausklappen | max-height 0.3s ease + Chevron rotate |
| Bottom-Sheet öffnen | slideUp 0.28s cubic-bezier(.2,.9,.3,1.1) + backdrop fadeIn 0.2s |
| Toast-Notification | Slide von unten 0.25s, auto-dismiss nach 2.4s |
| Progress-Bars | width 0.4s ease |
| Tab-Wechsel | Sofort, kein Page-Transition |

## Design-Tokens

Siehe `design-tokens.json` für die vollständige Token-Definition inkl. aller Theme-Varianten, Typografie-Skala, Spacing, Shadows, Animationen und Kategorie-Definitionen.
