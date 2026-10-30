[← O wydaniu i metodzie](../../README.md)

# 14. Bezpieczeństwo kont i danych

Oceniono wszystkie 12 pozycji źródła. Publikujemy 10 zweryfikowanych porad. Pozycje 14.5 i 14.11 pozostają rekordami needs_localization, nie instrukcjami do zastosowania. Czytnik ich nie pokazuje. Zachowujemy oryginalne numery.

To niezależna adaptacja HowToLiveBetter autorstwa eternity4719, na podstawie wersji e2605d3e2242bd6216c9255192b8a8957a08c55a. Tekst: CC BY 4.0; [licencja](../../LICENSE). Koszty i opłacalność są ocenami redakcji. [Znaczenie ocen](../../README.md#jak-czytac-dowody).

Informacje prawne są ogólne i dotyczą wskazanego zakresu źródeł. Nie rozstrzygają indywidualnej sprawy. Zalecenie techniczne, norma prawna i wynik eksperymentu nie są tym samym rodzajem dowodu. Nie przekazuj nikomu prawdziwych haseł, kodów odzyskiwania ani kluczy w zgłoszeniu poprawki do tej książki.

<a id="porada-14-1"></a>

### 1. Włącz silne uwierzytelnianie i przygotuj odzyskiwanie dostępu
- Status: verified
- Koszt: Konfiguracja każdej usługi i przechowanie zapasu. Klucz sprzętowy może wymagać zakupu; nie podajemy cen.
- W praktyce: Zacznij od poczty i innych ważnych kont. Jeżeli usługa obsługuje klucze dostępu, czyli passkeys, lub klucz sprzętowy FIDO/WebAuthn, rozważ tę metodę. Gdy usługa nie obsługuje kluczy dostępu, włącz dostępną weryfikację dwuskładnikową (2FA), zwłaszcza dla poczty i banku. Kody SMS i kody z aplikacji nadal można wyłudzić na fałszywej stronie. Zapisz bezpiecznie kody odzyskiwania, które oferuje usługa lub dodaj zapasowy klucz zgodnie z instrukcją usługi. Nie zatwierdzaj logowania, którego nie rozpoczynasz.
- Korzyść i dowody: CERT Polska wyjaśnia, że klucze dostępu są związane z adresem witryny i odporne na wyłudzanie danych na fałszywej stronie. Kody SMS i kody z aplikacji można wyłudzić. Sama prośba push nie zapewnia takiej odporności jak poprawnie wdrożony WebAuthn.
- Ocena dowodów: C — aktualne zalecenia techniczne CERT Polska, nie eksperyment o procencie zablokowanych ataków.
- Ocena redakcyjna: Warto poprawić ochronę najważniejszych kont, ale wcześniej upewnić się, że utrata jednego urządzenia nie odetnie wszystkich dróg odzyskania.
- Ograniczenia: Klucz dostępu nie zawsze oznacza dwa składniki: zależy to także od wymagania i sprawdzenia weryfikacji użytkownika przez usługę. Odporność na phishing nie chroni przed każdym złośliwym programem, kradzieżą aktywnej sesji lub oszustwem przy odzyskiwaniu konta. Korzystaj z metod rzeczywiście oferowanych przez usługę.
- Źródła: [CERT Polska: hasła, klucze dostępu i zapas](https://wiedza.cert.pl/dobre-praktyki/hasla/); [CERT Polska: MFA i weryfikacja użytkownika w WebAuthn](https://wiedza.cert.pl/odpornosc-infrastruktury/bezpieczenstwo-webowe/mfa/).
- Oryginał: [14.1](https://github.com/eternity4719/HowToLiveBetter/blob/e2605d3e2242bd6216c9255192b8a8957a08c55a/book/14-%E8%B4%A6%E5%8F%B7%E4%B8%8E%E4%BF%A1%E6%81%AF%E5%AE%89%E5%85%A8.md#L7-L14)
- Weryfikacja: 2026-10-28; pełna treść dwóch poradników CERT Polska: phishing, WebAuthn, weryfikacja użytkownika, odzyskiwanie i zalecenie dostępnej 2FA przy braku passkeys. Bez przenoszenia statystyki jednego dostawcy.
- Zmiany w adaptacji: Oryginalne A zastąpiono C dla zalecenia operacyjnego. Usunięto ranking „push przed SMS” oraz procenty z badania Google z 2019 roku jako ogólną gwarancję. Dodano odporność na phishing i odzyskiwanie. Zachowano ogólne zalecenie włączenia 2FA również wtedy, gdy usługa nie obsługuje kluczy dostępu.

<a id="porada-14-2"></a>

### 2. Używaj osobnego hasła do poczty i nie powtarzaj go w innych usługach
- Status: verified
- Koszt: Zmiana haseł i przygotowanie menedżera haseł (aplikacji do tworzenia i przechowywania haseł). Dostępne rozwiązania różnią się kosztem; nie wymagamy zakupu konkretnego produktu.
- W praktyce: W menedżerze wygeneruj długie, unikalne hasła do usług, które ich używają. Zabezpiecz dostęp do samego menedżera: ustaw jedno hasło główne z kilku losowych, niezwiązanych słów i zapamiętaj je. Jeśli to możliwe, włącz drugi składnik logowania (na przykład jednorazowy kod z telefonu) na koncie, za pomocą którego logujesz się do menedżera, i zapisz w bezpiecznym miejscu kody zapasowe, które serwis pokaże przy jego włączaniu. Zacznij od poczty, przez którą resetujesz hasła do innych kont.
- Korzyść i dowody: CERT Polska opisuje, że ponownie użyte hasło może po wycieku jednej usługi umożliwić przejęcie innych kont. Menedżer ułatwia tworzenie i przechowywanie różnych haseł zamiast zapamiętywania jednego do wszystkiego.
- Ocena dowodów: C — praktyczne zalecenia CERT Polska, bez zmierzonej kwoty unikniętych strat.
- Ocena redakcyjna: Unikalność haseł usuwa wspólny punkt słabości, ale menedżer też wymaga ochrony.
- Ograniczenia: Silne hasło może zostać wyłudzone lub przechwycone. Dodaj [odpowiednią metodę uwierzytelniania z 14.1](#porada-14-1). Nie podajemy jednej długości pasującej do wymagań każdej usługi.
- Źródła: [CERT Polska: bezpieczne hasła i menedżery](https://wiedza.cert.pl/dobre-praktyki/hasla/).
- Oryginał: [14.2](https://github.com/eternity4719/HowToLiveBetter/blob/e2605d3e2242bd6216c9255192b8a8957a08c55a/book/14-%E8%B4%A6%E5%8F%B7%E4%B8%8E%E4%BF%A1%E6%81%AF%E5%AE%89%E5%85%A8.md#L16-L23)
- Weryfikacja: 2026-10-28; pełny poradnik CERT Polska: ponowne użycie haseł, menedżery i ochrona najważniejszych kont. 2026-10-29: ponowne sprawdzenie zapisanej strony (główna część tekstu): drugi składnik logowania dla konta menedżera, kody zapasowe i hasło główne z losowych słów, zamiast ogólnego odzyskiwania konta; strona nie opisuje, czym jest CERT Polska.
- Zmiany w adaptacji: Zachowano C. Usunięto uniwersalne wymaganie 16 znaków i przykłady chińskich aplikacji. Nie obiecujemy, że menedżer sam chroni przed phishingiem. Poprawka 2026-10-29: zamiast ogólnego „przygotuj odzyskiwanie konta” opisano to, co mówi źródło (hasło główne, drugi składnik dla konta menedżera, kody zapasowe), a opis źródła w Ocenie dowodów ograniczono do tego, co strona mówi o sobie.

<a id="porada-14-3"></a>

### 3. Ustaw blokadę ekranu i rozważ PIN karty SIM
- Status: verified
- Koszt: Konfiguracja i bezpieczne przechowanie danych potrzebnych do odzyskania dostępu. To ocena redakcji.
- W praktyce: Włącz blokadę ekranu urządzenia i sprawdź możliwość używania PIN-u SIM lub eSIM. Nie zgaduj kodu początkowego ani PUK-u. Gdy go nie znasz, sprawdź dokumenty lub skorzystaj z oficjalnego wsparcia swojego operatora.
- Korzyść i dowody: Instrukcja Apple opisuje blokowanie SIM lub eSIM po ponownym uruchomieniu urządzenia albo wyjęciu karty. To inne zabezpieczenie niż kod blokady ekranu. Google opisuje osobno zdalne zablokowanie utraconego telefonu.
- Ocena dowodów: C — oficjalna dokumentacja urządzeń i usług, nie badanie strat finansowych.
- Ocena redakcyjna: Te zabezpieczenia dotyczą różnych dróg dostępu. Warto wiedzieć, którego kodu żąda urządzenie, zanim spróbujesz je odblokować.
- Ograniczenia: Wiele błędnych prób może zablokować kartę i wymagać pomocy operatora lub wymiany karty. PIN SIM nie jest gwarancją ochrony kont ani zabezpieczeniem każdej procedury operatora. Dostępność i nazwy ustawień zależą od urządzenia i karty.
- Źródła: [Apple: PIN SIM i eSIM, ostrzeżenie przed zgadywaniem](https://support.apple.com/pl-pl/118228); [Google: blokowanie urządzenia z Androidem](https://support.google.com/accounts/answer/6160491?hl=pl).
- Oryginał: [14.3](https://github.com/eternity4719/HowToLiveBetter/blob/e2605d3e2242bd6216c9255192b8a8957a08c55a/book/14-%E8%B4%A6%E5%8F%B7%E4%B8%8E%E4%BF%A1%E6%81%AF%E5%AE%89%E5%85%A8.md#L25-L32)
- Weryfikacja: 2026-10-28; pełne polskie instrukcje: różne rodzaje blokady, działanie PIN-u SIM i postępowanie przy nieznanym kodzie.
- Zmiany w adaptacji: Zachowano C. Usunięto domyślne kody do zgadywania i chiński przypadek jako dowód polskiej procedury. Nie podajemy numerów infolinii.

<a id="porada-14-4"></a>

### 4. Po utracie telefonu zabezpiecz urządzenie, numer i zagrożone konta
- Status: verified
- Koszt: Dostęp do innego zaufanego urządzenia i kontakt z dostawcami usług. Czas i ewentualne opłaty zależą od sytuacji.
- W praktyce: Użyj oficjalnej usługi producenta, by oznaczyć telefon jako utracony lub go zablokować, jeżeli ta funkcja była dostępna. Powiadom operatora o utracie karty i ustal, jak ją zabezpieczyć. Jeśli zagrożony jest dostęp do konta bankowego lub widzisz obce operacje, skontaktuj się pilnie z bankiem oficjalnym kanałem. Podejrzenie kradzieży zgłoś policji. Nie czekaj na zakończenie jednego zgłoszenia, jeżeli inne ryzyko jest pilne.
- Korzyść i dowody: Google i Apple opisują zdalną blokadę i inne działania po utracie urządzenia. Apple wskazuje także kontakt z operatorem. Rzecznik Finansowy zaleca kontakt z dostawcą i zabezpieczenie instrumentu przy nieautoryzowanych operacjach.
- Ocena dowodów: C — oficjalne instrukcje reagowania; nie badanie jednego optymalnego porządku działań.
- Ocena redakcyjna: Przygotowana wcześniej lista oficjalnych kontaktów może ułatwić reakcję. Nie potrzebujemy do tego jednolitego scenariusza dla wszystkich telefonów.
- Ograniczenia: Zdalne funkcje zależą od wcześniejszych ustawień i łączności. Wymazanie urządzenia może nieodwracalnie usunąć dane; po resecie urządzenie z Androidem może przestać być widoczne w usłudze lokalizacji. Apple ostrzega przed usunięciem urządzenia z listy Znajdź, bo usuwa to blokadę aktywacji. Zanim wybierzesz kasowanie lub usunięcie z konta, przeczytaj instrukcję dla swojego urządzenia.
- Źródła: [Google: utracone urządzenie](https://support.google.com/accounts/answer/6160491?hl=pl); [Apple: zgubiony iPhone lub iPad](https://support.apple.com/pl-pl/101593); [Rzecznik Finansowy: nieautoryzowane operacje](https://rf.gov.pl/edukacja/baza-wiedzy/najczestsze-pytania-i-odpowiedzi-faq/transakcje-nieautoryzowane/).
- Oryginał: [14.4](https://github.com/eternity4719/HowToLiveBetter/blob/e2605d3e2242bd6216c9255192b8a8957a08c55a/book/14-%E8%B4%A6%E5%8F%B7%E4%B8%8E%E4%BF%A1%E6%81%AF%E5%AE%89%E5%85%A8.md#L34-L41)
- Weryfikacja: 2026-10-28; polskie instrukcje producentów: blokada, ograniczenia lokalizacji i kasowania, kontakt z operatorem; zalecenia RF o zabezpieczeniu dostępu do pieniędzy. Bez oceny konkretnego roszczenia.
- Zmiany w adaptacji: Zachowano C. Usunięto sztywną chińską kolejność, numery operatorów i automatyczne zalecenie kasowania. Zgłoszenie na policji nie jest warunkiem wcześniejszego kontaktu z bankiem.

<a id="porada-14-5"></a>

### 5. Rekord redakcyjny: Nieautoryzowana płatność i odpowiedzialność banku
- Status: needs_localization
- Ograniczenia: Nie przenosimy chińskiego rozkładu ciężaru dowodu ani gwarancji zwrotu do Polski. Oficjalna informacja Rzecznika Finansowego jest dostępna, ale nie zatwierdzono kompletnej adaptacji wszystkich warunków odpowiedzialności.
- Źródła: Potrzebne pełne sprawdzenie aktualnych art. 40 i 44–46 ustawy o usługach płatniczych, wyjątków, statusu konsumenta oraz rozróżnienia zgody i uwierzytelnienia. Punkt wyjścia: [Rzecznik Finansowy](https://rf.gov.pl/edukacja/baza-wiedzy/najczestsze-pytania-i-odpowiedzi-faq/transakcje-nieautoryzowane/) i [tekst ustawy w ELI](https://eli.gov.pl/api/acts/DU/2025/611/text/U/D20250611Lj.pdf).
- Oryginał: [14.5](https://github.com/eternity4719/HowToLiveBetter/blob/e2605d3e2242bd6216c9255192b8a8957a08c55a/book/14-%E8%B4%A6%E5%8F%B7%E4%B8%8E%E4%BF%A1%E6%81%AF%E5%AE%89%E5%85%A8.md#L43-L50)
- Weryfikacja: 2026-10-28; ocena oryginalnej pozycji i decyzja o niepublikowaniu kompletnej polskiej porady. Wymagania pozostałych źródeł wskazano wyżej.

<a id="porada-14-6"></a>

### 6. Sprawdzaj sesje, uprawnienia aplikacji i przekazywanie poczty
- Status: verified
- Koszt: Przegląd ustawień i ustalenie, co nadal jest potrzebne. Częstotliwość przeglądu jest wyborem redakcyjnym, nie wynikiem badania.
- W praktyce: Sprawdź dostępne w usłudze listy sesji i połączonych aplikacji. Usuń zbędne dostępy. Przy podejrzeniu przejęcia konta skorzystaj z oficjalnej instrukcji odzyskiwania, sprawdź obce reguły przekazywania poczty, zmień przejęte lub powtórzone hasła i wyloguj pozostałe sesje zgodnie z procedurą dostawcy.
- Korzyść i dowody: NCSC opisuje nietypowe logowania i nieznane zmiany jako sygnały do sprawdzenia. Wskazuje też reguły przekazywania poczty używane do przechwytywania wiadomości oraz potrzebę zakończenia dostępu urządzeń i aplikacji po zmianie haseł.
- Ocena dowodów: C — oficjalny poradnik odzyskiwania konta, bez oceny skuteczności okresowego przeglądu.
- Ocena redakcyjna: Warto znać te ustawienia, zanim będą potrzebne w nagłej sytuacji.
- Ograniczenia: Nieznana lokalizacja sama nie rozstrzyga o ataku. Zmiana hasła i cofnięcie dostępu aplikacji to nie zawsze ta sama czynność. Nie ma tu jednego harmonogramu dla wszystkich usług ani gwarancji odzyskania konta.
- Źródła: [NCSC: Recovering a hacked account](https://www.ncsc.gov.uk/guidance/recovering-a-hacked-account).
- Oryginał: [14.6](https://github.com/eternity4719/HowToLiveBetter/blob/e2605d3e2242bd6216c9255192b8a8957a08c55a/book/14-%E8%B4%A6%E5%8F%B7%E4%B8%8E%E4%BF%A1%E6%81%AF%E5%AE%89%E5%85%A8.md#L52-L59)
- Weryfikacja: 2026-10-28; pełny poradnik NCSC: sygnały przejęcia, przekazywanie poczty, zmiana haseł, sesje i oficjalne odzyskiwanie.
- Zmiany w adaptacji: Zachowano C. Okresowy przegląd pozostaje sugestią redakcyjną. Nie przeniesiono brytyjskich numerów zgłoszeniowych ani nazw chińskich aplikacji.

<a id="porada-14-7"></a>

### 7. Sprawdzaj osobno uprawnienia aplikacji i zgody na przetwarzanie danych
- Status: verified
- Koszt: Przeczytanie celu dostępu i zmiana ustawień; część funkcji może przestać działać. To ocena redakcji.
- W praktyce: Sprawdź, do czego aplikacja chce dostępu, i nie akceptuj zbiorczo wszystkiego bez zastanowienia. Odbierz zbędne uprawnienia, na przykład do kontaktów, jeśli nie używasz funkcji, która ich potrzebuje. Przy zgodach na przetwarzanie danych przeczytaj cel i możliwość wycofania zgody.
- Korzyść i dowody: RODO wymaga ograniczenia danych do niezbędnych dla celu. Jeżeli podstawą jest zgoda, określa jej dobrowolność oraz prawo wycofania. Przy ocenie dobrowolności uwzględnia uzależnianie usługi od zgody na dane zbędne do wykonania umowy. Strona pomocy Androida opisuje zmianę uprawnień aplikacji.
- Ocena dowodów: C — normy prawne i instrukcja systemu, nie badanie skuteczności interwencji.
- Ocena redakcyjna: Kontrola konkretnego celu jest użyteczniejsza niż automatyczne wybieranie „zgadzam się na wszystko”.
- Ograniczenia: Uprawnienie aplikacji w Androidzie dotyczy dostępu do funkcji urządzenia, a zgoda w rozumieniu RODO (art. 4 pkt 11) to dobrowolne, konkretne, świadome i jednoznaczne okazanie woli. To zestawienie redakcji, nie wniosek z cytowanych źródeł. Zgoda nie jest jedyną podstawą przetwarzania (art. 6 ust. 1 RODO). Art. 7 ust. 4 mówi, że przy ocenie dobrowolności zgody w jak największym stopniu uwzględnia się między innymi uzależnienie wykonania umowy, w tym usługi, od zgody na dane zbędne do jej wykonania; nie rozstrzyga, kiedy usługa musi być dostępna mimo odmowy. Strona pomocy Androida wiąże uprawnienia z funkcjami urządzenia, takimi jak aparat czy lista kontaktów, i opisuje, jak ich włączenie wpływa na działanie aplikacji; dotyczy Androida, a część kroków obowiązuje tylko na wybranych telefonach i wersjach systemu. To nie jest rozstrzygnięcie legalności konkretnej aplikacji. Tekst opisuje przepisy ogólnie, nie jest poradą prawną i nie miał przeglądu prawnika.
- Źródła: [RODO, art. 4 pkt 11 oraz art. 5–7, tekst urzędowy udostępniony przez UODO](https://uodo.gov.pl/data/filemanager_pl/727.pdf); [Google: zmiana uprawnień aplikacji](https://support.google.com/android/answer/9431959?hl=pl).
- Oryginał: [14.7](https://github.com/eternity4719/HowToLiveBetter/blob/e2605d3e2242bd6216c9255192b8a8957a08c55a/book/14-%E8%B4%A6%E5%8F%B7%E4%B8%8E%E4%BF%A1%E6%81%AF%E5%AE%89%E5%85%A8.md#L61-L68)
- Weryfikacja: 2026-10-28; polski tekst art. 5 ust. 1 lit. c, art. 6 i art. 7 RODO; polska instrukcja Androida. Bez analizy umowy konkretnej usługi. 2026-10-29: ponowne sprawdzenie na zapisanych źródłach: art. 4 pkt 11, art. 5 ust. 1 lit. c, art. 6 ust. 1 i art. 7 ust. 3 i 4 RODO oraz strona pomocy Androida. Żadne z tych źródeł nie łączy uprawnienia systemowego ze zgodą RODO.
- Zmiany w adaptacji: Oryginalne A zastąpiono C dla normy prawnej. Chińskie przepisy zastąpiono odpowiednim zakresem RODO, bez obietnicy, że każda odmowa zgody musi pozostawić usługę dostępną. Poprawka 2026-10-29: źródło systemowe nazwano stroną pomocy, związek między uprawnieniem a zgodą opisano jako zestawienie redakcji, a zdanie o odmowie ograniczono do treści art. 7 ust. 4; dodano zastrzeżenie o braku przeglądu prawnika. Tytuł nie wprowadza już podziału „wymagane”/„dodatkowe” ani nie twierdzi, że uprawnienie nie jest zgodą, czego żadne z cytowanych źródeł nie opisuje; zdanie o funkcjach zastąpiono opisem tego, co mówi strona pomocy.

<a id="porada-14-8"></a>

### 8. Korzystaj z praw do danych, ale sprawdź warunki i wyjątki
- Status: verified
- Koszt: Opisanie żądania i zachowanie korespondencji. Działania na żądanie są co do zasady bezpłatne, lecz RODO przewiduje wyjątki dla żądań ewidentnie nieuzasadnionych lub nadmiernych.
- W praktyce: Napisz administratorowi, czy żądasz dostępu i kopii danych, sprostowania nieścisłości, czy usunięcia danych. Zachowaj potwierdzenie. Przy usuwaniu wskaż, dlaczego warunki są spełnione; samo zamknięcie konta nie musi usuwać wszystkich danych. W razie odmowy przeczytaj uzasadnienie i informacje o skardze lub ochronie sądowej.
- Korzyść i dowody: RODO określa prawo dostępu i kopii w art. 15, sprostowania w art. 16 oraz usunięcia w art. 17. Art. 12 przewiduje odpowiedź bez zbędnej zwłoki, zasadniczo w ciągu miesiąca od otrzymania żądania. Termin może być przedłużony o dwa kolejne miesiące ze względu na skomplikowanie lub liczbę żądań, z informacją i przyczyną przekazaną w pierwszym miesiącu.
- Ocena dowodów: C — treść rozporządzenia i wyjaśnienie UODO, nie badanie rezultatów sporów.
- Ocena redakcyjna: Precyzyjne żądanie i zapis korespondencji pomagają ustalić, czego dotyczy odpowiedź. Nie obiecujemy wyniku sporu.
- Ograniczenia: Usunięcie nie jest bezwarunkowe: wyjątki obejmują między innymi obowiązek prawny, wolność wypowiedzi, określone cele interesu publicznego oraz ustalenie, dochodzenie lub obronę roszczeń. Kopia danych nie może naruszać praw i wolności innych. Administrator może w uzasadnionym zakresie potwierdzać tożsamość. Nie wysyłaj dokumentu tożsamości bez sprawdzenia potrzeby i kanału. Tekst opisuje przepisy ogólnie, nie jest poradą prawną i nie miał przeglądu prawnika.
- Źródła: [RODO, art. 12 i 15–17, tekst urzędowy na stronie UODO](https://uodo.gov.pl/data/filemanager_pl/727.pdf); [UODO: prawo do usunięcia i wyjątki](https://www.uodo.gov.pl/pl/493/4098).
- Oryginał: [14.8](https://github.com/eternity4719/HowToLiveBetter/blob/e2605d3e2242bd6216c9255192b8a8957a08c55a/book/14-%E8%B4%A6%E5%8F%B7%E4%B8%8E%E4%BF%A1%E6%81%AF%E5%AE%89%E5%85%A8.md#L70-L77)
- Weryfikacja: 2026-10-28; polski tekst art. 12, 15, 16 i 17, fizyczne strony 39–44 dokumentu; oficjalny poradnik UODO o usunięciu, terminie i potwierdzeniu tożsamości. Nie oceniano indywidualnego żądania.
- Zmiany w adaptacji: Oryginalne A zastąpiono C. Usunięto chińską podstawę prawną i bezwarunkową obietnicę usunięcia. Dodano wyjątki, tryb odpowiedzi oraz rozróżnienie zamknięcia konta od usunięcia danych. Dodano 2026-10-29 zastrzeżenie, że tekst nie jest poradą prawną i nie miał przeglądu prawnika.

<a id="porada-14-9"></a>

### 9. Zanim przekażesz biometrię, zapytaj o cel, podstawę i alternatywę
- Status: verified
- Koszt: Przeczytanie informacji i zapytanie o inny sposób weryfikacji. To ocena redakcji.
- W praktyce: Gdy organizacja chce używać twarzy lub odcisku palca do identyfikacji, zapytaj, kto przetwarza dane, w jakim celu, na jakiej podstawie i jak długo. Zapytaj także o inną metodę.
- Korzyść i dowody: RODO definiuje dane biometryczne przez specjalne przetwarzanie techniczne umożliwiające lub potwierdzające jednoznaczną identyfikację. Art. 9 obejmuje szczególną ochroną biometrię używaną do takiego celu: zasadniczy zakaz ma wymienione w prawie wyjątki. Wyraźna zgoda jest jednym z nich, nie jedyną możliwą podstawą.
- Ocena dowodów: C — norma prawna dotycząca kategorii danych, nie porównanie skuteczności metod logowania.
- Ocena redakcyjna: Warto znać sposób wykorzystania danych przed ich przekazaniem, zamiast utożsamiać wygodę z koniecznością prawną.
- Ograniczenia: Nie każde zdjęcie jest automatycznie przetwarzaniem biometrycznym w tym znaczeniu. Możliwość odmowy i żądania alternatywy zależy od kontekstu i podstawy prawnej. Ta porada dotyczy organizacji przetwarzającej biometrię, nie jest oceną lokalnego odblokowania urządzenia. Ochronę logowania opisuje [14.1](#porada-14-1). Tekst opisuje przepisy ogólnie, nie jest poradą prawną i nie miał przeglądu prawnika.
- Źródła: [RODO, art. 4 pkt 14, art. 9 i informacje z art. 13](https://uodo.gov.pl/data/filemanager_pl/727.pdf); [UODO: omówienie danych biometrycznych](https://uodo.gov.pl/pl/file/3534).
- Oryginał: [14.9](https://github.com/eternity4719/HowToLiveBetter/blob/e2605d3e2242bd6216c9255192b8a8957a08c55a/book/14-%E8%B4%A6%E5%8F%B7%E4%B8%8E%E4%BF%A1%E6%81%AF%E5%AE%89%E5%85%A8.md#L79-L86)
- Weryfikacja: 2026-10-28; polski tekst art. 4 pkt 14, art. 9 i art. 13; definicje i podstawy prawne w materiale UODO. Nie przenoszono opisanych w starszej prezentacji rozstrzygnięć konkretnej sprawy szkolnej.
- Zmiany w adaptacji: Oryginalne A zastąpiono C. Usunięto chińskie nakazy, progi liczby osób, terminy rejestracji i granice wieku. Nie utworzono fikcyjnego polskiego prawa do alternatywy w każdej sytuacji. Dodano 2026-10-29 zastrzeżenie, że tekst nie jest poradą prawną i nie miał przeglądu prawnika.

<a id="porada-14-10"></a>

### 10. Nie przekazuj sekretów niesprawdzonym pośrednikom AI
- Status: verified
- Koszt: Sprawdzenie operatora, warunków przetwarzania i uprawnień narzędzia. Cena nie jest tu dowodem bezpieczeństwa.
- W praktyce: Przed użyciem pośrednika ustal, kto otrzymuje treść, jakie dane przechowuje i komu je przekazuje. Nie wysyłaj mu kluczy dostępu, cudzych danych ani prywatnego kodu bez właściwego upoważnienia i oceny poufności oraz podstaw przetwarzania danych. Nie pozwalaj niezweryfikowanym odpowiedziom AI automatycznie wykonywać poleceń z szerokimi uprawnieniami. Przy ujawnieniu klucza skorzystaj z procedury jego unieważnienia u wystawcy.
- Korzyść i dowody: Liu i współautorzy opisali w preprincie badanie 28 płatnych i 400 bezpłatnych pośredników API modeli. W tej próbie wykryli między innymi wstrzykiwanie szkodliwego kodu do odpowiedzi oraz dostęp do badawczych kluczy kontrolnych. Badani pośrednicy mieli dostęp do jawnej treści przekazywanych żądań.
- Ocena dowodów: B — pojedyncze badanie pomiarowe opublikowane jako preprint, nie reprezentatywna ocena całego rynku.
- Ocena redakcyjna: Sekretu nie należy używać do sprawdzania wiarygodności nieznanego dostawcy. Ocena musi poprzedzać przekazanie danych.
- Ograniczenia: Nie wiadomo z tego badania, jaki odsetek wszystkich pośredników jest złośliwy. Oficjalny dostawca też wymaga oceny zasad przetwarzania; bezpośrednie połączenie nie jest gwarancją poufności. Sama zmiana nazwy lub zamaskowanie fragmentu nie musi usuwać danych osobowych. Ocena polecenia przez człowieka ogranicza część ryzyka, ale nie gwarantuje wykrycia każdego ataku.
- Źródła: Liu i współautorzy (2026), Your Agent Is Mine: Measuring Malicious Intermediary Attacks on the LLM Supply Chain. [Abstrakt autorów i wersje preprintu](https://arxiv.org/abs/2604.08407).
- Oryginał: [14.10](https://github.com/eternity4719/HowToLiveBetter/blob/e2605d3e2242bd6216c9255192b8a8957a08c55a/book/14-%E8%B4%A6%E5%8F%B7%E4%B8%8E%E4%BF%A1%E6%81%AF%E5%AE%89%E5%85%A8.md#L88-L95)
- Weryfikacja: 2026-10-28; abstrakt autorów: projekt pomiaru, liczebności, dostęp pośredników i typy zaobserwowanych nadużyć. Nie wykonano własnych testów usług ani pełnej walidacji kodu badaczy.
- Zmiany w adaptacji: Zachowano B z jawnym statusem preprintu. Usunięto chiński komunikat urzędowy jako polską podstawę oraz kwoty szkód i instrukcje ataku. Nie obiecujemy, że każde bezpośrednie połączenie jest bezpieczne.

<a id="porada-14-11"></a>

### 11. Rekord redakcyjny: Sprawdzanie kart i rachunków przypisanych do osoby
- Status: needs_localization
- Ograniczenia: Opisane chińskie usługi zbiorczego wyszukiwania nie są polską instrukcją. Nie ustalono i nie obiecujemy jednego polskiego narzędzia o takim samym zakresie.
- Źródła: Potrzebne aktualne oficjalne polskie procedury, zakres dostępnych rejestrów i sposób wyjaśniania wpisu u banku lub operatora. Roczny termin z oryginału jest wyborem autora, nie dowodem skuteczności.
- Oryginał: [14.11](https://github.com/eternity4719/HowToLiveBetter/blob/e2605d3e2242bd6216c9255192b8a8957a08c55a/book/14-%E8%B4%A6%E5%8F%B7%E4%B8%8E%E4%BF%A1%E6%81%AF%E5%AE%89%E5%85%A8.md#L97-L104)
- Weryfikacja: 2026-10-28; ocena oryginalnej pozycji i decyzja o niepublikowaniu kompletnej polskiej porady. Wymagania pozostałych źródeł wskazano wyżej.

<a id="porada-14-12"></a>

### 12. Przed rezygnacją z numeru telefonu sprawdź powiązane konta
- Status: verified
- Koszt: Przegląd używanych usług i potwierdzenie nowych sposobów kontaktu oraz odzyskiwania. Nie zakładamy stałego czasu wykonania.
- W praktyce: W usługach, które korzystają ze starego numeru, ustaw i sprawdź nowy numer lub inną metodę odzyskiwania, zanim stracisz do niego dostęp. Uwzględnij pocztę, bank i inne ważne konta, ale postępuj według procedury każdego dostawcy. Nie zakładaj, że jedna zmiana aktualizuje wszystkie usługi.
- Korzyść i dowody: Google wyjaśnia, że numer może służyć do logowania lub odzyskiwania, a jego zmiana na koncie wpływa tylko na niektóre usługi; inne mogą mieć własne ustawienia. To uzasadnia sprawdzenie powiązań zamiast polegania na jednej zmianie.
- Ocena dowodów: C — dokumentacja dostawcy i redakcyjna lista kontrolna, bez badania unikniętych strat.
- Ocena redakcyjna: Warto sprawdzić działanie nowej metody przed wyłączeniem starej. Lista usług jest przykładem, nie kompletnym rejestrem twoich kont.
- Ograniczenia: Nie podajemy polskiego okresu ponownego przydziału numeru ani jednolitej procedury bankowej. Dokumentacja Google nie dowodzi sposobu działania wszystkich usług. Potwierdź wymagania bezpośrednio u własnego dostawcy.
- Źródła: [Google: zmiana numeru i różne sposoby jego użycia](https://support.google.com/accounts/answer/3463280?hl=pl); [NCSC: odzyskiwanie zależy od dostawcy](https://www.ncsc.gov.uk/guidance/recovering-a-hacked-account).
- Oryginał: [14.12](https://github.com/eternity4719/HowToLiveBetter/blob/e2605d3e2242bd6216c9255192b8a8957a08c55a/book/14-%E8%B4%A6%E5%8F%B7%E4%B8%8E%E4%BF%A1%E6%81%AF%E5%AE%89%E5%85%A8.md#L106-L113)
- Weryfikacja: 2026-10-28; pełna polska dokumentacja Google: zakres zmiany i funkcje odzyskiwania; wskazanie NCSC, że każda usługa ma własną procedurę.
- Zmiany w adaptacji: Zachowano C. Usunięto chiński termin 90 dni, usługi państwowe i domyślny okres pozostawienia starej karty. Ogólną listę kontrolną oznaczono jako redakcyjną.
