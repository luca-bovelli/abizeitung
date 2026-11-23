# Abizeitung 2027 · Gestaltung

Vier Entwürfe für ein minimalistisches, typografisches Gestaltungssystem, alle auf einer Leinwand:

- **Zeugnis**: Newsreader, Mittelachse, Stempelblau für Stimmen von Menschen
- **Klausur**: IBM Plex Mono auf 5-mm-Karo, Rotstift nur für Lehrkräfte
- **Plakat**: Archivo, nur zwei Größen (9 pt und „füllt die Breite“), schwarz-weiß
- **Weißraum**: Instrument Sans, eine einzige Größe, Fotos tragen die Seite

Jede Zeile zeigt Regeln, Schrift, Farben, Satzspiegel, Titel, Inhalt, Lehrerzitate und Steckbriefe. Namen, Zitate und Schule sind Platzhalter.

## Bedienung

Ziehen bewegt, Strg + Mausrad (oder Pinch) zoomt. Tasten: `1` alles zeigen, `0` 100 %, `+`/`−` zoomen, `R` Raster, Pfeiltasten bewegen.
Direkt zu einem Entwurf: `#zeugnis`, `#klausur`, `#plakat`, `#weissraum`.

## Aufbau

- `index.html`: Leinwand mit allen Seiten
- `css/canvas.css`: Leinwand, Rahmen, A4-Seiten (Maße in mm über `--mm`/`--pt`)
- `css/systeme.css`: die vier Systeme
- `js/canvas.js`: Bewegen, Zoomen, Raster, Breitenanpassung für Plakat

Lokal ansehen: `index.html` im Browser öffnen. Veröffentlicht über GitHub Pages (Branch `main`, Ordner `/`).
