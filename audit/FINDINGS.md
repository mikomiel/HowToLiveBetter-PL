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
5. **Komu wolno wznowić.** Przegląd wznowiono 2026-10-30 na polecenie właściciela (przebieg run7). Kolejne przebiegi i zmiany tekstu wymagają jego polecenia.

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

## G. Quality review and implementation handoff (2026-10-30)

The operator requested a full review and implementation, then confirmed that the previous writer had stopped. The integration branch preserves PR #9 (`564c9f8`) and PR #10 (`5283aa0`) and merges main `9ef1b87`; it does not overwrite either branch. This section owns the improvement backlog. Canonical advice and verification scope remain in `book/pl/`, not in a second evidence database.

The review read all 32 published entries, the 17 pending records and the eight chapter-04 exclusions. Baseline checks: 172 Node tests and 26 Chromium desktop/mobile tests passed; content lint reported zero errors and 16 warnings. This was not a new systematic literature review. Sources without newly checked material retain their previous verification dates and limitations.

| Priority | Finding and action | Boundary |
| --- | --- | --- |
| P1 | Separate an editorial `verified` state from expert approval in the headline, counts and reader labels. Keep the machine state and the fail-closed publication rule. | Source change |
| P1 | In 14.7–14.9 distinguish OS permissions from GDPR consent; remove the implied duty to supply a legal argument for erasure; name the supervisory complaint route; explain Article 6 together with Article 9. | Source change after legal consultation and direct statutory reads |
| P1 | Complete 14.5 only as a narrow consumer-account tip: immediate reporting, authentication versus authorization, D+1 versus final liability, the 13-month limit and statutory exceptions. Do not promise a refund for every fraud. | Source change; requires human review before merge |
| P1 | In 14.10 distinguish API credentials from passkeys and from personal data/confidential code. Explain the intermediary and preprint. Permission to process data does not authorize exposing credentials. | Source change |
| P1 | In 14.12 state Google's possible one-week security delay without exporting it to every provider. Preserve the check-before-disconnection instruction. | Source change |
| P1 | In 03.4 identify 8.8/13.2 hours as model-derived population estimates, not personal safety deadlines. Read the full methods and results, rather than relying only on the abstract. | Source change |
| P2 | Preserve the crisis and clinical safeguards. Explain exercise comparisons and effect sizes, CBT-I and CPAP in plain Polish; retain adult scope, low certainty and no self-prescribed treatment. | Source change |
| P2 | Apply the remaining justified language fixes: unclear pronouns, who performed the study, unexplained jargon and inconsistent terms. Do not mechanically apply every stylistic suggestion or change protected meaning without evidence. | Source change |
| P2 | Replace generic pending-record verification text with the actual item-specific gap. Do not imply the missing study was read or promote an unsupported item. | Source change |
| P2 | Add a direct link on each card, expose the current advice in navigation and associate grade help with its filter. Preserve keyboard focus, mobile layout and historical anchors. | Reader and real-browser regression tests |
| P2 | State hosting/privacy limits and make correction intake warn against public health, account and case details. Do not invent publisher identity, legal capacity or a complete privacy policy. | Source documentation; owner facts remain a release gate |
| P2 | Keep run7 historical. Its report acceptance is not factual approval, and changed book text makes old packets stale. Do not regenerate old reports as if they reviewed new wording. | Audit documentation |
| Owner | Confirm the intended main-review policy and require Dependency Review through repository administration. The 2026-10-30 API snapshot required zero approvals and only `Treść i czytnik`; that does not waive the human-review rule in AGENTS. | Separate administrative approval; no setting changed here |
| Owner | Register and isolate the repository-scoped GitHub App. A second token for `mikomiel` does not separate author and reviewer. | Owner registration and secure credential route |
| Owner | Decide publisher identity/capacity, hosting/contact data roles and any applicable AI-transparency obligations before the first manual Pages publication. | Legal readiness remains yellow; no deployment here |
| Separate triage | Five HIGH CodeQL alerts remain in inherited `tools/` generators/checkers. These files are not invoked by the Polish reader, its validation scripts or its Pages workflow. Do not dismiss them or replace their HTML handling without separate context and behavioral tests. | GitHub alerts remain the finding owner; not claimed fixed |
| No change | Keep a dependency-free reader, the three-chapter scope, original numbering, withheld medical/institutional material, attribution and both licences. Do not add a CMS, tracking, paid CI, automated deployment or more chapters. | Preserved constraints |

### Implementation state

The candidate keeps all inherited PR commits and adds a source-level quality pass. It publishes 33 entries after completing the scoped Polish consumer-payment entry 14.5; 16 pending records and eight chapter-04 exclusions stay outside the reader. The factual edit dates and scopes are recorded on the affected entries. Generic pending-record descriptions now identify their own gap without claiming the missing source was read. Content lint reports zero errors and zero warnings.

The reader, CLI and answering skill use editorial rather than expert-approval wording. Card permalinks and current-location navigation have browser regressions. The build and deployment permissions, file whitelist, noindex notice, licences and dependency-free runtime are unchanged. Validation-only CI also runs content lint explicitly.

A baseline test froze the corpus at 74 citations. The candidate legitimately has 76: the test now checks the documented empty records, nonempty published citations, unique valid inputs and discovery of the new official statute; its synthetic exact-extraction cases remain. This fixes a brittle corpus-count assertion, not a failed source parser.

### Evidence and limits

Prawnik completed an anonymized Polish/EU consultation on 2026-10-30. It is an AI analysis, not approval by a licensed lawyer. The implementation owner independently read the selected GDPR Articles 6–9, 12, 15–17 and the payment-act Articles 40, 42, 44–46, plus the official UOKiK/RF explanations. The recent TSUE case mentioned by RF is not presented as independently reviewed case law.

Primary references: [GDPR, official Polish text](https://uodo.gov.pl/data/filemanager_pl/727.pdf); [payment act, Dz.U. 2026 poz. 623](https://eli.gov.pl/api/acts/DU/2026/623/text.pdf); [UOKiK on unauthorized transactions](https://uokik.gov.pl/nieautoryzowane-transakcje-platnicze-cztery-banki-zmieniaja-praktyki-po-decyzjach-prezesa-uokik); [RF explanation of prompt refunds and later liability](https://rf.gov.pl/kradziez-pieniedzy-z-konta-bank-musi-je-niezwlocznie-zwrocic-tsue-potwierdza-stanowisko-rzecznika-finansowego/); [caffeine meta-analysis, sections 2.5 and 3.3.9](https://doi.org/10.1016/j.smrv.2023.101764); [exercise review, methods and abstract](https://www.bmj.com/content/384/bmj-2023-075847); [AASM clinical guideline](https://pmc.ncbi.nlm.nih.gov/articles/PMC7853203/); [CERT Polska](https://wiedza.cert.pl/dobre-praktyki/hasla/); [Google number-change limits](https://support.google.com/accounts/answer/3463280?hl=pl); [116 123 operator](https://116sos.pl/otrzymaj-pomoc/telefon); [GitHub Pages data collection](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection).

Release, deployment, paid resources, new account permissions and merging remain outside this implementation's authority. Each source change still needs exact-head tests, independent review and the operator's merge decision.

