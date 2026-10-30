# Przegląd opublikowanych porad: stan prac i wznowienie

Stan na 2026-10-30. Przegląd był wstrzymany na prośbę właściciela, który wznowił go 2026-10-30. Przebieg run7 jest przeprowadzony, ale niepełny: 112 z 115 raportów przeszło kontrolę skryptów (sprawdzają formę i cytaty, nie zastępują oceny człowieka), 3 odrzucono po trzech próbach. Wyniki i sprawy czekające na właściciela: [runs/run7/STATUS.md](runs/run7/STATUS.md). Dalsze przebiegi i wszelkie zmiany tekstu wymagają polecenia właściciela.

Ten katalog zawiera wszystko, co potrzebne do kontynuacji w dowolnym narzędziu (Codex, Claude Code, inne): raporty z dotychczasowych przebiegów, wykaz źródeł i opis kroków. Nic tu nie zależy od konkretnego agenta. Skrypty są w Node, role to zwykłe pliki Markdown, a sprawdzanie raportów robią skrypty, nie model.

Decyzje właściciela i te, które jeszcze czekają, są w [FINDINGS.md](FINDINGS.md). Zasady redakcyjne i dowodowe są w [AGENTS.md](../AGENTS.md), który jest jedynym kanonicznym dokumentem instrukcji.

## Prompt dla nowego agenta

> Przeczytaj AGENTS.md, a potem audit/README.md i audit/FINDINGS.md. Wznów przegląd według sekcji „Kroki wznowienia”. Nie zmieniaj tekstu w book/pl, nie scalaj i nie twórz PR bez zgody właściciela. Raportuj kontrole jako PASS, FAIL, NOT_RUN lub UNAVAILABLE i podaj testowany commit.

## Kroki wznowienia

Wszystkie polecenia uruchamiaj w katalogu głównym repozytorium.

1. **Środowisko.** `npm ci --ignore-scripts`, potem `npm test`. Wszystkie testy powinny przejść. Potrzebny jest Node 22.21 lub nowszy (przy proxy: opcja `--use-env-proxy`, skrypt `fetch.mjs` dodaje ją sam).
2. **Źródła.** Katalog `.cache/` jest ignorowany przez git i znika razem ze środowiskiem. Odbuduj go jednym poleceniem: `node tools/pl/fetch.mjs --published` (około 56 pobrań, kilka minut, potrzebny dostęp HTTPS m.in. do doi.org, api.crossref.org, www.ebi.ac.uk, pmc.ncbi.nlm.nih.gov, wiedza.cert.pl, support.google.com, uodo.gov.pl). Serwisy, które blokują skrypty, są zapisywane jako zablokowane; blokad nie obchodzimy. Odbudowa z 2026-10-29 dała te same teksty co przebieg przeglądu w 55 z 56 przypadków, a jedno źródło (PMC7853203 przy 03.26) przestało być zablokowane. Skrót każdego źródła z tamtego dnia jest w [sources-manifest-2026-10-29.jsonl](sources-manifest-2026-10-29.jsonl).
3. **Nowy przebieg.** `node tools/pl/audit.mjs prepare audit/runs/run7 --published`. Powstają pakiety dla ról, prompt dla każdego raportu i `plan.json` z odciskiem tekstu każdej porady. Pozycje zdrowotne, prawne, finansowe, dotyczące bezpieczeństwa i kont dostają dwa niezależne przebiegi weryfikatora (`verifier-a`, `verifier-b`), pozostałe jeden.
4. **Przejęcie ważnych raportów.** Od najnowszego przebiegu do najstarszego:
   `node tools/pl/audit.mjs adopt audit/runs/run7 audit/runs/run6-chapters03-04-partial`, potem `run5-chapter14-partial`, `run4-verifier-03.4`, `run3-verifier-03.4-14.7`, `run2-second-round`. Skrypt kopiuje tylko raporty, które przechodzą swoje skrypty sprawdzające, a tekst porady, który oceniały, jest nadal tekstem tej porady. Resztę pomija i podaje powód. Wersję tekstu danego przebiegu zapisuje [runs/runs.json](runs/runs.json).
5. **Co zostało.** `node tools/pl/audit.mjs status audit/runs/run7` wypisuje brakujące, odrzucone i nieaktualne raporty oraz różnice między dwoma przebiegami weryfikatora. Kod wyjścia 0 oznacza, że nic nie zostało.
6. **Uruchomienie roli.** Dla każdego brakującego raportu daj plik `audit/runs/run7/<N.M>/prompt-<rola>-<przebieg>.md` **osobnej, świeżej sesji** dowolnego agenta (rola nie może widzieć innych raportów ani wersji roboczej tekstu) i zapisz wynik jako JSON pod ścieżką, którą podaje prompt. Role są opisane w `.claude/agents/pl-source-verifier.md`, `pl-claim-adversary.md` i `pl-language-editor.md`; to zwykłe pliki Markdown, front matter można pominąć. Rola ma tylko czytać pliki i zapisać jeden raport: bez sieci, bez powłoki, bez skryptów.
7. **Sprawdzenie i ponowienie.** Po zapisaniu raportów uruchom `status` jeszcze raz. Odrzucony raport: `node tools/pl/audit.mjs retry audit/runs/run7 <N.M> <rola>-<przebieg>` wypisuje prompt z listą błędów; daj go tej samej roli w nowej, świeżej sesji. Raportu nie poprawia się ręcznie. Po trzech nieudanych próbach zgłoś to właścicielowi.
8. **Zebranie wyników.** Gdy `status` pokazuje „Nothing left to run”: `node tools/pl/digest.mjs audit/runs/run7 > audit/runs/run7/digest.md`. Digest wylicza statusy z werdyktów i niczego sam nie ocenia. Zacommituj `audit/runs/run7` i przedstaw właścicielowi.
9. **Zmiany w tekście.** Dopiero po decyzji właściciela, w osobnym commicie „draft: … (for owner review)”, jeden autor zapisuje. Po zmianie uruchom `npm test`, `node tools/pl/lint.mjs` i `npm run test:browser`, a zmienione pozycje przejdź ponownie weryfikatorem (`audit.mjs prepare` na nowym katalogu tylko dla tych pozycji).

Przegląd PR musi dotyczyć dokładnego opublikowanego HEAD. Nie scalaj PR, nie publikuj wydań i nie włączaj GitHub Pages bez osobnej zgody właściciela.

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

Przebiegi: run1 (pierwsze wersje poprawek), run2 (druga runda), run3 i run4 (tylko weryfikator, po kolejnych poprawkach), run5 i run6 (przerwany przegląd pozostałych pozycji: rozdział 14, rozdziały 03 i 04). Raporty z przebiegów 1–4 powstały przy pomocy narzędzia Workflow w Claude Code, a 5–6 przerwano w trakcie. Skrypt orkiestracji tego narzędzia jest w `tools/pl/workflows/audit-items.js`; jest opcjonalny, bo `audit.mjs` robi to samo bez orkiestratora. run7 (2026-10-30): wznowiony przegląd wszystkich 32 opublikowanych pozycji; 45 raportów przejęto z wcześniejszych przebiegów, 70 napisano w świeżych sesjach agentów. Kroki powyżej opisują, jak go przygotowano; kolejny przebieg nazwij run8.

## Ograniczenia, o których trzeba pamiętać

- **Ślepota ról jest proceduralna.** Pakiet jest ślepy, a prompt zabrania otwierania innych plików, ale technicznie agent może je otworzyć. Dlatego każda rola ma raportować, co otworzyła, a przegląd człowieka go nie zastępuje.
- **Jeden przebieg weryfikatora nie jest deterministyczny** przy zdaniach granicznych: to samo zdanie dostało raz `partly`, raz `supported`. Stąd dwa przebiegi dla pozycji ryzykownych (lista: `node tools/pl/compare.mjs --risk`) i decyzja człowieka tam, gdzie się różnią.
- **FAIL oznacza „nic w czytelnych źródłach tego nie popiera”, nie „porada jest błędna”.** Wszystkie dotychczasowe FAIL-e wstępnego przeglądu to zalecenia bez oparcia w czytelnym źródle, najczęściej dlatego, że źródło było zablokowane. Żaden wiersz nie został uznany za sprzeczny ze źródłem.
- **Źródła nieczytelne dla skryptu** (stan z 2026-10-29) ograniczają przegląd bardziej niż jakość ról. Zablokowane: BMJ (03.18), Nature (03.2), Wiley (04.12), Apple Support (14.3, 14.4), Rzecznik Finansowy (14.4). Tylko metadane DOI: 03.5, 04.1, 04.2, 04.3, 04.4, 04.5, 04.7, 04.17, 04.18. Właściciel może dostarczyć teksty ręcznie; import ręczny nie jest jeszcze zaimplementowany (zob. FINDINGS.md).
- Role (`.claude/agents/*.md`) zostały dopracowane w trakcie prób na czterech pozycjach. Zmieniając je, zmieniasz kontrakt raportu, więc raporty starsze od zmiany mogą nie przechodzić nowych kontroli.
