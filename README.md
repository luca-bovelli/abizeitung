# Abizeitung 2027 · Gestaltung

Vier Entwürfe für ein minimalistisches, typografisches Gestaltungssystem, alle auf einer Leinwand:

- **Zeugnis**: Nyght Serif (Display) + Gambetta, Mittelachse, Stempelblau für Stimmen von Menschen
- **Klausur**: JetBrains Mono auf 5-mm-Karo, Lehrkräfte schreiben rot von Hand (Sharpie)
- **Plakat**: Clash Display + Cabinet Grotesk, nur zwei Größen (9 pt und „füllt die Breite“), schwarz-weiß
- **Weißraum**: Switzer, eine einzige Größe, Fotos tragen die Seite

Jede Zeile zeigt Regeln, Schrift, Farben, Satzspiegel, Titel, Inhalt, Lehrerzitate und Steckbriefe. Namen, Zitate und Schule sind Platzhalter.

## Bedienung

Ziehen bewegt, Strg + Mausrad (oder Pinch) zoomt. Tasten: `1` alles zeigen, `0` 100 %, `+`/`−` zoomen, `R` Raster, Pfeiltasten bewegen.
Direkt zu einem Entwurf: `#zeugnis`, `#klausur`, `#plakat`, `#weissraum`.

## Aufbau

- `index.html`: Leinwand mit allen Seiten
- `css/canvas.css`: Leinwand, Rahmen, A4-Seiten (Maße in mm über `--mm`/`--pt`)
- `css/systeme.css`: die vier Systeme
- `js/canvas.js`: Bewegen, Zoomen, Raster, Breitenanpassung für Plakat

Jedes Systemblatt hat eine Schriftwahl zum Vergleichen. Schriften: Fontshare (ITF Free Font License), Google Fonts und Nyght Serif (OFL, selbst gehostet in `fonts/`).

Lokal ansehen: `index.html` im Browser öffnen. Veröffentlicht über GitHub Pages per GitHub Actions (`.github/workflows/pages.yml`), bei jedem Push auf `main`.
