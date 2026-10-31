[← O wydaniu i metodzie](../../README.md)

# 14. Bezpieczeństwo kont i danych

Oceniono wszystkie 12 pozycji źródła. Publikujemy 11 opracowanych porad z opisem źródeł i ograniczeń. Pozycja 14.11 pozostaje rekordem needs_localization, nie instrukcją do zastosowania. Czytnik jej nie pokazuje. Zachowujemy oryginalne numery.

To niezależna adaptacja HowToLiveBetter autorstwa eternity4719, na podstawie wersji e2605d3e2242bd6216c9255192b8a8957a08c55a. Tekst: CC BY 4.0; [licencja](../../LICENSE). Koszty i opłacalność są ocenami redakcji. [Znaczenie ocen](../../README.md#jak-czytac-dowody).

Informacje prawne są ogólne i dotyczą wskazanego zakresu źródeł. Nie rozstrzygają indywidualnej sprawy. Zalecenie techniczne, norma prawna i wynik eksperymentu nie są tym samym rodzajem dowodu. Nie przekazuj nikomu prawdziwych haseł, kodów odzyskiwania ani kluczy w zgłoszeniu poprawki do tej książki.

<a id="porada-14-1"></a>

### 1. Zabezpiecz logowanie i przygotuj odzyskiwanie dostępu
- Status: verified
- Koszt: Konfiguracja każdej usługi i bezpieczne przechowanie kodów odzyskiwania lub zapasowego klucza. Klucz sprzętowy może wymagać zakupu; nie podajemy cen.
- W praktyce: Zacznij od poczty i innych ważnych kont. Jeżeli usługa obsługuje klucze dostępu, czyli passkeys, lub klucz sprzętowy FIDO/WebAuthn — osobne urządzenie do logowania — rozważ tę metodę. Gdy usługa nie obsługuje kluczy dostępu, włącz dostępną weryfikację dwuskładnikową (2FA), zwłaszcza dla poczty i banku. Kody SMS i kody z aplikacji nadal można wyłudzić na fałszywej stronie. Zapisz bezpiecznie kody odzyskiwania, które oferuje usługa, lub dodaj zapasowy klucz zgodnie z jej instrukcją. Propozycja redakcji: nie zatwierdzaj w aplikacji prośby o logowanie, którego nie rozpoczynasz.
- Korzyść i dowody: CERT Polska wyjaśnia, że klucze dostępu są związane z adresem witryny i odporne na wyłudzanie danych na fałszywej stronie, czyli phishing. Kody SMS i kody z aplikacji można wyłudzić. Samo powiadomienie z prośbą o zatwierdzenie logowania nie zapewnia takiej odporności jak poprawnie wdrożony WebAuthn.
- Ocena dowodów: C — aktualne zalecenia techniczne CERT Polska, nie eksperyment o procencie zablokowanych ataków.
- Ocena redakcyjna: Warto poprawić ochronę najważniejszych kont, ale wcześniej upewnić się, że utrata jednego urządzenia nie odetnie wszystkich dróg odzyskania.
- Ograniczenia: Klucz dostępu nie zawsze oznacza dwa składniki: znaczenie ma także to, czy usługa wymaga i sprawdza dodatkowe potwierdzenie użytkownika, na przykład kodem PIN urządzenia. Odporność na phishing nie chroni przed każdym złośliwym programem, kradzieżą aktywnej sesji lub oszustwem przy odzyskiwaniu konta. Korzystaj z metod rzeczywiście oferowanych przez usługę.
- Źródła: [CERT Polska: hasła, klucze dostępu i zapas](https://wiedza.cert.pl/dobre-praktyki/hasla/); [CERT Polska: MFA i weryfikacja użytkownika w WebAuthn](https://wiedza.cert.pl/odpornosc-infrastruktury/bezpieczenstwo-webowe/mfa/).
- Oryginał: [14.1](https://github.com/eternity4719/HowToLiveBetter/blob/e2605d3e2242bd6216c9255192b8a8957a08c55a/book/14-%E8%B4%A6%E5%8F%B7%E4%B8%8E%E4%BF%A1%E6%81%AF%E5%AE%89%E5%85%A8.md#L7-L14)
- Weryfikacja: 2026-10-28; pełna treść dwóch poradników CERT Polska: phishing, WebAuthn, weryfikacja użytkownika, odzyskiwanie i zalecenie dostępnej 2FA przy braku passkeys. Bez przenoszenia statystyki jednego dostawcy.
- Zmiany w adaptacji: Oryginalne A zastąpiono C dla zalecenia operacyjnego. Usunięto ranking „push przed SMS” oraz procenty z badania Google z 2019 roku jako ogólną gwarancję. Dodano odporność na phishing i odzyskiwanie. Zachowano ogólne zalecenie włączenia 2FA również wtedy, gdy usługa nie obsługuje kluczy dostępu. 2026-10-30 (przegląd run7, decyzja właściciela): zdanie o niezatwierdzaniu logowania, którego nie rozpoczynasz, oznaczono jako propozycję redakcji, bo żadna ze stron CERT Polska go nie zawiera.

<a id="porada-14-2"></a>

### 2. Używaj osobnego hasła do poczty i nie powtarzaj go w innych usługach
- Status: verified
- Koszt: Zmiana haseł i przygotowanie menedżera haseł (aplikacji do tworzenia i przechowywania haseł). Dostępne rozwiązania różnią się kosztem; nie wymagamy zakupu konkretnego produktu.
- W praktyce: W menedżerze wygeneruj długie, unikalne hasła do usług, które ich używają. Zabezpiecz dostęp do samego menedżera: ustaw jedno hasło główne z kilku losowych, niezwiązanych słów i zapamiętaj je. Jeśli to możliwe, włącz drugi składnik logowania (na przykład jednorazowy kod z telefonu) na koncie menedżera. Zapisz w bezpiecznym miejscu kody zapasowe, które usługa pokaże przy włączaniu tego zabezpieczenia. Zacznij od poczty, przez którą resetujesz hasła do innych kont.
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
- W praktyce: Włącz blokadę ekranu urządzenia i sprawdź możliwość używania PIN-u SIM lub eSIM. Nie zgaduj początkowego PIN-u ani kodu PUK, który służy do odblokowania karty po błędnych próbach PIN-u. Jeśli nie znasz któregoś z kodów, sprawdź dokumenty lub skorzystaj z oficjalnego wsparcia swojego operatora.
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
- W praktyce: Użyj oficjalnej usługi producenta, by oznaczyć telefon jako utracony lub go zablokować, jeżeli ta funkcja była dostępna. Propozycja redakcji: powiadom operatora o utracie karty SIM lub dostępu do eSIM i ustal, jak zabezpieczyć numer. Jeśli zagrożony jest dostęp do konta bankowego lub widzisz operacje, których nie rozpoznajesz, skontaktuj się pilnie z bankiem oficjalnym kanałem. Podejrzenie kradzieży zgłoś policji. Nie czekaj na zakończenie jednego zgłoszenia, jeżeli inne ryzyko jest pilne.
- Korzyść i dowody: Google i Apple opisują zdalną blokadę i inne działania po utracie urządzenia. Apple wskazuje także kontakt z operatorem. Rzecznik Finansowy zaleca kontakt z dostawcą i zabezpieczenie instrumentu przy nieautoryzowanych operacjach.
- Ocena dowodów: C — oficjalne instrukcje reagowania; nie badanie jednego optymalnego porządku działań.
- Ocena redakcyjna: Przygotowana wcześniej lista oficjalnych kontaktów może ułatwić reakcję. Nie potrzebujemy do tego jednolitego scenariusza dla wszystkich telefonów.
- Ograniczenia: Zdalne funkcje zależą od wcześniejszych ustawień i łączności. Wymazanie urządzenia może nieodwracalnie usunąć dane; po resecie urządzenie z Androidem może przestać być widoczne w usłudze lokalizacji. Apple ostrzega przed usunięciem urządzenia z listy Znajdź, bo usuwa to blokadę aktywacji. Zanim wybierzesz wymazanie urządzenia lub usunięcie go z konta, przeczytaj instrukcję dla swojego urządzenia.
- Źródła: [Google: utracone urządzenie](https://support.google.com/accounts/answer/6160491?hl=pl); [Apple: zgubiony iPhone lub iPad](https://support.apple.com/pl-pl/101593); [Rzecznik Finansowy: nieautoryzowane operacje](https://rf.gov.pl/edukacja/baza-wiedzy/najczestsze-pytania-i-odpowiedzi-faq/transakcje-nieautoryzowane/).
- Oryginał: [14.4](https://github.com/eternity4719/HowToLiveBetter/blob/e2605d3e2242bd6216c9255192b8a8957a08c55a/book/14-%E8%B4%A6%E5%8F%B7%E4%B8%8E%E4%BF%A1%E6%81%AF%E5%AE%89%E5%85%A8.md#L34-L41)
- Weryfikacja: 2026-10-28; polskie instrukcje producentów: blokada, ograniczenia lokalizacji i kasowania, kontakt z operatorem; zalecenia RF o zabezpieczeniu dostępu do pieniędzy. Bez oceny konkretnego roszczenia.
- Zmiany w adaptacji: Zachowano C. Usunięto sztywną chińską kolejność, numery operatorów i automatyczne zalecenie kasowania. Zgłoszenie na policji nie jest warunkiem wcześniejszego kontaktu z bankiem. 2026-10-30 (przegląd run7, decyzja właściciela): zdanie o powiadomieniu operatora oznaczono jako propozycję redakcji; czytelne źródło mówi tylko, że operator może użyć numeru IMEI do wyłączenia telefonu.

<a id="porada-14-5"></a>

### 5. Płatność bez twojej zgody zgłoś bankowi od razu
- Status: verified
- Koszt: Pilny kontakt z bankiem i zachowanie potwierdzenia zgłoszenia oraz dostępnych dowodów. Spór może wymagać dalszej korespondencji lub pomocy prawnej; nie obiecujemy jego czasu ani wyniku.
- W praktyce: Jeśli widzisz płatność, na którą nie wyraziłeś zgody, skontaktuj się pilnie z bankiem oficjalnym kanałem. Zgłoś transakcję, poproś o zabezpieczenie dostępu i zastrzeżenie zagrożonej karty lub innego sposobu płacenia. Zachowaj historię operacji, wiadomości i potwierdzenie zgłoszenia. Nie opóźniaj kontaktu, aby najpierw zebrać wszystkie dowody albo zgłosić sprawę policji. Nie każde oszustwo jest płatnością nieautoryzowaną; opisz bankowi, co rzeczywiście się wydarzyło.
- Korzyść i dowody: Art. 40 ustawy o usługach płatniczych wiąże autoryzację ze zgodą na transakcję. Samo poprawne użycie karty lub kodu nie wystarcza do wykazania zgody — art. 45 określa ciężar dowodu po stronie dostawcy. Przy nieautoryzowanej transakcji bank co do zasady zwraca kwotę niezwłocznie, najpóźniej do końca następnego dnia roboczego po dniu, w którym bank stwierdził taką transakcję lub otrzymał zgłoszenie (art. 46). To nie jest termin 24 godzin. UOKiK i Rzecznik Finansowy odróżniają szybki zwrot od ostatecznej odpowiedzialności klienta.
- Ocena dowodów: C — polska ustawa i oficjalne objaśnienia organów, nie badanie skuteczności reklamacji ani gwarancja wygrania sporu.
- Ocena redakcyjna: Szybkie zgłoszenie i zapis faktów są ważniejsze niż czekanie na komplet dokumentów. Zgłoszenie operacji, zabezpieczenie dostępu i rozstrzygnięcie odpowiedzialności to odrębne sprawy.
- Ograniczenia: Zakres: polskie prawo, konsument i zwykły rachunek płatniczy; nie opisujemy wszystkich szczególnych instrumentów ani umów przedsiębiorców. Zgłaszaj niezwłocznie. Co do zasady brak zgłoszenia w ciągu 13 miesięcy od obciążenia rachunku wygasza roszczenia z tego tytułu; wyjątek dotyczy nieudostępnienia wymaganych informacji o transakcji. Wyjątek od szybkiego zwrotu wymaga uzasadnionych, należycie udokumentowanych podstaw podejrzenia oszustwa płatnika i pisemnego powiadomienia organów ścigania. Sam zarzut rażącego niedbalstwa nie jest automatyczną podstawą wstrzymania zwrotu, ale bank może później dochodzić kwoty, jeśli wykaże ustawowe przesłanki odpowiedzialności klienta. Umyślność lub rażąco niedbałe naruszenie obowiązków z art. 42 może prowadzić do pełnej odpowiedzialności. Równowartość 50 euro nie jest uniwersalnym udziałem własnym: ma określone przesłanki i wyjątki. Ocena konkretnego oszustwa zależy od faktów. To ogólna informacja, nie indywidualna porada prawna ani zatwierdzenie przez prawnika.
- Źródła: [Ustawa o usługach płatniczych, t.j. Dz.U. 2026 poz. 623, art. 40 i 42–46](https://eli.gov.pl/api/acts/DU/2026/623/text.pdf); [UOKiK: autoryzacja, zwrot i odpowiedzialność](https://uokik.gov.pl/nieautoryzowane-transakcje-platnicze-cztery-banki-zmieniaja-praktyki-po-decyzjach-prezesa-uokik); [Rzecznik Finansowy: szybki zwrot a późniejsza odpowiedzialność](https://rf.gov.pl/kradziez-pieniedzy-z-konta-bank-musi-je-niezwlocznie-zwrocic-tsue-potwierdza-stanowisko-rzecznika-finansowego/).
- Oryginał: [14.5](https://github.com/eternity4719/HowToLiveBetter/blob/e2605d3e2242bd6216c9255192b8a8957a08c55a/book/14-%E8%B4%A6%E5%8F%B7%E4%B8%8E%E4%BF%A1%E6%81%AF%E5%AE%89%E5%85%A8.md#L43-L50)
- Weryfikacja: 2026-10-30; wybrane przepisy polskiej ustawy: art. 40, 42, 44–45 i art. 46 ust. 1–4a, fizyczne strony 38–41 tekstu Dz.U. 2026 poz. 623; pełne komunikaty UOKiK i RF w powyższym zakresie. Konsultacja z agentem Prawnik AI oraz odczyt przepisów przez redakcję; nie przegląd przez prawnika-człowieka ani niezależna analiza pełnego wyroku TSUE przywołanego przez RF. Bez rozstrzygnięcia konkretnego roszczenia.
- Zmiany w adaptacji: Oryginalne A zastąpiono C. Rekord needs_localization zastąpiono 2026-10-30 zawężoną poradą konsumencką opartą na polskim prawie. Nie przeniesiono chińskiego ciężaru dowodu ani bezwarunkowej obietnicy zwrotu. Rozdzielono zgodę i uwierzytelnienie, termin zwrotu i ostateczną odpowiedzialność; dodano wyjątki i pilne zgłoszenie bez warunku wcześniejszej wizyty na policji. Konsultacja AI nie oznacza zatwierdzenia przez prawnika.

<a id="porada-14-6"></a>

### 6. Sprawdzaj sesje logowania, połączone aplikacje i przekazywanie poczty
- Status: verified
- Koszt: Przegląd ustawień i ustalenie, co nadal jest potrzebne. Częstotliwość przeglądu jest wyborem redakcyjnym, nie wynikiem badania.
- W praktyce: Sprawdź listy sesji i aplikacji połączonych z kontem. Sesja to trwające zalogowanie na urządzeniu lub w przeglądarce; połączona aplikacja może mieć osobny dostęp do konta. Zakończ zbędne sesje i sprawdź, jak odłączyć niepotrzebne aplikacje. Przy podejrzeniu przejęcia konta skorzystaj z oficjalnej instrukcji odzyskiwania; sprawdź obce reguły przekazywania poczty, zmień przejęte lub ponownie użyte hasła i wyloguj pozostałe sesje zgodnie z procedurą dostawcy.
- Korzyść i dowody: NCSC opisuje nietypowe logowania i nieznane zmiany jako sygnały do sprawdzenia. Wskazuje też reguły przekazywania poczty używane do przechwytywania wiadomości oraz potrzebę zakończenia dostępu urządzeń i aplikacji po zmianie haseł.
- Ocena dowodów: C — oficjalny poradnik odzyskiwania konta, bez oceny skuteczności okresowego przeglądu.
- Ocena redakcyjna: Warto znać te ustawienia, zanim będą potrzebne w nagłej sytuacji.
- Ograniczenia: Nieznana lokalizacja logowania sama nie rozstrzyga o ataku. Zmiana hasła i cofnięcie dostępu aplikacji to nie zawsze ta sama czynność. Nie ma tu jednego harmonogramu dla wszystkich usług ani gwarancji odzyskania konta.
- Źródła: [NCSC: Recovering a hacked account](https://www.ncsc.gov.uk/guidance/recovering-a-hacked-account).
- Oryginał: [14.6](https://github.com/eternity4719/HowToLiveBetter/blob/e2605d3e2242bd6216c9255192b8a8957a08c55a/book/14-%E8%B4%A6%E5%8F%B7%E4%B8%8E%E4%BF%A1%E6%81%AF%E5%AE%89%E5%85%A8.md#L52-L59)
- Weryfikacja: 2026-10-28; pełny poradnik NCSC: sygnały przejęcia, przekazywanie poczty, zmiana haseł, sesje i oficjalne odzyskiwanie.
- Zmiany w adaptacji: Zachowano C. Okresowy przegląd pozostaje sugestią redakcyjną. Nie przeniesiono brytyjskich numerów zgłoszeniowych ani nazw chińskich aplikacji.

<a id="porada-14-7"></a>

### 7. Sprawdzaj osobno uprawnienia aplikacji i zgody na przetwarzanie danych
- Status: verified
- Koszt: Przeczytanie celu dostępu i zmiana ustawień; część funkcji może przestać działać. To ocena redakcji.
- W praktyce: Sprawdź, do czego aplikacja chce mieć dostęp. Odbierz zbędne uprawnienia, na przykład do kontaktów, jeśli nie używasz funkcji, która ich potrzebuje. Oddzielnie przeczytaj informacje o przetwarzaniu danych: jego celu, podstawie i możliwości wycofania zgody, jeżeli to na niej opiera się przetwarzanie. Samo odebranie uprawnienia urządzenia nie musi wycofywać zgody ani usuwać danych już wysłanych.
- Korzyść i dowody: RODO wymaga ograniczenia danych do niezbędnych dla danego celu. Jeśli przetwarzanie opiera się na zgodzie, określa warunki jej dobrowolności i prawo wycofania w dowolnym momencie, równie łatwo jak jej udzielenia. Przy ocenie dobrowolności uwzględnia uzależnianie usługi od zgody na dane zbędne do wykonania umowy. Strona pomocy Androida opisuje osobno zmianę uprawnień urządzenia.
- Ocena dowodów: C — normy prawne i instrukcja systemu, nie badanie skuteczności interwencji.
- Ocena redakcyjna: Kontrola konkretnego celu jest użyteczniejsza niż automatyczne wybieranie „zgadzam się na wszystko”.
- Ograniczenia: Uprawnienie systemowe dotyczy dostępu do funkcji urządzenia; zgoda RODO musi spełniać warunki art. 4 pkt 11 i art. 7. To zestawienie redakcyjne: kliknięcie „Zezwól” samo nie przesądza, czy uzyskano ważną zgodę. Nie wykluczamy, że jedno działanie może spełniać obie funkcje, jeżeli towarzyszą mu właściwe informacje i warunki. Zgoda nie jest jedyną podstawą przetwarzania. Jej wycofanie nie unieważnia wcześniejszego zgodnego z prawem przetwarzania ani nie usuwa automatycznie danych przechowywanych na innej podstawie. Nie każda odmowa zgody daje prawo do dalszego korzystania z każdej usługi. Instrukcja Androida zależy od urządzenia i wersji. To ogólna informacja, nie indywidualna porada prawna ani zatwierdzenie aplikacji przez prawnika.
- Źródła: [RODO, art. 4 pkt 11 oraz art. 5–7, tekst urzędowy udostępniony przez UODO](https://uodo.gov.pl/data/filemanager_pl/727.pdf); [Google: zmiana uprawnień aplikacji](https://support.google.com/android/answer/9431959?hl=pl).
- Oryginał: [14.7](https://github.com/eternity4719/HowToLiveBetter/blob/e2605d3e2242bd6216c9255192b8a8957a08c55a/book/14-%E8%B4%A6%E5%8F%B7%E4%B8%8E%E4%BF%A1%E6%81%AF%E5%AE%89%E5%85%A8.md#L61-L68)
- Weryfikacja: 2026-10-30; urzędowy polski tekst RODO: art. 4 pkt 11, art. 5 ust. 1 lit. c oraz art. 6–7, fizyczne strony 33–37 PDF; instrukcja Androida w zakresie uprawnień. Konsultacja z agentem Prawnik AI i ponowny odczyt przepisów przez redakcję; nie przegląd przez prawnika-człowieka. Bez analizy umowy konkretnej usługi.
- Zmiany w adaptacji: Oryginalne A zastąpiono C dla normy prawnej. Chińskie przepisy zastąpiono odpowiednim zakresem RODO, bez obietnicy, że każda odmowa zgody musi pozostawić usługę dostępną. Poprawka 2026-10-29: źródło systemowe nazwano stroną pomocy, związek między uprawnieniem a zgodą opisano jako zestawienie redakcji, a zdanie o odmowie ograniczono do treści art. 7 ust. 4; dodano zastrzeżenie o braku przeglądu prawnika. Tytuł nie wprowadza już podziału „wymagane”/„dodatkowe” ani nie twierdzi, że uprawnienie nie jest zgodą, czego żadne z cytowanych źródeł nie opisuje; zdanie o funkcjach zastąpiono opisem tego, co mówi strona pomocy. 2026-10-30 (przegląd jakości): rozdzielono odebranie uprawnienia, wycofanie zgody i usunięcie danych. Zachowano możliwość jednoczesnego działania jednego kliknięcia oraz brak uniwersalnego prawa do usługi mimo odmowy. Konsultacja AI nie jest zatwierdzeniem prawnika.

<a id="porada-14-8"></a>

### 8. Korzystaj z praw do danych, ale sprawdź warunki i wyjątki
- Status: verified
- Koszt: Opisanie żądania i zachowanie korespondencji. Realizacja praw jest co do zasady bezpłatna. Przy żądaniach ewidentnie nieuzasadnionych lub nadmiernych administrator może pobrać rozsądną opłatę albo odmówić działania; musi wykazać taki charakter żądania. Za kolejne kopie danych może pobrać rozsądną opłatę wynikającą z kosztów administracyjnych.
- W praktyce: Napisz do administratora danych — osoby lub organizacji decydującej, po co i jak przetwarza twoje dane — czy żądasz dostępu i kopii, sprostowania, czy usunięcia. Wskaż dane i opisz sytuację; nie musisz sporządzać uzasadnienia prawnego ani podawać przepisów. Zachowaj potwierdzenie. Jeśli uważasz, że naruszono RODO, możesz złożyć skargę do Prezesa UODO, także przy braku odpowiedzi w terminie. Skarga nie jest tym samym co żądanie skierowane do administratora.
- Korzyść i dowody: RODO określa dostęp i kopię danych w art. 15, sprostowanie w art. 16 oraz usunięcie w art. 17. Art. 12 przewiduje informację o działaniach bez zbędnej zwłoki, najpóźniej w ciągu miesiąca od otrzymania żądania — nie automatycznie 30 dni. W razie potrzeby termin można przedłużyć o dwa kolejne miesiące ze względu na skomplikowanie lub liczbę żądań, z informacją i przyczyną w pierwszym miesiącu. O odmowie działania też trzeba poinformować najpóźniej w ciągu miesiąca. Art. 77 daje prawo skargi do organu nadzorczego; dostępna jest również ochrona sądowa.
- Ocena dowodów: C — treść rozporządzenia i wyjaśnienie UODO, nie badanie wyników sporów.
- Ocena redakcyjna: Precyzyjne żądanie i zapis korespondencji pomagają ustalić, czego dotyczy odpowiedź. Nie obiecujemy wyniku sporu.
- Ograniczenia: Administrator ocenia przesłanki i wyjątki; zamknięcie konta nie musi usuwać wszystkich danych. Usunięcie nie jest bezwarunkowe: dalsze przetwarzanie może być niezbędne między innymi dla obowiązku prawnego, wolności wypowiedzi, określonych celów interesu publicznego lub roszczeń. Kopia danych nie może naruszać praw i wolności innych osób. Przy uzasadnionych wątpliwościach co do tożsamości administrator może żądać dodatkowych informacji niezbędnych do jej potwierdzenia. Nie wysyłaj automatycznie kopii dokumentu tożsamości; sprawdź potrzebę, zakres danych i kanał. Tekst jest ogólną informacją, nie indywidualną poradą prawną ani zatwierdzeniem przez prawnika.
- Źródła: [RODO, art. 12, 15–17 i 77–79, urzędowy polski tekst](https://uodo.gov.pl/data/filemanager_pl/727.pdf); [UODO: prawo do usunięcia, warunki i skarga](https://www.uodo.gov.pl/pl/493/4098).
- Oryginał: [14.8](https://github.com/eternity4719/HowToLiveBetter/blob/e2605d3e2242bd6216c9255192b8a8957a08c55a/book/14-%E8%B4%A6%E5%8F%B7%E4%B8%8E%E4%BF%A1%E6%81%AF%E5%AE%89%E5%85%A8.md#L70-L77)
- Weryfikacja: 2026-10-30; urzędowy polski tekst art. 12, 15–17 i 77–79, fizyczne strony 39–44 i 80–81 PDF; pełne objaśnienie UODO o usunięciu danych. Konsultacja z agentem Prawnik AI oraz odczyt przepisów przez redakcję; nie przegląd przez prawnika-człowieka. Bez oceny indywidualnego żądania.
- Zmiany w adaptacji: Oryginalne A zastąpiono C. Usunięto chińską podstawę prawną i bezwarunkową obietnicę usunięcia. Dodano wyjątki, tryb odpowiedzi oraz rozróżnienie zamknięcia konta od usunięcia danych. Dodano 2026-10-29 zastrzeżenie, że tekst nie jest poradą prawną i nie miał przeglądu prawnika. 2026-10-30 (przegląd jakości): usunięto sugestię obowiązku prawnego uzasadniania żądania. Nazwano administratora i Prezesa UODO, dodano brak odpowiedzi, opłatę za kolejne kopie i warunek dodatkowej weryfikacji tożsamości. Miesiąca nie zastąpiono 30 dniami; wyjątki pozostają.

<a id="porada-14-9"></a>

### 9. Zanim przekażesz biometrię, zapytaj o cel, podstawę i alternatywę
- Status: verified
- Koszt: Przeczytanie informacji i zapytanie o inną metodę weryfikacji. To ocena redakcji.
- W praktyce: Gdy organizacja chce używać twarzy lub odcisku palca do identyfikacji, zapytaj, kto przetwarza dane, w jakim celu, na jakiej podstawie i jak długo. Zapytaj także o inną metodę.
- Korzyść i dowody: RODO definiuje dane biometryczne przez specjalne przetwarzanie techniczne umożliwiające lub potwierdzające jednoznaczną identyfikację. Przy biometrii używanej do tego celu organizacja potrzebuje podstawy przetwarzania z art. 6 oraz właściwego wyjątku od zakazu z art. 9. Wyraźna zgoda jest jednym z wyjątków, nie jedynym; nadal obowiązują minimalizacja i bezpieczeństwo danych.
- Ocena dowodów: C — norma prawna dotycząca kategorii danych, nie porównanie skuteczności metod logowania.
- Ocena redakcyjna: Warto znać sposób wykorzystania danych przed ich przekazaniem, zamiast utożsamiać wygodę z koniecznością prawną.
- Ograniczenia: Nie każde zdjęcie jest automatycznie przetwarzaniem biometrycznym w tym znaczeniu. Zapytanie o inną metodę nie oznacza bezwarunkowego prawa do jej otrzymania w każdej sytuacji. Możliwość odmowy i ocena dobrowolności zgody zależą od kontekstu i podstawy prawnej. Ta porada dotyczy organizacji przetwarzającej biometrię, nie jest oceną lokalnego odblokowania urządzenia. Ochronę logowania opisuje [14.1](#porada-14-1). To ogólna informacja, nie indywidualna porada prawna ani zatwierdzenie konkretnego systemu przez prawnika.
- Źródła: [RODO, art. 4 pkt 14, art. 5–6, 9 i 13](https://uodo.gov.pl/data/filemanager_pl/727.pdf); [UODO: omówienie danych biometrycznych](https://uodo.gov.pl/pl/file/3534).
- Oryginał: [14.9](https://github.com/eternity4719/HowToLiveBetter/blob/e2605d3e2242bd6216c9255192b8a8957a08c55a/book/14-%E8%B4%A6%E5%8F%B7%E4%B8%8E%E4%BF%A1%E6%81%AF%E5%AE%89%E5%85%A8.md#L79-L86)
- Weryfikacja: 2026-10-30; urzędowy polski tekst art. 4 pkt 14, art. 5–6, 9 i 13; fragmenty materiału UODO o definicji i wyjątkach. Konsultacja z agentem Prawnik AI oraz odczyt przepisów przez redakcję; nie przegląd przez prawnika-człowieka. Bez analizy sektorowej ani rozstrzygnięcia dawnej sprawy szkolnej.
- Zmiany w adaptacji: Oryginalne A zastąpiono C. Usunięto chińskie nakazy, progi liczby osób, terminy rejestracji i granice wieku. Nie utworzono fikcyjnego polskiego prawa do alternatywy w każdej sytuacji. Dodano 2026-10-29 zastrzeżenie, że tekst nie jest poradą prawną i nie miał przeglądu prawnika. 2026-10-30 (przegląd jakości): wyraźnie rozdzielono podstawę z art. 6 i wyjątek z art. 9. Zachowano brak obietnicy alternatywy w każdej sytuacji i odróżnienie organizacji od lokalnego odblokowania telefonu. Nie uznano konsultacji AI za przegląd prawnika.

<a id="porada-14-10"></a>

### 10. Nie przekazuj haseł ani kluczy API niesprawdzonym pośrednikom AI
- Status: verified
- Koszt: Sprawdzenie operatora, warunków przetwarzania i uprawnień narzędzia. Cena nie jest tu dowodem bezpieczeństwa.
- W praktyce: Pośrednik AI to tutaj usługa przekazująca zapytania między tobą a dostawcami modeli. Nie wklejaj do rozmowy haseł, kluczy API ani tokenów, czyli danych umożliwiających dostęp do usług. Klucz API nie jest kluczem dostępu typu passkey z [14.1](#porada-14-1). Używaj takich danych tylko w przeznaczonej do tego, zweryfikowanej konfiguracji usługi, z ograniczonymi uprawnieniami. Oddzielnie oceń, czy wolno ci przekazać dane osobowe lub poufny kod i jakie są warunki narzędzia. Zgoda na przetwarzanie danych nie upoważnia do ujawnienia haseł. Zasada bezpieczeństwa redakcji: nie pozwalaj niezweryfikowanym odpowiedziom AI samodzielnie wykonywać poleceń z szerokimi uprawnieniami; przy ujawnieniu klucza unieważnij go u wystawcy.
- Korzyść i dowody: Autorzy pracy Your Agent Is Mine opisali badanie 28 płatnych i 400 bezpłatnych pośredników API modeli. W tej próbie wykryli między innymi wstrzykiwanie szkodliwego kodu do odpowiedzi oraz użycie kontrolnych danych dostępowych należących do badaczy. Badani pośrednicy mieli dostęp do jawnej treści przekazywanych żądań. Opis jest preprintem, czyli wersją pracy udostępnioną przed recenzją naukową.
- Ocena dowodów: B — pojedyncze badanie pomiarowe opublikowane jako preprint, nie reprezentatywna ocena całego rynku.
- Ocena redakcyjna: Sekretu nie należy używać do sprawdzania wiarygodności nieznanego dostawcy. Ocena musi poprzedzać przekazanie danych.
- Ograniczenia: Próba nie określa odsetka wszystkich złośliwych pośredników. Nawet operator wyglądający na wiarygodnego wymaga oceny; badanie opisuje także nadużycia po ujawnieniu kluczy do pozornie zwykłych usług. Bezpośrednie połączenie z dostawcą nie jest gwarancją poufności. Sama zmiana nazwy lub zamaskowanie fragmentu nie musi usuwać danych osobowych. Ocena polecenia przez człowieka nie gwarantuje wykrycia każdego ataku.
- Źródła: Your Agent Is Mine: Measuring Malicious Intermediary Attacks on the LLM Supply Chain (2026). [Abstrakt autorów i wersje preprintu](https://arxiv.org/abs/2604.08407); [RODO, art. 5–6: podstawy i zasady przetwarzania](https://uodo.gov.pl/data/filemanager_pl/727.pdf).
- Oryginał: [14.10](https://github.com/eternity4719/HowToLiveBetter/blob/e2605d3e2242bd6216c9255192b8a8957a08c55a/book/14-%E8%B4%A6%E5%8F%B7%E4%B8%8E%E4%BF%A1%E6%81%AF%E5%AE%89%E5%85%A8.md#L88-L95)
- Weryfikacja: 2026-10-30; abstrakt preprintu: projekt pomiaru, liczebności, dostęp do treści i badawczych danych dostępowych oraz rodzaje nadużyć; polski tekst art. 5–6 RODO dla ogólnego zastrzeżenia o danych. Konsultacja z agentem Prawnik AI o oddzieleniu upoważnienia do danych od ujawnienia sekretów. Bez własnych testów usług, pełnej walidacji kodu badaczy ani zatwierdzenia prawnika.
- Zmiany w adaptacji: Zachowano B z jawnym statusem preprintu. Usunięto chiński komunikat urzędowy jako polską podstawę oraz kwoty szkód i instrukcje ataku. Nie obiecujemy, że każde bezpośrednie połączenie jest bezpieczne. 2026-10-30 (przegląd run7, decyzja właściciela): dwa zdania ostrzegawcze oznaczono jako propozycje redakcji; abstrakt opisuje nadużycia ujawnionych kluczy i obronę po stronie klienta, ale nie podaje ani takiej reguły, ani procedury unieważniania. 2026-10-30 (przegląd jakości): wyjaśniono pośrednika, preprint i klucz API, odróżniono go od passkey. Usunięto wspólny warunek mogący sugerować, że upoważnienie dotyczące danych usprawiedliwia ujawnienie hasła. Zasady ostrożności pozostają redakcyjne, a nie wynikiem testu ich skuteczności.

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
- Koszt: Przegląd używanych usług i potwierdzenie nowych sposobów kontaktu oraz odzyskiwania konta. Nie zakładamy stałego czasu wykonania.
- W praktyce: W usługach, które korzystają ze starego numeru, ustaw i sprawdź nowy numer lub inną metodę odzyskiwania konta, zanim stracisz dostęp do starego numeru. Uwzględnij pocztę e-mail, bank i inne ważne konta, ale postępuj według procedury każdego dostawcy. Nie zakładaj, że jedna zmiana aktualizuje wszystkie usługi.
- Korzyść i dowody: Google wyjaśnia, że numer może służyć do logowania lub odzyskiwania konta, a jego zmiana wpływa tylko na niektóre usługi; inne mogą mieć własne ustawienia. Ostrzega także, że zanim nowy numer będzie używany do potwierdzania tożsamości przy wrażliwych działaniach, takich jak zmiana hasła, może upłynąć tydzień.
- Ocena dowodów: C — dokumentacja dostawcy i redakcyjna lista kontrolna, bez badania unikniętych strat.
- Ocena redakcyjna: Warto sprawdzić działanie nowej metody przed wyłączeniem starej. Lista usług jest przykładem, nie kompletnym rejestrem twoich kont.
- Ograniczenia: Samo zapisanie nowego numeru nie oznacza, że każda metoda odzyskiwania już działa. Wzmianka o tygodniu dotyczy opisanej procedury Google, nie wszystkich usług. Zaplanuj przejście tak, by nie utracić jedynej działającej metody dostępu. Nie podajemy polskiego okresu ponownego przydziału numeru ani jednolitej procedury bankowej. Wymagania potwierdź u własnego dostawcy.
- Źródła: [Google: zmiana numeru i różne sposoby jego użycia](https://support.google.com/accounts/answer/3463280?hl=pl); [NCSC: odzyskiwanie zależy od dostawcy](https://www.ncsc.gov.uk/guidance/recovering-a-hacked-account).
- Oryginał: [14.12](https://github.com/eternity4719/HowToLiveBetter/blob/e2605d3e2242bd6216c9255192b8a8957a08c55a/book/14-%E8%B4%A6%E5%8F%B7%E4%B8%8E%E4%BF%A1%E6%81%AF%E5%AE%89%E5%85%A8.md#L106-L113)
- Weryfikacja: 2026-10-30; pełna polska strona pomocy Google: zakres zmiany, funkcje odzyskiwania i ostrzeżenie o możliwym tygodniu przed użyciem nowego numeru do wrażliwych działań. Poprzednio sprawdzone wskazanie NCSC o odrębnych procedurach dostawców pozostaje bez uogólniania terminu.
- Zmiany w adaptacji: Zachowano C. Usunięto chiński termin 90 dni, usługi państwowe i domyślny okres pozostawienia starej karty. Ogólną listę kontrolną oznaczono jako redakcyjną. 2026-10-30 (przegląd jakości): dodano ostrzeżenie Google o możliwym opóźnieniu; nie ustanowiono wspólnego okresu przejściowego dla banków i operatorów.
