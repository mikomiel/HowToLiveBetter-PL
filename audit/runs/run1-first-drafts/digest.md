# Audit digest

| Item | Verifier A | Verifier B | Runs agree | Adversary (blocker/major/minor) | Editor |
|---|---|---|---|---|---|
| 03.4 | UNAVAILABLE | UNAVAILABLE | no (1) | 0/0/8 | needs_edits, 3 edits |
| 04.4 | UNAVAILABLE | - | - | 0/1/5 | needs_edits, 4 edits |
| 14.2 | PASS | PASS | yes | 0/2/7 | needs_edits, 4 edits |
| 14.7 | UNAVAILABLE | UNAVAILABLE | no (2) | 0/0/8 | needs_edits, 2 edits |

## 03.4

Verifier A: UNAVAILABLE, 3 open row(s)
- title#1 (recommendation_derived, partly): Ogranicz kofeinę przed snem zamiast stosować jedną godzinę graniczną dla wszystkich
  - Backed: limiting caffeine before sleep (Gardiner abstract: caffeine cut total sleep time; both sources give a minimum interval before bed) and the cutoff differing with the caffeine source/dose (8.8 h for coffee vs 13.2 h for a pre-workout…
- Ograniczenia#1.1 (source_claim, partly): Nie ma uniwersalnej granicy
  - The snapshots give different minimum intervals before bedtime (8.8 h coffee, 13.2 h pre-workout serve in the Gardiner abstract; 6 h tea/coffee in NHS), which supports that there is no single interval for all caffeine sources. Neither snaps…
- Ograniczenia#3 (source_claim, not_checkable): Cytowane źródła nie opisują indywidualnej wrażliwości na kofeinę.
  - Absence can be shown only from a whole text. The Gardiner snapshot is an abstract only (Europe PMC); it does not mention individual sensitivity, but the full text of Gardiner et al. would be needed to show absence. The NHS snapshot is the …

Verifier B: UNAVAILABLE, 4 open row(s)
- title#1 (recommendation_derived, partly): Ogranicz kofeinę przed snem zamiast stosować jedną godzinę graniczną dla wszystkich
  - Backed part: limiting caffeine before sleep, with sources giving minimum intervals before bedtime that differ by source and product. Not backed part: 'instead of one cut-off hour for everyone'. No snapshot advises against a single cut-off,…
- Ograniczenia#1.1 (source_claim, partly): Nie ma uniwersalnej granicy
  - The quotes show that the recommended minimum interval before bedtime differs by source and product (NHS tea or coffee versus the meta-analysis coffee versus pre-workout supplement), which supports that there is no single interval for every…
- Ograniczenia#2 (source_claim, partly): Zawartość kofeiny różni się między napojami: autorzy podają jako przykłady 107 mg w 250 mL kawy i 217,5 mg w porcji suplementu przedtrening…
  - Supported part: the abstract gives the two example figures (107 mg per 250 mL of coffee, 217.5 mg per standard serve of pre-workout supplement). Weak part: 'Zawartość kofeiny różni się między napojami' as a general statement. The abstract …
- Ograniczenia#3 (source_claim, not_checkable): Cytowane źródła nie opisują indywidualnej wrażliwości na kofeinę.
  - The meta-analysis snapshot is an abstract only, which cannot show absence; its full text would be needed. In the abstract nothing on individual sensitivity to caffeine was found. In the NHS page main region (keptChars 4304 of wholeChars 48…

The two runs differ; a person decides:
- Ograniczenia#2 (strength): A source_claim supported; B source_claim partly

Adversary: 0 blocker/major, 8 minor; not assessable: grade

Editor (needs_edits, 17 protected findings):
- title (title): "przed snem zamiast stosować" → "przed snem, zamiast stosować"
- W praktyce (term): "autorzy metaanalizy" → "autorzy metaanalizy (statystycznego połączenia wyników badań)"
- Ocena redakcyjna (consistency): "Przesunięcie napoju" → "Przesunięcie pory picia napoju z kofeiną"

## 04.4

Verifier A: UNAVAILABLE, 1 open row(s)
- W praktyce#1.2 (recommendation_derived, partly): sprawdź, ile trwało poprzednie podobne zadanie.
  - Backed only as the first step of the combined procedure that worked (recall plus linking to the new task, row Korzyść i dowody#1). Taken alone, checking how long a past task took is the recall-only condition, which the source found did not…

Adversary: 1 blocker/major, 5 minor
- MAJOR same-action (title#1): Przed oceną terminu porównaj nowe zadanie z podobnymi wcześniejszymi
  - The title (and W praktyce#2) presents comparison with earlier similar tasks as the action. What Study 4 manipulated was a bundle: participants described past similar assignments, then wrote the date they would finish if they finished as far before the deadline as they typically had, then wrote a plausible scenario, ba…
  - Direction: State in Ograniczenia that the experimental condition bundled a date derived from the typical past pace with a written scenario of delays, that no arm tested either part alone, and that the authors t…

Editor (needs_edits, 8 protected findings):
- Koszt (term): "szacunek" → "oszacowanie"
- Ocena redakcyjna (consistency): "sprawdzenia historii" → "sprawdzenia wcześniejszych podobnych zadań"
- Ocena redakcyjna (calque): "deklaracją" → "zadeklarowaniem"
- Ograniczenia (term, needs re-verification): "bezwzględnego błędu prognozy" → "bezwzględnego błędu prognozy (różnicy między przewidywanym a rzeczywistym czasem, bez względu na kierunek pomyłki)"

## 14.2

Verifier A: PASS

Verifier B: PASS

Adversary: 2 blocker/major, 7 minor; not assessable: recency
- MAJOR preservation (W praktyce#1): W menedżerze wygeneruj długie, unikalne hasła do usług, które ich używają.
  - The upstream span gives a fallback for a reader who does not want or cannot set up a separate manager: use the browser's built-in password manager. The cited CERT Polska page says the same. The Polish item drops it, and Koszt speaks of 'przygotowanie menedżera', so this reader has no stated zero-install path and may s…
  - Direction: State that a browser's built-in password saving is an acceptable starting point if the reader will not use a separate manager, within what the CERT page says. Do not add claims beyond the page.
- MAJOR self-containment (W praktyce#2): Zabezpiecz dostęp do samego menedżera: jeśli to możliwe, włącz drugi składnik logowania na koncie, którym się do niego …
  - The item protects the manager only through a second factor on its login account and backup codes. It never mentions the manager's master password, which the cited page calls the one password the reader must remember and says to build as a passphrase. Read alone, a reader may reuse an old password as the master passwor…
  - Direction: Add a sentence on the manager's master password (unique, not reused, memorised, built as the CERT page describes) or state explicitly where that guidance lives. Keep Ograniczenia#3 about not giving a…

Editor (needs_edits, 8 protected findings):
- Koszt (term): "przygotowanie menedżera" → "przygotowanie menedżera haseł (narzędzia do ich tworzenia i przechowywania)"
- W praktyce (calque): "do usług, które ich używają" → "do usług, w których logujesz się hasłem"
- W praktyce (calque, needs re-verification): "na koncie, którym się do niego logujesz" → "na koncie, za pomocą którego logujesz się do menedżera"
- W praktyce (calque, needs re-verification): "resetujesz inne konta" → "resetujesz hasła do innych kont"

## 14.7

Verifier A: UNAVAILABLE, 4 open row(s)
- title#1 (recommendation_derived, partly): Rozdziel wymagane uprawnienia aplikacji od dodatkowych zgód
  - Backed: a system permission is a per-app accept/decline decision about access to device functions (Android help page) and RODO consent is a separate act whose voluntariness depends on whether the data are necessary for the service (Art. 7 …
- Koszt#1.2 (source_claim, partly): część funkcji może przestać działać.
  - The Android page says that enabling a permission affects how the app works and that after 'Nie zezwalaj' the app cannot use that permission. It does not say that app functions stop working when a permission is withdrawn; that consequence i…
- Ograniczenia#4.2 (source_claim, partly): mówi tylko, że przy ocenie dobrowolności zgody uwzględnia się uzależnienie usługi od zgody na dane zbędne do jej wykonania;
  - The content matches (conditioning a contract or service on consent to unnecessary processing is a factor in assessing voluntariness). Missing: the provision says 'w jak największym stopniu uwzględnia się' (taken into account to the greates…
- Ograniczenia#5 (source_claim, partly): Niektóre funkcje wymagają określonego dostępu.
  - The Android page lists permission types, what each one covers, and says an app cannot use a permission that was declined. It does not state that app functions require a given access; that general statement is an inference. The RODO text (A…

Verifier B: UNAVAILABLE, 2 open row(s)
- title#1 (recommendation_derived, partly): Rozdziel wymagane uprawnienia aplikacji od dodatkowych zgód
  - Backed in part: the Android help page shows that app permissions can be accepted, refused and changed one by one (Korzyść i dowody#4), and Art. 7 ust. 4 RODO names consent to data that is not necessary for the service as a factor in judgin…
- Ograniczenia#5 (source_claim, partly): Niektóre funkcje wymagają określonego dostępu.
  - The Android page says that enabling a permission affects how an app works and that after 'Nie zezwalaj' the app cannot use that permission. It does not state that particular app functions require particular access, nor that refusing a perm…

The two runs differ; a person decides:
- Koszt#1 (checking): A editorial_estimate not_applicable, source_claim partly; B editorial_estimate not_applicable
- Ograniczenia#4 (strength): A meta_statement not_applicable, source_claim partly, source_claim absent_in_source; B source_claim supported, source_claim absent_in_source

Adversary: 0 blocker/major, 8 minor; not assessable: recency

Editor (needs_edits, 12 protected findings):
- title (title): "Rozdziel" → "Oddziel"
- W praktyce (term): "Odbierz" → "Cofnij"

