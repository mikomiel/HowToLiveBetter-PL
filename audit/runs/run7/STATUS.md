# Przebieg run7: stan na 2026-10-30

Wznowiony na polecenie właściciela (2026-10-30). Ocenia teksty 32 opublikowanych porad z `book/pl` w stanie z `main` 754b21c (treść `book/` jest identyczna jak w 1a7f91e, na którym przygotowano przebieg). Źródła: pamięć podręczna odbudowana 2026-10-30 przez `node tools/pl/fetch.mjs --published`. Tekst żadnej porady nie został zmieniony.

Ten plik pisała osoba prowadząca przebieg, nie skrypt. `digest.md` i `checks.txt` generują skrypty.

## Wynik kontroli skryptów (`audit.mjs status`, `check-reports.mjs`)

- 115 plików raportów, 112 przyjętych przez swoje skrypty, 3 odrzucone (poniżej). Kod wyjścia `status` jest niezerowy, bo zostały te 3 odrzucenia i różnice między przebiegami weryfikatora.
- 45 raportów przejęto z wcześniejszych przebiegów (`audit.mjs adopt`), 70 napisano w świeżych sesjach agentów, w tym ponowienia po odrzuceniu.
- 13 raportów (14.8, 14.9 verifier-b, 14.10, 14.12) nie powstało za pierwszym razem, bo agenci trafili na limit użycia; napisano je po jego odnowieniu.

## Trzy raporty odrzucone po trzech próbach (zgłoszenie do właściciela, zgodnie z README, krok 7)

Nie poprawiano ich ręcznie. Są w katalogu tak, jak je napisała rola, i `digest.md` je uwzględnia bez oznaczenia, więc czytaj je z tą wiedzą.

| Raport | Powód odrzucenia | Uwaga |
|---|---|---|
| 03.3 verifier-a | cytaty w twierdzeniach 8 i 9 nie są w wierszu 14 migawki `b6bab3851cebff29.txt`; liczby 48, 21, 38 poza cytatem | Skrypt przyjmuje cytat tylko od granicy słowa. Abstrakt w migawce ma sklejone nagłówki („ParticipantsA total of n = 48…”, „ResultsChronic restriction…”), więc cytat zaczynający się od „A total…” nie przechodzi. Opis roli tego nie mówi. Drugi przebieg (verifier-b) tej pozycji jest przyjęty. |
| 04.7 adversary-a | ustalenie 3 (grade): cytat nie leży w wierszu 8 fragmentu oryginału | Za każdym razem inny cytat w tym samym ustaleniu. |
| 04.12 adversary-a | status UNAVAILABLE nie zgadza się z ustaleniami, które dają PASS | Agent sam zgłosił, że opis roli łączy UNAVAILABLE z listą `attacks_not_assessable`, a tu pełny tekst wydawcy jest zablokowany (HTTP 403) i dostępny jest tylko abstrakt, ale żaden atak nie został uznany za niemożliwy do oceny. Wymaga decyzji o tym, jak ma brzmieć zasada, nie kolejnej próby. |

## Różnice między dwoma przebiegami weryfikatora (decyduje człowiek)

Liczba różnic w nawiasie, szczegóły w `digest.md`: 03.2 (2), 03.8 (1), 03.18 (7), 03.26 (3), 03.27 (1), 04.9 (3), 14.1 (2), 14.2 (2), 14.4 (1), 14.6 (2), 14.9 (2), 14.10 (6), 14.12 (1). Przy 03.18 i 14.10 różnic jest najwięcej. `digest.md` pokazuje też jedną różnicę przy 03.3, ale liczy ją z odrzuconego raportu verifier-a, więc `audit.mjs status` jej nie zalicza i tu nie jest policzona.

## Granice tego przebiegu

- **Raport nie napisany ślepo:** 03.5 adversary-a. Agent ponawiający przeczytał odrzucony raport pod ścieżką wyjściową, zanim napisał nowy, i sam to zapisał w `notes`. Skrypt go przyjął, ale to nie jest sesja bez wiedzy o wcześniejszej wersji. Z 14 ponowień pierwszej rundy 9 agentów napisało, że nie otwierało starego raportu, a 4 nie zgłosiło tego jednoznacznie w końcowej uwadze; ponowienia drugiej i trzeciej rundy dostały polecenie, by go nie otwierać.
- **Ślepota proceduralna:** agenci mieli ten sam dostęp do plików co zawsze. 03.4 adversary-a (pierwsza próba) zgłosił, że raz użył `ls` w powłoce na katalogu pozycji (pokazało nazwy plików, nie ich treść). Kilku agentów zgłosiło też, że czytali `README.md` szerzej niż sekcję „Jak czytać dowody”.
- **Źródła:** FAIL oznacza „nic w czytelnych źródłach tego nie popiera”, nie „porada jest błędna”. Wiele wyników UNAVAILABLE i FAIL wynika z zablokowanych źródeł (Nature, BMJ, Wiley, Apple, Rzecznik Finansowy) i z DOI, dla których skrypt widzi tylko metadane. Blokad nie obchodzono.
- **Niejasności w opisach ról** powtarzają się w uwagach agentów: znaczenie `fallback_stated` dla działań bezwarunkowych, nadawanie `id` ustaleniom o polach spoza `packet.propositions` (Zmiany w adaptacji, Źródła), czy wynik „uruchomiono, nic nie znaleziono” dla ataku recency przy jednej migawce wymusza UNAVAILABLE, oraz język pól `why` i `fix_direction`. To sprawa do decyzji właściciela o opisach ról; zmiana opisu zmienia kontrakt raportu, więc starsze raporty mogą przestać przechodzić.
- **Redaktor:** wszystkie 32 raporty redaktora mają werdykt `needs_edits`. To propozycje, żadna nie została zastosowana. Zmiana tekstu w `book/pl` wymaga decyzji właściciela i osobnego commita „draft: … (for owner review)”.

## Co dalej (czeka na właściciela)

1. Decyzja, co zrobić z trzema odrzuconymi raportami (osobna decyzja dla zasady UNAVAILABLE z 04.12) i czy poprawić opisy ról.
2. Rozstrzygnięcie różnic z listy wyżej.
3. Które propozycje redaktora i ustalenia przeciwnika przejść do tekstu (kontynuacja sekcji B i C w `audit/FINDINGS.md`).
