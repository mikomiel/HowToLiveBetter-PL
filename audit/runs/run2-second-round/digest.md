# Audit digest

| Item | Verifier A | Verifier B | Runs agree | Adversary (blocker/major/minor) | Editor |
|---|---|---|---|---|---|
| 03.4 | UNAVAILABLE | UNAVAILABLE | yes | 0/0/9 | needs_edits, 3 edits |
| 04.4 | PASS | - | - | 0/2/5 | needs_edits, 2 edits |
| 14.2 | PASS | PASS | no (2) | 0/1/5 | needs_edits, 4 edits |
| 14.7 | UNAVAILABLE | UNAVAILABLE | no (4) | 0/0/9 | needs_edits, 2 edits |

## 03.4

Verifier A: UNAVAILABLE, 3 open row(s)
- W praktyce#2 (recommendation_derived, partly): Przy trudnościach ze snem przesuń ją wcześniej lub ogranicz.
  - Moving the last coffee or tea earlier (6 hours before bed in the NHS insomnia self-help list; at least 8.8 h before bedtime for coffee in Gardiner) is backed. Reducing the amount (ogranicz) is not given as advice by either snapshot: the NH…
- Ograniczenia#1.1 (source_claim, partly): Źródła podają odstęp od pory snu (6 godzin, 8,8 godziny i 13,2 godziny dla różnych napojów),
  - The three intervals (6 h, 8.8 h, 13.2 h), all counted back from bedtime / going to bed, are supported. The word napojów is broader than the source: the Gardiner abstract names the 13.2 h item a standard serve of pre-workout supplement and …
- Ograniczenia#1.2 (source_claim, not_checkable): nie godzinę na zegarze.
  - Absence claim (the sources give no clock time). The Gardiner snapshot is abstract-only, which cannot show absence; the full text would be needed to confirm it gives no clock-time example. In the NHS snapshot (main region, 4304 of 4844 char…

Verifier B: UNAVAILABLE, 3 open row(s)
- W praktyce#2 (recommendation_derived, partly): Przy trudnościach ze snem przesuń ją wcześniej lub ogranicz.
  - Backed: moving the last caffeine earlier when sleep is poor (NHS lists a 6-hour no tea/coffee window under self-treatment of insomnia; the meta-analysis abstract gives 8.8 h for coffee). Not backed: 'lub ogranicz' if it means reducing the …
- Ograniczenia#1.1 (source_claim, partly): Źródła podają odstęp od pory snu (6 godzin, 8,8 godziny i 13,2 godziny dla różnych napojów)
  - The three intervals counted from bedtime (6 h, 8.8 h, 13.2 h) are stated. Not matched exactly: 'różnych napojów'. The 13.2 h figure is for a 'standard serve of pre-workout supplement', and the abstract does not say it is a drink; the 6 h N…
- Ograniczenia#1.2 (source_claim, not_checkable): nie godzinę na zegarze
  - Searched both snapshots for clock-time wording (clock, o'clock, am/pm, evening, afternoon, morning, hh:mm): no hits. In the NHS snapshot this shows absence only from the stored main region (4304 of 4844 characters kept). The meta-analysis …

Adversary: 0 blocker/major, 9 minor

Editor (needs_edits, 14 protected findings):
- W praktyce (term): "metaanalizy" → "metaanalizy, czyli łącznej analizy wyników badań,"
- Korzyść i dowody (calque): "Po kofeinie" → "Po przyjęciu kofeiny"
- Ocena redakcyjna (consistency): "Przesunięcie napoju" → "Przesunięcie porcji kofeiny"

## 04.4

Verifier A: PASS

Adversary: 2 blocker/major, 5 minor
- MAJOR same-action (Korzyść i dowody#1): osoby, które powiązały wcześniejsze doświadczenia z nowym zadaniem, rzadziej zaniżały termin ukończenia
  - The tested recall-relevant procedure had two parts: (a) the target date was derived from the participant's own summary of how far before deadlines they usually finished, and (b) the participant wrote a scenario, built on problems met before, that ends at that typical time. The authors state that the study had no scena…
  - Direction: State in Ograniczenia that the manipulation combined a past-based target date with a written scenario of obstacles and that the study cannot separate the two; describe the benefit as the result of th…
- MAJOR limitations (W praktyce#1): sprawdź, ile trwało poprzednie podobne zadanie, zapisz, jak odnosi się do tego, które planujesz, i dopiero wtedy wyznac…
  - The authors say that, on the basis of their studies, they do not yet have compelling evidence that individuals can use recollections of their own past performance to improve the accuracy of their time estimates. They also report that estimates built heavily on typical past completion times would have been far too pess…
  - Direction: Add the authors' own caution to Ograniczenia: no compelling evidence that recollecting past durations improves accuracy, past typical times would have given estimates that were too long in this study…

Editor (needs_edits, 8 protected findings):
- W praktyce (calque): "jak odnosi się do tego, które planujesz" → "jak ma się ono do zadania, które planujesz"
- Ocena redakcyjna (register): "przemawia za taką próbą przed deklaracją terminu" → "przemawia za wypróbowaniem tego sposobu przed zadeklarowaniem terminu"

## 14.2

Verifier A: PASS

Verifier B: PASS

The two runs differ; a person decides:
- W praktyce#3 (checking): A recommendation_derived not_applicable, source_claim supported; B recommendation_derived not_applicable
- W praktyce#4 (checking): A recommendation_derived not_applicable, source_claim supported; B recommendation_derived not_applicable

Adversary: 1 blocker/major, 5 minor
- MAJOR preservation (W praktyce#1): W menedżerze wygeneruj długie, unikalne hasła
  - The upstream gives an explicit fallback for a reader who will not or cannot use a separate manager: the browser's built-in one. The cited CERT page also calls the built-in browser option 'a simple and good solution'. The item says only 'W menedżerze' and 'przygotowanie menedżera haseł'. It never says that the browser'…
  - Direction: State that a manager built into the browser is an acceptable starting point when the reader does not want a separate product, as the cited page does, and list the removal or change in 'Zmiany w adapt…

Editor (needs_edits, 9 protected findings):
- Koszt (term): "Zmiana haseł i przygotowanie menedżera haseł." → "Zmiana haseł i przygotowanie menedżera haseł (aplikacji do tworzenia i przechowywania haseł)."
- W praktyce (calque, needs re-verification): "które serwis pokaże przy jego włączaniu" → "które usługa pokaże przy włączaniu drugiego składnika logowania"
- W praktyce (calque): "przez którą resetujesz inne konta" → "przez którą resetujesz hasła do innych kont"
- Korzyść i dowody (calque): "powtórzone hasło" → "ponownie użyte hasło"

## 14.7

Verifier A: UNAVAILABLE, 1 open row(s)
- Ograniczenia#1.1 (source_claim, partly): Uprawnienie systemowe dotyczy dostępu aplikacji do funkcji urządzenia
  - The Android help page states this for Android app permissions. The claim speaks of a system permission in general; no snapshot covers other operating systems. Minor: the next part of the same field limits the reading to Android.

Verifier B: UNAVAILABLE, 3 open row(s)
- title#1 (recommendation_derived, partly): Rozdziel uprawnienia aplikacji od zgód na przetwarzanie danych
  - Backed: each concept taken separately (Ograniczenia#1: the Android help page ties permissions to device functions; RODO Art. 4 pkt 11 defines consent). Not backed: the instruction to keep the two apart, that is, that an app permission is n…
- Korzyść i dowody#4 (source_description, partly): Strona pomocy Androida (Google) opisuje zmianę uprawnień aplikacji.
  - Supported: it is an Android help page (title ends with 'Android - Pomoc') that describes changing app permissions. Not shown by the text between the snapshot markers: the attribution '(Google)'. The word Google does not occur in the page t…
- Ograniczenia#2.2 (source_claim, partly): żadne z cytowanych źródeł nie rozstrzyga, kiedy jedno jest drugim.
  - Holds for the Android page: it never mentions consent, RODO or personal data (searched zgod, RODO, osobow, rozporządz: no hits in the stored article region of 4276 of 6655 characters). Holds for the RODO operative text as far as app permis…

The two runs differ; a person decides:
- title#1 (strength): A recommendation_derived not_applicable; B recommendation_derived partly
- Korzyść i dowody#4 (strength): A source_description supported; B source_description partly
- Ograniczenia#1 (strength): A source_claim partly, meta_statement not_applicable, source_claim supported; B source_claim supported
- Ograniczenia#2 (strength): A meta_statement not_applicable, source_claim absent_in_source; B meta_statement not_applicable, source_claim partly

Adversary: 0 blocker/major, 9 minor

Editor (needs_edits, 18 protected findings):
- W praktyce (calque): "do czego aplikacja chce dostępu" → "o jaki dostęp prosi aplikacja"
- Ograniczenia (calque): "miał przeglądu prawnika" → "został przejrzany przez prawnika"

