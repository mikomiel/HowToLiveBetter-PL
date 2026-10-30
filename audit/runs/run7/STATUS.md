# Przebieg run7: stan na 2026-10-30

Przegląd wznowiony na polecenie właściciela (2026-10-30); run7 to nowy przebieg. Obejmuje teksty 32 opublikowanych porad z `book/pl` w stanie z `main` 754b21c (treść `book/` jest identyczna jak w 1a7f91e, na którym przygotowano przebieg). Źródła: pamięć podręczna odbudowana 2026-10-30 przez `node tools/pl/fetch.mjs --published`. Tekst żadnej porady nie został zmieniony.

Ten plik napisał agent AI (Claude Code) prowadzący przebieg, nie człowiek i nie skrypt. `digest.md` i `checks.txt` generują skrypty. Wszystkie raporty napisali agenci AI. Skrypty sprawdzają tylko formę raportu i zgodność cytatów z migawkami, nie poprawność merytoryczną. Żaden raport nie został sprawdzony przez człowieka ani przez eksperta dziedzinowego (lekarza, prawnika).

## Wynik kontroli skryptów (`audit.mjs status`, `check-reports.mjs`)

- 115 plików raportów, 112 przyjętych przez skrypty sprawdzające, 3 odrzucone (poniżej). Kod wyjścia `status` jest niezerowy, bo pozostały te 3 odrzucone raporty i różnice między przebiegami weryfikatora.
- 45 raportów przejęto z wcześniejszych przebiegów (`audit.mjs adopt`), 70 napisano w świeżych sesjach agentów, w tym ponowienia po odrzuceniu.
- 13 raportów (14.8, 14.9 `verifier-b`, 14.10, 14.12) nie powstało za pierwszym razem, bo agentom skończył się limit użycia; napisano je po jego odnowieniu.

## Trzy raporty odrzucone po trzech próbach (zgłoszenie właścicielowi, zgodnie z `audit/README.md`, krok 7)

Nie poprawiano ich ręcznie. Są w katalogu tak, jak je napisała rola, a `digest.md` je uwzględnia bez oznaczenia, więc czytaj je z tą wiedzą.

| Raport | Powód odrzucenia | Uwaga |
|---|---|---|
| 03.3 `verifier-a` | cytaty w twierdzeniach 8 i 9 nie są w wierszu 14 migawki `b6bab3851cebff29.txt`; liczby 48, 21, 38 poza cytatem | Skrypt przyjmuje cytat tylko od granicy słowa. Abstrakt w migawce ma sklejone nagłówki („ParticipantsA total of n = 48…”, „ResultsChronic restriction…”), więc cytat zaczynający się od „A total…” nie przechodzi. Opis roli tego nie mówi. Drugi przebieg (`verifier-b`) tej pozycji jest przyjęty. |
| 04.7 `adversary-a` | ustalenie 3 (atak `grade`, czyli zgodność litery A/B/C z rodzajem źródła): cytat nie znajduje się w wierszu 8 fragmentu oryginału | We wszystkich trzech próbach agent podał ten sam cytat i leży on w wierszu 8. Skrypt go odrzuca, bo wiersz jest po chińsku, a cytat zaczyna się w środku ciągu chińskich znaków, które reguła granicy słowa traktuje jak litery. To decyzja o skrypcie, jak przy 03.3, a nie o kolejnej próbie. |
| 04.12 `adversary-a` | status UNAVAILABLE nie zgadza się z ustaleniami, które dają PASS | Agent sam zauważył, że według opisu roli status UNAVAILABLE wynika z niepustej listy `attacks_not_assessable` (ataki to sprawdzenia, które wykonuje rola przeciwnika). Tu pełny tekst wydawcy jest zablokowany (HTTP 403) i dostępny jest tylko abstrakt, ale agent nie uznał żadnego ataku za niemożliwy do oceny. Wymaga decyzji o brzmieniu zasady w opisie roli, a nie kolejnej próby. |

## Różnice między dwoma przebiegami weryfikatora (decyduje człowiek)

Liczba różnic w nawiasie, szczegóły w `digest.md`: 03.2 (2), 03.8 (1), 03.18 (7), 03.26 (3), 03.27 (1), 04.9 (3), 14.1 (2), 14.2 (2), 14.4 (1), 14.6 (2), 14.9 (2), 14.10 (6), 14.12 (1). Przy 03.18 i 14.10 różnic jest najwięcej. `digest.md` pokazuje też jedną różnicę przy 03.3, ale liczy ją z odrzuconego raportu `verifier-a`, więc `audit.mjs status` jej nie zalicza i tu nie jest policzona.

## Granice tego przebiegu

- **Raport napisany bez zachowania ślepoty:** 03.5 `adversary-a`. Agent ponawiający przeczytał odrzucony raport pod ścieżką wyjściową, zanim napisał nowy, i sam to zapisał w `notes`. Skrypt go przyjął, ale to nie jest sesja bez wiedzy o wcześniejszej wersji. Z 14 ponowień pierwszej rundy 9 agentów napisało, że nie otwierało starego raportu, a 4 nie zgłosiło tego jednoznacznie w końcowej uwadze; ponowienia drugiej i trzeciej rundy dostały polecenie, by go nie otwierać.
- **Ślepota proceduralna:** agenci mieli ten sam dostęp do plików co zawsze. W przyjętych raportach zapisano odstępstwa: 04.3 `adversary-a` raz użył w powłoce polecenia `ls` na katalogu głównym repozytorium, a 04.1, 04.5 i 14.2 `adversary-a` oraz 14.3 `verifier-b` użyli Glob do wylistowania nazw plików. Według własnych zapisków żaden z nich nie otworzył pliku spoza dozwolonego zbioru. Kilku agentów zgłosiło też, że czytali `README.md` z katalogu głównego szerzej niż sekcję „Jak czytać dowody”.
- **Źródła:** FAIL oznacza „nic w czytelnych źródłach tego nie popiera”, nie „porada jest błędna”. UNAVAILABLE oznacza „z czytelnych źródeł nie da się tego rozstrzygnąć” (źródło zablokowane, tylko abstrakt lub metadane albo czytelne źródło potwierdza twierdzenie tylko częściowo), a nie „niepotwierdzona” ani „błędna”. Wiele wyników UNAVAILABLE i FAIL wynika z zablokowanych źródeł (Nature, BMJ, Wiley, Apple, Rzecznik Finansowy), z DOI, dla których skrypt widzi tylko metadane, i z twierdzeń, które czytelne źródło potwierdza tylko częściowo. Blokad nie obchodzono.
- **Niejasności w opisach ról** powtarzają się w uwagach agentów: znaczenie `fallback_stated` dla działań bezwarunkowych, nadawanie `id` ustaleniom o polach spoza `packet.propositions` (Zmiany w adaptacji, Źródła), pytanie, czy wynik „uruchomiono, nic nie znaleziono” dla ataku `recency` (aktualność źródła) przy jednej migawce wymusza UNAVAILABLE, oraz język pól `why` i `fix_direction`. To sprawa do decyzji właściciela o opisach ról; zmiana opisu zmienia kontrakt raportu, więc starsze raporty mogą przestać przechodzić.
- **Redaktor:** wszystkie 32 raporty redaktora mają werdykt `needs_edits`. To propozycje poprawek językowych (kalki, terminy, tytuły, rejestr, spójność), a nie ocena dowodów; żadna nie została zastosowana. Zmiana tekstu w `book/pl` wymaga decyzji właściciela i osobnego commita „draft: … (for owner review)”.

## Co dalej (czeka na właściciela)

1. Decyzja, co zrobić z trzema odrzuconymi raportami (osobna decyzja o zasadzie UNAVAILABLE z 04.12) i czy poprawić opisy ról.
2. Rozstrzygnięcie różnic z listy wyżej.
3. Które propozycje redaktora i ustalenia przeciwnika wprowadzić do tekstu (kontynuacja sekcji B i C w `audit/FINDINGS.md`).
