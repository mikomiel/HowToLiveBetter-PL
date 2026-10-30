# Przebieg run7: stan na 2026-10-30

Przegląd wznowiony na polecenie właściciela (2026-10-30); run7 to nowy przebieg. Obejmuje teksty 32 opublikowanych porad z `book/pl` w stanie z `main` 754b21c (treść `book/` jest identyczna jak w 1a7f91e, na którym przygotowano przebieg). Źródła: pamięć podręczna odbudowana 2026-10-30 przez `node tools/pl/fetch.mjs --published`. Tekst żadnej porady nie został zmieniony.

Ten plik napisał agent AI (Claude Code) prowadzący przebieg, nie człowiek i nie skrypt. `digest.md` i `checks.txt` generują skrypty. Wszystkie raporty napisali agenci AI. Skrypty sprawdzają tylko formę raportu i zgodność cytatów z migawkami, nie poprawność merytoryczną. Żaden raport nie został sprawdzony przez człowieka ani przez eksperta dziedzinowego (lekarza, prawnika).

## Wynik kontroli skryptów (`audit.mjs status`, `check-reports.mjs`)

- 115 plików raportów, wszystkie 115 przyjęte przez skrypty sprawdzające. Trzy raporty, które wcześniej odrzucono po trzech próbach, opisuje następna sekcja. Kod wyjścia `status` jest niezerowy, bo zostały różnice między przebiegami weryfikatora.
- 45 raportów przejęto z wcześniejszych przebiegów (`audit.mjs adopt`), 70 napisano w świeżych sesjach agentów, w tym ponowienia po odrzuceniu.
- 13 raportów (14.8, 14.9 `verifier-b`, 14.10, 14.12) nie powstało za pierwszym razem, bo agentom skończył się limit użycia; napisano je po jego odnowieniu.

## Trzy raporty odrzucone po trzech próbach i co z nimi zrobiono

Po trzech nieudanych próbach te raporty zgłoszono właścicielowi (`audit/README.md`, krok 7). Właściciel zdecydował 2026-10-30, że opisy ról i skrypt mają zostać poprawione, a raporty napisane na nowo. Poprawki są w tym samym PR: `tools/pl/quotes.mjs`, `pl-source-verifier.md` i `pl-claim-adversary.md`. Żaden raport nie został poprawiony ręcznie; nowe napisały świeże sesje agentów.

| Raport | Przyczyna odrzucenia | Co zrobiono |
|---|---|---|
| 03.3 `verifier-a` | cytaty zaczynały się od „A total…” sklejonego w migawce z nagłówkiem („ParticipantsA total of n = 48…”), a skrypt przyjmuje cytat tylko od granicy słowa; opis roli tego nie mówił | Opis roli podaje regułę granicy słowa i przypadek sklejonego nagłówka, a komunikat skryptu mówi, gdzie cytat zaczyna się w środku słowa. Odrzucony plik usunięto z drzewa (historia git go zachowuje), żeby świeży agent go nie zobaczył, i raport napisano od nowa. |
| 04.7 `adversary-a` | cytat z wiersza 8 oryginału zaczynał się w środku ciągu chińskich znaków, które reguła granicy słowa traktowała jak litery | Błąd był w skrypcie: pismo chińskie nie ma spacji, więc znak Han nie jest już znakiem słowa. Ten sam raport, bez zmian, przechodzi teraz kontrolę. |
| 04.12 `adversary-a` | status UNAVAILABLE nie zgadzał się z ustaleniami, które dawały PASS | Opis roli przeciwnika zawierał dwa sprzeczne zdania o statusie. Teraz mówi, że status jest wyprowadzany mechanicznie (FAIL przy blokerze, UNAVAILABLE tylko przy niepustym `attacks_not_assessable`, w pozostałych przypadkach PASS), a komunikat skryptu przypomina tę regułę. Raport napisano od nowa. |

Wszystkie 115 raportów sprawdzono ponownie nowymi regułami: żaden raport przyjęty wcześniej nie jest teraz odrzucany. Dwie nowe sesje zgłosiły odstępstwa: agent 03.3 `verifier-a` napisał, że narzędzie zapisu odmówiło nadpisania istniejącego pliku bez wcześniejszego odczytu (dlatego plik usunięto i uruchomiono agenta jeszcze raz), a agent 04.12 `adversary-a` raz odczytał ścieżkę wyjściową z przesunięciem poza koniec pliku, co zwróciło tylko ostrzeżenie bez treści; zapisał to w `notes`.

## Różnice między dwoma przebiegami weryfikatora (decyduje człowiek)

Liczba różnic w nawiasie, szczegóły w `digest.md`: 03.2 (2), 03.3 (1), 03.8 (1), 03.18 (7), 03.26 (3), 03.27 (1), 04.9 (3), 14.1 (2), 14.2 (2), 14.4 (1), 14.6 (2), 14.9 (2), 14.10 (6), 14.12 (1). Przy 03.18 i 14.10 różnic jest najwięcej. Różnice przy 03.3 wynikają z nowego raportu `verifier-a`.

## Granice tego przebiegu

- **Raport napisany bez zachowania ślepoty:** 03.5 `adversary-a`. Agent ponawiający przeczytał odrzucony raport pod ścieżką wyjściową, zanim napisał nowy, i sam to zapisał w `notes`. Skrypt go przyjął, ale to nie jest sesja bez wiedzy o wcześniejszej wersji. Z 14 ponowień pierwszej rundy 9 agentów napisało, że nie otwierało starego raportu, a 4 nie zgłosiło tego jednoznacznie w końcowej uwadze; ponowienia drugiej i trzeciej rundy dostały polecenie, by go nie otwierać.
- **Ślepota proceduralna:** agenci mieli ten sam dostęp do plików co zawsze. W przyjętych raportach zapisano odstępstwa: 04.3 `adversary-a` raz użył w powłoce polecenia `ls` na katalogu głównym repozytorium, a 04.1, 04.5 i 14.2 `adversary-a` oraz 14.3 `verifier-b` użyli Glob do wylistowania nazw plików. Według własnych zapisków żaden z nich nie otworzył pliku spoza dozwolonego zbioru. Kilku agentów zgłosiło też, że czytali `README.md` z katalogu głównego szerzej niż sekcję „Jak czytać dowody”.
- **Źródła:** FAIL oznacza „nic w czytelnych źródłach tego nie popiera”, nie „porada jest błędna”. UNAVAILABLE oznacza „z czytelnych źródeł nie da się tego rozstrzygnąć” (źródło zablokowane, tylko abstrakt lub metadane albo czytelne źródło potwierdza twierdzenie tylko częściowo), a nie „niepotwierdzona” ani „błędna”. Wiele wyników UNAVAILABLE i FAIL wynika z zablokowanych źródeł (Nature, BMJ, Wiley, Apple, Rzecznik Finansowy), z DOI, dla których skrypt widzi tylko metadane, i z twierdzeń, które czytelne źródło potwierdza tylko częściowo. Blokad nie obchodzono.
- **Niejasności w opisach ról** powtarzają się w uwagach agentów: znaczenie `fallback_stated` dla działań bezwarunkowych, nadawanie `id` ustaleniom o polach spoza `packet.propositions` (Zmiany w adaptacji, Źródła), pytanie, czy wynik „uruchomiono, nic nie znaleziono” dla ataku `recency` (aktualność źródła) przy jednej migawce wymusza UNAVAILABLE, oraz język pól `why` i `fix_direction`. To sprawa do decyzji właściciela o opisach ról; zmiana opisu zmienia kontrakt raportu, więc starsze raporty mogą przestać przechodzić.
- **Redaktor:** wszystkie 32 raporty redaktora mają werdykt `needs_edits`. To propozycje poprawek językowych (kalki, terminy, tytuły, rejestr, spójność), a nie ocena dowodów; żadna nie została zastosowana. Zmiana tekstu w `book/pl` wymaga decyzji właściciela i osobnego commita „draft: … (for owner review)”.

## Co dalej (czeka na właściciela)

1. Rozstrzygnięcie różnic z listy wyżej (właściciel rozstrzyga je po kolei; decyzje zapisuje `audit/FINDINGS.md`).
2. Które z 24 propozycji redaktora, wymagających ponownej weryfikacji (na 121), i które ustalenia przeciwnika wprowadzić do tekstu (kontynuacja sekcji B i C w `audit/FINDINGS.md`). Edycje wyłącznie językowe są w osobnym PR.
