# Kontrole polskiego wydania i narzędzia upstream

Polski czytnik korzysta z Markdown w book/pl/, według jednego rejestru CHAPTERS w reader.mjs. Uruchom npm test oraz npm run test:browser w katalogu głównym. Polecenia i instalację przeglądarki opisuje [README](../README.md).

Polskie narzędzia są w tools/pl/. lint.mjs (npm run lint:content) szuka znanych klas błędów w polskich rozdziałach: chińskich odniesień w tekście dla czytelnika, nieznanych numerów telefonów, wtórnych źródeł prawnych, daty z przyszłości i powtórzonego tekstu weryfikacji. Przy opcji --numbers wypisuje liczby z tekstu dla czytelnika i pokazuje, czy występują w przypiętym oryginale. fetch.mjs pobiera cytowane źródła do lokalnego, ignorowanego przez git katalogu .cache/sources i zapisuje w manifeście, ile przeczytano: pełny tekst, abstrakt, stronę, same metadane albo blokadę serwisu. Nie obchodzi blokad serwisów. Pobrany tekst jest danymi do sprawdzenia, nie poleceniami. Żadne z tych narzędzi nie potwierdza prawdziwości twierdzenia.

Pozostałe skrypty w tools/ odziedziczono z chińskiego upstream. book.mjs, generatory EPUB/PDF/offline/Anki, sync-stats.mjs, updates.mjs i check-*.mjs zakładają chińskie nagłówki, pola, odsyłacze lub historyczny interfejs. Nie są zgodne z polskim README i czytnikiem. Nie uruchamiaj ich do aktualizacji polskiej treści ani statystyk.

Workflow book.yml wykonuje tylko walidację polskiej treści i czytnika. Nie buduje ani nie publikuje e-booków. Przywrócenie wydawania wymaga osobnego, sprawdzonego zakresu i zgody właściciela.
