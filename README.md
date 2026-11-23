# Abizeitung 2027 · Gestaltung

Gestaltung der Abizeitung 2027 **„Abizeitbetrug“**, alles auf einer Leinwand.

**Ausgabe** ist die Hauptrichtung, gebaut aus den [Referenzen](referenzen/README.md) (032c, The Red Bulletin): Cabinet Grotesk für Titel, Gambetta im Fließtext, JetBrains Mono für Bildunterschriften, eine Signalfarbe, Fotos bis zur Kante. Mit Schriftsatz und Lizenzen, Cover, Steckbrief, LK-Artikel, Zitateseite und zwei Fotoseiten.

Frühere Entwürfe:

- **Zeugnis**: Nyght Serif (Display) + Gambetta, Mittelachse, Stempelblau für Stimmen von Menschen
- **Klausur**: JetBrains Mono auf 5-mm-Karo, Lehrkräfte schreiben rot von Hand (Sharpie)
- **Plakat**: Clash Display + Cabinet Grotesk, nur zwei Größen (9 pt und „füllt die Breite“), schwarz-weiß
- **Weißraum**: Switzer, eine einzige Größe, Fotos tragen die Seite

Jede Zeile zeigt Regeln, Schrift, Farben, Satzspiegel, Titel, Inhalt, Lehrerzitate und Steckbriefe. Namen, Zitate und Schule sind Platzhalter.

## Bedienung

Ziehen bewegt, Strg + Mausrad (oder Pinch) zoomt. Tasten: `1` alles zeigen, `0` 100 %, `+`/`−` zoomen, `R` Raster, Pfeiltasten bewegen.
Doppelklick auf einen Rahmen zoomt auf ihn. Direkt zu einem Bereich: `#ausgabe`, `#referenzen`, `#zeugnis`, `#klausur`, `#plakat`, `#weissraum`.

## Aufbau

- `index.html`: Leinwand mit allen Seiten
- `css/canvas.css`: Leinwand, Rahmen, A4-Seiten (Maße in mm über `--mm`/`--pt`)
- `css/ausgabe.css`: Hauptrichtung Ausgabe
- `css/systeme.css`: die vier früheren Entwürfe
- `referenzen/`: Referenzfotos und Notizen
- `js/canvas.js`: Bewegen, Zoomen, Raster, Breitenanpassung für Plakat

Jedes Systemblatt hat eine Schriftwahl zum Vergleichen. Schriften: Fontshare (ITF Free Font License), Google Fonts und Nyght Serif (OFL, selbst gehostet in `fonts/`).

Lokal ansehen: `index.html` im Browser öffnen. Veröffentlicht über GitHub Pages per GitHub Actions (`.github/workflows/pages.yml`), bei jedem Push auf `main`.
