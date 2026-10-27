# Jak żyć lepiej

## Praktyczny poradnik oparty na dowodach

Niezależna polska adaptacja [HowToLiveBetter — 高性价比人生指南](https://github.com/eternity4719/HowToLiveBetter), autorstwa eternity4719. Wybieramy praktyczne zalecenia, sprawdzamy źródła i opisujemy ich ograniczenia. Nie jest to oficjalne wydanie autora oryginału ani automatyczne tłumaczenie.

**Stan pilotażu: 10 zweryfikowanych polskich porad z rozdziału 04.** Osiem pozostałych pozycji tego rozdziału nie weszło do pilotażu. Ich powody pominięcia są przy treści. Nie przetłumaczono całej książki liczącej w wersji źródłowej 767 pozycji.

- [Czytaj rozdział 4: Nie marnuj czasu](book/pl/04-nie-marnuj-czasu.md)
- [Otwórz lokalny czytnik](index.html) po uruchomieniu serwera według instrukcji poniżej.
- [Zgłoś błąd lub zaproponuj korektę](https://github.com/mikomiel/HowToLiveBetter-PL/issues/new)
- [Zasady redakcyjne](AGENTS.md)

Podstawa adaptacji: commit upstream [e2605d3e2242bd6216c9255192b8a8957a08c55a](https://github.com/eternity4719/HowToLiveBetter/tree/e2605d3e2242bd6216c9255192b8a8957a08c55a). Weryfikację pilotażu wykonano 2026-10-27. Wybrane tematy to planowanie, koszty utopione, prognozowanie czasu, spotkania, prokrastynacja, nawyki, skróty klawiaturowe i dojazdy.

## Jak czytać koszty i korzyści

Każda porada oddziela:

- koszt pieniędzy, czasu i wysiłku;
- wynik sprawdzonego badania lub syntezy badań;
- ocenę redakcyjną, czy warto spróbować danego działania;
- ograniczenia i niepewność.

Koszty przygotowania są orientacyjnymi ocenami redakcji, nie wynikami badań czasu pracy. Nie podajemy zmyślonych polskich cen. Nie zamieniamy wyników ankiety w obietnicę poprawy i nie obiecujemy określonej liczby odzyskanych godzin. Rachunek przykładowy ma jawne założenia.

Mały koszt próby nie oznacza mocnych dowodów. Mocne dowody nie oznaczają, że działanie jest opłacalne dla każdego. Kolejność porad wynika z numerów źródła, nie z rankingu opłacalności. Nie trzeba wykonywać wszystkich zaleceń.

<a id="jak-czytac-dowody"></a>

## Jak czytać dowody

Zachowujemy oznaczenia A/B/C, ale podajemy przy każdej poradzie projekt badania i zakres wniosku. To skrót redakcyjny inspirowany oryginałem, nie formalny system oceny pewności GRADE.

| Ocena | Znaczenie w tym pilotażu |
| --- | --- |
| A | Ilościowa synteza wielu badań. Trzeba osobno ocenić ich projekt i ograniczenia; synteza korelacji nadal nie dowodzi przyczyny. |
| B | Pojedyncze badanie, ograniczone próby albo wniosek, którego nie można wiarygodnie wyrazić jedną wielkością efektu. |
| C | Osąd redakcyjny lub doświadczenie bez bezpośredniego badania skuteczności. Nie przedstawiamy go jako dowodu naukowego. |

Przykładowo d = 0,65 jest standaryzowaną miarą różnicy, a nie poprawą o 65%. Wzrost z 29,3% do 60,0% to 30,7 punktu procentowego. Ryzyko względne nie mówi samo, ile osób uniknie zdarzenia. Samo określenie „A” nie gwarantuje prawdziwości, przyczynowości ani zastosowania wyniku w Polsce.

Przy części publikacji dostępny był tylko abstrakt autora. Każda porada podaje zakres sprawdzenia. verified oznacza sprawdzenie konkretnych opublikowanych twierdzeń, nie ponowne wykonanie badania ani pełny systematyczny przegląd najnowszej literatury. Zastrzeżenie dotyczące dowodu zostaje przy poradzie, także w czytniku.

## Stan treści i pochodzenie

Jedynym źródłem polskiej treści jest [Markdown rozdziału 04](book/pl/04-nie-marnuj-czasu.md). Czytnik nie ma osobnej bazy i nie pobiera chińskich rozdziałów. Każda porada zawiera numer oryginału, przypięty odsyłacz do upstream, badania, ocenę dowodów, ograniczenia, datę i zakres weryfikacji oraz opis zmian.

| Stan | Znaczenie |
| --- | --- |
| verified | Tłumaczenie sprawdzone i dopuszczone do pilotażu. Tylko ten stan trafia do czytnika. |
| needs_verification | Tłumaczenie istnieje, ale istotne twierdzenie wymaga potwierdzenia. |
| needs_localization | Treść zależy od chińskich przepisów, instytucji, rynku lub procedur. |
| not_applicable | Brak odpowiedniego zastosowania w Polsce. |

Chińskie pliki w [book/](book/) i [docs/](docs/), odziedziczony selfcheck.html, skille oraz starsze generatory są **materiałem referencyjnym upstream**, nie gotową polską treścią. Nie przenosimy chińskich statystyk, procedur ani porad prawnych pod polskie nazwy. Część porad zawężono po sprawdzeniu źródeł, między innymi prognozowanie terminów, spotkania, nawyki i skróty klawiaturowe.

## Uruchom lokalny czytnik

Potrzebujesz Pythona 3 do prostego serwera HTTP; sam czytnik działa bez instalacji pakietów i bez połączeń z zewnętrznymi usługami.

```bash
git clone https://github.com/mikomiel/HowToLiveBetter-PL.git
cd HowToLiveBetter-PL
python3 -m http.server 8000 --bind 127.0.0.1
```

Otwórz http://127.0.0.1:8000/. Po połączeniu tego PR z main klon zawiera pilotaż; przed połączeniem przełącz się na gałąź PR. Nie otwieraj index.html przez file://, ponieważ przeglądarka blokuje wtedy odczyt Markdown.

Czytnik ma wyszukiwanie (także bez polskich znaków), filtr ocen dowodów, nawigację do porad i rozwijane szczegóły źródeł. Liczba porad pochodzi z wczytanego Markdown. Obsługuje klawiaturę i małe ekrany. Nie ma reklam, śledzenia, zewnętrznych fontów ani wymaganego konta. Nie uruchomiono publicznej strony.

## Jak zgłosić poprawkę i współtworzyć wydanie

W zgłoszeniu podaj identyfikator, na przykład 04.12, kwestionowane zdanie, źródło pierwotne i proponowaną korektę. Nie przesyłaj cudzych danych osobowych. Jeśli źródła brakuje, napisz to zamiast dopisywać pewny wniosek.

Przed PR przeczytaj [AGENTS.md](AGENTS.md). Edytuj Markdown, nie kopię porady w kodzie. Zachowaj oryginalny numer. Zmiana istotnego twierdzenia wymaga ponownej weryfikacji i daty; niezweryfikowane tłumaczenie pozostaje poza czytnikiem. PR kieruj wyłącznie do main w mikomiel/HowToLiveBetter-PL.

Kontrole techniczne wymagają Node.js 22 lub nowszego. Playwright jest jedyną nową zależnością, wyłącznie testową: stare skrypty nie wykonują interakcji z polskim czytnikiem w przeglądarce. Czytnik nie ma zależności uruchomieniowych.

```bash
npm ci
npm test
npx playwright install chromium
npm run test:browser
```

Testy sprawdzają format i stany treści, pochodzenie, liczbę porad, kotwice oraz workflow. Test przeglądarkowy wczytuje rzeczywisty Markdown, sprawdza wyszukiwanie, filtr, linki, klawiaturę, mały ekran i błąd odczytu. Test nie zastępuje oceny faktów i języka przez redaktora.

## Publikacja i licencje

GitHub Actions wykonuje wyłącznie kontrole pilotażu, z contents: read i bez zachowywania poświadczeń checkoutu. Runner Ubuntu 24.04 jest przypięty do wersji obsługiwanej przez testową przeglądarkę Playwright. Nie tworzy e-booków, tagów, wydań ani wdrożeń Pages. Stare generatory opisuje [tools/README.md](tools/README.md); nie służą do publikacji polskiego pilotażu. Scalenie PR wymaga decyzji człowieka.

Tekst oryginału oraz polska adaptacja, w tym README i book/pl/, są udostępnione na [CC BY 4.0](LICENSE). Możesz kopiować, adaptować i używać ich komercyjnie zgodnie z [warunkami licencji](https://creativecommons.org/licenses/by/4.0/). Zachowaj oznaczenie eternity4719, tytuł i link do HowToLiveBetter, link do licencji, informację o adaptacji i dokonanych zmianach. Nie sugeruj zatwierdzenia adaptacji przez autora. Nie ma gwarancji poprawności; pełne warunki i wyłączenia zawiera LICENSE. Prawa do znaków i materiałów osób trzecich nie wynikają automatycznie z tej licencji.

Kod czytnika i narzędzi jest na [MIT](LICENSE-CODE). Pełne zawiadomienie Copyright (c) 2026 eternity4719 i warunki MIT pozostają bez zmian. Nie używamy odziedziczonych reklam, próśb o wpłaty ani grafik marki w polskim czytniku.
