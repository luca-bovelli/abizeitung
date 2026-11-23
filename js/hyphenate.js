// Automatische deutsche Silbentrennung für Blocksatz.
// Bibliothek: hyphen (ISC), Liang-Muster wie in TeX, neue Rechtschreibung (de-1996).
// Fügt weiche Trennstriche (&shy;) ein; der Browser trennt dann nur dort, wo eine Zeile umbricht.
// Fällt das CDN aus, bleibt CSS `hyphens: auto` als Rückfall.
import de from "https://cdn.jsdelivr.net/npm/hyphen@1.14.1/de/+esm";

// Alles, was im Blocksatz steht. Neue Fließtext-Klassen hier ergänzen oder data-hyphenate setzen.
const SELECTOR = ".ag-text, [data-hyphenate]";

document.querySelectorAll(SELECTOR).forEach((el) => {
  el.innerHTML = de.hyphenateHTMLSync(el.innerHTML);
});
