# Audit digest

| Item | Verifier A | Verifier B | Runs agree | Adversary (blocker/major/minor) | Editor |
|---|---|---|---|---|---|
| 03.1 | UNAVAILABLE | - | - | 0/1/5 | needs_edits, 1 edits |
| 03.2 | UNAVAILABLE | FAIL | no (2) | 0/0/8 | needs_edits, 2 edits |
| 03.3 | UNAVAILABLE | UNAVAILABLE | yes | 0/1/10 | needs_edits, 6 edits |
| 03.5 | FAIL | - | - | 0/3/4 | needs_edits, 4 edits |
| 03.6 | UNAVAILABLE | - | - | 0/0/5 | needs_edits, 1 edits |
| 03.7 | UNAVAILABLE | - | - | 0/1/7 | needs_edits, 2 edits |

## 03.1

Verifier A: UNAVAILABLE, 3 open row(s)
- Korzyść i dowody#1.1 (source_description, partly): Stothart i współautorzy wykazali w eksperymencie,
  - Authors (Stothart, Mitchum, Yehnert) are confirmed. The design label 'eksperyment' is not stated anywhere in the abstract or the PubMed page: the abstract says 'We found' and mentions 'participants' but never names the design. The full tex…
- Ocena dowodów#1 (source_description, partly): B — eksperyment dotyczący konkretnego zadania uwagowego.
  - The grade letter B is editorial and was not checked. The words after it describe the source: the abstract confirms a task that demands attention, but it does not name the task ('konkretnego') and does not state the design 'eksperyment'. Th…
- Ograniczenia#1 (source_claim, not_checkable): Nie zmierzono codziennych oszczędności czasu ani skutków wieloletnich.
  - Both snapshots hold only the abstract (the PubMed page adds metadata around the same abstract text, not the paper). The abstract reports performance on an attention-demanding task and names no daily time savings or long-term follow-up, but…

Adversary: 1 blocker/major, 5 minor
- MAJOR scope-words (Korzyść i dowody#1): Stothart i współautorzy wykazali w eksperymencie, że same powiadomienia zakłócały wykonanie zadania wymagającego uwagi
  - The upstream span states two conditions of the evidence: it was done in a laboratory and the participants were university students. The Polish item keeps neither in Korzyść i dowody, Ocena dowodów or Ograniczenia (AGENTS.md: 'Zachowaj warunki, populację, niepewność i ograniczenia źródła'). The stored abstract names no…
  - Direction: State the setting and the sample as far as the stored sources allow (laboratory attention task; sample not specified in the abstract, upstream says university students) or have the full text checked,…

Editor (needs_edits, 7 protected findings):
- Koszt (register): "To nakład redakcyjnie oceniany" → "Redakcja ocenia ten nakład"

## 03.2

Verifier A: UNAVAILABLE, 9 open row(s)
- title#1 (recommendation_derived, partly): Dbaj o regularne pory snu, nie skracając odpoczynku
  - NHS backs only a fixed wake-up time and keeping regular sleeping hours after a bad night. It does not advise fixed sleep times in general (it says to go to bed only when sleepy) and gives no advice about not cutting rest short as such, onl…
- W praktyce#1 (recommendation_derived, partly): Jeśli pozwalają na to obowiązki, wybierz zbliżone pory wstawania i przeznacz wystarczająco dużo czasu na sen.
  - The part about choosing similar wake-up times is backed by NHS (same time every day). The part about allowing enough time for sleep is not given as advice in the NHS snapshot, which only states an average need (adults 7 to 9 hours, line 41…
- W praktyce#2 (recommendation_derived, partly): Nie traktuj regularności jako powodu do celowego niedosypiania.
  - Only the premise is in NHS: the average sleep need of adults and that constant daytime tiredness suggests too little sleep. No snapshot gives this advice or discusses weighing regularity against shortened sleep, and no source_claim row of …
- Korzyść i dowody#1 (source_description, source_unavailable): Phillips i współautorzy obserwowali 61 studentów przez 30 dni.
  - The cited source (Nature Scientific Reports, s41598-017-03171-4) was blocked by the site and has no snapshot. The lead row with the same DOI has origin lead and is not evidence. Author, design, 61 students and 30 days cannot be checked.
- Korzyść i dowody#2 (source_claim, source_unavailable): Większa regularność snu wiązała się z lepszymi wynikami akademickimi; mniej regularna grupa miała późniejszy rytm dobowy.
  - The cited source (Nature Scientific Reports, s41598-017-03171-4) was blocked and has no snapshot. Both findings (regularity linked to academic performance, less regular group with later circadian phase) cannot be checked. The weakest verdi…
- Ocena dowodów#1.1 (source_description, partly): B — małe badanie obserwacyjne oraz zalecenie dla pacjentów
  - The grade letter B is editorial and was not checked. The NHS page is public self-help advice for people with insomnia, which fits 'zalecenie dla pacjentów' only loosely. 'Małe badanie obserwacyjne' (size and observational design of Phillip…
- Ocena dowodów#1.2 (source_claim, source_unavailable): nie próba skuteczności samej stałej pobudki.
  - The claim covers both sources. In the NHS snapshot (main region only, keptChars 4304 of wholeChars 4844) I found no trial and no measured effect of a fixed wake-up time alone: the page lists habits without citing studies. Whether Phillips …
- Ograniczenia#1 (source_claim, source_unavailable): Korelacja nie dowodzi poprawy ocen po zmianie pobudki.
  - The sentence presupposes that the Phillips finding is correlational (no change of wake-up time tested). That depends on the Nature source, which has no snapshot, so the design cannot be confirmed. The general point that correlation does no…
- Ograniczenia#2 (source_claim, partly): Praca zmianowa, choroby i opieka nad bliskimi wymagają innego planowania.
  - NHS lists shift work (line 67, 'shift work', too short to quote) among the most common causes of insomnia and lists conditions that can cause insomnia (lines 71-83). It does not say that these need different planning, and caregiving for re…

Verifier B: FAIL, 9 open row(s)
- title#1 (recommendation_derived, partly): Dbaj o regularne pory snu, nie skracając odpoczynku
  - Backed: the 'regularne pory' part (NHS advises a fixed wake time and regular sleeping hours). Not backed: 'nie skracając odpoczynku'. The NHS page only states an average need of 7 to 9 hours for adults (line 41) and does not advise against…
- W praktyce#1 (recommendation_derived, partly): Jeśli pozwalają na to obowiązki, wybierz zbliżone pory wstawania i przeznacz wystarczająco dużo czasu na sen.
  - Backed: 'wybierz zbliżone pory wstawania' (NHS: same wake-up time every day). Not backed: 'przeznacz wystarczająco dużo czasu na sen'. NHS gives no advice to allot enough time; it only states an average adult need of 7 to 9 hours (line 41)…
- W praktyce#2 (recommendation_derived, unsupported): Nie traktuj regularności jako powodu do celowego niedosypiania.
  - Searched b59686537010480d.txt (NHS insomnia, main region) for advice against deliberately sleeping less for the sake of regular times. Found none. Nearest text is the average need of 7 to 9 hours for adults (line 41) and 'You probably do n…
- Korzyść i dowody#1 (source_description, source_unavailable): Phillips i współautorzy obserwowali 61 studentów przez 30 dni.
  - Cited source https://www.nature.com/articles/s41598-017-03171-4 has access 'blocked' and snapshot null, so authors, design, 61 students and 30 days cannot be checked. The only readable text of this paper in the packet is a row with origin …
- Korzyść i dowody#2 (source_claim, source_unavailable): Większa regularność snu wiązała się z lepszymi wynikami akademickimi; mniej regularna grupa miała późniejszy rytm dobowy.
  - Both parts (regularity with better academic results; less regular group with later circadian rhythm) come from the Nature article, access 'blocked', snapshot null. No cited readable snapshot speaks to them; the 'lead' row is not evidence u…
- Ocena dowodów#1.1 (source_description, partly): B — małe badanie obserwacyjne oraz zalecenie dla pacjentów
  - The grade letter B is editorial and was not checked. 'zalecenie dla pacjentów': the NHS page gives self-help advice to people with insomnia, which fits loosely (it is a public health-information page, not described as a guideline). 'małe b…
- Ocena dowodów#1.2 (source_claim, source_unavailable): nie próba skuteczności samej stałej pobudki
  - The claim says neither source is an efficacy trial of a fixed wake time alone. Searched the NHS main region (4304 of 4844 chars, b59686537010480d.txt): it is a list of self-help advice and describes no trial or efficacy test. The Phillips …
- Ograniczenia#1 (source_claim, source_unavailable): Korelacja nie dowodzi poprawy ocen po zmianie pobudki.
  - This states a limit of the Phillips study (correlational design, no test of changing wake time on grades). That depends on the Nature article, access 'blocked', snapshot null. The NHS snapshot does not speak to it. The 'lead' row is not ev…
- Ograniczenia#2 (recommendation_derived, unsupported): Praca zmianowa, choroby i opieka nad bliskimi wymagają innego planowania.
  - Searched b59686537010480d.txt for advice on planning sleep differently for shift work, illness or caring for relatives. The NHS lists shift work (line 67) and several conditions (lines 69 to 81) among causes of insomnia, but gives no advic…

The two runs differ; a person decides:
- W praktyce#2 (strength): A recommendation_derived partly; B recommendation_derived unsupported
- Ograniczenia#2 (checking): A source_claim partly; B recommendation_derived unsupported

Adversary: 0 blocker/major, 8 minor; not assessable: numbers

Editor (needs_edits, 9 protected findings):
- Ocena dowodów (calque): "samej stałej pobudki" → "samej stałej pory wstawania"
- Ograniczenia (consistency): "po zmianie pobudki" → "po zmianie pory wstawania"

## 03.3

Verifier A: UNAVAILABLE, 3 open row(s)
- W praktyce#3 (recommendation_derived, partly): Jeśli mimo odpowiedniej możliwości spania nadal występuje znaczna senność, skonsultuj ją zamiast jedynie zwiększać ilość kofeiny.
  - Backed only in part: the NHS insomnia page advises seeing a GP when a sleep problem affects daily life and mentions referral to a sleep clinic for another sleep disorder. Not backed: the specific trigger (significant sleepiness persisting …
- Ograniczenia#2 (source_claim, partly): Liczy się też jakość snu.
  - NHS lists disturbed sleep and feeling tired after waking as insomnia symptoms and lists factors that keep you from a good night's sleep, which fits the claim only by implication. No snapshot states that sleep quality matters in addition to…
- Ograniczenia#3.1 (source_claim, not_checkable): Badanie nie określa dokładnej potrzeby każdej osoby
  - Absence claim, but the snapshot is an abstract (Europe PMC), so absence cannot be shown. The abstract describes fixed doses of 4, 6 or 8 h time in bed assigned by randomization, which is consistent with no individual need estimate. The ful…

Verifier B: UNAVAILABLE, 3 open row(s)
- W praktyce#3 (recommendation_derived, partly): Jeśli mimo odpowiedniej możliwości spania nadal występuje znaczna senność, skonsultuj ją zamiast jedynie zwiększać ilość kofeiny.
  - Only the general idea of seeing a clinician when sleep problems persist and affect daily life is backed (NHS says 'See a GP' for insomnia that habit changes did not fix). Not backed: (1) the trigger as worded, i.e. significant sleepiness d…
- Ograniczenia#2 (source_claim, partly): Liczy się też jakość snu.
  - No snapshot states in general terms that sleep quality matters in addition to duration. The NHS page lists fragmented sleep and feeling tired after waking among insomnia symptoms and lists conditions that keep you from a good night's sleep…
- Ograniczenia#3.1 (source_claim, not_checkable): Badanie nie określa dokładnej potrzeby każdej osoby
  - This is a claim of absence about the study. The Van Dongen snapshot is an abstract only, which cannot show absence; the full text would be needed to confirm that no individual sleep need was estimated. The abstract is consistent with it (f…

Adversary: 1 blocker/major, 10 minor
- MAJOR same-action (W praktyce#3): Jeśli mimo odpowiedniej możliwości spania nadal występuje znaczna senność, skonsultuj ją zamiast jedynie zwiększać iloś…
  - This is a health action that is not in the upstream span and is not tested in the Van Dongen abstract. The NHS snapshot gives a 'see a GP' trigger for insomnia when habit changes did not help, which is a different situation from sleepiness despite enough sleep opportunity. It mentions caffeine only as something to avo…
  - Direction: Either label the sentence as an editorial safety net and tie it to a source passage that states it, or remove it. If kept, name the addressee (a doctor), say it applies to persistent sleepiness, and …

Editor (needs_edits, 10 protected findings):
- title (title): "dowód wyspania" → "dowód wyspania się"
- Koszt (consistency, needs re-verification): "Czas na odpoczynek" → "Czas na sen"
- W praktyce (consistency): "ją zamiast" → "ją, zamiast"
- Korzyść i dowody (calque): "deficyty wykonania zadań" → "deficyty w wykonywaniu zadań"
- Korzyść i dowody (term): "samoopis senności" → "wynik własnej oceny senności"
- Ocena redakcyjna (calque): "poczucia przyzwyczajenia" → "poczucia przyzwyczajenia się do niedosypiania"

## 03.5

Verifier A: FAIL, 7 open row(s)
- title#1 (recommendation_derived, partly): Jeśli obowiązki pozwalają, sprawdzaj pocztę w ustalonych porach
  - Only the general direction is backed: the article title in the snapshot says less frequent email checking reduces stress. The snapshot is metadata only (no abstract), so it says nothing about checking at fixed times or about any schedule; …
- W praktyce#1 (recommendation_derived, partly): Ustal, kiedy odpowiadasz na zwykłe e-maile, i pozostaw osobny sposób kontaktu w pilnej sprawie.
  - Backed only in part: the title in the snapshot supports the idea that checking email less often lowers stress, which is the basis for limiting when ordinary email is answered. Nothing in the snapshot (metadata only) speaks to keeping a sep…
- W praktyce#2 (recommendation_derived, unsupported): Dopasuj rytm do obowiązków, zamiast bezwarunkowo narzucać trzy odczyty dziennie.
  - Searched fc3c2cf54e0262ec.txt for any text on a three-per-day limit, on adapting the schedule, or on work obligations. The snapshot holds only DOI, title, authors, journal and year, so no source line backs this advice and no quote contains…
- Korzyść i dowody#1.2 (source_claim, not_checkable): 124 dorosłych porównywało dwa tygodnie.
  - The snapshot is metadata only (DOI, title, authors, journal, year) with no abstract or methods text. Sample size (124 adults), the age group and the two-week comparison design need the abstract or the full text.
- Korzyść i dowody#2 (source_claim, partly): W tygodniu z ograniczeniem sprawdzania poczty do trzech razy dziennie odczuwany codzienny stres był niższy niż w tygodniu bez limitu.
  - The article title supports only the general finding that less frequent email checking reduces stress. The three-times-a-day limit, the measure of perceived daily stress, the within-person comparison of a limited week with an unlimited week…
- Ocena dowodów#1 (source_description, partly): B — krótkie badanie wewnątrzosobnicze z losowaniem kolejności warunków; wynik dotyczy stresu.
  - The title supports that the outcome concerns stress. The design label (short, within-subject, randomised order of conditions) is not in the metadata-only snapshot and needs the abstract or full text. The grade letter B is editorial and was…
- Ograniczenia#1 (source_claim, not_checkable): Nie zmierzono tu wzrostu produktywności ani efektu identycznej reguły dla komunikatorów.
  - Absence of a measure or of a messenger condition can only be shown from the abstract or full text. The snapshot is metadata only (DOI, title, authors, journal, year), so it cannot show what was or was not measured.

Adversary: 3 blocker/major, 4 minor; not assessable: recency
- MAJOR numbers (Korzyść i dowody#1): W badaniu Kushleva i Dunn 124 dorosłych porównywało dwa tygodnie.
  - The only stored source for this item is a Crossref metadata stub with no abstract and no results. The figures 124 adults, two weeks and three checks per day, and the direction of the result (lower stress), appear only in the upstream span, which is a lead and not evidence. The snapshot does confirm the citation (autho…
  - Direction: Either obtain the abstract or full text and re-quote sample size, duration, limit and outcome from it, or state in Korzyść i dowody, Źródła and Zmiany w adaptacji that only metadata was checked and t…
- MAJOR grade (Ocena dowodów#1): B — krótkie badanie wewnątrzosobnicze z losowaniem kolejności warunków; wynik dotyczy stresu.
  - The grade rationale asserts a design detail, randomised order of conditions, that is in neither the snapshot (metadata only) nor the upstream span. The upstream describes the design only as the same people compared '前后对比（自身对照）' (a before-and-after, self-controlled comparison), which does not state that order was rando…
  - Direction: Remove the randomisation claim unless it is confirmed from the abstract or full text; describe the design only as far as the checked text states it.
- MAJOR same-action (title#1): Jeśli obowiązki pozwalają, sprawdzaj pocztę w ustalonych porach
  - What the source manipulated was a cap on the number of checks (three per day for one week versus no limit), not checking at set times of day. The title and W praktyce advise a schedule ('ustalonych porach', 'Dopasuj rytm do obowiązków') whose benefit was never tested: a reader who picks scheduled slots but checks many…
  - Direction: State in the item that the study tested a cap of three checks per day, that scheduled times or other counts are an editorial extension, and that no benefit of those variants was measured. Name the te…

Editor (needs_edits, 8 protected findings):
- title (calque): "w ustalonych porach" → "o ustalonych porach"
- W praktyce (calque): "odczyty" → "sprawdzenia poczty"
- Ocena dowodów (term): "wewnątrzosobnicze" → "wewnątrzosobnicze (porównanie u tych samych osób)"
- Ograniczenia (calque): "dla komunikatorów" → "w komunikatorach"

## 03.6

Verifier A: UNAVAILABLE, 2 open row(s)
- Korzyść i dowody#2 (source_claim, partly): Po przerwaniach trwających średnio 2,8 sekundy liczba błędów sekwencji była dwukrotnie większa, a po 4,4 sekundy trzykrotnie większa niż w …
  - Both multipliers (doubled at 2.8 s average, tripled at 4.4 s average, relative to baseline trials) match the abstract. The weak part is the measure: the source states a rate of sequence errors on post-interruption trials, the sentence says…
- Ocena dowodów#1 (source_description, partly): B — eksperyment laboratoryjny dotyczący błędów sekwencji.
  - The grade letter B is editorial and was not checked. The words after it describe the source: the abstract supports a participant task with sequence errors compared between baseline and post-interruption trials, but it uses neither the word…

Adversary: 0 blocker/major, 5 minor

Editor (needs_edits, 11 protected findings):
- W praktyce (calque): "zgubić kolejny krok" → "stracić miejsce w sekwencji kroków"

## 03.7

Verifier A: UNAVAILABLE, 3 open row(s)
- title#1 (recommendation_derived, partly): Przy zadaniu wymagającym uwagi ogranicz przełączanie się między czynnościami
  - Backed part: the abstract reports slower and usually more error-prone responses immediately after a task switch (Korzyść i dowody#2). Not backed: the abstract covers experimenter-required switching among a small set of simple tasks, not ta…
- W praktyce#1 (recommendation_derived, partly): Wybierz bieżące zadanie i odłóż niezwiązane z nim wiadomości, jeśli możesz to zrobić bezpiecznie.
  - Backed part: avoiding switches is supported only through the switch cost reported in Korzyść i dowody#2 (slower, usually more error-prone responses right after a switch). Not backed: deferring unrelated messages. The abstract does not ment…
- Ocena dowodów#1.2 (source_claim, not_checkable): bez jednej uniwersalnej wielkości efektu.
  - The snapshot is an abstract only (Access: abstract, 999 characters). It states no effect-size figure and calls the cost 'substantial', 'usually' present and 'reduced, but not eliminated'. Whether the review gives no single overall effect s…

Adversary: 1 blocker/major, 7 minor
- MAJOR same-action (W praktyce#1): Wybierz bieżące zadanie i odłóż niezwiązane z nim wiadomości
  - The only cited source (Monsell abstract) describes experiments in which subjects were required to switch frequently among a small set of simple tasks and reports the cost right after a switch. It does not test, according to the stored abstract, deferring unrelated messages, interruptions in real work, or any outcome o…
  - Direction: State in Ograniczenia (or Korzyść i dowody) that the reviewed experiments concern required switching among simple tasks, that the source as checked in the abstract does not test deferring messages or…

Editor (needs_edits, 9 protected findings):
- Korzyść i dowody (calque): "odpowiedzi były" → "reakcje były"
- Ograniczenia (calque): "używanie mediów" → "korzystanie z mediów"

