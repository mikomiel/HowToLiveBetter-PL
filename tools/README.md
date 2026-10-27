# Kontrole pilotażu i narzędzia upstream

Polski czytnik korzysta bezpośrednio z book/pl/04-nie-marnuj-czasu.md. Uruchom npm test oraz npm run test:browser w katalogu głównym. Polecenia i instalację przeglądarki opisuje [README](../README.md).

Pozostałe skrypty w tools/ odziedziczono z chińskiego upstream. book.mjs, generatory EPUB/PDF/offline/Anki, sync-stats.mjs, updates.mjs i check-*.mjs zakładają chińskie nagłówki, pola, odsyłacze lub historyczny interfejs. Nie są zgodne z polskim README i czytnikiem. Nie uruchamiaj ich do aktualizacji polskiej treści ani statystyk.

Workflow book.yml zastąpiono kontrolami pilotażu. Nie buduje ani nie publikuje e-booków i nie uruchamia odziedziczonych generatorów. Przywrócenie wydawania wymaga osobnego, sprawdzonego zakresu i zgody właściciela.
