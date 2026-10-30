# Ustalenia i decyzje czekające na właściciela

Stan na 2026-10-29. Dowody (raporty) są w [runs/](runs/). Jak wznowić przegląd: [README.md](README.md).

## Decyzje właściciela

- **2026-10-30: rozstrzygnięto różnice między dwoma przebiegami weryfikatora w run7** (13 pozycji i 03.3, sekcja F poniżej). Zdania, których nie zawiera żadne czytelne źródło, dostały oznaczenie „Propozycja redakcji:”, zdanie o numerze 112 w 03.18 zawężono do źródła, a w 03.3 zawężono wzmiankę o losowym przydziale. Poprawki są w osobnych commitach „draft: … (for owner review)”.
- **2026-10-30: właściciel wznowił przegląd.** Wykonano przebieg run7 na wszystkich 32 opublikowanych pozycjach. Wyniki i otwarte sprawy (trzy odrzucone raporty, różnice między przebiegami weryfikatora, propozycje redaktora): [runs/run7/STATUS.md](runs/run7/STATUS.md). Tekst książki nie został zmieniony.
- **2026-10-29: przyjęto wszystkie poprawki z sekcji A** (03.4, 04.4, 14.2, 14.7) oraz zastrzeżenie o braku przeglądu prawnika w 14.7, 14.8 i 14.9. Commity nazwane „draft: … (for owner review)” zostają w historii pod tą nazwą, bo historii nie przepisujemy. Status `verified` pozostał bez zmian. Każdą poprawkę nadal da się cofnąć osobno.
- **2026-10-29: dopisano wskaźnik do tego przeglądu w AGENTS.md** (jedno zdanie w „Zakres i źródła”), za zgodą właściciela.
- Wcześniej tego dnia: ustalenia dotyczące opublikowanych pozycji mają trafiać do poprawek do przeglądu, nie do zmian bez wiedzy właściciela; dwa niezależne przebiegi weryfikatora dla pozycji ryzykownych; następny etap to dokończenie przeglądu wszystkich 32 pozycji (obecnie wstrzymane); zastrzeżenie przy pozycjach prawnych zostaje.
- Nadal otwarte: sekcje B, C, D i E poniżej.

## A. Poprawki w opublikowanych poradach (do przyjęcia, zmiany lub odrzucenia)

Ślepa weryfikacja (osobna rola bez dostępu do tekstu roboczego) znalazła zdania, których zapisane źródła nie potwierdzają. Poprawki zawężają je do tego, co źródło mówi, a w polach Weryfikacja i Zmiany w adaptacji zapisano, co sprawdzono i dlaczego zmieniono. Każdą poprawkę można cofnąć osobno: `git revert` odpowiedniego commita albo ręcznie.

| Pozycja | Problem znaleziony | Poprawka (commit) | Wynik ślepej weryfikacji po poprawce |
|---|---|---|---|
| 03.4 | Abstrakt metaanalizy nie mówi, że 8,8 godziny to wynik „modelu”, nie opisuje zależności wielkości efektu od dawki i pory ani wrażliwości indywidualnej; tytuł przeciwstawiał „jedną godzinę dla wszystkich”, czego żadne źródło nie mówi | Usunięto te twierdzenia, podano odstępy 6, 8,8 i 13,2 godziny z ich źródeł, krok samoobserwacji oznaczono „Propozycja redakcji”; Weryfikacja mówi, że czytano tylko abstrakt (9800901, bc2b7b8, 518c3b3, 1173be1) | dwa przebiegi UNAVAILABLE, zgodne; jedyny otwarty wiersz to krok „Propozycja redakcji”, którego żadne źródło nie zaleca |
| 04.4 | W badaniu 4 warunek samego przypominania dotyczył wcześniejszych podobnych zadań kończonych zwykle ok. dnia przed terminem, nie „opóźnienia”; krok „zapisz, co jest teraz inne” nie jest tym, o co proszono uczestników | Zdanie opisuje to, co przypominano; krok to powiązanie wcześniejszego zadania z planowanym, jak w badaniu (9800901, bc2b7b8) | PASS (jeden przebieg, pozycja niskiego ryzyka) |
| 14.2 | „Przygotuj odzyskiwanie konta” nie ma oparcia: strona CERT Polska mówi o kodach zapasowych 2FA; „zespół reagowania” nie jest w źródle; pierwsza poprawka pominęła hasło główne menedżera | Hasło główne z losowych słów, drugi składnik logowania, kody zapasowe; opis źródła zgodny ze stroną (9800901, bc2b7b8) | dwa przebiegi PASS |
| 14.7 | Wniosek, że uprawnienie systemowe nie jest automatycznie zgodą RODO, nie wynika z żadnego cytowanego źródła; „Dokumentacja Androida” to strona pomocy; tytuł dzielił „wymagane” od „dodatkowych” | Wniosek jest opisany jako zestawienie redakcji, art. 4 pkt 11 dodany do źródeł, zdanie o art. 7 ust. 4 wierniejsze tekstowi, tytuł jako czynność (9800901, bc2b7b8, 518c3b3) | dwa przebiegi PASS |
| 14.7, 14.8, 14.9 | Prawa z RODO podane bez przeglądu prawnika | Dodano zdanie „nie jest poradą prawną i nie miał przeglądu prawnika”; Weryfikacja i Status 14.8 i 14.9 bez zmian | nie dotyczy |

Decyzja podjęta: przyjęto wszystkie. Otwarty wiersz 03.4 (krok „Propozycja redakcji”, którego żadne źródło nie zaleca) zostaje w tekście jako oznaczona sugestia redakcji, dopóki właściciel nie zdecyduje inaczej.

## B. Ustalenia przeciwnika o treści, która już była w książce (nie poprawiałem)

Przeciwnik (rola szukająca uproszczeń, utraconych rozwiązań zastępczych i nadinterpretacji) nie znalazł blokerów w czterech poprawianych pozycjach, ale zgłosił:

1. **04.4, ważne:** manipulacja w badaniu 4 miała kilka kroków (data wyliczona z własnego typowego tempa i pisemny scenariusz przeszkód), a badanie nie rozdziela ich skutków; autorzy piszą, że nie mają jeszcze przekonujących dowodów, że przypominanie własnych czasów poprawia dokładność szacunków, i że szacunki oparte na typowych dawnych czasach byłyby zbyt pesymistyczne. Proponowany kierunek: dopisać to do Ograniczeń i opisać korzyść jako wynik całej procedury.
2. **14.2, ważne:** pominięto rozwiązanie zastępcze „wbudowany w przeglądarkę menedżer haseł”, które strona CERT Polska nazywa „prostym i dobrym rozwiązaniem”. Czytelnik, który nie chce osobnego produktu, nie ma opisanego prostego startu.
3. Mniejsze uwagi (na dokładnych cytatach w `runs/run2-second-round/<N.M>/adversary-a.json`): m.in. brak następnego kroku po nieskutecznej zmianie nawyku kofeinowego (03.4), brak ścieżki „zezwól tylko tym razem” przy uprawnieniach (14.7). Uwagę o tym, że źródłem jest tylko Android, uwzględniono w poprawce 14.7.

Decyzja: które z tych uwag włączyć do tekstu.

## C. Ustalenia językowe dla całej książki (redaktor)

- **Objaśnianie terminów przy pierwszym użyciu.** W tekście dla czytelnika „NHS” występuje w trzech opublikowanych pozycjach (03.2, 03.3, 03.4), a „metaanaliza” w trzech (03.4, 03.18, 03.23). Redaktor zgłasza, że żaden z tych terminów nie jest objaśniony przy pierwszym użyciu w pozycji. Pozycje czyta się osobno, więc potrzebna jest zasada: objaśnienie w każdej pozycji, czy raz na rozdział.
- **„To szacunek redakcji”** (04.1, 04.2, 04.4) a „To ocena redakcji” (w pozostałych): redaktor proponuje „oszacowanie”. To drobna niespójność, nie błąd.
- Redaktor proponuje też „Oddziel” zamiast „Rozdziel” (14.7) i „Cofnij” zamiast „Odbierz” (uprawnienia). To kwestia gustu.

## D. Wstępne wyniki przerwanego przeglądu pozostałych pozycji (niesprawdzone przez człowieka)

11 z 28 pozycji ma pierwsze raporty (patrz README). Wszystkie wiersze o statusie FAIL to zalecenia bez oparcia w czytelnych źródłach. Żaden nie jest sprzeczny ze źródłem:

- **14.1:** „Nie zatwierdzaj logowania, którego nie rozpoczynasz.”
- **14.3:** „Nie zgaduj kodu początkowego ani PUK.” (oba przebiegi; strona Apple jest zablokowana)
- **14.4:** kontakt z bankiem (strona Rzecznika Finansowego zablokowana), zgłoszenie kradzieży policji, kolejność zgłoszeń.
- **03.2:** „Nie traktuj regularności jako powodu do celowego niedosypiania.” oraz „Praca zmianowa, choroby i opieka nad bliskimi wymagają innego planowania.”
- **03.5:** „Dopasuj rytm do obowiązków…”; dla tej pozycji skrypt widzi tylko metadane DOI.

Wiele z tych zaleceń to zdrowy rozsądek i może zostać jako oznaczone „Propozycja redakcji”, jak w 03.4. To decyzja redakcyjna właściciela.

## E. Czego brakuje do dalszej pracy

1. **Czytelne źródła.** Zablokowane są BMJ, Nature, Wiley, Apple Support i Rzecznik Finansowy, a dla dziewięciu DOI (03.5, 04.1, 04.2, 04.3, 04.4, 04.5, 04.7, 04.17, 04.18) widzimy tylko metadane. Możliwości: (a) właściciel zapisuje tekst strony lub PDF i wskazuje, gdzie go umieścić; wymaga to dopisania importu ręcznego, który zapisze migawkę z adnotacją „ręcznie dostarczone”, (b) klucz OpenAlex dla prac psychologicznych z rozdziału 04, (c) pominięcie tych pozycji w przeglądzie z adnotacją „źródło niedostępne”.
2. **Recenzenci dziedzinowi** (lekarz, prawnik, osoba znająca podatki i świadczenia) dla pozycji o dużym ryzyku. Bez nich takie pozycje pozostają „sprawdzone maszynowo”, nie „zatwierdzone przez eksperta”. Sformułowania w książce i panelu stanu powinny to odróżniać.
3. **Zakres.** Rozdziały 03, 04 i 14 to uzgodniony zakres. Szersza próba (20–30 pozycji z innych rozdziałów) wymaga zgody właściciela.
4. ~~Wskaźnik w AGENTS.md~~ Zrobione 2026-10-29 za zgodą właściciela: AGENTS.md odsyła do audit/README.md i audit/FINDINGS.md, więc nowa sesja w Codex lub Claude Code dowie się o wstrzymanym przeglądzie sama.
5. **Komu wolno wznowić.** Przegląd jest wstrzymany na prośbę właściciela, więc wznowienie wymaga jego polecenia.

## F. Decyzje właściciela o różnicach przebiegu run7 (2026-10-30)

Dwa przebiegi weryfikatora różniły się przy 14 pozycjach (33 wiersze plus jeden w 03.3). Żadne zdanie nie jest sprzeczne ze źródłem; różnice dotyczą tego, czy zdanie jest poradą redakcji, czy twierdzeniem o źródle, i jak surowo je czytać. Szczegóły są w [runs/run7/digest.md](runs/run7/digest.md).

| Pozycja | Decyzja właściciela | Skutek w tekście |
|---|---|---|
| 03.2 | oznaczyć oba zdania jako propozycje redakcji | „Nie traktuj regularności…” (W praktyce) i „Praca zmianowa, choroby…” (Ograniczenia) |
| 03.3 | zawęzić wzmiankę o losowym przydziale | Ocena dowodów: losowy przydział do 4, 6 lub 8 godzin opisano tylko dla eksperymentu z ograniczaniem snu |
| 03.8 | oznaczyć zdanie o jednej godzinie | „Nie traktuj jednej godziny…” jako propozycja redakcji |
| 03.18 | oznaczyć i zawęzić | dwa zdania o ruchu jako propozycje redakcji; ze zdania o numerze 112 usunięto „zamiast czekać na rozmowę wspierającą” |
| 03.26 | oznaczyć zdanie ostrzegawcze | „Nie zmieniaj samodzielnie przepisanych leków…” jako propozycja redakcji |
| 14.1 | oznaczyć zdanie | „Nie zatwierdzaj logowania, którego nie rozpoczynasz.” jako propozycja redakcji |
| 14.4 | oznaczyć zdanie | „Powiadom operatora o utracie karty…” jako propozycja redakcji |
| 14.10 | oznaczyć oba zdania | „Nie pozwalaj niezweryfikowanym odpowiedziom AI…” i „Przy ujawnieniu klucza…” jako propozycje redakcji |
| 03.27, 04.9, 14.2, 14.6, 14.9, 14.12 | przyjąć bez zmian | różnice dotyczą klasyfikacji zdań lub surowości odczytu; nic nie przeczy źródłu. W 14.6 zostaje słowo „oficjalny”, w 14.9 oba zdania |

Zmiany w tekście wprowadzają commity „draft: … (for owner review)” w osobnym PR, ułożonym na PR z edycjami językowymi, bo oba zmieniają te same wiersze pól. W polu „Zmiany w adaptacji” każdej zmienionej pozycji dopisano, co i dlaczego zmieniono. Status `verified` pozostaje; zdania oznaczone jako propozycje redakcji nie są twierdzeniami o źródle.

