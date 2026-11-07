# Przegląd opublikowanych porad: historia i dalsza praca

Historyczny run7 z 2026-10-30 obejmował 32 ówczesne porady, nie dzisiejszy zbiór. Według [końcowego stanu run7](runs/run7/STATUS.md) kontrolę skryptów przeszło 115 z 115 raportów. Trzy wcześniej odrzucone raporty napisano ponownie po zmianach kontraktu ról. Przyjęcie raportu przez skrypt sprawdza formę i cytaty, nie prawdziwość porady ani akceptację człowieka. Późniejsze zmiany tekstu mogą unieważnić odpowiednie pakiety.

Aktualne pokrycie opisuje [README wydania](../README.md), a stan i zakres sprawdzenia każdej pozycji są w book/pl/. [Plan zatwierdzony 2026-11-07](FINDINGS.md#h-plan-zatwierdzony-2026-11-07) porządkuje dalszą pracę. Starsze ustalenia w FINDINGS.md i runs/ zachowujemy jako historię, nie automatyczną listę braków dzisiejszej wersji. [AGENTS.md](../AGENTS.md) pozostaje jedynym kanonicznym dokumentem instrukcji. Mechanizm jest przenośny między narzędziami (Codex, Claude Code, inne); role są zwykłymi plikami Markdown.

## Prompt dla nowego agenta

Przeczytaj AGENTS.md, ten plik i zatwierdzony plan. Wybierz jeden ograniczony etap i jego kryteria zakończenia. Sprawdź bieżące issues i dokładny ref przed zmianami. Raportuj PASS, FAIL, NOT_RUN lub UNAVAILABLE dla badanego commita. Nie traktuj przeglądu AI ani CI jako recenzji lekarza lub prawnika. Nie scalaj ani nie uruchamiaj Pages na podstawie samej zgody na pracę źródłową.

## Nowy przegląd aktualnej treści

1. Wskaż pozycje i dokładny commit. Zacznij od treści o dużym ryzyku; nie uruchamiaj całego starego przebiegu tylko po to, aby zmienić jego wynik.
2. Uruchom npm ci --ignore-scripts i npm test z gałęzi zadania. Źródła wszystkich opublikowanych pozycji pobiera node tools/pl/fetch.mjs --published, opisany w [tools/README.md](../tools/README.md); liczba wejść zależy od aktualnego zakresu. Blokad dostawców nie obchodzimy. Samo pobranie lub odczyt metadanych nie jest lekturą źródła.
3. Użyj audit.mjs prepare z nowym, nieistniejącym katalogiem i wybraną listą pozycji. Składnia jest w tools/README.md. Nie nadpisuj historycznego run7 ani jego raportów, checks.txt lub digest.md.
4. audit.mjs adopt może przejąć raport z wcześniejszego katalogu tylko po sprawdzeniu niezmienionego tekstu i zgodności raportu. Odrzuconego raportu nie poprawiaj ręcznie jako rzekomo niezależnego. Role i ich ograniczenia są w .claude/agents/; ich użycie musi być dozwolone w bieżącej sesji.
5. Sprawdź audit.mjs status i rozstrzygnij różnice na podstawie dostępnych źródeł. Brak źródła, niezgodność zakresu lub potrzebna recenzja dziedzinowa pozostają jawną blokadą. Dla odrzuconego raportu audit.mjs retry wypisuje prompt z listą błędów. Przekaż go świeżej sesji w granicach obowiązującego limitu prób; potem zgłoś blokadę. Nie uznawaj braku sprzeczności za potwierdzenie. Zbiorczy digest tworzy tools/pl/digest.mjs, nie dodatkowa ocena modelu.
6. Zastosuj uzasadnione zmiany jednym autorem w osobnym PR. Zmiana twierdzenia wymaga ponownej oceny, daty i testów. Raporty dla zmienionych pozycji przygotuj od nowa; nie przerabiaj dawnych pakietów tak, jakby obejmowały nowy tekst. Walidacja i niezależny przegląd PR dotyczą aktualnego opublikowanego HEAD; merge należy do człowieka.

## Co zostało zrobione do 2026-10-29

- **Narzędzia** w `tools/pl/`: lint treści, pobieranie źródeł do lokalnej pamięci, pakiety dla ról, sprawdzanie raportów weryfikatora i przeciwnika (`quotes.mjs`), sprawdzanie propozycji redaktora (`edits.mjs`), porównanie dwóch przebiegów (`compare.mjs`), zbiorczy digest (`digest.mjs`), sprawdzanie wszystkich raportów katalogu (`check-reports.mjs`) oraz sterownik `audit.mjs`. Opis każdego jest w [tools/README.md](../tools/README.md).
- **Skill odziedziczony po wersji chińskiej** został zastąpiony przez `.claude/skills/jak-zyc-lepiej`, który odpowiada wyłącznie na podstawie zweryfikowanych porad.
- **Przegląd 4 pozycji z poprawkami** (03.4, 04.4, 14.2, 14.7). Poprawki są w czterech commitach „draft: …” (9800901, bc2b7b8, 518c3b3, 1173be1), zostały przyjęte przez właściciela 2026-10-29, a status `verified` zostawiono bez zmian. Wynik ślepej weryfikacji: 14.2, 14.7 i 04.4 przechodzą, 03.4 ma jeden otwarty wiersz (krok redakcyjny bez źródła).
- **Zastrzeżenie** „nie jest poradą prawną i nie miał przeglądu prawnika” dodano w 14.7, 14.8 i 14.9.
- **Wstępny przegląd pozostałych pozycji** przerwano. Pierwsze raporty są dla 11 z 28 pozycji (14.1, 14.3, 14.4, 14.6, 14.9, 03.1, 03.2, 03.3, 03.5, 03.6, 03.7); nie są sprawdzone przez człowieka ani przez drugi przebieg. 17 pozycji nie ruszono: 14.8, 14.10, 14.12, 03.8, 03.18, 03.23, 03.26, 03.27, 04.1, 04.2, 04.3, 04.5, 04.7, 04.9, 04.12, 04.17, 04.18.

## Co leży w katalogu

| Ścieżka | Zawartość |
|---|---|
| `runs/<przebieg>/<N.M>/<rola>-<przebieg>.json` | raporty weryfikatora, przeciwnika i redaktora |
| `runs/<przebieg>/checks.txt` | wynik `check-reports.mjs` na tekście z 2026-10-29 (raport starszy niż tekst może być odrzucony, choć był poprawny) |
| `runs/<przebieg>/digest.md` | zbiorcza lista dla człowieka |
| `runs/<przebieg>/workflow-result.json` | wynik orkiestracji wraz z uwagami agentów o niejasnościach w opisach ról (tylko przebiegi 1–4) |
| `runs/runs.json` | commit tekstu, który oceniał każdy przebieg |
| `sources-manifest-2026-10-29.jsonl` | adresy, stan dostępu i skróty pobranych źródeł. Samych tekstów nie przechowujemy (to cudze utwory) |

Przebiegi: run1-first-drafts (pierwsze wersje poprawek), run2-second-round (druga runda), run3-verifier-03.4-14.7 i run4-verifier-03.4 (tylko weryfikator, po kolejnych poprawkach), run5-chapter14-partial i run6-chapters03-04-partial (przerwany przegląd pozostałych pozycji: rozdział 14, rozdziały 03 i 04). Raporty z przebiegów 1–4 powstały przy pomocy narzędzia Workflow w Claude Code, a 5–6 przerwano w trakcie. Skrypt orkiestracji tego narzędzia jest w `tools/pl/workflows/audit-items.js`; jest opcjonalny, bo `audit.mjs` robi to samo bez orkiestratora. run7 (2026-10-30): wznowiony przegląd wszystkich 32 opublikowanych pozycji; 45 raportów przejęto z wcześniejszych przebiegów, 70 napisano w świeżych sesjach agentów. To zapis historyczny. Nowy przebieg umieść w osobnym, jeszcze nieistniejącym katalogu; nie uruchamiaj ponownie run7 na zmienionej treści.

## Ograniczenia, o których trzeba pamiętać

- **Ślepota ról jest proceduralna.** Pakiet jest ślepy, a prompt zabrania otwierania innych plików, ale technicznie agent może je otworzyć. Dlatego każda rola ma raportować, co otworzyła, a przegląd człowieka go nie zastępuje.
- **Jeden przebieg weryfikatora nie jest deterministyczny** przy zdaniach granicznych: to samo zdanie dostało raz `partly`, raz `supported`. Stąd dwa przebiegi dla pozycji ryzykownych (lista: `node tools/pl/compare.mjs --risk`) i decyzja człowieka tam, gdzie się różnią.
- **FAIL oznacza „nic w czytelnych źródłach tego nie popiera”, nie „porada jest błędna”.** Wszystkie dotychczasowe FAIL-e wstępnego przeglądu to zalecenia bez oparcia w czytelnym źródle, najczęściej dlatego, że źródło było zablokowane. Żaden wiersz nie został uznany za sprzeczny ze źródłem.
- **Źródła nieczytelne dla skryptu** (stan z 2026-10-29) ograniczają przegląd bardziej niż jakość ról. Zablokowane: BMJ (03.18), Nature (03.2), Wiley (04.12), Apple Support (14.3, 14.4), Rzecznik Finansowy (14.4). Tylko metadane DOI: 03.5, 04.1, 04.2, 04.3, 04.4, 04.5, 04.7, 04.17, 04.18. Właściciel może dostarczyć teksty ręcznie; import ręczny nie jest jeszcze zaimplementowany (zob. FINDINGS.md).
- Role (`.claude/agents/*.md`) zostały dopracowane w trakcie prób na czterech pozycjach. Zmieniając je, zmieniasz kontrakt raportu, więc raporty starsze od zmiany mogą nie przechodzić nowych kontroli.
