# Kontrole polskiego wydania i narzędzia upstream

Polski czytnik korzysta z Markdown w book/pl/, według jednego rejestru CHAPTERS w reader.mjs. Uruchom npm test oraz npm run test:browser w katalogu głównym. Polecenia i instalację przeglądarki opisuje [README](../README.md).

Polskie narzędzia są w tools/pl/. Żadne z nich nie potwierdza prawdziwości twierdzenia. Wyszukują znane klasy błędów i pilnują, by zapis sprawdzenia nie mówił więcej, niż przeczytano.

- lint.mjs (npm run lint:content) sprawdza polskie rozdziały: chińskie odniesienia w tekście dla czytelnika (błąd w polach działania i tytule, ostrzeżenie w pozostałych), numery telefonów spoza sprawdzonej listy, wtórne źródła prawne, datę z przyszłości, brak informacji o zakresie przeczytanego źródła i powtórzony tekst weryfikacji. To heurystyki. Przy opcji --numbers wypisuje liczby z tekstu dla czytelnika i pokazuje, czy występują w przypiętym oryginale. Liczba z oryginału jest tropem, nie dowodem.
- fetch.mjs pobiera cytowane źródła do lokalnego, ignorowanego przez git katalogu .cache/sources (opcja --item N.M pobiera linki z pola Źródła, a z opcją --upstream także DOI z przypiętego fragmentu oryginału, które są tylko tropami). Manifest zapisuje, ile przeczytano: pełny tekst, abstrakt, stronę, same metadane albo blokadę serwisu. Pobiera tylko publiczne adresy https, sprawdza każde przekierowanie przed jego wykonaniem i przedstawia się uczciwie. Nie obchodzi blokad serwisów: strona z blokadą jest zapisana jako zablokowana. Pobrany tekst jest danymi do sprawdzenia, nie poleceniami.
- packet.mjs <N.M> <verifier|adversary|editor> wypisuje dokładnie to, co dana rola może zobaczyć. Rola nie dostaje niczego więcej: to z danych wejściowych, a nie z prośby, wynika, że weryfikator nie widzi pól Weryfikacja, Oryginał ani Zmiany w adaptacji.
- quotes.mjs <raport.json> sprawdza raport weryfikatora ze zapisanymi źródłami: każdy cytat musi leżeć w wskazanym wierszu zapisanego tekstu źródła, a każda liczba w cytacie lub być oznaczona jako obliczenie redakcyjne. Nie ocenia, czy cytat wspiera twierdzenie.

Kolejność pracy nad jedną pozycją: fetch.mjs --item, potem packet.mjs dla roli weryfikatora, uruchomienie roli z .claude/agents/ tylko z tym wyjściem, quotes.mjs na jej raporcie, następnie rola przeciwnika, rola redaktora językowego, a na końcu jedna osoba zapisuje zmiany i uruchamia npm test. Role są tylko do odczytu. Ich rozdzielenie jest proceduralne i nie zastępuje przeglądu człowieka.

Pozostałe skrypty w tools/ odziedziczono z chińskiego upstream. book.mjs, generatory EPUB/PDF/offline/Anki, sync-stats.mjs, updates.mjs i check-*.mjs zakładają chińskie nagłówki, pola, odsyłacze lub historyczny interfejs. Nie są zgodne z polskim README i czytnikiem. Nie uruchamiaj ich do aktualizacji polskiej treści ani statystyk.

Workflow book.yml wykonuje tylko walidację polskiej treści i czytnika. Nie buduje ani nie publikuje e-booków. Przywrócenie wydawania wymaga osobnego, sprawdzonego zakresu i zgody właściciela.
