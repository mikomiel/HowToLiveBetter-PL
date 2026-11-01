[← Polskie rozdziały](../README.md)

# 11. Czerwone linie IT: czego osobom technicznym nie wolno robić

Niezależna polska adaptacja rozdziału 11 z HowToLiveBetter autorstwa eternity4719, na podstawie commita [e2605d3e2242bd6216c9255192b8a8957a08c55a](https://github.com/eternity4719/HowToLiveBetter/tree/e2605d3e2242bd6216c9255192b8a8957a08c55a). Tekst adaptacji: [CC BY 4.0](../../LICENSE); zachowano pochodzenie, zmieniono język, zalecenia, oceny i zakres dowodów. To nie jest oficjalne wydanie autora.

Ten rozdział zbiera rzeczy, które osoby piszące kod i pracujące z systemami często traktują jak „tylko technikę”, a które w Polsce kończą się paragrafem karnym albo pozwem o pieniądze: cheaty i skrypty, dostęp do cudzych systemów, dane osobowe, kontrakty z przestępcami, własność kodu, licencje open source, prywatność aplikacji, AI i ataki sieciowe. To opis przepisów i procedur, nie porada prawna dla konkretnej sprawy — w razie wątpliwości skorzystaj z nieodpłatnej pomocy prawnej (zob. [07.3](07-jak-zyc-gdy-nie-masz-pieniedzy.md#porada-7-3)). Pamiętaj: asystent AI (także ten, z którego korzystasz) nie jest adwokatem ani radcą prawnym.

Oceniono wszystkie 21 pozycji rozdziału: wszystkie mają stan verified i są publikowane. Numeracja odpowiada oryginałowi, nie rankingowi korzyści.

Porady dotyczą osób działających z Polski / w polskim porządku prawnym, chyba że przy konkretnej pozycji podano inny zakres. W bezpośrednim zagrożeniu życia dzwoń pod 112; na policję — 997; straż pożarna — 998; w kryzysie emocjonalnym osoby dorosłej — 116 123, dziecka lub osoby nastoletniej — 116 111.

Źródła sprawdzono w zakresie zapisanym przy pozycjach — głównie aktualne polskie akty prawne (Kodeks karny rozdział XXXIII „Przestępstwa przeciwko ochronie informacji” — art. 267, 268a, 269, 269a, 269b, 269c; art. 18, 190a, 287 KK; Kodeks karny skarbowy art. 107; Kodeks pracy art. 101¹-101², art. 100; Kodeks postępowania karnego art. 244, 263; ustawa o prawie autorskim art. 41/74; ustawa o zwalczaniu nieuczciwej konkurencji art. 11/23; Prawo telekomunikacyjne; ustawa o KSC; ustawa o świadczeniu usług drogą elektroniczną — lexlege/sip.lex.pl/ISAP/eli.gov.pl) oraz prawo UE (RODO, rozporządzenie (UE) 2024/1689 „AI Act") i oficjalne źródła (UODO, UOKiK, UKE, CERT Polska, gov.pl). Wiele pozycji oryginału opierało się na chińskim prawie i chińskich instytucjach — zastąpiono je polskimi i unijnymi odpowiednikami. Oceny A/B/C oznaczają rodzaj podstawy według README, nie gwarancję ani system GRADE. Nie prowadzono nowego pełnego systematycznego przeglądu ani przeglądu przez uprawnionego eksperta.

<a id="porada-11-1"></a>

### 1. Zanim coś zrobisz „technicznie”, zapytaj: czy producent, platforma albo pracodawca ma powód, żeby to zgłosić; gdy już jesteś zatrzymany — od razu obrońca (a w razie potrzeby nieodpłatna pomoc prawna)
- Status: verified
- Koszt: Bezpłatnie. Przed działaniem zamień pytanie „czy technicznie się da” na „czy ktoś to zgłosi”. Trudność: logi serwerów, płatności i rozmowy są dostępne dla organów ścigania.
- W praktyce: W Polsce każdy może zawiadomić o przestępstwie, a organy ścigania zbierają dowody (w tym dane elektroniczne). Zatrzymanie przez policję może trwać do 48 godzin (k.p.k. art. 244 §1); tymczasowe aresztowanie w postępowaniu przygotowawczym — co do zasady do 3 miesięcy, z możliwością przedłużenia (k.p.k. art. 263). Od zatrzymania/przesłuchania przysługuje prawo do obrońcy (k.p.k. — poziom wyszukiwania); gdy nie stać cię na pełnomocnika — nieodpłatna pomoc prawna (zob. [07.3](07-jak-zyc-gdy-nie-masz-pieniedzy.md#porada-7-3)).
- Korzyść i dowody: k.p.k. art. 244 §1 (pełny odczyt lexlege): zatrzymanie przez policję — niezwłocznie, max 48 h na przekazanie sądowi. k.p.k. art. 263 §1 (pełny odczyt): tymczasowe aresztowanie w postępowaniu przygotowawczym — max 3 miesiące, sąd może przedłużać (art. 263 §2-3). Prawo do obrońcy od pierwszej czynności (k.p.k. art. 71/245 — poziom wyszukiwania); NPP: ustawa o nieodpłatnej pomocy prawnej (poziom wyszukiwania).
- Ocena dowodów: C — opis procedury karnej na podstawie przepisów k.p.k. (część pełne odczyty, część poziom wyszukiwania); bez przeglądu orzecznictwa.
- Ocena redakcyjna: „To tylko technika” nie jest linią obrony — liczy się skutek i czy ktoś zgłosi. Obrońcę bierze się od pierwszej czynności, nie dopiero na etapie sądu.
- Ograniczenia: Terminy procesowe są złożone (przedłużenia aresztu, postępowanie sądowe); nie opisujemy tu całej procedury karnej — to opis ramowy, nie porada dla konkretnej sprawy.
- Źródła: [k.p.k. art. 244 — zatrzymanie przez policję (lexlege, pełny odczyt)](https://lexlege.pb.pl/kodeks-postepowania-karnego/art-244); [k.p.k. art. 263 — tymczasowe aresztowanie (lexlege, pełny odczyt)](https://lexlege.pb.pl/kodeks-postepowania-karnego/art-263); [Ustawa o nieodpłatnej pomocy prawnej (sip.lex.pl, poziom wyszukiwania)](https://sip.lex.pl/akty-prawne/dzu-dziennik-ustaw/ustawa-o-nieodplatnej-pomocy-prawnej-17506493)
- Oryginał: [11.1](https://github.com/eternity4719/HowToLiveBetter/blob/e2605d3e2242bd6216c9255192b8a8957a08c55a/book/11-%E7%A8%8B%E5%BA%8F%E5%91%98%E5%92%8C%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%AE%B9%E6%98%93%E8%B8%A9%E7%9A%84%E7%BA%A2%E7%BA%BF.md#L21-L29)
- Weryfikacja: 2026-11-01; pełne odczyty k.p.k. art. 244 i 263 (lexlege.pb.pl); wyniki wyszukiwań: art. 71/245 k.p.k. (prawo do obrońcy), ustawa o NPP; nie przeglądano orzecznictwa.
- Zmiany w adaptacji: Oryginalne C zachowane. Chińska procedura (37 dni od zatrzymania do decyzji o areszcie, k.p.k. CN art. 67/79/91/97) zastąpiona polską: zatrzymanie do 48 h (k.p.k. art. 244), areszt tymczasowy do 3 miesięcy z przedłużeniami (art. 263); chińskie „37 dni” to był sumaryczny opis innej procedury.

<a id="porada-11-2"></a>

### 2. Nie rób i nie sprzedawaj cheatów do gier ani „modów” dodających funkcje do cudzych aplikacji — w tym „czytających tylko ekran” asystentów AI
- Status: verified
- Koszt: Bezpłatnie. Koszt to utrata tego typu zleceń i „małych narzędzi”.
- W praktyce: Wytwarzanie, pozyskiwanie, zbywanie lub udostępnianie programów przystosowanych do popełnienia przestępstw z art. 267, 268a, 269, 269a KK (czyli m.in. cheatów zakłócających grę) to KK art. 269b §1: kara pozbawienia wolności od 3 miesięcy do lat 5, a przy skazaniu sąd orzeka przepadek (art. 269b §2). Sam dostęp do cudziego systemu (np. przez lukę w grze) to art. 267 §2 KK — do lat 2, ścigane na wniosek pokrzywdzonego (§5).
- Korzyść i dowody: KK rozdział XXXIII (pełny odczyt rozdziału lexlege, tekst jednolity Dz.U.2026.1342): art. 269b §1-2 — 3 miesiące do 5 lat + przepadek; art. 267 §2 — dostęp do systemu informatycznego bez uprawnienia, do lat 2, na wniosek (§5); art. 267 §1 — przełamanie zabezpieczeń informacji. Naruszenie praw autorskich (omijanie zabezpieczeń programu) — KK przepisy o prawie autorskim + upa, poziom wyszukiwania.
- Ocena dowodów: A — KK art. 267 i 269b z pełnymi odczytami (rozdział XXXIII); przepisy autorskie na poziomie wyszukiwania.
- Ocena redakcyjna: „Tylko odczyt ekranu, bez ruszania pamięci” też może być przestępstwem — o kwalifikacji decyduje organ ścigania, nie opis narzędzia.
- Ograniczenia: Art. 269b §1a wyłącza karalność, gdy ktoś działa wyłącznie w celu zabezpieczenia systemu — cheaty komercyjne tego nie spełniają; czy konkretny cheat „zakłóca” system, ocenia sąd kazuistycznie.
- Źródła: [KK rozdział XXXIII — przestępstwa przeciwko ochronie informacji (lexlege, pełny odczyt)](https://lexlege.pb.pl/kodeks-karny/rozdzial-xxxiii-przestepstwa-przeciwko-ochronie-informacji/211/); [KK art. 269b — programy przystosowane do przestępstw (lexlege)](https://lexlege.pb.pl/kodeks-karny/art-269b/); [KK art. 267 — bezprawne uzyskanie informacji (lexlege)](https://lexlege.pb.pl/kodeks-karny/art-267/)
- Oryginał: [11.2](https://github.com/eternity4719/HowToLiveBetter/blob/e2605d3e2242bd6216c9255192b8a8957a08c55a/book/11-%E7%A8%8B%E5%BA%8F%E5%91%98%E5%92%8C%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%AE%B9%E6%98%93%E8%B8%A9%E7%9A%84%E7%BA%A2%E7%BA%BF.md#L30-L38)
- Weryfikacja: 2026-11-01; pełny odczyt rozdziału XXXIII KK (lexlege.pb.pl, Dz.U.2026.1342 t.j., stan 01.11.2026); wyniki wyszukiwań: KK art. 115-118 (prawa autorskie), orzecznictwo ws. cheatów.
- Zmiany w adaptacji: Oryginalne A zachowane. Chińskie art. 285 §3 KK CN (narzędzia do włamań — 3/7 lat, progi 20 osób/5000 yuanów) i art. 217 KK CN (naruszenie praw autorskich przez omijanie zabezpieczeń) zastąpione aktualnym KK rozdz. XXXIII: art. 269b (3 mies.-5 lat) i art. 267 §2 (do 2 lat, na wniosek); chińskie progi ilościowe/kwotowe nie mają polskiego odpowiednika ustawowego.

<a id="porada-11-3"></a>

### 3. Nie pisz ani nie sprzedawaj skryptów do „szybkiego klikania” (bilety, promocje, zamówienia) — samo wysyłanie żądań też może być przestępstwem
- Status: verified
- Koszt: Bezpłatnie i bez nakładu czasu.
- W praktyce: Skrypt, który omija zabezpieczenia (login, token, podpis) i pobiera dane z cudziego systemu, to dostęp do systemu informatycznego bez uprawnienia — KK art. 267 §2 (do lat 2, na wniosek). Udostępnianie takiego skryptu innym to art. 269b §1 (3 miesiące do 5 lat). Sprzedaż narzędzi zakłócających działanie cudzej platformy może też być czynem nieuczciwej konkurencji (uokik — poziom wyszukiwania).
- Korzyść i dowody: KK art. 267 §2 i art. 269b §1 (pełne odczyty rozdziału XXXIII lexlege, stan 01.11.2026). Uokik (ustawa o zwalczaniu nieuczciwej konkurencji) — odpowiedzialność cywilna za zakłócanie działalności innego przedsiębiorcy, poziom wyszukiwania.
- Ocena dowodów: A — KK art. 267 §2 / 269b pełne odczyty; uokik na poziomie wyszukiwania.
- Ocena redakcyjna: „Nie modyfikuję pamięci, tylko klikam szybciej” nie wyłącza odpowiedzialności — liczy się omijanie zabezpieczeń i pobieranie danych, nie sposób techniczny.
- Ograniczenia: Ściganie art. 267 wymaga wniosku pokrzywdzonego; czy dane „wymagają logowania/zabezpieczeń”, ocenia się kazuistycznie; samo jednorazowe użycie prywatne — praktyka ścigania rzadka (poziom wyszukiwania).
- Źródła: [KK art. 267 (lexlege, pełny odczyt)](https://lexlege.pb.pl/kodeks-karny/art-267/); [KK art. 269b (lexlege, pełny odczyt)](https://lexlege.pb.pl/kodeks-karny/art-269b/); [Uokik (sip.lex.pl, poziom wyszukiwania)](https://sip.lex.pl/akty-prawne/dzu-dziennik-ustaw/zwalczanie-nieuczciwej-konkurencji-16795259)
- Oryginał: [11.3](https://github.com/eternity4719/HowToLiveBetter/blob/e2605d3e2242bd6216c9255192b8a8957a08c55a/book/11-%E7%A8%8B%E5%BA%8F%E5%91%98%E5%92%8C%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%AE%B9%E6%98%93%E8%B8%A9%E7%9A%84%E7%BA%A2%E7%BA%BF.md#L39-L47)
- Weryfikacja: 2026-11-01; pełne odczyty KK art. 267/269b (lexlege.pb.pl); wyniki wyszukiwań: uokik, orzecznictwo ws. skryptów automatyzujących zakupy.
- Zmiany w adaptacji: Oryginalne A zachowane. Chińskie art. 285 §2 KK CN (nielegalne pozyskanie danych — progi kwotowe w walucie lokalnej) zastąpione KK art. 267 §2 + 269b; chińskie progi kwotowe zastąpione klauzulą „na wniosek pokrzywdzonego”.

<a id="porada-11-4"></a>

### 4. Scrapuj tylko publiczne strony bez logowania; nie omijaj zabezpieczeń, nie zbieraj danych osobowych, nie sprzedawaj zebranych danych
- Status: verified
- Koszt: Bezpłatnie. Przed scrapingiem sprawdź plik robots.txt i regulamin/API strony; danych za loginem/tokenem/podpisem nie pobieraj.
- W praktyce: Omijanie zabezpieczeń i pobieranie danych z cudziego systemu to KK art. 267 §2 (do lat 2, na wniosek). Dane osobowe ze scrapingu podlegają RODO: przetwarzanie wymaga podstawy prawnej (art. 6 RODO), a zasady art. 5 RODO (m.in. minimalizacja) — naruszenie grozi karą administracyjną UODO do 20 mln euro lub 4% obrotu (art. 83 RODO). Udostępnianie cudzych danych osobowych to też KK art. 267 §4 (ujawnienie informacji, do lat 2).
- Korzyść i dowody: KK art. 267 §2 i §4 (pełne odczyty, rozdział XXXIII, stan 01.11.2026). RODO (rozporządzenie (UE) 2016/679): art. 5 (zasady), art. 6 (podstawa prawna), art. 83 (kary administracyjne do 20 mln EUR / 4% całkowitego obrotu) — poziom wyszukiwania (eur-lex/sip.lex).
- Ocena dowodów: A — KK art. 267 pełny odczyt; RODO art. 5/6/83 na poziomie wyszukiwania (tekst rozporządzenia UE).
- Ocena redakcyjna: Publicznie dostępne ≠ „moje do wzięcia” — dane osobowe są chronione niezależnie od tego, skąd pochodzą.
- Ograniczenia: RODO nie definiuje „scrapingu” wprost — ocena należy do UODO i sądów (poziom wyszukiwania); KK art. 267 ścigany na wniosek; strony publiczne bez danych osobowych co do zasady nie wchodzą w zakres art. 267 §2 (poziom wyszukiwania).
- Źródła: [KK art. 267 (lexlege, pełny odczyt)](https://lexlege.pb.pl/kodeks-karny/art-267/); [RODO — rozporządzenie (UE) 2016/679, art. 5/6/83 (eur-lex)](https://eur-lex.europa.eu/eli/reg/2016/679/oj); [UODO — kary administracyjne (uodo.gov.pl, poziom wyszukiwania)](https://www.uodo.gov.pl/)
- Oryginał: [11.4](https://github.com/eternity4719/HowToLiveBetter/blob/e2605d3e2242bd6216c9255192b8a8957a08c55a/book/11-%E7%A8%8B%E5%BA%8F%E5%91%98%E5%92%8C%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%AE%B9%E6%98%93%E8%B8%A9%E7%9A%84%E7%BA%A2%E7%BA%BF.md#L48-L56)
- Weryfikacja: 2026-11-01; pełny odczyt KK art. 267 (lexlege); RODO przez eur-lex/sip.lex (poziom wyszukiwania art. 5/6/83); wytyczne UODO/EDPB ws. scrapingu — poziom wyszukiwania.
- Zmiany w adaptacji: Oryginalne A zachowane. Chińskie art. 285 §2 i 253-1 KK CN (nielegalne pozyskanie danych i obywatelskich informacji osobistych z progami 50/500/5000 rekordów) zastąpione: KK art. 267 §2/§4 + RODO art. 5/6/83; chińskie progi ilościowe nie mają polskiego odpowiednika.

<a id="porada-11-5"></a>

### 5. Nie przyjmuj zleceń na aplikacje hazardowe, oszustów i pornograficzne; nie buduj dla „klientów” kanałów płatności ani nie odblokowuj kont
- Status: verified
- Koszt: Bezpłatnie. Koszt to odrzucenie dobrze płatnych, ale „dziwnych” zleceń.
- W praktyce: Organizowanie gier hazardowych wbrew ustawie to KKS art. 107 (zob. też [09.13](09-czerwone-linie-prawa.md#porada-9-13)); świadome pomaganie w przestępstwie sieciowym (program, płatności, odblokowanie kont) to pomocnictwo karne — KK art. 18 §3 (karze podlega także pomocnik); oszustwo komputerowe to KK art. 287 (wpływanie na przetwarzanie danych w celu korzyści majątkowej — do lat 5).
- Korzyść i dowody: KKS art. 107 (pełny odczyt lexlege): urządzanie/prowadzenie gier hazardowych wbrew ustawie lub koncesji. KK art. 18 §3 (pełny odczyt): pomocnictwo karne. KK art. 287 (pełny odczyt): oszustwo komputerowe.
- Ocena dowodów: A — KKS art. 107, KK art. 18 §3 i art. 287 z pełnymi odczytami.
- Ocena redakcyjna: „Klient nie powiedział, po co” nie działa — przy wyraźnie podejrzanych projektach „wiedzę” można wywodzić z okoliczności (cena, funkcje, tajność).
- Ograniczenia: Kwalifikacja (współsprawstwo vs pomocnictwo) należy do sądu; nie każde zlecenie „z pogranicza” jest karalne — opisujemy ryzyko, nie orzekamy.
- Źródła: [KKS art. 107 — gry hazardowe (lexlege, pełny odczyt)](https://lexlege.pb.pl/kodeks-karny-skarbowy/art-107); [KK art. 18 — formy zjawiskowe (lexlege, pełny odczyt)](https://lexlege.pb.pl/kodeks-karny/art-18); [KK art. 287 — oszustwo komputerowe (lexlege, pełny odczyt)](https://lexlege.pb.pl/kodeks-karny/art-287)
- Oryginał: [11.5](https://github.com/eternity4719/HowToLiveBetter/blob/e2605d3e2242bd6216c9255192b8a8957a08c55a/book/11-%E7%A8%8B%E5%BA%8F%E5%91%98%E5%92%8C%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%AE%B9%E6%98%93%E8%B8%A9%E7%9A%84%E7%BA%A2%E7%BA%BF.md#L57-L65)
- Weryfikacja: 2026-11-01; pełne odczyty KKS art. 107, KK art. 18 i 287 (lexlege.pb.pl); wyniki wyszukiwań: pomocnictwo do przestępstw informatycznych, orzecznictwo ws. deweloperów aplikacji hazardowych.
- Zmiany w adaptacji: Oryginalne A zachowane. Chińskie art. 287-2 KK CN (pomoc w przestępstwach informatycznych osobny typ przestępstwa pomocnictwa informatycznego — do 3 lat) i art. 303 §2 (otwieranie kasyna online — 5-10 lat) zastąpione: KK art. 18 §3 (pomocnictwo) + KKS art. 107 + KK art. 287; w PL nie ma osobnego „przestępstwa pomocnictwa informatycznego” jak w oryginale — pomocnictwo idzie przez art. 18 §3.

<a id="porada-11-6"></a>

### 6. Przy odejściu oddaj wszystkie konta i uprawnienia; nie usuwaj repozytoriów, nie zostawiaj „furt” ani nie zmieniaj haseł — nawet gdy firma zalega z wypłatą
- Status: verified
- Koszt: Bezpłatnie. Zaległe wynagrodzenie dochodź w sądzie pracy (zob. [07.3](07-jak-zyc-gdy-nie-masz-pieniedzy.md#porada-7-3)), nie „samemu”.
- W praktyce: Konto i hasło służbowe przestają być twoje z chwilą rozwiązania umowy. Dostęp do systemu firmy bez uprawnienia po odejściu to KK art. 267 §2 (do lat 2). Usunięcie/zmiana danych to KK art. 268a §1 (do lat 3; przy znacznej szkole 3 miesiące do 5 lat, §2). Celowe unieruchomienie systemu (np. zmiana haseł blokująca pracę) to KK art. 269a (zakłócenie pracy systemu — 3 miesiące do 5 lat). Cywilnie pracodawca może żądać naprawienia szkody (k.p. art. 100 i nast.).
- Korzyść i dowody: KK art. 267 §2, art. 268a §1-2, art. 269a (pełne odczyty rozdziału XXXIII lexlege, stan 01.11.2026); k.p. art. 100 (pełny odczyt): obowiązki pracownika, odpowiedzialność za szkodę (k.p. art. 100-114, poziom wyszukiwania).
- Ocena dowodów: A — KK art. 267/268a/269a i k.p. art. 100 z pełnymi odczytami; szczegóły odpowiedzialności majątkowej pracownika na poziomie wyszukiwania.
- Ocena redakcyjna: „Firma mi zalega, więc biorę odwet” kończy się odpowiedzialnością karną i cywilną jednocześnie — spory o pieniądze rozwiązuje sąd.
- Ograniczenia: Art. 267/268a ścigane na wniosek pokrzywdzonego; czy doszło do „znacznej szkody”, ocenia biegły/sąd; k.p. ogranicza odpowiedzialność pracownika za szkodę wyrządzoną umyślnie vs nieumyślnie (poziom wyszukiwania).
- Źródła: [KK rozdział XXXIII (lexlege, pełny odczyt)](https://lexlege.pb.pl/kodeks-karny/rozdzial-xxxiii-przestepstwa-przeciwko-ochronie-informacji/211/); [KK art. 268a (lexlege)](https://lexlege.pb.pl/kodeks-karny/art-268a); [KK art. 269a (lexlege)](https://lexlege.pb.pl/kodeks-karny/art-269a); [k.p. art. 100 (lexlege, pełny odczyt)](https://lexlege.pb.pl/kodeks-pracy/art-100)
- Oryginał: [11.6](https://github.com/eternity4719/HowToLiveBetter/blob/e2605d3e2242bd6216c9255192b8a8957a08c55a/book/11-%E7%A8%8B%E5%BA%8F%E5%91%98%E5%92%8C%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%AE%B9%E6%98%93%E8%B8%A9%E7%9A%84%E7%BA%A2%E7%BA%BF.md#L66-L74)
- Weryfikacja: 2026-11-01; pełne odczyty KK art. 267/268a/269a i k.p. art. 100 (lexlege.pb.pl); wyniki wyszukiwań: k.p. art. 100-114 (odpowiedzialność za szkodę), orzecznictwo ws. usuwania danych przez odchodzących pracowników.
- Zmiany w adaptacji: Oryginalne A zachowane. Chińskie art. 285 §2 i 286 KK CN (nielegalna kontrola systemu; niszczenie danych systemu — 5+ lat) zastąpione aktualnym KK: art. 267 §2, 268a i 269a; chińskie progi strat w walucie lokalnej nie mają polskiego odpowiednika — w PL o wysokości kary decyduje „znaczna szkoda” (art. 268a §2).

<a id="porada-11-7"></a>

### 7. Nie wynoś z firmy kodu źródłowego, list klientów ani dokumentacji technicznej (także do osobistej chmury) i nie używaj jej u kolejnego pracodawcy
- Status: verified
- Koszt: Bezpłatnie. Przed odejściem usuń z prywatnych urządzeń i chmur materiały firmowe.
- W praktyce: Ujawnienie lub wykorzystanie tajemnicy przedsiębiorstwa to czyn nieuczciwej konkurencji (uokik art. 11) z odpowiedzialnością cywilną (uokik art. 23 — m.in. odszkodowanie, zaniechanie); KK art. 267 §4 karze ujawnienie cudzej informacji (do lat 2, na wniosek). Kod napisany w pracy zazwyczaj należy do pracodawcy (zob. 11.13).
- Korzyść i dowody: uokik art. 11 (pełny odczyt lexlege): czynem nieuczciwej konkurencji jest ujawnienie/wykorzystanie tajemnicy przedsiębiorstwa; art. 23 (pełny odczyt): odpowiedzialność odszkodowawcza. KK art. 267 §4 (pełny odczyt): ujawnienie informacji uzyskanej bezprawnie.
- Ocena dowodów: A — uokik art. 11/23 i KK art. 267 §4 z pełnymi odczytami.
- Ocena redakcyjna: „Sam to napisałem” zazwyczaj nie zmienia właściciela kodu — patrz umowa o pracę i 11.13; listy klientów mogą być tajemnicą przedsiębiorstwa.
- Ograniczenia: Co dokładnie jest „tajemnicą przedsiębiorstwa”, ocenia sąd kazuistycznie (uokik art. 11 wymaga m.in. poufności i wartości gospodarczej); KK art. 267 ścigany na wniosek.
- Źródła: [uokik art. 11 — tajemnica przedsiębiorstwa (lexlege, pełny odczyt)](https://lexlege.pb.pl/ustawa-o-zwalczaniu-nieuczciwej-konkurencji/art-11); [uokik art. 23 — odpowiedzialność (lexlege, pełny odczyt)](https://lexlege.pb.pl/ustawa-o-zwalczaniu-nieuczciwej-konkurencji/art-23); [KK art. 267 (lexlege)](https://lexlege.pb.pl/kodeks-karny/art-267/)
- Oryginał: [11.7](https://github.com/eternity4719/HowToLiveBetter/blob/e2605d3e2242bd6216c9255192b8a8957a08c55a/book/11-%E7%A8%8B%E5%BA%8F%E5%91%98%E5%92%8C%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%AE%B9%E6%98%93%E8%B8%A9%E7%9A%84%E7%BA%A2%E7%BA%BF.md#L75-L83)
- Weryfikacja: 2026-11-01; pełne odczyty uokik art. 11/23 i KK art. 267 (lexlege.pb.pl); wyniki wyszukiwań: orzecznictwo ws. wynoszenia kodu źródłowego przez pracowników.
- Zmiany w adaptacji: Oryginalne A zachowane. Chińskie art. 219 KK CN (naruszenie tajemnicy handlowej — 3/10 lat) i chińska ustawa o nieuczciwej konkurencji art. 10 zastąpione uokik art. 11/23 + KK art. 267 §4; w PL brak osobnego "przestępstwa tajemnicy handlowej" w KK na wzór oryginału — ochrona głównie cywilna (uokik) plus art. 267 §4.

<a id="porada-11-8"></a>

### 8. Nie uruchamiaj własnych programów na cudzych komputerach, serwerach ani kamerach; nie używaj firmowych maszyn do kopania kryptowalut
- Status: verified
- Koszt: Bezpłatnie.
- W praktyce: Zdalne sterowanie cudzym urządzeniem bez zgody to dostęp do systemu informatycznego bez uprawnienia — KK art. 267 §2 (do lat 2, na wniosek); rozsyłanie programu, który to umożliwia, to art. 269b §1 (3 miesiące do 5 lat). Kopanie kryptowalut na sprzęcie pracodawcy bez zgody to nadużycie zasobów firmy — odpowiedzialność pracownicza (k.p. art. 100) i ewentualnie art. 268a/269a, gdy szkodzi systemowi.
- Korzyść i dowody: KK art. 267 §2, 269b §1, 268a, 269a (pełne odczyty rozdziału XXXIII, stan 01.11.2026); k.p. art. 100 (pełny odczyt).
- Ocena dowodów: A — KK art. 267/269b/268a/269a i k.p. art. 100 z pełnymi odczytami.
- Ocena redakcyjna: „To tylko test na cudzej kamerze” — zgoda właściciela urządzenia jest kluczowa; bez niej to przestępstwo, nie test.
- Ograniczenia: Art. 267 ścigany na wniosek; szkoda materialna przy kopaniu na firmowym sprzęcie rozliczana cywilnie (k.p.); nie oceniamy tu wartości energii.
- Źródła: [KK rozdział XXXIII (lexlege, pełny odczyt)](https://lexlege.pb.pl/kodeks-karny/rozdzial-xxxiii-przestepstwa-przeciwko-ochronie-informacji/211/); [KK art. 269b (lexlege)](https://lexlege.pb.pl/kodeks-karny/art-269b/); [k.p. art. 100 (lexlege, pełny odczyt)](https://lexlege.pb.pl/kodeks-pracy/art-100)
- Oryginał: [11.8](https://github.com/eternity4719/HowToLiveBetter/blob/e2605d3e2242bd6216c9255192b8a8957a08c55a/book/11-%E7%A8%8B%E5%BA%8F%E5%91%98%E5%92%8C%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%AE%B9%E6%98%93%E8%B8%A9%E7%9A%84%E7%BA%A2%E7%BA%BF.md#L84-L92)
- Weryfikacja: 2026-11-01; pełne odczyty KK rozdz. XXXIII i k.p. art. 100 (lexlege.pb.pl); wyniki wyszukiwań: orzecznictwo ws. nieuprawnionego sterowania cudkimi urządzeniami.
- Zmiany w adaptacji: Oryginalne A zachowane. Chińskie art. 285 §2 KK CN (nielegalna kontrola 20+ urządzeń) i chińska ustawa o bezpieczeństwie sieci (zakaz pracy na kluczowych stanowiskach) zastąpione KK art. 267 §2 / 269b; w PL nie ma ustawowego „zakazu pracy w branży po karze” jak w oryginale (poziom wyszukiwania).

<a id="porada-11-9"></a>

### 9. Nie testuj cudzych systemów bez pisemnego upoważnienia — „dobrych intencji” i „zgłoszenia po fakcie” samo w sobie nie wyłącza odpowiedzialności
- Status: verified
- Koszt: Bezpłatnie. Przed udziałem w programie bug bounty/SRC weź dokument z zakresem, listą celów i oknem czasowym; po potwierdzeniu luki — przestań.
- W praktyce: Dostęp do cudziego systemu informatycznego bez uprawnienia (także „mam konto, ale używam poza zakresem”) to KK art. 267 §2 — grzywna, ograniczenie wolności albo pozbawienie wolności do lat 2; ściganie na wniosek pokrzywdzonego (§5). W PL istnieje jednak ustawowa klauzula bezkarności: KK art. 269c zwalnia z karalności za art. 267 §2 / 269a, gdy ktoś działa wyłącznie w celu zabezpieczenia systemu, niezwłocznie powiadomił dysponenta i nie wyrządził szkody ani nie naruszył interesu publicznego/prywatnego.
- Korzyść i dowody: KK art. 267 §2 i §5 (pełny odczyt): dostęp bez uprawnienia, do lat 2, na wniosek. KK art. 269c (pełny odczyt): klauzula bezkarności dla działań pro-sekurnościowych z niezwłocznym zgłoszeniem dysponentowi — to główna różnica wobec oryginału.
- Ocena dowodów: A — KK art. 267 §2/§5 i art. 269c z pełnymi odczytami.
- Ocena redakcyjna: Legalny white-hat w PL: działać tylko na systemach, na które masz zgodę, i zgłosić lukę dysponentowi natychmiast — art. 269c tego wymaga.
- Ograniczenia: Art. 269c wymaga braku szkody i niezwłocznego powiadomienia — pobranie „dla dowodu” dużej ilości danych szkodę stanowi; przekroczenie zakresu pisemnej zgody wyłącza ochronę; ściganie art. 267 i tak na wniosek.
- Źródła: [KK art. 267 (lexlege, pełny odczyt)](https://lexlege.pb.pl/kodeks-karny/art-267/); [KK art. 269c — bezkarność pro-sekurnościowa (lexlege, pełny odczyt)](https://lexlege.pb.pl/kodeks-karny/art-269c/); [CERT Polska — koordynowane ujawnianie podatności (cert.pl/cvd, poziom wyszukiwania)](https://cert.pl/cvd/)
- Oryginał: [11.9](https://github.com/eternity4719/HowToLiveBetter/blob/e2605d3e2242bd6216c9255192b8a8957a08c55a/book/11-%E7%A8%8B%E5%BA%8F%E5%91%98%E5%92%8C%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%AE%B9%E6%98%93%E8%B8%A9%E7%9A%84%E7%BA%A2%E7%BA%BF.md#L93-L101)
- Weryfikacja: 2026-11-01; pełne odczyty KK art. 267 i 269c (lexlege.pb.pl, rozdział XXXIII); wyniki wyszukiwań: programy bug bounty w PL, wytyczne CSIRT/CERT Polska.
- Zmiany w adaptacji: Oryginalne A zachowane. W oryginale brakowało podstawy prawnej dla „dobrych intencji”; w PL art. 269c KK daje ustawową klauzulę bezkarności za działania zabezpieczające z niezwłocznym zgłoszeniem — odnotowano tę korzystną różnicę; chińskie wytyczne prokuratury zastąpione art. 269c.

<a id="porada-11-10"></a>

### 10. Podatności zgłaszaj producentowi lub krajowemu CSIRT; przed naprawą nie publikuj szczegółów i nie udostępniaj kodu wykorzystującego lukę
- Status: verified
- Koszt: Bezpłatnie. Zgłoś lukę do producenta albo do CERT Polska (program CVD); zachowaj korespondencję.
- W praktyce: Udostępnianie programu wykorzystującego lukę (exploit) to art. 269b §1 KK — 3 miesiące do 5 lat (program przystosowany do przestępstwa z art. 267/268a/269a). Ujawnianie podatności w sposób koordynowany (CVD) prowadzi CERT Polska / CSIRT Krajowy w ramach ustawy o Krajowym Systemie Cyberbezpieczeństwa (poziom wyszukiwania). Działania wyłącznie w celu zabezpieczenia systemu z niezwłocznym zgłoszeniem dysponentowi są bezkarne — KK art. 269c.
- Korzyść i dowody: KK art. 269b §1 i art. 269c (pełne odczyty rozdziału XXXIII, stan 01.11.2026); ustawa o KSC (CSIRT Krajowy, zgłaszanie podatności) i cert.pl/cvd — poziom wyszukiwania.
- Ocena dowodów: A — KK art. 269b/269c pełne odczyty; KSC/CSIRT/CVD na poziomie wyszukiwania.
- Ocena redakcyjna: Publikacja „dla dobra wszystkich” przed naprawą to wciąż udostępnienie exploita — rób to dopiero po naprawie i koordynacji z producentem.
- Ograniczenia: W PL nie ma osobnego przepisu zakazującego przekazywania luk za granicę — ale udostępnianie exploita wciąż grozi art. 269b; zgłaszanie do CSIRT to dobra praktyka (poziom wyszukiwania).
- Źródła: [KK art. 269b (lexlege, pełny odczyt)](https://lexlege.pb.pl/kodeks-karny/art-269b/); [KK art. 269c (lexlege, pełny odczyt)](https://lexlege.pb.pl/kodeks-karny/art-269c/); [CERT Polska — CVD (cert.pl/cvd)](https://cert.pl/cvd/); [Ustawa o Krajowym Systemie Cyberbezpieczeństwa (sip.lex.pl, poziom wyszukiwania)](https://sip.lex.pl/akty-prawne/dzu-dziennik-ustaw/ustawa-o-krajowym-systemie-cyberbezpieczenstwa-18107466)
- Oryginał: [11.10](https://github.com/eternity4719/HowToLiveBetter/blob/e2605d3e2242bd6216c9255192b8a8957a08c55a/book/11-%E7%A8%8B%E5%BA%8F%E5%91%98%E5%92%8C%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%AE%B9%E6%98%93%E8%B8%A9%E7%9A%84%E7%BA%A2%E7%BA%BF.md#L102-L110)
- Weryfikacja: 2026-11-01; pełne odczyty KK art. 269b/269c (lexlege); wyniki wyszukiwań: ustawa o KSC (CSIRT), cert.pl/cvd, rozporządzenia ws. zgłaszania podatności.
- Zmiany w adaptacji: Oryginalne A zachowane. Chińskie „przepisy o zarządzaniu lukami w produktach sieciowych” (zakaz publikacji przed naprawą, zakaz udostępniania exploitów, zakaz przekazywania za granicę) zastąpione: KK art. 269b (exploity) + art. 269c (bezkarność zgłoszenia) + KSC/CSIRT/CERT; w PL nie ma ustawowego zakazu kierowania luk za granicę (poziom wyszukiwania).

<a id="porada-11-11"></a>

### 11. Nie sprzedawaj narzędzi VPN ani kont proxy „do omijania blokad” jako usługi; samo korzystanie z VPN przez osobę prywatną jest w Polsce legalne
- Status: verified
- Koszt: Bezpłatnie.
- W praktyce: W PL używanie VPN przez użytkownika prywatnego jest legalne — Polska nie zakazuje „obchodzenia blokad” (różnica wobec oryginału). Sprzedaż jednak może być działalnością telekomunikacyjną: świadczenie usług dostępu do internetu wymaga wpisu do rejestru przedsiębiorców telekomunikacyjnych prowadzonego przez UKE (Prawo telekomunikacyjne — poziom wyszukiwania); prowadzenie takiej działalności bez wpisu/zgłoszenia to wykroczenie z karą grzywny.
- Korzyść i dowody: Prawo telekomunikacyjne (Dz.U.2024.1221 t.j. — eli.gov.pl): rejestr przedsiębiorców telekomunikacyjnych (art. 10 i nast.), zgłoszenia działalności (art. 14 i nast.), sankcje za brak wpisu — poziom wyszukiwania. Legalność VPN dla użytkownika — poziom wyszukiwania (brak zakazu w PL).
- Ocena dowodów: B — Prawo telekomunikacyjne na poziomie wyszukiwania (brak pełnych odczytów konkretnych artykułów); teza o legalności VPN potwierdzona wyszukiwaniem.
- Ocena redakcyjna: „Sprzedaję dostęp, bo technicznie umiem” to już działalność gospodarcza — sprawdź rejestr UKE, zanim wystawisz ofertę.
- Ograniczenia: Nie każda sprzedaż proxy/VPN będzie uznana za usługę telekomunikacyjną — kwalifikacja należy do UKE/sądu (poziom wyszukiwania); nie opisujemy tu przepisów innych krajów.
- Źródła: [Prawo telekomunikacyjne — tekst jednolity (eli.gov.pl)](https://eli.gov.pl/api/acts/DU/2024/1221/text.html); [UKE — rejestr przedsiębiorców telekomunikacyjnych (uke.gov.pl, poziom wyszukiwania)](https://www.uke.gov.pl/)
- Oryginał: [11.11](https://github.com/eternity4719/HowToLiveBetter/blob/e2605d3e2242bd6216c9255192b8a8957a08c55a/book/11-%E7%A8%8B%E5%BA%8F%E5%91%98%E5%92%8C%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%AE%B9%E6%98%93%E8%B8%A9%E7%9A%84%E7%BA%A2%E7%BA%BF.md#L111-L119)
- Weryfikacja: 2026-11-01; wyniki wyszukiwań: Prawo telekomunikacyjne (rejestr, zgłoszenia, sankcje), legalność VPN w PL, stanowiska UKE; pełne odczyty artykułów nie były wykonywane — ujawnione.
- Zmiany w adaptacji: Oryginalne B zachowane. Chiński zakaz „samodzielnych kanałów międzynarodowych” (przepisy o międzynarodowym łączeniu sieci — kara administracyjna + KK art. 225 nielegalna działalność) zastąpiony kontekstem PL: brak takiego zakazu; ryzyko leży w rejestrze przedsiębiorców telekomunikacyjnych UKE przy sprzedaży usług.

<a id="porada-11-12"></a>

### 12. Masz podpisaną klauzulę konkurencyjną: pilnuj, żeby pracodawca płacił odszkodowanie; przy zwłoce możesz ją rozwiązać — zapisz to na piśmie
- Status: verified
- Koszt: Bezpłatnie. Przy odejściu zachowaj egzemplarz umowy o zakazie konkurencji i dowody braku płatności.
- W praktyce: Zakaz konkurencji po ustaniu stosunku pracy wymaga umowy na piśmie (k.p. art. 101²) i daje prawo do odszkodowania za ten okres — jeśli umowa nie określa kwoty, sąd może przyznać odszkodowanie w odpowiedniej wysokości (poziom wyszukiwania: orzecznictwo SN, zwykle procent wynagrodzenia). Jeśli pracodawca nie wypłaca odszkodowania mimo obowiązku, pracownik może rozwiązać umowę o zakazie konkurencji (k.p. art. 101² — poziom wyszukiwania szczegółów, pełny odczyt art. 101²). Maksymalny czas trwania zakazu konkurencji po ustaniu stosunku pracy to 2 lata (k.p. — poziom wyszukiwania).
- Korzyść i dowody: k.p. art. 101² (pełny odczyt lexlege, stan 01.11.2026): zakaz konkurencji po ustaniu stosunku pracy — wymóg formy pisemnej, odszkodowanie dla pracownika; szczegóły wysokości odszkodowania i rozwiązania przy zwłoce (art. 101² §2-3, orzecznictwo) — poziom wyszukiwania.
- Ocena dowodów: A — k.p. art. 101² z pełnym odczytem; orzecznictwo co do wysokości odszkodowania i terminów rozwiązania — poziom wyszukiwania.
- Ocena redakcyjna: Klauzula konkurencyjna bez płatnego odszkodowania to pułapka — żądaj wypłat na piśmie i dokumentuj zwłokę.
- Ograniczenia: K.p. nie zawiera sztywnego „30% średniego wynagrodzenia” jak oryginał — wysokość ustala się umownie lub sądownie (poziom wyszukiwania); zakaz konkurencji w czasie pracy (art. 101¹) nie wymaga osobnego wynagrodzenia.
- Źródła: [k.p. art. 101² — zakaz konkurencji po ustaniu stosunku pracy (lexlege, pełny odczyt)](https://lexlege.pb.pl/kodeks-pracy/art-101-2); [k.p. art. 101¹ — zakaz konkurencji w czasie trwania (lexlege)](https://lexlege.pb.pl/kodeks-pracy/art-101-1); [Orzecznictwo SN ws. odszkodowania za zakaz konkurencji (poziom wyszukiwania)](https://www.sn.pl/)
- Oryginał: [11.12](https://github.com/eternity4719/HowToLiveBetter/blob/e2605d3e2242bd6216c9255192b8a8957a08c55a/book/11-%E7%A8%8B%E5%BA%8F%E5%91%98%E5%92%8C%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%AE%B9%E6%98%93%E8%B8%A9%E7%9A%84%E7%BA%A2%E7%BA%BF.md#L120-L128)
- Weryfikacja: 2026-11-01; pełny odczyt k.p. art. 101² (lexlege.pb.pl); wyniki wyszukiwań: art. 101¹/101³ k.p., orzecznictwo SN o wysokości odszkodowania (procent wynagrodzenia) i rozwiązaniu przy braku wypłat.
- Zmiany w adaptacji: Oryginalne A zachowane. Chińska zasada (ustawa o umowach o pracę art. 23/24: rekompensata 30% średniego wynagrodzenia, 3 miesiące zwłoki = prawo rozwiązania, max 2 lata) zastąpiona k.p. art. 101²; odnotowano różnicę: w PL nie ma ustawowych „30%” ani sztywnego „3 miesięcy” — wysokość i rozwiązanie przy zwłoce wynikają z umowy i orzecznictwa (poziom wyszukiwania).

<a id="porada-11-13"></a>

### 13. Kod pisany w czasie pracy i na zasobach firmy należy do pracodawcy; własne projekty open source rób na własnym sprzęcie i własnym czasie
- Status: verified
- Koszt: Bezpłatnie. Przy zatrudnieniu przeczytaj klauzulę IP w umowie o pracę; rozdzielaj projekty osobiste i służbowe na osobnych maszynach.
- W praktyce: Zgodnie z upa art. 74, prawa majątkowe do programu komputerowego stworzonego przez pracownika w wyniku wykonywania obowiązków ze stosunku pracy przysługują pracodawcy (chyba że umowa stanowi inaczej); autor zachowuje tylko prawa osobiste (m.in. prawo do podpisu). Wynalazek dokonany w ramach obowiązków pracowniczych to wynalazek pracowniczy — prawo do patentu należy do pracodawcy (ustawa — Prawo patentowe art. 8, poziom wyszukiwania).
- Korzyść i dowody: upa art. 74 (tekst ustawy o prawie autorskim — orka.sejm.gov.pl / sip.lex.pl, poziom wyszukiwania pełnego tekstu art. 74); Prawo patentowe art. 8 (wynalazek pracowniczy) — poziom wyszukiwania.
- Ocena dowodów: A — upa art. 74 i Prawo patentowe art. 8 na poziomie wyszukiwania tekstu ustaw (ujawnione); ogólna zasada własności utworów pracowniczych potwierdzona wieloma źródłami.
- Ocena redakcyjna: „Nocą napisałem na firmowym laptopie” — wciąż może należeć do firmy; własny projekt prowadź na własnym sprzęcie, bez mieszania repozytoriów.
- Ograniczenia: Granica między „utworem pracowniczym” a projektem osobistym bywa sporna i ocenia ją sąd (czy „w wyniku wykonywania obowiązków”, czy „głównie z zasobów firmy”); umowa o pracę może to precyzować.
- Źródła: [Ustawa o prawie autorskim i prawach pokrewnych (orka.sejm.gov.pl)](https://orka.sejm.gov.pl/proc2.nsf/ustawy/86_u.htm); [upa art. 74 (sip.lex.pl, poziom wyszukiwania)](https://sip.lex.pl/akty-prawne/dzu-dziennik-ustaw/ustawa-o-prawie-autorskim-16782568/art-74); [Prawo patentowe art. 8 (sip.lex.pl, poziom wyszukiwania)](https://sip.lex.pl/akty-prawne/dzu-dziennik-ustaw/prawo-patentowe-16782984/art-8)
- Oryginał: [11.13](https://github.com/eternity4719/HowToLiveBetter/blob/e2605d3e2242bd6216c9255192b8a8957a08c55a/book/11-%E7%A8%8B%E5%BA%8F%E5%91%98%E5%92%8C%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%AE%B9%E6%98%93%E8%B8%A9%E7%9A%84%E7%BA%A2%E7%BA%BF.md#L129-L137)
- Weryfikacja: 2026-11-01; wyniki wyszukiwań: tekst upa art. 74 (programy komputerowe pracownika — prawa majątkowe u pracodawcy), Prawo patentowe art. 8 (wynalazek pracowniczy); pełny odczyt art. 74 nie został wykonany (strona lexlege zwróciła treść komercyjną) — ujawnione.
- Zmiany w adaptacji: Oryginalne A zachowane. Chińska ustawa o prawie autorskim art. 18 i ustawa patentowa art. 6 (utwory/wynalazki służbowe) zastąpione upa art. 74 + Prawem patentowym art. 8; różnica: w PL program komputerowy z pracy jest wprost własnością pracodawcy (art. 74), a nie tylko „utworem służbowym z prawem pierw refusal” jak w oryginale.

<a id="porada-11-14"></a>

### 14. Używając kodu na licencji GPL (i podobnych copyleft) w produkcie komercyjnym, licz się z obowiązkiem udostępnienia kodu źródłowego — albo wybierz inną licencję
- Status: verified
- Koszt: Bezpłatnie. Przed użyciem biblioteki sprawdź jej licencję; w razie konfliktu zmień zależność.
- W praktyce: Licencja GPL nakłada warunek udostępnienia kodu źródłowego przy rozpowszechnianiu produktu zawierającego kod GPL (zasada copyleft, wykładnia licencji na podstawie upa art. 41 — licencja jako umowa). Naruszenie warunków licencji to naruszenie praw autorskich — odpowiedzialność cywilna (upa art. 79 i nast.) i ewentualnie karna (KK przepisy o naruszeniu praw autorskich — poziom wyszukiwania).
- Korzyść i dowody: upa art. 41 (licencja) — poziom wyszukiwania pełnego tekstu; doktryna i orzecznictwo ws. copyleft/GPL w PL — poziom wyszukiwania (brak polskich wyroków o naruszeniu GPL znalezionych wprost — ujawnione).
- Ocena dowodów: B — podstawa to licencja (umowa) i ogólne przepisy upa/KK, bez osobnego przepisu o licencjach open source; poziom wyszukiwania.
- Ocena redakcyjna: „Nikt tego nie sprawdza” przy GPL działa do pierwszego sporu — wtedy liczy się tekst licencji, nie życzenia.
- Ograniczenia: Nie każda licencja open source jest copyleft (MIT/Apache nie wymagają ujawniania kodu); czy dany produkt „pochodzi” od kodu GPL, ocenia się kazuistycznie (linkowanie statyczne/dynamiczne — poziom wyszukiwania).
- Źródła: [Ustawa o prawie autorskim (ISAP, pełny tekst)](https://isap.sejm.gov.pl/isap.nsf/download.xsp/WDU20060900631/U/D20060631Lj.pdf); [upa art. 41 — licencja (sip.lex.pl, poziom wyszukiwania)](https://sip.lex.pl/akty-prawne/dzu-dziennik-ustaw/ustawa-o-prawie-autorskim-16782568/art-41); [FSF/OSI — wyjaśnienia licencji GPL (poziom wyszukiwania)](https://www.gnu.org/licenses/gpl-faq.html)
- Oryginał: [11.14](https://github.com/eternity4719/HowToLiveBetter/blob/e2605d3e2242bd6216c9255192b8a8957a08c55a/book/11-%E7%A8%8B%E5%BA%8F%E5%91%98%E5%92%8C%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%AE%B9%E6%98%93%E8%B8%A9%E7%9A%84%E7%BA%A2%E7%BA%BF.md#L138-L146)
- Weryfikacja: 2026-11-01; wyniki wyszukiwań: upa art. 41 (licencja), doktryna copyleft, orzecznictwo PL ws. GPL (brak znalezionych wyroków naruszenia GPL — ujawnione); tekst licencji GPL (gnu.org).
- Zmiany w adaptacji: Oryginalne B zachowane. Chińska teza z orzecznictwa („czyjaś naruszenie GPL nie pozbawia go praw autorskich”) pozostaje aktualna w PL; w PL nie ma osobnego przepisu o licencjach open source — ochrona przez umowę (licencję) i przepisy o prawie autorskim (upa art. 41, KK).

<a id="porada-11-15"></a>

### 15. Aplikacja może zbierać tylko dane niezbędne do działania; zgoda dziecka na usługi online wymaga zgody opiekuna; polityka prywatności musi być napisana i dostępna
- Status: verified
- Koszt: Bezpłatnie. Przed publikacją porównaj listę uprawnień aplikacji z polityką prywatności — zbędne uprawnienia usuń.
- W praktyce: RODO wymaga, żeby przetwarzanie danych osobowych było zgodne z prawem, rzetelne i ograniczone do tego, co niezbędne (art. 5 ust. 1 lit. c RODO — minimalizacja), miało podstawę prawną (art. 6) i żeby użytkownik dostał klauzulę informacyjną (art. 13 — czyli „politykę prywatności”). Zgoda dziecka na usługi społeczeństwa informacyjnego wymaga zgody opiekuna do ukończenia przez dziecko 16 lat (art. 8 RODO — Polska nie obniżyła wieku do 13; poziom wyszukiwania). Naruszenia grożą karami administracyjnymi UODO do 20 mln euro lub 4% obrotu (art. 83 RODO). Zob. też rozdział [14.10](14-bezpieczenstwo-kont-i-danych.md#porada-14-10).
- Korzyść i dowody: RODO (rozporządzenie (UE) 2016/679): art. 5 (zasady przetwarzania), art. 6 (podstawa prawna), art. 8 (zgoda dziecka — 16 lat), art. 13 (klauzula informacyjna), art. 83 (kary do 20 mln EUR / 4% obrotu) — eur-lex/sip.lex, poziom wyszukiwania tekstu artykułów.
- Ocena dowodów: B — RODO (rozporządzenie UE) na poziomie wyszukiwania tekstu artykułów; krajowe wytyczne UODO — poziom wyszukiwania; brak przeglądu orzecznictwa.
- Ocena redakcyjna: „Może się przyda później” to nie podstawa prawna — każde uprawnienie aplikacji musi mieć uzasadnienie w polityce prywatności.
- Ograniczenia: RODO nie definiuje wprost „minimalnej listy uprawnień” dla aplikacji mobilnych — wytyczne EDPB/UODO rozwijają zasadę minimalizacji (poziom wyszukiwania); wiek zgody dziecka w PL (16 lat) — potwierdź w aktualnym brzmieniu art. 8 RODO i ustawie krajowej.
- Źródła: [RODO — rozporządzenie (UE) 2016/679 (eur-lex)](https://eur-lex.europa.eu/eli/reg/2016/679/oj); [RODO art. 8 — zgoda dziecka (sip.lex.pl)](https://sip.lex.pl/akty-prawne/dzienniki-UE/rozporzadzenie-2018-1725-w-sprawie-ochrony-osob-fizycznych-w-zwiazku-z-69111004/art-8); [UODO (uodo.gov.pl)](https://www.uodo.gov.pl/)
- Oryginał: [11.15](https://github.com/eternity4719/HowToLiveBetter/blob/e2605d3e2242bd6216c9255192b8a8957a08c55a/book/11-%E7%A8%8B%E5%BA%8F%E5%91%98%E5%92%8C%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%AE%B9%E6%98%93%E8%B8%A9%E7%9A%84%E7%BA%A2%E7%BA%BF.md#L147-L155)
- Weryfikacja: 2026-11-01; wyniki wyszukiwań: RODO art. 5/6/8/13/83 (eur-lex, sip.lex), wiek zgody dziecka w PL (16 lat), wytyczne UODO/EDPB ws. aplikacji mobilnych i minimalizacji danych.
- Zmiany w adaptacji: Oryginalne B zachowane. Chińska ustawa o ochronie danych osobowych (art. 6, 13, 31, 66 — zgoda dziecka poniżej 14 lat, kary do 5% obrotu) zastąpiona RODO: art. 5/6/8/13/83; odnotowano różnicę: w PL wiek zgody dziecka to 16 lat (a nie 14 jak w oryginale) — poziom wyszukiwania.

<a id="porada-11-16"></a>

### 16. W Polsce nie ma obowiązku „rejestracji strony” jak ICP — ale logi i dane użytkowników trzeba przechowywać zgodnie z prawem (retencja) i zabezpieczać system
- Status: verified
- Koszt: Bezpłatnie (poza kosztem zgodności). Świadczenie usług drogą elektroniczną nie wymaga w PL zgłoszenia strony; obowiązki retencyjne wynikają z innych przepisów.
- W praktyce: W PL nie ma obowiązku rejestracji strony internetowej przed jej uruchomieniem — samo prowadzenie usługi drogą elektroniczną nie wymaga zgłoszenia (uso). Obowiązki dotyczą jednak retencji: przedsiębiorcy telekomunikacyjni przechowują dane billingowe przez ustawowy okres (Prawo telekomunikacyjne — poziom wyszukiwania; art. 79c w starszym brzmieniu), a podmioty Krajowego Systemu Cyberbezpieczeństwa prowadzą rejestry zdarzeń bezpieczeństwa przez okres określony w rozporządzeniu (poziom wyszukiwania). RODO art. 5 ust. 1 lit. e nakazuje nie przechowywać danych dłużej niż to konieczne.
- Korzyść i dowody: uso (świadczenie usług drogą elektroniczną — brak obowiązku rejestracji strony, poziom wyszukiwania); Prawo telekomunikacyjne (retencja danych — art. 79c w brzmieniu uchylonym, nowe przepisy retencyjne — poziom wyszukiwania); ustawa o KSC + rozporządzenie (rejestry zdarzeń min. 90 dni — poziom wyszukiwania); RODO art. 5 ust. 1 lit. e (eur-lex).
- Ocena dowodów: A — teza o braku obowiązku rejestracji strony i zasady retencji na poziomie wyszukiwania tekstów ustaw (ujawnione); konkretne okresy retencji w rozporządzeniach — poziom wyszukiwania.
- Ocena redakcyjna: Logi to też twoja obrona („to nie ja”) — trzymaj je zgodnie z prawem i bezpiecznie, nawet gdy nie masz ustawowego minimum.
- Ograniczenia: Okresy retencji różnią się w zależności od rodzaju danych i podmiotu (billing vs bezpieczeństwo vs dane osobowe RODO) — podajemy kierunek, nie tabelę; szczegóły w rozporządzeniach (poziom wyszukiwania).
- Źródła: [Ustawa o świadczeniu usług drogą elektroniczną (sip.lex.pl, poziom wyszukiwania)](https://sip.lex.pl/akty-prawne/dzu-dziennik-ustaw/ustawa-o-swiadczeniu-uslug-droga-elektroniczna-17261798); [Prawo telekomunikacyjne (lexlege, art. 79c — uchylony, poziom wyszukiwania)](https://lexlege.pb.pl/prawo-telekomunikacyjne/art-79c); [Ustawa o KSC (sip.lex.pl, poziom wyszukiwania)](https://sip.lex.pl/akty-prawne/dzu-dziennik-ustaw/ustawa-o-krajowym-systemie-cyberbezpieczenstwa-18107466); [RODO art. 5 (eur-lex)](https://eur-lex.europa.eu/eli/reg/2016/679/oj)
- Oryginał: [11.16](https://github.com/eternity4719/HowToLiveBetter/blob/e2605d3e2242bd6216c9255192b8a8957a08c55a/book/11-%E7%A8%8B%E5%BA%8F%E5%91%98%E5%92%8C%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%AE%B9%E6%98%93%E8%B8%A9%E7%9A%84%E7%BA%A2%E7%BA%BF.md#L156-L164)
- Weryfikacja: 2026-11-01; wyniki wyszukiwań: brak wymogu rejestracji stron w PL (uso), retencja danych w Prawie telekomunikacyjnym (zmiany 2024), rejestry zdarzeń w rozporządzeniu KSC, RODO art. 5 ust. 1 lit. e; bezpośredni odczyt art. 79c pokazał oznaczenie „utracił moc” — ujawnione.
- Zmiany w adaptacji: Oryginalne A zachowane. Zagraniczny wymóg rejestracji strony („ICP”) i tamtejszy system klasyfikacji poziomów bezpieczeństwa z 6-miesięcznymi logami zastąpione kontekstem PL: brak rejestracji strony, retencja z Prawa telekomunikacyjnego/KSC/RODO; konkretne „6 miesięcy” nie ma polskiego odpowiednika ustawowego dla każdego podmiotu — poziom wyszukiwania.

<a id="porada-11-17"></a>

### 17. Przed publicznym udostępnieniem usługi generatywnej AI w UE (także w Polsce) sprawdź obowiązki AI Act: oznaczanie treści generowanych przez AI i ewentualne obowiązki dla modeli ogólnego przeznaczenia
- Status: verified
- Koszt: Bezpłatnie, ale wymaga procesu (ocena zgodności, dokumentacja). Narzędzia używane wewnętrznie, bez udostępniania publicznego, są poza zakresem części obowiązków.
- W praktyce: Rozporządzenie (UE) 2024/1689 (AI Act) nakłada m.in. obowiązek oznaczania treści wygenerowanych lub zmanipulowanych przez AI (art. 50 — w tym deepfake), a od 2 sierpnia 2025 obowiązki dla dostawców modeli ogólnego przeznaczenia (GPAI, art. 53-55 — dokumentacja techniczna, streszczenie danych treningowych); kary za naruszenia do wysokich progów procentowych obrotu (art. 99). Polska implementacja (wyznaczenie organów nadzoru) — w toku (poziom wyszukiwania).
- Korzyść i dowody: Rozporządzenie (UE) 2024/1689: art. 50 (oznaczanie treści AI), art. 53-55 (GPAI), art. 99 (kary) — eur-lex, poziom wyszukiwania tekstu artykułów; polska ustawa implementująca AI Act — poziom wyszukiwania (projekt/ustawa 2026).
- Ocena dowodów: B — rozporządzenie UE na poziomie wyszukiwania tekstu artykułów; krajowa implementacja w toku; brak przeglądu aktów wykonawczych.
- Ocena redakcyjna: Treści generowane przez AI, które trafiają do użytkowników, oznaczaj — to obowiązek, nie tylko etyka.
- Ograniczenia: Zakres obowiązków zależy od roli (dostawca vs deployer) i kategorii ryzyka systemu AI; AI Act wchodzi w życie etapami (2025-2027) — sprawdź aktualny stan stosowania (poziom wyszukiwania).
- Źródła: [Rozporządzenie (UE) 2024/1689 — AI Act (eur-lex)](https://eur-lex.europa.eu/eli/reg/2024/1689/oj); [Komisja Europejska — AI Act, harmonogram stosowania (ai-act-service-desk, poziom wyszukiwania)](https://digital-strategy.ec.europa.eu/en/policies/ai-act); [gov.pl — AI Act w Polsce (poziom wyszukiwania)](https://www.gov.pl/web/cyfryzacja)
- Oryginał: [11.17](https://github.com/eternity4719/HowToLiveBetter/blob/e2605d3e2242bd6216c9255192b8a8957a08c55a/book/11-%E7%A8%8B%E5%BA%8F%E5%91%98%E5%92%8C%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%AE%B9%E6%98%93%E8%B8%A9%E7%9A%84%E7%BA%A2%E7%BA%BF.md#L165-L173)
- Weryfikacja: 2026-11-01; wyniki wyszukiwań: AI Act art. 50/53-55/99 (eur-lex), harmonogram stosowania 2025-2027, polska implementacja (MC/ustawa o systemach AI) — poziom wyszukiwania.
- Zmiany w adaptacji: Oryginalne B zachowane. Chińskie „tymczasowe zarządzenie usługami generatywnej AI” (ocena bezpieczeństwa, rejestracja algorytmów, oznaczanie treści) zastąpione rozporządzeniem (UE) 2024/1689 (AI Act) obowiązującym w PL; chiński „rejestr algorytmów” nie ma unijnego odpowiednika w tej formie — poziom wyszukiwania.

<a id="porada-11-18"></a>

### 18. Nie twórz ani nie rozpowszechniaj narzędzi automatycznie pomijających lub blokujących reklamy cudzych aplikacji — nawet darmowe może być czynem nieuczciwej konkurencji
- Status: verified
- Koszt: Bezpłatnie. Koszt to rezygnacja z popularnego „małego narzędzia”.
- W praktyce: Uokik zakazuje czynów nieuczciwej konkurencji polegających m.in. na utrudnianiu innemu przedsiębiorcy działalności przez środki techniczne (klauzula generalna art. 5 i przepisy szczególne uokik — poziom wyszukiwania); blokowanie reklam konkurenta bywa kwalifikowane jako takie naruszenie (orzecznictwo — poziom wyszukiwania). Odpowiedzialność cywilna: odszkodowanie, zaniechanie (uokik art. 24-26); UOKiK może nałożyć karę do 10% obrotu (uokik art. 106 — poziom wyszukiwania).
- Korzyść i dowody: uokik (ustawa o zwalczaniu nieuczciwej konkurencji, Dz.U.2026.85 t.j. — sip.lex/ISAP, poziom wyszukiwania art. 5/16/24-26/106); orzecznictwo PL ws. blokowania reklam w aplikacjach/przeglądarkach — poziom wyszukiwania.
- Ocena dowodów: A — uokik jako podstawa na poziomie wyszukiwania tekstu; konkretna kwalifikacja konkretnego narzędzia należy do sądu (ujawnione).
- Ocena redakcyjna: „Nie zarabiam, tylko pomagam użytkownikom” nie wyłącza odpowiedzialności — liczy się skutek dla konkurenta, nie intencja.
- Ograniczenia: Nie każde narzędzie „ad-block” będzie uznane za naruszenie — ocena kazuistyczna (co dokładnie blokuje, czy szkodzi); UOKiK orzeka w konkretnej sprawie (poziom wyszukiwania).
- Źródła: [Uokik — tekst jednolity (ISAP)](https://isap.sejm.gov.pl/isap.nsf/download.xsp/WDU19930470211/U/D19930211Lj.pdf); [uokik art. 23 (lexlege, pełny odczyt — przykład odpowiedzialności za naruszenie tajemnicy)](https://lexlege.pb.pl/ustawa-o-zwalczaniu-nieuczciwej-konkurencji/art-23); [UOKiK (uokik.gov.pl, poziom wyszukiwania)](https://www.uokik.gov.pl/)
- Oryginał: [11.18](https://github.com/eternity4719/HowToLiveBetter/blob/e2605d3e2242bd6216c9255192b8a8957a08c55a/book/11-%E7%A8%8B%E5%BA%8F%E5%91%98%E5%92%8C%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%AE%B9%E6%98%93%E8%B8%A9%E7%9A%84%E7%BA%A2%E7%BA%BF.md#L174-L182)
- Weryfikacja: 2026-11-01; wyniki wyszukiwań: uokik (klauzula generalna, przepisy o środkach technicznych, kary UOKiK), orzecznictwo PL ws. ad-blockerów; pełne odczyty tylko art. 11/23 — ujawnione.
- Zmiany w adaptacji: Oryginalne A zachowane. Chińska ustawa o zwalczaniu nieuczciwej konkurencji (art. 2/13/22/29 — zakaz technicznego utrudniania konkurentowi, kary administracyjne) zastąpiona uokik (klauzula art. 5 + przepisy szczególne + kary UOKiK do 10% obrotu) — poziom wyszukiwania szczegółów.

<a id="porada-11-19"></a>

### 19. Nie zakładaj „stacji pośredniej” odsprzedającej zagraniczne API modeli AI po niższej cenie — to ryzyko prawne (RODO, transfer danych za granicę, regulaminy) i już są pierwsze zatrzymania
- Status: verified
- Koszt: Bezpłatnie. Koszt to rezygnacja z pozornie łatwego zarobku; legalna agregacja modeli wymaga licencji i zgodności.
- W praktyce: „AI relay” kupuje subskrypcje zagranicznych modeli i odsprzedaje dostęp — przekazuje przy tym dane użytkowników (zapytania) za granicę. Transfer danych osobowych do państw trzecich wymaga podstawy z rozdziału V RODO (art. 44-49 — decyzja adequacyjna, SCC itp.); nieuprawnione wykorzystanie cudzych kont/API łamie regulaminy i może rodzić odpowiedzialność (cywilną, a w skrajnych wypadkach karną — KK art. 267 §4, poziom wyszukiwania). Nie udostępniaj też haseł/kluczy API niezweryfikowanym pośrednikom — zob. [14.10](14-bezpieczenstwo-kont-i-danych.md#porada-14-10).
- Korzyść i dowody: RODO rozdział V (art. 44-49 — transfer danych do państw trzecich, mechanizmy: adequacy, SCC, BCR) — eur-lex, poziom wyszukiwania; KK art. 267 §4 (ujawnienie informacji, do lat 2, na wniosek — pełny odczyt rozdziału XXXIII); doniesienia o zatrzymaniach „stacji pośrednich” — tylko media (poziom wyszukiwania, bez wyroku).
- Ocena dowodów: C — głównie doniesienia medialne i analiza ryzyka prawnego; brak wyroków i oficjalnych komunikatów w tej kwestii (ujawnione).
- Ocena redakcyjna: Tanie API przez pośrednika = twoje dane (i dane klientów) lecą gdzie indziej — RODO rozdział V to realna podstawa odpowiedzialności.
- Ograniczenia: Nie każda „stacja pośrednia” musi być nielegalna — legalność zależy od licencji, zgód i transferu danych; nie mamy wyroku, więc nie orzekamy, że „zawsze przestępstwo”.
- Źródła: [RODO — rozdział V, transfer danych (eur-lex)](https://eur-lex.europa.eu/eli/reg/2016/679/oj); [KK art. 267 (lexlege, pełny odczyt)](https://lexlege.pb.pl/kodeks-karny/art-267/); [EDPB — wytyczne ws. transferu danych do państw trzecich (edpb.europa.eu, poziom wyszukiwania)](https://www.edpb.europa.eu/)
- Oryginał: [11.19](https://github.com/eternity4719/HowToLiveBetter/blob/e2605d3e2242bd6216c9255192b8a8957a08c55a/book/11-%E7%A8%8B%E5%BA%8F%E5%91%98%E5%92%8C%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%AE%B9%E6%98%93%E8%B8%A9%E7%9A%84%E7%BA%A2%E7%BA%BF.md#L183-L191)
- Weryfikacja: 2026-11-01; pełny odczyt KK art. 267 (lexlege); RODO rozdział V i wytyczne EDPB — poziom wyszukiwania; doniesienia medialne o „stacjach pośrednich AI” — tylko jako anegdota, bez cytowania szczegółów (poziom wyszukiwania).
- Zmiany w adaptacji: Oryginalne C zachowane. Doniesienia z oryginału (ostrzeżenie służb bezpieczeństwa i jeden przypadek zatrzymania — tylko media) zachowane jako C; podstawa prawna PL: RODO rozdział V (transfer za granicę) + KK art. 267 §4; chińskie „brak licencji” zastąpione kontekstem unijnym.

<a id="porada-11-20"></a>

### 20. Nie twórz, nie sprzedawaj i nie rozpowszechniaj cracków, keygenów ani „łatek” omijających zabezpieczenia płatnego oprogramowania
- Status: verified
- Koszt: Bezpłatnie. Koszt to rezygnacja z szybkiego zarobku na sprzedaży „odblokowanego” softu.
- W praktyce: Wytwarzanie, pozyskiwanie, zbywanie lub udostępnianie programów przystosowanych do popełnienia przestępstw z art. 267/268a/269a (czyli m.in. narzędzi omijających zabezpieczenia i klucze dostępu) to KK art. 269b §1: od 3 miesięcy do 5 lat, plus przepadek (§2). Cywilnie: omijanie technicznych środków ochrony praw autorskich to naruszenie upa (odpowiedzialność odszkodowawcza — upa art. 79 i nast., poziom wyszukiwania); KK przepisy karne o naruszeniu praw autorskich (poziom wyszukiwania).
- Korzyść i dowody: KK art. 269b §1-2 (pełny odczyt rozdziału XXXIII, stan 01.11.2026) — 3 mies. do 5 lat + przepadek; upa (odpowiedzialność cywilna za naruszenie praw autorskich i obchodzenie zabezpieczeń technicznych) — poziom wyszukiwania.
- Ocena dowodów: A — KK art. 269b z pełnym odczytem; upa/KK autorskie na poziomie wyszukiwania.
- Ocena redakcyjna: „To tylko obejście licencji, nie kradzież” — art. 269b nie rozróżnia: liczy się, że narzędzie służy przestępstwu; cywilnie płacisz też za naruszenie praw autorskich.
- Ograniczenia: Art. 269b §1a wyłącza karalność przy działaniu wyłącznie w celu zabezpieczenia systemu (np. testy własnego softu) — komercyjny crack tego nie spełnia; art. 269c dotyczy zgłoszeń luk, nie cracków.
- Źródła: [KK art. 269b (lexlege, pełny odczyt)](https://lexlege.pb.pl/kodeks-karny/art-269b/); [KK rozdział XXXIII (lexlege)](https://lexlege.pb.pl/kodeks-karny/rozdzial-xxxiii-przestepstwa-przeciwko-ochronie-informacji/211/); [upa — odpowiedzialność cywilna (sip.lex.pl, poziom wyszukiwania)](https://sip.lex.pl/akty-prawne/dzu-dziennik-ustaw/ustawa-o-prawie-autorskim-16782568)
- Oryginał: [11.20](https://github.com/eternity4719/HowToLiveBetter/blob/e2605d3e2242bd6216c9255192b8a8957a08c55a/book/11-%E7%A8%8B%E5%BA%8F%E5%91%98%E5%92%8C%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%AE%B9%E6%98%93%E8%B8%A9%E7%9A%84%E7%BA%A2%E7%BA%BF.md#L192-L200)
- Weryfikacja: 2026-11-01; pełny odczyt KK art. 269b (lexlege); wyniki wyszukiwań: upa art. 79 (odszkodowanie), przepisy karne KK o prawach autorskich, orzecznictwo ws. keygenów.
- Zmiany w adaptacji: Oryginalne A zachowane. Chińska nowelizacja KK (art. 217 pkt 6 — omijanie technicznych środków ochrony praw autorskich w celu zysku, progi kwotowe w walucie lokalnej) zastąpione KK art. 269b (narzędzia + kody dostępu, 3-5 lat) i upa (cywilnie); chińskie progi kwotowe nie mają polskiego odpowiednika.

<a id="porada-11-21"></a>

### 21. Nie zlecaj ani nie wykonuj ataków DDoS („stress testów” na cudzych serwerach); nie sprzedawaj ani nie wynajmuj platform do „uderzania” ruchem
- Status: verified
- Koszt: Bezpłatnie. Koszt to rezygnacja z płatnych „usług nacisku” i zemsty „po przegranej”.
- W praktyce: Atak DDoS — zakłócenie pracy cudzego systemu informatycznego przez transmisję danych — to KK art. 269a: kara pozbawienia wolności od 3 miesięcy do lat 5. Udostępnianie platformy/narzędzi do takich ataków to art. 269b §1 (3 mies. do 5 lat); pomoc w ataku (serwery, płatności) to pomocnictwo — KK art. 18 §3. Legalny „stress test” dotyczy wyłącznie własnego systemu albo takiego, na który masz pisemną zgodę (zob. 11.9).
- Korzyść i dowody: KK art. 269a (pełny odczyt rozdziału XXXIII, stan 01.11.2026) — 3 mies. do 5 lat; KK art. 269b §1 (narzędzia, 3-5 lat); KK art. 18 §3 (pomocnictwo — pełny odczyt).
- Ocena dowodów: A — KK art. 269a/269b/18 §3 z pełnymi odczytami.
- Ocena redakcyjna: „To tylko test obciążeniowy” bez zgody właściciela celu to atak — konflikty rozwiązuj przez reklamacje, UOKiK, sąd albo zgłoszenie, nie przez „zablokowanie” komuś usługi.
- Ograniczenia: Kwalifikacja (art. 269a vs 267 §2) zależy od skutku i sposobu — sąd ocenia kazuistycznie; art. 269c chroni tylko działania pro-sekurnościowe z niezwłocznym zgłoszeniem, nie „testy na czyimś serwerze”.
- Źródła: [KK art. 269a — zakłócenie pracy systemu (lexlege, pełny odczyt)](https://lexlege.pb.pl/kodeks-karny/art-269a/); [KK art. 269b — narzędzia (lexlege, pełny odczyt)](https://lexlege.pb.pl/kodeks-karny/art-269b/); [KK art. 18 §3 — pomocnictwo (lexlege, pełny odczyt)](https://lexlege.pb.pl/kodeks-karny/art-18)
- Oryginał: [11.21](https://github.com/eternity4719/HowToLiveBetter/blob/e2605d3e2242bd6216c9255192b8a8957a08c55a/book/11-%E7%A8%8B%E5%BA%8F%E5%91%98%E5%92%8C%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%AE%B9%E6%98%93%E8%B8%A9%E7%9A%84%E7%BA%A2%E7%BA%BF.md#L201-L208)
- Weryfikacja: 2026-11-01; pełne odczyty KK art. 269a/269b/18 (lexlege.pb.pl, rozdział XXXIII, Dz.U.2026.1342 t.j.); wyniki wyszukiwań: orzecznictwo PL ws. ataków DDoS („booter/stresser”), CBZC/policja.gov.pl komunikaty.
- Zmiany w adaptacji: Oryginalne A zachowane. Chińskie art. 286/287/287-1 KK CN (niszczenie systemu przez DDoS — 5+ lat; narzędzia do zakłócania; pomocnictwo) zastąpione aktualnym KK: art. 269a (3 mies.-5 lat) + art. 269b + art. 18 §3; progi liczbowe i kwotowe w walucie lokalnej (komputery, pieniądze, godziny, użytkownicy) nie mają polskiego odpowiednika ustawowego.

