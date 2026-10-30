# Audit digest

| Item | Verifier A | Verifier B | Runs agree | Adversary (blocker/major/minor) | Editor |
|---|---|---|---|---|---|
| 03.1 | UNAVAILABLE | - | - | 0/1/5 | needs_edits, 1 edits |
| 03.2 | UNAVAILABLE | FAIL | no (2) | 0/0/7 | needs_edits, 2 edits |
| 03.3 | UNAVAILABLE | UNAVAILABLE | no (1) | 0/1/8 | needs_edits, 6 edits |
| 03.4 | UNAVAILABLE | UNAVAILABLE | yes | 0/0/7 | needs_edits, 4 edits |
| 03.5 | FAIL | - | - | 0/4/5 | needs_edits, 4 edits |
| 03.6 | UNAVAILABLE | - | - | 0/0/5 | needs_edits, 1 edits |
| 03.7 | UNAVAILABLE | - | - | 0/1/7 | needs_edits, 2 edits |
| 03.8 | UNAVAILABLE | FAIL | no (1) | 0/2/5 | needs_edits, 6 edits |
| 03.18 | UNAVAILABLE | FAIL | no (7) | 0/1/4 | needs_edits, 6 edits |
| 03.23 | UNAVAILABLE | UNAVAILABLE | yes | 0/2/7 | needs_edits, 4 edits |
| 03.26 | UNAVAILABLE | UNAVAILABLE | no (3) | 0/2/7 | needs_edits, 5 edits |
| 03.27 | UNAVAILABLE | UNAVAILABLE | no (1) | 0/1/10 | needs_edits, 2 edits |
| 04.1 | FAIL | - | - | 0/1/4 | needs_edits, 4 edits |
| 04.2 | FAIL | - | - | 0/1/5 | needs_edits, 6 edits |
| 04.3 | UNAVAILABLE | - | - | 0/2/5 | needs_edits, 1 edits |
| 04.4 | PASS | - | - | 0/2/5 | needs_edits, 2 edits |
| 04.5 | FAIL | - | - | 0/2/4 | needs_edits, 4 edits |
| 04.7 | FAIL | - | - | 0/0/3 | needs_edits, 6 edits |
| 04.9 | FAIL | FAIL | no (3) | 0/0/9 | needs_edits, 1 edits |
| 04.12 | UNAVAILABLE | - | - | 0/4/4 | needs_edits, 5 edits |
| 04.17 | FAIL | - | - | 0/3/3 | needs_edits, 2 edits |
| 04.18 | UNAVAILABLE | - | - | 0/2/7 | needs_edits, 2 edits |
| 14.1 | UNAVAILABLE | FAIL | no (2) | 0/1/10 | needs_edits, 6 edits |
| 14.2 | PASS | PASS | no (2) | 0/1/5 | needs_edits, 4 edits |
| 14.3 | FAIL | FAIL | yes | 0/0/7 | needs_edits, 6 edits |
| 14.4 | FAIL | FAIL | no (1) | 0/3/2 | needs_edits, 8 edits |
| 14.6 | UNAVAILABLE | UNAVAILABLE | no (2) | 0/2/10 | needs_edits, 6 edits |
| 14.7 | PASS | PASS | yes | 0/0/7 | needs_edits, 2 edits |
| 14.8 | UNAVAILABLE | UNAVAILABLE | yes | 0/2/9 | needs_edits, 3 edits |
| 14.9 | UNAVAILABLE | UNAVAILABLE | no (2) | 0/1/8 | needs_edits, 1 edits |
| 14.10 | FAIL | FAIL | no (6) | 0/7/8 | needs_edits, 5 edits |
| 14.12 | UNAVAILABLE | PASS | no (1) | 0/2/5 | needs_edits, 4 edits |

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

Adversary: 0 blocker/major, 7 minor; not assessable: numbers

Editor (needs_edits, 9 protected findings):
- Ocena dowodów (calque): "samej stałej pobudki" → "samej stałej pory wstawania"
- Ograniczenia (consistency): "po zmianie pobudki" → "po zmianie pory wstawania"

## 03.3

Verifier A: UNAVAILABLE, 4 open row(s)
- W praktyce#3 (recommendation_derived, partly): Jeśli mimo odpowiedniej możliwości spania nadal występuje znaczna senność, skonsultuj ją zamiast jedynie zwiększać ilość kofeiny.
  - Backed in part: the NHS page tells the reader to see a GP when changing sleeping habits has not helped insomnia (lines 143-145) and mentions a sleep clinic referral for another sleep disorder (line 159). Not backed: the specific situation …
- Ocena dowodów#1 (source_description, partly): B — badania laboratoryjne z randomizacją oraz ogólna informacja NHS o potrzebie snu.
  - The grade letter B is an editorial judgement and was not checked. The description is mostly supported: laboratory experiments and a general NHS passage on sleep need. Randomization is stated in the abstract only for the chronic sleep restr…
- Ograniczenia#2 (source_claim, partly): Liczy się też jakość snu.
  - Neither snapshot states in general that sleep quality counts besides duration. The NHS page lists, as symptoms of insomnia (regular problems sleeping), waking during the night and still feeling tired after waking (lines 19, 25), which fits…
- Ograniczenia#3.1 (source_claim, not_checkable): Badanie nie określa dokładnej potrzeby każdej osoby
  - The Van Dongen snapshot is an abstract only (Access: abstract). It reports group results for fixed doses and no estimate of an individual's exact sleep need, but absence from an abstract cannot show absence from the study; the full text wo…

Verifier B: UNAVAILABLE, 3 open row(s)
- W praktyce#3 (recommendation_derived, partly): Jeśli mimo odpowiedniej możliwości spania nadal występuje znaczna senność, skonsultuj ją zamiast jedynie zwiększać ilość kofeiny.
  - Only the general idea of seeing a clinician when sleep problems persist and affect daily life is backed (NHS says 'See a GP' for insomnia that habit changes did not fix). Not backed: (1) the trigger as worded, i.e. significant sleepiness d…
- Ograniczenia#2 (source_claim, partly): Liczy się też jakość snu.
  - No snapshot states in general terms that sleep quality matters in addition to duration. The NHS page lists fragmented sleep and feeling tired after waking among insomnia symptoms and lists conditions that keep you from a good night's sleep…
- Ograniczenia#3.1 (source_claim, not_checkable): Badanie nie określa dokładnej potrzeby każdej osoby
  - This is a claim of absence about the study. The Van Dongen snapshot is an abstract only, which cannot show absence; the full text would be needed to confirm that no individual sleep need was estimated. The abstract is consistent with it (f…

The two runs differ; a person decides:
- Ocena dowodów#1 (strength): A source_description partly; B source_description supported

Adversary: 1 blocker/major, 8 minor
- MAJOR same-action (W praktyce#3): Jeśli mimo odpowiedniej możliwości spania nadal występuje znaczna senność, skonsultuj ją zamiast jedynie zwiększać iloś…
  - This is an action that is not in the upstream span, which prescribes only sleep duration, and it is not stated in either snapshot. The NHS page gives see-a-GP triggers that are specific to insomnia (habit changes did not help, trouble sleeping for months, insomnia hard to cope with) and mentions caffeine only as a res…
  - Direction: Remove the sentence, or present it as an explicit editorial extension supported by a stored source whose trigger matches (marked sleepiness despite adequate time in bed), name who to consult, define …

Editor (needs_edits, 10 protected findings):
- title (title): "dowód wyspania" → "dowód wyspania się"
- Koszt (consistency, needs re-verification): "Czas na odpoczynek" → "Czas na sen"
- W praktyce (consistency): "ją zamiast" → "ją, zamiast"
- Korzyść i dowody (calque): "deficyty wykonania zadań" → "deficyty w wykonywaniu zadań"
- Korzyść i dowody (term): "samoopis senności" → "wynik własnej oceny senności"
- Ocena redakcyjna (calque): "poczucia przyzwyczajenia" → "poczucia przyzwyczajenia się do niedosypiania"

## 03.4

Verifier A: UNAVAILABLE, 1 open row(s)
- W praktyce#1.2 (recommendation_derived, partly): zwróć uwagę, o której przyjmujesz ostatnią porcję kofeiny i jak śpisz.
  - The premise (caffeine reduced total sleep time; the meta-analysis abstract gives a time before bedtime) is backed by the listed rows. The advice itself, to observe when you take the last caffeine and how you sleep, is not given in either c…

Verifier B: UNAVAILABLE, 1 open row(s)
- W praktyce#1.2 (recommendation_derived, partly): zwróć uwagę, o której przyjmujesz ostatnią porcję kofeiny i jak śpisz.
  - The part about noting the time of the last caffeine serving is backed only indirectly: both sources give an interval counted from bedtime (NHS 6 h, meta-analysis 8.8 h for the stated coffee dose), which presupposes knowing that time. The p…

Adversary: 0 blocker/major, 7 minor

Editor (needs_edits, 9 protected findings):
- title (title): "Zachowaj odstęp między ostatnią kofeiną a snem, liczony od pory snu" → "Zachowaj odstęp między ostatnią porcją kofeiny a porą snu"
- W praktyce (calque): "osobista granica bezpieczeństwa" → "indywidualna granica bezpieczeństwa"
- Ocena dowodów (calque): "osobistą prognozą" → "indywidualną prognozą"
- Ocena redakcyjna (calque): "Przesunięcie napoju" → "Przesunięcie pory ostatniej porcji kofeiny"

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

Adversary: 4 blocker/major, 5 minor; not assessable: recency
- MAJOR numbers (Korzyść i dowody#1): W badaniu Kushleva i Dunn 124 dorosłych porównywało dwa tygodnie.
  - Wielkość próby (124 osoby) i czas trwania (dwa tygodnie) występują tylko w upstream, czyli są tropem, nie dowodem. Jedyne źródło cytowane ma w zapisanej migawce wyłącznie metadane: DOI, tytuł, autorów, czasopismo i rok (packet: access = metadata-only, czyli tylko metadane, bez abstraktu). Metadane nie potwierdzają wyn…
  - Direction: Zapisać abstrakt lub pełny tekst i dopiero z niego potwierdzić próbę i czas trwania, albo ograniczyć pole do tego, co potwierdzają metadane. Dostosować opisy źródła w polach Źródła i Zmiany w adaptac…
- MAJOR numbers (Korzyść i dowody#2): W tygodniu z ograniczeniem sprawdzania poczty do trzech razy dziennie odczuwany codzienny stres był niższy niż w tygodn…
  - Limit „trzech razy dziennie”, zestawienie dwóch tygodni i kierunek wyniku w zdaniu pochodzą z upstream (lead). Migawka potwierdza co najwyżej to, że autorzy tytułem zapowiadają, iż rzadsze sprawdzanie poczty zmniejsza stres. Tytuł nie jest wynikiem i nie mówi nic o limicie trzech sprawdzeń ani o porównaniu z tygodniem…
  - Direction: Po zapisaniu abstraktu lub pełnego tekstu sprawdzić, jaki limit i jakie porównanie faktycznie zastosowano. Do tego czasu nie przedstawiać limitu trzech sprawdzeń jako sprawdzonego w źródle.
- MAJOR grade (Ocena dowodów#1): z losowaniem kolejności warunków
  - Losowanie kolejności warunków nie występuje ani w migawce (są tylko metadane), ani w upstream. Upstream opisuje porównanie „przed i po” tej samej grupy (前后对比, 自身对照) i mówi, że „na początku” nie było limitu, co nie opisuje losowania ani zrównoważenia kolejności. Szczegół projektu, który wzmacnia ocenę B i wyklucza efek…
  - Direction: Usunąć szczegół o losowaniu, dopóki zapisane źródło go nie potwierdza, i opisywać projekt tylko słowami, które da się sprawdzić w abstrakcie lub pełnym tekście. Zaznaczyć przy ocenie, że podstawa lit…
- MAJOR same-action (W praktyce#2): Dopasuj rytm do obowiązków, zamiast bezwarunkowo narzucać trzy odczyty dziennie.
  - Pole Korzyść i dowody opisuje wynik dla jednego sprawdzonego ograniczenia (trzy sprawdzenia dziennie), a ta rada zastępuje je nieokreślonym „rytmem dopasowanym do obowiązków”, bez limitu i bez liczby. Taki rytm (w tym wiele pór dziennie) nie był porównywany: upstream opisuje limit trzech sprawdzeń, a migawka daje tylk…
  - Direction: Nazwać dopasowany rytm jawnie redakcyjnym uogólnieniem poza badaniem, a ocenę B odnieść wyłącznie do ograniczenia do trzech sprawdzeń dziennie. Rozważyć podanie sprawdzonej liczby jako punktu odniesi…

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

## 03.8

Verifier A: UNAVAILABLE, 7 open row(s)
- W praktyce#2 (recommendation_derived, partly): Nie traktuj jednej godziny jako naukowo ustalonej granicy dla wszystkich urządzeń.
  - Backed only in part: the NHS page ties its one-hour figure to winding down (line 107) and gives no hour figure for devices, only 'right before going to bed' (line 123), and the Chang abstract tests reading 'in the hours before bedtime' wit…
- Korzyść i dowody#1.2 (source_description, not_checkable): u 12 zdrowych młodych dorosłych
  - The Chang snapshot is abstract-only. It speaks only of 'Participants' and gives no number of participants, no health status and no age. The full text of the PNAS article would be needed to check 12 healthy young adults.
- Korzyść i dowody#2.1 (source_description, partly): W losowanym badaniu krzyżowym
  - The quote shows that the same participants were compared across the two reading conditions (a within-participant comparison, consistent with a crossover). The abstract does not use the words randomised or crossover and does not say how the…
- Korzyść i dowody#2.2 (source_description, not_checkable): każda sesja trwała około 4 godzin przed snem przez pięć wieczorów.
  - The Chang snapshot is abstract-only. It says only that reading took place 'in the hours before bedtime'. It does not state the length of a session (about 4 hours) or the number of evenings (five). Full text of the PNAS article needed.
- Ocena dowodów#1 (source_description, partly): małe badanie krzyżowe w kontrolowanych warunkach laboratoryjnych.
  - The grade letter B is editorial and was not checked. The quote supports only a within-participant comparison of the two reading conditions (consistent with a crossover). The abstract does not give the sample size (small), the setting (labo…
- Ograniczenia#1 (source_claim, not_checkable): Nie badano każdego telefonu, trybu nocnego ani ekranu z tuszem elektronicznym.
  - Absence cannot be shown from an abstract-only snapshot. The Chang abstract names only 'a light-emitting device (LE-eBook)' and does not list the devices or display modes used. The NHS page (main region only, 4304 of 4844 characters) was al…
- Ograniczenia#2 (source_claim, not_checkable): Duża ekspozycja laboratoryjna nie określa wielkości efektu krótkiego użycia ekranu w domu.
  - The Chang snapshot is abstract-only. It does not state the size of the exposure, the laboratory setting or anything on brief use at home, and it reports no effect size. The NHS page does not discuss exposure duration or setting. Full text …

Verifier B: FAIL, 7 open row(s)
- W praktyce#2 (source_claim, unsupported): Nie traktuj jednej godziny jako naukowo ustalonej granicy dla wszystkich urządzeń.
  - The sentence says that no one-hour (or other) threshold is scientifically established for all devices, i.e. a statement about the state of the evidence across devices. Neither cited snapshot says this. The NHS page (main region, read in fu…
- Korzyść i dowody#1.2 (source_description, not_checkable): u 12 zdrowych młodych dorosłych
  - The snapshot is the Europe PMC abstract only. It gives no sample size and no description of the participants (health status, age). The abstract mentions only a survey of 1,508 American adults, which is background and not the study sample. …
- Korzyść i dowody#2.1 (source_description, partly): W losowanym badaniu krzyżowym
  - The wording 'Participants reading an LE-eBook ... than when reading a printed book' implies that the same participants were compared under both conditions (consistent with a crossover design). The abstract does not use the words crossover …
- Korzyść i dowody#2.2 (source_description, not_checkable): każda sesja trwała około 4 godzin przed snem przez pięć wieczorów
  - The abstract says only that the reading was 'in the hours before bedtime'. It gives no session length (about 4 hours) and no number of evenings. These are methods details the abstract does not carry; the full text (Methods, protocol) would…
- Ocena dowodów#1 (source_description, partly): B — małe badanie krzyżowe w kontrolowanych warunkach laboratoryjnych.
  - The grade letter B is editorial and was not checked. For the description after it: the abstract implies a within-participant comparison of reading an LE-eBook and a printed book (consistent with a crossover). It does not state the design l…
- Ograniczenia#1 (source_claim, not_checkable): Nie badano każdego telefonu, trybu nocnego ani ekranu z tuszem elektronicznym.
  - The Chang snapshot is an abstract only. It names the tested condition as reading on a light-emitting eReader (LE-eBook) and does not mention phones, night mode or e-ink screens, but absence from an abstract does not show they were not stud…
- Ograniczenia#2 (source_claim, not_checkable): Duża ekspozycja laboratoryjna nie określa wielkości efektu krótkiego użycia ekranu w domu.
  - The abstract does not describe the exposure level or the setting and says nothing about effect size for short use at home. Whether the exposure was large and laboratory-based, and what the authors say about generalising, would need the ful…

The two runs differ; a person decides:
- W praktyce#2 (checking): A recommendation_derived partly; B source_claim unsupported

Adversary: 2 blocker/major, 5 minor
- MAJOR numbers (Korzyść i dowody#1): u 12 zdrowych młodych dorosłych
  - The sample size 12 and the population words zdrowych młodych dorosłych appear neither in the stored abstract nor in the upstream span. The abstract names no number of participants and no age or health status. The only upstream statement on size is that the group was small (人数少), with no count. The figure is therefore …
  - Direction: Either support N and the population from a stored full-text or methods passage, or remove the number and the population words and say only that the study was small (as the upstream note states) and t…
- MAJOR limitations (Korzyść i dowody#2): W losowanym badaniu krzyżowym każda sesja trwała około 4 godzin przed snem przez pięć wieczorów.
  - The only stored source for this study is an abstract (Europe PMC). The abstract gives no design details: no randomisation, no 4-hour exposure, no five evenings. The upstream span gives crossover, about 4 hours and 5 nights, which is a lead, not evidence. The word losowanym (randomised) is in neither text. The item sta…
  - Direction: Drop losowanym and the 4-hour and five-evening details unless a stored passage supports them, or state explicitly that they come from the upstream summary and were not confirmed in the abstract that …

Editor (needs_edits, 9 protected findings):
- W praktyce (calque): "czytanie papierowej książki" → "czytanie książki papierowej"
- Korzyść i dowody (calque): "z emitującego światło urządzenia oraz papierowej książki" → "z urządzenia emitującego światło oraz książki papierowej"
- Korzyść i dowody (calque, needs re-verification): "Warunek ekranu" → "Wariant z urządzeniem emitującym światło"
- Ograniczenia (calque): "użycia ekranu" → "korzystania z ekranu"
- Ocena redakcyjna (consistency): "wieczornej rutyny" → "wieczornego nawyku"
- Ocena redakcyjna (calque): "próbą do dopasowania" → "próbą dopasowania"

## 03.18

Verifier A: UNAVAILABLE, 11 open row(s)
- title#1.1 (recommendation_derived, partly): Przy utrzymującym się obniżeniu nastroju szukaj wsparcia
  - The Ministry of Health page says that people in psychological crisis or needing a psychologist, therapist or psychiatrist can get help, so the existence of support is backed. It does not speak of a persistent lowering of mood below crisis …
- title#1.2 (source_claim, source_unavailable): ruch może być częścią pomocy
  - The only cited document that could bear on exercise as part of help is the BMJ network meta-analysis (bmj.com/content/384/bmj-2023-075847). Access was blocked (HTTP 403) and the packet has no snapshot for it. The two gov.pl snapshots do no…
- W praktyce#1 (recommendation_derived, partly): Jeśli nastrój utrudnia codzienne życie, skontaktuj się z profesjonalną pomocą.
  - The Ministry of Health page backs that professional help (psychologist, therapist, psychiatrist, a mental health centre) is available to adults in crisis or needing it. It says nothing about the condition in the sentence (mood that makes d…
- W praktyce#3 (source_claim, source_unavailable): Ruch może uzupełniać leczenie, jeśli jest dla ciebie odpowiedni.
  - A statement of what exercise can do next to treatment is a claim about the world, so it needs a source. The only cited document that could bear on it is the BMJ network meta-analysis (bmj.com/content/384/bmj-2023-075847). Access was blocke…
- W praktyce#5.2 (recommendation_derived, partly): zamiast czekać na rozmowę wspierającą
  - Backed: the source gives 112 as the number to call in a sudden threat to life or health, and lists it separately from the 116 123 support line for crisis. Not backed: the source never says to choose 112 instead of waiting for a supportive …
- Korzyść i dowody#1 (source_description, source_unavailable): Sieciowa metaanaliza Noetela i współautorów objęła 218 badań z randomizacją i 14 170 osób spełniających przyjęte w przeglądzie kryteria dep…
  - The cited BMJ article (bmj.com/content/384/bmj-2023-075847) returned HTTP 403 and has no snapshot. Design, authors, the number of trials, the number of participants and the depression criteria cannot be checked. The gov.pl snapshots do not…
- Korzyść i dowody#2 (source_claim, source_unavailable): Część form ruchu zmniejszała objawy względem aktywnych warunków kontrolnych.
  - The finding belongs to the BMJ network meta-analysis, which was blocked (HTTP 403) and has no snapshot. Which forms of exercise, which comparators and which outcome measure were used cannot be checked. Full text would be needed.
- Korzyść i dowody#3 (source_claim, source_unavailable): Autorzy ocenili pewność wyników jako niską dla marszu lub biegania i bardzo niską dla pozostałych porównań interwencji.
  - The authors' certainty ratings are in the BMJ network meta-analysis, which was blocked (HTTP 403) and has no snapshot. The full text (results and GRADE or CINeMA tables) would be needed.
- Ocena dowodów#1.1 (source_description, source_unavailable): A — ilościowa synteza prób klinicznych
  - The words after the grade letter describe the BMJ review as a quantitative synthesis of clinical trials. The article was blocked (HTTP 403) and has no snapshot, so the design label cannot be checked. The grade letter A itself is editorial …
- Ograniczenia#2 (recommendation_derived, partly): Potrzeby osób z ciężkimi objawami lub zagrożeniem samobójczym wymagają oceny klinicznej.
  - Backed: the Ministry of Health page points people in psychological crisis to a psychologist or psychiatrist and, in a sudden threat to life or health, to a hospital admission room or emergency department with a psychiatric ward. Not backed…
- Ograniczenia#3 (recommendation_derived, partly): Telefon wsparcia nie zastępuje numeru alarmowego.
  - Backed: the source gives 112 as the number for a sudden threat to life or health and presents the 116 123 support line as a separate service for crisis. Not backed: no snapshot says in words that the support line is not a substitute for th…

Verifier B: FAIL, 12 open row(s)
- title#1 (recommendation_derived, partly): Przy utrzymującym się obniżeniu nastroju szukaj wsparcia; ruch może być częścią pomocy
  - Backed in part: the Ministry of Health page tells people in psychological crisis who need a psychologist, therapist or psychiatrist that quick help exists (the 'szukaj wsparcia' part, for crisis, not for persistent low mood in general). No…
- W praktyce#1 (recommendation_derived, partly): Jeśli nastrój utrudnia codzienne życie, skontaktuj się z profesjonalną pomocą.
  - Backed in part: the page says people in psychological crisis who need professional help can get it and where to go. Not backed: the trigger 'jeśli nastrój utrudnia codzienne życie' (impairment of daily life). Neither snapshot states that t…
- W praktyce#2 (source_claim, unsupported): Nie musisz najpierw udowodnić, że potrafisz ćwiczyć.
  - This states that no proof of ability to exercise is required before help. Both readable snapshots describe how to get psychological and psychiatric help; line 51 of f231cd969d441cef.txt says only that a patient at a centrum zdrowia psychic…
- W praktyce#3 (recommendation_derived, unsupported): Ruch może uzupełniać leczenie, jeśli jest dla ciebie odpowiedni.
  - Looked for any statement that exercise or movement can complement treatment, or that help should be combined with physical activity, in both readable snapshots (f231cd969d441cef.txt, 601d0f7b15c908cb.txt): none. The editors' basis would be…
- W praktyce#5 (recommendation_derived, partly): Przy bezpośrednim zagrożeniu życia lub zdrowia dzwoń pod 112, zamiast czekać na rozmowę wspierającą.
  - Backed: the Ministry of Health page gives the same advice, to call 112 in a sudden threat to life or health. Not backed: 'zamiast czekać na rozmowę wspierającą'. Neither snapshot compares 112 with a support conversation or says not to wait…
- Korzyść i dowody#1.1 (source_description, source_unavailable): Sieciowa metaanaliza Noetela i współautorów
  - The cited BMJ article (Noetel et al.) has no readable snapshot: access blocked, HTTP 403, snapshot null. The two gov.pl snapshots do not mention this study, its authors or its design. The full text or at least the abstract is needed.
- Korzyść i dowody#1.2 (source_claim, source_unavailable): objęła 218 badań z randomizacją i 14 170 osób spełniających przyjęte w przeglądzie kryteria depresji
  - The cited BMJ article has no readable snapshot (access blocked, HTTP 403, snapshot null), so the figures 218 and 14 170 and the inclusion criteria cannot be checked. The gov.pl snapshots do not mention them. The abstract or full text is ne…
- Korzyść i dowody#2 (source_claim, source_unavailable): Część form ruchu zmniejszała objawy względem aktywnych warunków kontrolnych.
  - The cited BMJ article has no readable snapshot (access blocked, HTTP 403, snapshot null). The gov.pl snapshots say nothing about exercise. The abstract or full text is needed.
- Korzyść i dowody#3 (source_claim, source_unavailable): Autorzy ocenili pewność wyników jako niską dla marszu lub biegania i bardzo niską dla pozostałych porównań interwencji.
  - The cited BMJ article has no readable snapshot (access blocked, HTTP 403, snapshot null), so the authors' certainty ratings cannot be checked. The gov.pl snapshots do not mention them. The abstract or full text is needed.
- Ocena dowodów#1.1 (source_description, source_unavailable): ilościowa synteza prób klinicznych
  - The design label describes the cited BMJ article (Noetel et al.), which has no readable snapshot (access blocked, HTTP 403, snapshot null). The grade letter A itself is editorial and was not checked.
- Ocena redakcyjna#2.2 (source_claim, unsupported): ani warunkiem leczenia
  - This states that physical activity is not a condition of treatment. Both readable snapshots describe access to psychological and psychiatric help (line 51 of f231cd969d441cef.txt: no referral, appointment or registration needed at a centru…
- Ograniczenia#3 (source_claim, partly): Telefon wsparcia nie zastępuje numeru alarmowego.
  - The Ministry of Health page assigns the 116 123 support line to a crisis situation and the alarm number 112 to a sudden threat to life or health, as separate offers. Neither snapshot says in words that the support line does not replace the…

The two runs differ; a person decides:
- title#1 (checking): A recommendation_derived partly, source_claim source_unavailable; B recommendation_derived partly
- W praktyce#2 (checking): A meta_statement not_applicable; B source_claim unsupported
- W praktyce#3 (checking): A source_claim source_unavailable; B recommendation_derived unsupported
- W praktyce#5 (checking): A source_claim supported, recommendation_derived partly; B recommendation_derived partly
- Ocena redakcyjna#2 (checking): A editorial_estimate not_applicable; B editorial_estimate not_applicable, source_claim unsupported
- Ograniczenia#2 (strength): A recommendation_derived partly; B meta_statement not_applicable
- Ograniczenia#3 (checking): A recommendation_derived partly; B source_claim partly

Adversary: 1 blocker/major, 4 minor; not assessable: numbers, limitations
- MAJOR preservation (Ograniczenia#4): Podany telefon 116 123 dotyczy dorosłych.
  - The upstream action was unconditional (call the hotline when despairing). The adaptation correctly narrows 116 123 to adults, but gives a reader under 18 no alternative path at all besides 112. The stored snapshots contain a ready fallback (the children and youth line) that the item drops. This is the same pattern as …
  - Direction: State a path for a reader under 18 (or say explicitly that the item is written for adults and point to the children and youth service), using only contacts confirmed in the stored official pages.

Editor (needs_edits, 13 protected findings):
- Koszt (calque): "Kontakt z pomocą" → "Zgłoszenie się po pomoc"
- Koszt (term): "dobranie aktywności" → "dobranie aktywności fizycznej"
- Koszt (calque): "do zdrowia oraz możliwości" → "do stanu zdrowia i możliwości"
- W praktyce (calque): "skontaktuj się z profesjonalną pomocą" → "zgłoś się po profesjonalną pomoc"
- Korzyść i dowody (term): "Sieciowa metaanaliza" → "Metaanaliza sieciowa"
- Ocena redakcyjna (consistency): "Aktywność nie jest" → "Aktywność fizyczna nie jest"

## 03.23

Verifier A: UNAVAILABLE, 1 open row(s)
- Ocena dowodów#1.2 (source_claim, not_checkable): nie nad liczbą odzyskanych godzin.
  - This clause says an outcome (recovered hours) was not covered by the synthesis. The snapshot is an abstract only (Access: abstract, about 1700 characters), which cannot show absence. The abstract names anger and aggression as outcomes and …

Verifier B: UNAVAILABLE, 1 open row(s)
- Ocena dowodów#1.2 (source_claim, not_checkable): nie nad liczbą odzyskanych godzin
  - The snapshot holds only the abstract (Access: abstract, 1700 characters). The abstract reports anger and aggression as the outcomes and does not mention hours; absence of any hours-recovered outcome in the study could be shown only with th…

Adversary: 2 blocker/major, 7 minor
- MAJOR same-action (title#1): zamiast agresywnego wyładowania
  - The comparison in the source is calming activities (deep breathing, mindfulness, meditation) versus arousal-increasing activities, whose named examples are hitting a bag, jogging and cycling. The item relabels that class as „agresywne wyładowanie” in the title and „agresywna reakcja” in W praktyce, and never names the…
  - Direction: Name the tested arousal-increasing activities (hitting a bag, jogging, cycling) as the comparator, state that „agresywne” is an editorial shorthand if it is kept, and keep the separate sentence that …
- MAJOR limitations (Ograniczenia#2): Wniosku nie należy odczytywać jako zakazu ruchu lub dowodu jego nieskuteczności w leczeniu depresji.
  - The only snapshot is an abstract on anger management. It contains nothing about exercise as a treatment, about depression or about mood, so this limitation sentence is not supported by any stored source. The upstream basis is a cross-referenced note that running helps „情绪低落” (low mood) over the long term, which is a l…
  - Direction: Limit the sentence to what the anger meta-analysis shows (it does not test exercise for other purposes), or support any statement about exercise and mood or depression with its own cited source; do n…

Editor (needs_edits, 10 protected findings):
- title (title, needs re-verification): "Przy złości wypróbuj uspokojenie pobudzenia zamiast agresywnego wyładowania" → "Przy złości spróbuj się uspokoić, zamiast agresywnie się wyładowywać"
- W praktyce (register): "To propozycja łagodnej próby" → "Potraktuj to jako łagodną próbę"
- W praktyce (calque): "ćwiczenie emocji" → "ćwiczenie uspokajające"
- Ocena redakcyjna (calque): "organizować" → "szukać"

## 03.26

Verifier A: UNAVAILABLE, 5 open row(s)
- Koszt#2.1 (source_claim, partly): Dostępność, forma i koszt zależą od świadczeniodawcy
  - The AASM guideline supports a general version: access, delivery format and cost of CBT-I vary (cost varies by delivery method, finding a skilled provider can be hard in a region). The NHS page shows that the format can be face-to-face or o…
- W praktyce#3 (recommendation_derived, partly): Nie zmieniaj samodzielnie przepisanych leków i nie wprowadzaj ograniczania czasu w łóżku bez ustalenia bezpieczeństwa tej metody.
  - Backed: the second part (do not start time-in-bed restriction without establishing that it is safe): AASM says sleep restriction may be contraindicated in some populations and ties it to explanation and clinician monitoring. Not backed: th…
- Ocena dowodów#1.1 (source_description, partly): zalecenia kliniczne oparte na przeglądach
  - The grade letter B itself is editorial and was not checked. For the words after it: the AASM guideline is a clinical practice guideline based on a systematic review with meta-analyses (supported). The European guideline snapshot is an abst…
- Ocena dowodów#1.2 (source_claim, not_checkable): publikowana wersja nie obiecuje jednej wielkości efektu
  - Absence cannot be shown for every cited source. In the AASM snapshot (main region of the full guideline text) and the NHS snapshot (main region of the page) I found no single effect size, only counts of studies and qualitative 'clinically …
- Ograniczenia#2 (recommendation_derived, partly): Nie trzeba czekać miesiącami z pilnym objawem.
  - Backed: the NHS page lists impact on daily life as a stand-alone reason to see a GP, with no required duration, so months of waiting is not a precondition. Not backed: the 'pilny objaw' (urgent symptom) part. I looked in all three snapshot…

Verifier B: UNAVAILABLE, 4 open row(s)
- Ocena dowodów#1.1 (source_description, partly): zalecenia kliniczne oparte na przeglądach
  - The grade letter B is editorial and was not checked. Supported for the AASM guideline (systematic review plus GRADE). The European guideline snapshot is the PubMed abstract only: it shows the document type (practice guideline) but not the …
- Ocena dowodów#1.2 (source_claim, not_checkable): publikowana wersja nie obiecuje jednej wielkości efektu.
  - Searched the AASM guideline text (main region, 47637 of 49374 characters) for any single pooled effect size or magnitude: it gives only qualitative 'clinically significant' improvements and study counts, and refers effect data to a separat…
- Ograniczenia#2 (recommendation_derived, partly): Nie trzeba czekać miesiącami z pilnym objawem.
  - Backed in part: the NHS lists three alternative reasons to see a GP, and the one about coping with daily life has no duration, so the months criterion is not a prerequisite. Not backed: the 'urgent symptom' part. No snapshot mentions urgen…
- Ograniczenia#3.1 (source_claim, partly): Farmakoterapia może być uzasadniona po ocenie korzyści i ryzyka
  - Drugs as an option when CBT-I is not enough is supported. The explicit weighing of advantages and disadvantages is stated only for longer-term treatment (more than 4 weeks); for short-term use the abstract only says the drugs can be used. …

The two runs differ; a person decides:
- Koszt#2 (checking): A source_claim partly, meta_statement not_applicable; B editorial_estimate not_applicable, meta_statement not_applicable
- W praktyce#3 (strength): A recommendation_derived partly; B meta_statement not_applicable, recommendation_derived not_applicable
- Ograniczenia#3 (strength): A source_claim supported, meta_statement not_applicable; B source_claim partly, meta_statement not_applicable

Adversary: 2 blocker/major, 7 minor
- MAJOR preservation (W praktyce#3): nie wprowadzaj ograniczania czasu w łóżku bez ustalenia bezpieczeństwa tej metody
  - The only safety condition is a generic phrase. It does not say who establishes safety, names none of the populations for whom the sources flag sleep restriction (drivers and machinery operators, people predisposed to mania or hypomania, poorly controlled seizures, excessive daytime sleepiness), and does not tell the r…
  - Direction: Add a sourced caution that names the groups and states that CBT-I commonly includes time-in-bed restriction with early daytime sleepiness, and make clear that a clinician decides and monitors. Keep t…
- MAJOR preservation (Koszt#2): Dostępność, forma i koszt zależą od świadczeniodawcy; nie obiecujemy polskiej refundacji.
  - The item admits that availability varies but gives a reader who cannot get CBT-I (or for whom it is not suitable) no non-drug path. The upstream gave a self-start action (stimulus control rules, line 3) and a sleep diary; both were dropped. The AASM text says the other behavioural therapies should still be considered …
  - Direction: State what a reader can do or ask for when CBT-I is not available or not suitable (for example the other AASM-supported behavioural options, discussed with a clinician), with the safety caveat, or sa…

Editor (needs_edits, 12 protected findings):
- W praktyce (calque, needs re-verification): "prowadzoną osobiście" → "prowadzoną podczas spotkań z terapeutą"
- W praktyce (calque): "wprowadzaj ograniczania" → "zaczynaj ograniczać"
- Ograniczenia (calque): "oceny klinicznej i przyczyn problemu" → "oceny klinicznej i oceny przyczyn problemu"
- Ograniczenia (term): "Farmakoterapia" → "Farmakoterapia, czyli leczenie lekami,"
- Ograniczenia (calque): "instrukcją odstawiania" → "instrukcją odstawiania leków"

## 03.27

Verifier A: UNAVAILABLE, 4 open row(s)
- W praktyce#1 (recommendation_derived, partly): Zgłoś zauważone przerwy w oddychaniu, nasilone chrapanie lub nadmierną senność.
  - Backed part: NG202 1.1.1 names snoring, witnessed apnoeas and unexplained excessive sleepiness as features that should lead to a sleep history and assessment for OSAHS. Not backed: advice to report any one of the three signs on its own. Th…
- W praktyce#2 (recommendation_derived, partly): Jeśli czujesz senność podczas prowadzenia, nie kontynuuj jazdy; wybierz bezpieczne zatrzymanie i inny sposób podróży.
  - Backed part: do not drive when sleepy (NHS insomnia page, a self-care 'Don't' item). Not backed: the instruction to choose a safe stop and another way of travelling; no snapshot says this. NICE NG202 only lists the impact of sleepiness on …
- W praktyce#3 (recommendation_derived, partly): Nie próbuj samodzielnie dobierać aparatu CPAP ani jego ustawień.
  - Backed part: CPAP is recommended after a sleep study has diagnosed moderate or severe OSAHS, and the guideline describes service-led provision, follow-up and adherence support. Not backed: the explicit instruction not to choose the device …
- Ograniczenia#2 (source_claim, partly): Rodzaj badania i leczenia dobiera osoba prowadząca.
  - Backed part: the guideline directs the choice of test and treatment by criteria (access, tolerance, severity). Not backed or narrower: no snapshot says that the treating clinician alone chooses; NG202 frames the choice as a decision in whi…

Verifier B: UNAVAILABLE, 4 open row(s)
- W praktyce#1 (recommendation_derived, partly): Zgłoś zauważone przerwy w oddychaniu, nasilone chrapanie lub nadmierną senność.
  - Backed: witnessed apnoeas, snoring and unexplained excessive sleepiness are all among the features for which NICE 1.1.1 says to take a sleep history and assess for OSAHS. Not backed: NICE sets the trigger at 2 or more of the listed feature…
- W praktyce#2 (recommendation_derived, partly): Jeśli czujesz senność podczas prowadzenia, nie kontynuuj jazdy; wybierz bezpieczne zatrzymanie i inny sposób podróży.
  - Backed: the NHS insomnia page, in its self-help Don't list, says not to drive when sleepy. Not backed: choosing a safe place to stop and using another way of travelling; no snapshot says either. The NICE chapter 4 snapshot only lists 'the …
- W praktyce#3 (recommendation_derived, partly): Nie próbuj samodzielnie dobierać aparatu CPAP ani jego ustawień.
  - Backed only indirectly: the guideline describes CPAP as treatment offered and followed up through a sleep service with specialist staff and equipment support. Not backed: any instruction or statement that people should not choose a CPAP de…
- Ograniczenia#2 (source_claim, partly): Rodzaj badania i leczenia dobiera osoba prowadząca.
  - The source supports that the choice of test and treatment depends on clinical circumstances and severity, with recommendations addressed to professionals. It does not say the treating clinician alone chooses; it says people have the right …

The two runs differ; a person decides:
- Ograniczenia#1 (checking): A recommendation_derived not_applicable; B source_claim supported

Adversary: 1 blocker/major, 10 minor
- MAJOR scope-words (Korzyść i dowody#2): Przy rozpoznanym umiarkowanym lub ciężkim bezdechu zalecają CPAP
  - The sentence states the CPAP recommendation with no population and no symptom condition. The guideline is titled for over 16s, and the CPAP statement in the snapshot is for adults with moderate or severe symptomatic OSAHS. A reader (or a parent of a child) cannot tell from the item that the recommendation is limited t…
  - Direction: State the population of the guideline (adults, over 16) and the 'symptomatic' qualifier as the source words it, or say explicitly that the item covers adults only.

Editor (needs_edits, 9 protected findings):
- W praktyce (calque): "podczas prowadzenia" → "za kierownicą"
- W praktyce (calque): "wybierz bezpieczne zatrzymanie i inny sposób podróży" → "zatrzymaj się w bezpiecznym miejscu i wybierz inny sposób podróży"

## 04.1

Verifier A: FAIL, 10 open row(s)
- title#1 (recommendation_derived, unsupported): Zapisz, kiedy i w jakiej sytuacji zaczniesz działać
  - Advice that rests on the finding of the one cited source (10.1016/s0065-2601(06)38002-1). That source has access blocked and snapshot null, so no snapshot line exists that could back it; no source_claim row has a quote to depend on. Looked…
- W praktyce#1 (recommendation_derived, unsupported): Zamiast „zajmę się tekstem” napisz: „Gdy we wtorek usiądę po śniadaniu przy biurku, otworzę plik i napiszę pierwszy akapit”.
  - A worked example of the if-then plan advice. It rests on the finding that if-then plans help goal attainment, but the only cited source is blocked (snapshot null), so no quote backs it and nothing can be listed in depends_on. Looked for: a…
- W praktyce#2 (recommendation_derived, unsupported): Wybierz cel, który rzeczywiście chcesz zrealizować.
  - Advice that depends on what the source says about the goal the plan is attached to (for example a condition such as the person's own commitment to the goal). The only cited source is blocked (snapshot null), so no quote backs it and nothin…
- Korzyść i dowody#1 (source_description, source_unavailable): Gollwitzer i Sheeran przeanalizowali wyniki 94 niezależnych testów planów „jeśli–to”.
  - The only cited source 10.1016/s0065-2601(06)38002-1 has access blocked ('blocked by api.crossref.org') and no snapshot. The authors, the document kind (analysis of pooled results) and the count of 94 independent tests cannot be checked aga…
- Korzyść i dowody#2 (source_claim, source_unavailable): Średni efekt dla realizacji celów wyniósł d = 0,65.
  - The only cited source 10.1016/s0065-2601(06)38002-1 has access blocked and no snapshot. The mean effect size d = 0,65 and its outcome (goal attainment) cannot be checked against any text.
- Ocena dowodów#1.1 (source_description, source_unavailable): A — ilościowa synteza wielu badań
  - The grade letter A is editorial and was not checked. The description of the source as a quantitative synthesis of many studies cannot be checked: the only cited source 10.1016/s0065-2601(06)38002-1 has access blocked and no snapshot.
- Ocena dowodów#1.2 (source_claim, source_unavailable): wynik dotyczy realizacji celów
  - The only cited source has access blocked and no snapshot, so the outcome the result concerns (goal attainment) cannot be checked.
- Ocena dowodów#1.3 (source_claim, source_unavailable): nie oszczędności czasu w Polsce
  - A clause that says something was not measured (time savings, Polish setting). absent_in_source would need a snapshot with the whole text; the only cited source has access blocked and no snapshot, so absence cannot be shown or searched for.
- Ograniczenia#1 (source_claim, source_unavailable): Wynik jest średnią z różnych zadań i grup.
  - The only cited source 10.1016/s0065-2601(06)38002-1 has access blocked and no snapshot, so it cannot be checked that the result is an average over different tasks and groups.
- Ograniczenia#2 (source_claim, source_unavailable): Plan nie zapewnia sukcesu i nie zastępuje umiejętności ani zasobów potrzebnych do działania.
  - A statement about what the plan does and does not achieve (no guaranteed success, no replacement for skills or resources). Treated as a claim about the world, not as an editor's caveat. The only cited source has access blocked and no snaps…

Adversary: 1 blocker/major, 4 minor; not assessable: same-action, grade, recency, limitations
- MAJOR scope-words (Ograniczenia#1): Wynik jest średnią z różnych zadań i grup.
  - The upstream span limits generality: the studies mostly recruited students, mostly measured health habits, and transfer to work settings is not guaranteed. The item replaces this with a neutral 'different tasks and groups', which hides that the evidence base is narrow. The item's own lead example in W praktyce#1 ('zaj…
  - Direction: Keep the students, health-habits and work-transfer caveat in Ograniczenia (or state a source-backed reason for dropping it), and either mark the writing example as an editorial example of a work task…

Editor (needs_edits, 5 protected findings):
- title (title): "zaczniesz działać" → "zabierzesz się do zadania"
- Koszt (term): "To szacunek redakcji." → "To oszacowanie redakcji."
- W praktyce (calque): "usiądę po śniadaniu przy biurku" → "po śniadaniu usiądę przy biurku"
- Korzyść i dowody (term): "planów „jeśli–to”." → "planów „jeśli–to”, takich jak plan z przykładu powyżej."

## 04.2

Verifier A: FAIL, 10 open row(s)
- title#1 (recommendation_derived, unsupported): Ustal przed rozpoczęciem projektu, kiedy zmienisz plan lub go zakończysz
  - Looked for source lines that give this advice (fix a change or stop criterion before a project starts) or state the fact it rests on. The only cited source (DOI 10.1016/s0065-2601(06)38002-1) has no readable snapshot (blocked by api.crossr…
- W praktyce#1 (recommendation_derived, unsupported): Zapisz warunek przeglądu: „Jeśli w uzgodnionym terminie nie mam działającego prototypu, sprawdzę przyczynę i zdecyduję, czy zmienić zakres,…
  - Looked for source lines that give the same advice (write down a review condition with a deadline and a deliverable) or state the fact it rests on. The only cited source (DOI 10.1016/s0065-2601(06)38002-1) has no readable snapshot (blocked …
- W praktyce#2 (recommendation_derived, unsupported): Uwzględnij też koszt bezpiecznego zakończenia.
  - Looked for source lines that give this advice (count the cost of a safe wind-down) or state the fact it rests on. The only cited source (DOI 10.1016/s0065-2601(06)38002-1) has no readable snapshot (blocked by api.crossref.org, snapshot nul…
- Korzyść i dowody#1.1 (source_description, source_unavailable): Przegląd Gollwitzera i Sheerana
  - The item describes the source as a review by Gollwitzer and Sheeran. The only cited source (DOI 10.1016/s0065-2601(06)38002-1) has no readable snapshot (blocked by api.crossref.org, snapshot null), so the document type, authors and design …
- Korzyść i dowody#1.2 (source_claim, source_unavailable): opisuje, że plany „jeśli–to” pomagały także wycofywać się z nieskutecznych działań.
  - The finding is attributed to the cited review. That source (DOI 10.1016/s0065-2601(06)38002-1) has no readable snapshot (blocked by api.crossref.org, snapshot null), so the claim cannot be checked for or against it. Not answered from memor…
- Korzyść i dowody#2 (source_claim, source_unavailable): Nie podaje w abstrakcie osobnej wielkości efektu ani liczby godzin zaoszczędzonych dzięki warunkowi zakończenia projektu.
  - An absence claim about the abstract of the cited source. The source (DOI 10.1016/s0065-2601(06)38002-1) has no readable snapshot (blocked by api.crossref.org, snapshot null), so neither the abstract nor the text could be searched. Absence …
- Ocena dowodów#1.1 (source_description, source_unavailable): B — kierunek wniosku potwierdza przegląd,
  - The grade letter B is editorial and was not checked. The words after it describe the source as a review that confirms the direction of the conclusion. The only cited source (DOI 10.1016/s0065-2601(06)38002-1) has no readable snapshot (bloc…
- Ocena dowodów#1.2 (source_claim, source_unavailable): ale dla tej konkretnej rady brak osobnego wyniku ilościowego.
  - A not-measured clause about the cited source. The source (DOI 10.1016/s0065-2601(06)38002-1) has no readable snapshot (blocked by api.crossref.org, snapshot null), so nothing could be searched and absence cannot be shown.
- Ograniczenia#1 (source_claim, source_unavailable): Nie każdy słaby wynik oznacza, że projekt nie ma przyszłości.
  - A statement about what a weak result means, not about the item itself. The only cited source (DOI 10.1016/s0065-2601(06)38002-1) has no readable snapshot (blocked by api.crossref.org, snapshot null), so nothing could be checked for or agai…
- Ograniczenia#2 (source_claim, source_unavailable): Badania nie uzasadniają automatycznego przerywania pracy po dowolnym opóźnieniu.
  - A statement about what the research does and does not justify. The only cited source (DOI 10.1016/s0065-2601(06)38002-1) has no readable snapshot (blocked by api.crossref.org, snapshot null), so neither the studies' conclusions nor their a…

Adversary: 1 blocker/major, 5 minor; not assessable: recency, limitations
- MAJOR preservation (Ograniczenia#3): Przy decyzji uwzględnij [przyszłe koszty i korzyści z porady 04.3](#porada-4-3).
  - The upstream rule is exclusive: judge ONLY on future input and future return. The item softens it to 'uwzględnij' (take into account), which does not tell the reader to ignore costs already sunk, and the sunk-cost reason for the whole advice appears nowhere in the item. With the cross-reference link removed, the reade…
  - Direction: State inside the item itself that the review decision rests only on future costs and future benefits, and name the sunk-cost trap, after checking that against the cross-referenced advice and a source…

Editor (needs_edits, 6 protected findings):
- title (title): "lub go zakończysz" → "lub zakończysz projekt"
- Koszt (term): "To szacunek redakcji." → "To oszacowanie redakcji."
- W praktyce (consistency): "w uzgodnionym terminie" → "w ustalonym terminie"
- Ocena dowodów (calque, needs re-verification): "kierunek wniosku potwierdza przegląd" → "przegląd potwierdza kierunek wniosku"
- Ocena dowodów (consistency): "dla tej konkretnej rady" → "dla tej konkretnej porady"
- Ograniczenia (consistency): "przerywania pracy" → "przerywania pracy nad projektem"

## 04.3

Verifier A: UNAVAILABLE, 4 open row(s)
- W praktyce#2 (recommendation_derived, partly): Oddziel nieodwracalny wydatek od tego, co nadal możesz odzyskać lub wykorzystać.
  - The first half (set aside the irreversible outlay) rests on the sunk-cost effect confirmed in the Roth et al. abstract. The second half (identify what can still be recovered or used) rests on a premise that no snapshot states: neither snap…
- Korzyść i dowody#1 (source_claim, partly): Arkes i Blumer opisują skłonność do kontynuowania działania po wcześniejszym nakładzie pieniędzy, wysiłku lub czasu.
  - The snapshot is metadata only (Access: metadata-only, no abstract). It supports that Arkes and Blumer wrote a paper titled 'The psychology of sunk cost'. It says nothing about the content: not the tendency to continue after an earlier outl…
- Ocena dowodów#1.1 (source_description, partly): B — badanie pierwotne i przegląd potwierdzają błąd decyzyjny
  - The grade letter B is editorial and was not checked. The review part is supported: a meta-analytic review that finds clear evidence the sunk-cost effect emerges, and the abstract speaks of people falling prey to it. The 'badanie pierwotne'…
- Ocena dowodów#1.2 (source_claim, not_checkable): ale nie mierzą korzyści z tej konkretnej instrukcji
  - Searched both snapshots for any outcome of an instruction to compare future costs and benefits, or any measured benefit of such a prompt: nothing is mentioned. Absence cannot be shown, because one snapshot is metadata only and the other is…

Adversary: 2 blocker/major, 5 minor
- MAJOR limitations (Ocena dowodów#1): badanie pierwotne i przegląd potwierdzają błąd decyzyjny
  - The stored snapshot of Arkes and Blumer (a28d057130b8ad3c.txt) holds only DOI, title, authors, journal and year; the packet marks it access metadata-only, 'tylko metadane, bez abstraktu'. Metadata cannot confirm any result of the primary study (AGENTS.md: 'Metadane i streszczenie innej osoby nie potwierdzają wyniku').…
  - Direction: Say in Ograniczenia (or Weryfikacja, which this packet does not show) that Arkes and Blumer was verified only as metadata; correct the link label that claims an abstract; ground the grade and the con…
- MAJOR scope-words (Korzyść i dowody#1): po wcześniejszym nakładzie pieniędzy, wysiłku lub czasu
  - The scope 'pieniędzy, wysiłku lub czasu' is attributed to Arkes and Blumer, but their stored snapshot contains no text about what they studied. The wording appears only in the upstream benefit line, which is a lead, not evidence. The only upstream description of their experiment concerns ticket prices (money). The one…
  - Direction: Limit the sentence to what the stored sources show (monetary sunk costs per the Roth abstract), or mark effort and time as the editorial extension of the concept until a source that was actually read…

Editor (needs_edits, 7 protected findings):
- W praktyce (calque): "Zapytaj:" → "Zapytaj siebie:"

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

## 04.5

Verifier A: FAIL, 9 open row(s)
- title#1 (recommendation_derived, unsupported): Przygotuj plan spotkania i korzystaj z niego
  - The only cited snapshot (088a9773da2a17de.txt) holds Crossref metadata only (DOI, title, authors, journal, year; no abstract). No line speaks about agendas or about using a plan, so no source fact for this advice is quoted and nothing back…
- W praktyce#1 (recommendation_derived, unsupported): Przygotuj plan i użyj go podczas spotkania.
  - Metadata-only snapshot: no line states anything about preparing or using an agenda during a meeting. Looked for: agenda, plan, use of a plan in the meeting. Nothing is quoted, so nothing backs the advice.
- W praktyce#2 (recommendation_derived, unsupported): Przykład redakcyjny: zapisz tematy do omówienia i oczekiwany wynik.
  - Labelled by the item itself as an editorial example. The metadata-only snapshot says nothing about agenda contents (topics, expected outcome). Looked for: agenda content or format. Nothing backs this specific way of writing a plan.
- W praktyce#3 (source_claim, not_checkable): Tego konkretnego sposobu pisania planu nie sprawdzono w cytowanym badaniu.
  - This is a claim of absence from the source. The snapshot is metadata only (no abstract, no body), so absence cannot be shown or refuted. Needed: the full text of Leach, Rogelberg, Warr, Burnfield (2009) to see whether agenda content (topic…
- Korzyść i dowody#1.2 (source_claim, not_checkable): w dwóch badaniach, obejmujących 958 i 292 osoby
  - Number of studies and the sample sizes 958 and 292 occur in no line of the snapshot, which holds metadata only (no abstract). Needed: the abstract or full text of the article. No quote was written because none exists in the snapshot.
- Korzyść i dowody#2 (source_claim, not_checkable): Korzystanie z porządku obrad wiązało się z lepszą oceną skuteczności spotkania przez uczestników.
  - The snapshot has title, authors, journal and year only. No line mentions agenda use or its association with perceived effectiveness. Needed: the abstract or full text (results on agenda use and perceived meeting effectiveness).
- Ocena dowodów#1 (source_description, partly): B — dwa badania obserwacyjne dotyczące subiektywnej oceny spotkań.
  - The title supports only the topic (perceived, that is subjective, meeting effectiveness). That there are two studies and that they are observational is not stated in the metadata-only snapshot; the full text is needed. The grade letter B i…
- Ograniczenia#1 (source_claim, not_checkable): Związek w ankiecie nie dowodzi, że sam plan spowodował poprawę.
  - Depends on the study design (survey, correlational) and on what the association was. The snapshot is metadata only and states neither. Needed: abstract or full text describing the design.
- Ograniczenia#2 (source_claim, not_checkable): Nie zmierzono tu liczby zaoszczędzonych godzin ani obiektywnej jakości decyzji.
  - Claim of absence (read as: not measured in the cited study). A metadata-only snapshot cannot show absence. Needed: the full text of the article to check the measures used. The word 'tu' is ambiguous (study or item); read here as the study.

Adversary: 2 blocker/major, 4 minor; not assessable: scope-words
- MAJOR numbers (Korzyść i dowody#1): w dwóch badaniach, obejmujących 958 i 292 osoby
  - The number of studies and both sample sizes are presented as content of the cited Leach et al. paper, but they occur only in the upstream span (a lead, not evidence). The single cited snapshot is metadata-only: it holds DOI, title, authors, journal and year, with no abstract, no methods and no results, so none of the …
  - Direction: Confirm the figures against the abstract or full text of the paper, or state openly that only bibliographic metadata were checked and that the sample sizes come from the upstream adaptation and are u…
- MAJOR same-action (Korzyść i dowody#2): Korzystanie z porządku obrad wiązało się z lepszą oceną skuteczności spotkania przez uczestników.
  - The only stored description of the result concerns meetings for which an agenda was sent before the meeting. The item restates the exposure as using the agenda and says in its adaptation note that the verified link concerns using the plan, while the requirement of sending it in advance was removed. The stored snapshot…
  - Direction: Establish from the abstract or full text what the paper actually measured. Then either word the association with the measured exposure, or mark the changed wording as an editorial reading that the so…

Editor (needs_edits, 7 protected findings):
- W praktyce (consistency): "użyj go podczas spotkania" → "korzystaj z niego podczas spotkania"
- Korzyść i dowody (consistency, needs re-verification): "Korzystanie z porządku obrad" → "Korzystanie z planu spotkania"
- Ocena redakcyjna (calque): "nakładem" → "nakładem pracy"
- Ocena redakcyjna (register): "waszemu zespołowi" → "twojemu zespołowi"

## 04.7

Verifier A: FAIL, 12 open row(s)
- title#1 (recommendation_derived, unsupported): Rozpisz złożone zadanie na części, zanim oszacujesz czas
  - The advice rests on the Kruger and Evans findings, but the only cited source (10.1016/j.jesp.2003.11.001) has access blocked and no snapshot. No snapshot line exists that gives this advice or states the fact it rests on, so nothing backs i…
- W praktyce#1 (recommendation_derived, unsupported): Przy pisaniu raportu uwzględnij zebranie danych, analizę, tekst i sprawdzenie.
  - This is advice resting on the finding that unpacking a task changes time estimates. The only cited source (10.1016/j.jesp.2003.11.001) has access blocked and no snapshot, so no snapshot line gives this advice or states the fact it rests on…
- W praktyce#2 (recommendation_derived, unsupported): Oszacuj części, zamiast podawać jedną liczbę bez wcześniejszego sprawdzenia zakresu zadania.
  - This is advice resting on the finding that estimating parts changes the estimate. The only cited source (10.1016/j.jesp.2003.11.001) has access blocked and no snapshot, so no snapshot line gives this advice or states the fact it rests on. …
- Korzyść i dowody#1 (source_description, source_unavailable): Kruger i Evans prosili uczestników o szacowanie czasu różnych zadań.
  - The only cited source (10.1016/j.jesp.2003.11.001) has access blocked by api.crossref.org and no snapshot (snapshot is null, 0 characters). Authors and design cannot be checked; nothing was answered from memory.
- Korzyść i dowody#2 (source_claim, source_unavailable): Rozpisanie części prowadziło do dłuższych oszacowań, a w eksperymentach 3 i 4 także do mniejszego zaniżania czasu.
  - The only cited source (10.1016/j.jesp.2003.11.001) has access blocked and no snapshot. Neither the longer estimates nor the smaller underestimation in experiments 3 and 4 can be checked; nothing was answered from memory.
- Korzyść i dowody#3 (source_claim, source_unavailable): W eksperymencie 5 znaczenie rozpisania rosło wraz ze złożonością zadania.
  - The only cited source (10.1016/j.jesp.2003.11.001) has access blocked and no snapshot. The experiment 5 result on task complexity cannot be checked; nothing was answered from memory.
- Ocena dowodów#1.1 (source_description, source_unavailable): B — seria eksperymentów w jednej publikacji; zweryfikowano kierunek wyniku
  - The grade letter B is editorial and was not checked. The description of the source as a series of experiments in one publication, and the statement that the direction of the result was verified, cannot be checked because the only cited sou…
- Ocena dowodów#1.2 (source_claim, source_unavailable): bez wielkości efektu
  - The clause says that no effect size was reported or taken. Absence can only be shown from a snapshot holding the text, and the only cited source (10.1016/j.jesp.2003.11.001) has access blocked and no snapshot, so the verdict cannot be abse…
- Ocena redakcyjna#1 (recommendation_derived, unsupported): Rozpisuj zadania złożone.
  - This is advice resting on the finding that unpacking a task changes time estimates, and on the finding about task complexity in experiment 5. The only cited source (10.1016/j.jesp.2003.11.001) has access blocked and no snapshot, so no snap…
- Ograniczenia#1 (source_claim, source_unavailable): Dłuższe oszacowanie nie zawsze jest trafniejsze.
  - A statement about the world taken as a limitation of the source. The only cited source (10.1016/j.jesp.2003.11.001) has access blocked and no snapshot, so it cannot be checked.
- Ograniczenia#2 (source_claim, source_unavailable): Mniejsze zaniżanie czasu abstrakt podaje tylko dla eksperymentów 3 i 4.
  - The claim is about what the abstract states. The only cited source (10.1016/j.jesp.2003.11.001) has access blocked and no snapshot, so the abstract was not read and the claim cannot be checked.
- Ograniczenia#3 (source_claim, source_unavailable): Ta publikacja nie potwierdza, że rozpisanie zadania samo w sobie zmniejsza prokrastynację.
  - The claim is about what the publication does and does not confirm. The only cited source (10.1016/j.jesp.2003.11.001) has access blocked and no snapshot, so it cannot be checked.

Adversary: 0 blocker/major, 3 minor; not assessable: same-action, numbers, scope-words, recency, limitations

Editor (needs_edits, 8 protected findings):
- Koszt (consistency): "listy etapów" → "listy części zadania"
- W praktyce (register): "Przy pisaniu raportu uwzględnij zebranie danych, analizę, tekst i sprawdzenie." → "Przy szacowaniu czasu na raport wyodrębnij części: zebranie danych, analizę, napisanie tekstu i sprawdzenie."
- W praktyce (calque): "Oszacuj części, zamiast" → "Oszacuj osobno czas tych części, zamiast"
- Korzyść i dowody (calque): "o szacowanie czasu różnych zadań" → "o oszacowanie czasu potrzebnego na różne zadania"
- Korzyść i dowody (calque): "Rozpisanie części" → "Rozpisanie zadania na części"
- Ograniczenia (term): "prokrastynację" → "prokrastynację (odkładanie spraw na później)"

## 04.9

Verifier A: FAIL, 6 open row(s)
- title#1 (recommendation_derived, partly): Sprawdź, co utrudnia rozpoczęcie zadania, zamiast poprzestawać na samokrytyce
  - Backed: the abstract names task aversiveness, task delay, self-efficacy and impulsiveness as strong predictors of procrastination, which supports looking for what hinders starting a task. Not backed: the part 'zamiast poprzestawać na samok…
- W praktyce#1 (recommendation_derived, partly): Zapytaj, czy zadanie jest niejasne, nieprzyjemne albo wydaje się niewykonalne.
  - Backed in part: 'nieprzyjemne' rests on task aversiveness and 'wydaje się niewykonalne' loosely on self-efficacy, both named as strong predictors in the abstract. Not backed: 'niejasne' (task unclarity is not mentioned in either snapshot) …
- W praktyce#2 (recommendation_derived, unsupported): Wybierz mały pierwszy krok.
  - Looked for any mention of a small first step, breaking a task down, subgoals, starting rules or any intervention in both snapshots (the abstract and the PubMed page, which carries the same abstract). Neither says anything about it; the abs…
- Korzyść i dowody#2 (source_claim, partly): Z odkładaniem zadań wiązały się między innymi niechęć do zadania, odległość nagrody lub zakończenia w czasie, poczucie własnej skuteczności…
  - Task aversiveness (niechęć do zadania), self-efficacy (poczucie własnej skuteczności) and impulsiveness (impulsywność) are stated in the abstract. The abstract names only 'task delay' and does not say what it means; the gloss 'odległość na…
- Ocena redakcyjna#2 (source_claim, not_checkable): Sama zmiana sposobu myślenia nie ma tutaj zmierzonego efektu.
  - This says that no effect of changing one's way of thinking was measured in the evidence cited. Both snapshots hold only the abstract (the PubMed page is the abstract record, not the paper), and an abstract cannot show absence; it does not …
- Ograniczenia#1 (source_claim, partly): Z tego przeglądu nie wynika, że każda prokrastynacja jest unikaniem przykrych emocji ani że wynika z braku wysiłku.
  - Supported in part: the abstract reports several different strong predictors and none of them is named as avoidance of unpleasant emotions or as lack of effort, so a single-cause reading does not follow from it. Not checkable from an abstra…

Verifier B: FAIL, 8 open row(s)
- title#1 (recommendation_derived, partly): Sprawdź, co utrudnia rozpoczęcie zadania, zamiast poprzestawać na samokrytyce
  - Backed only in part: the abstract lists factors that go with procrastination (task aversiveness, task delay, self-efficacy, impulsiveness), which are the kind of obstacles the advice tells the reader to look for. Not backed: the contrast '…
- W praktyce#1 (recommendation_derived, partly): Zapytaj, czy zadanie jest niejasne, nieprzyjemne albo wydaje się niewykonalne.
  - Backed only in part: 'nieprzyjemne' matches the predictor 'task aversiveness' and 'niewykonalne' is near 'self-efficacy' (the match is loose, a belief about one's own ability is not the same as a task seeming infeasible). Not backed: 'niej…
- W praktyce#2 (recommendation_derived, unsupported): Wybierz mały pierwszy krok.
  - Searched both snapshots (the Europe PMC abstract and the PubMed page, which carries only the abstract) for any mention of a small or first step, breaking a task into parts, starting small, or a planning intervention. Neither text says anyt…
- Korzyść i dowody#2 (source_claim, partly): Z odkładaniem zadań wiązały się między innymi niechęć do zadania, odległość nagrody lub zakończenia w czasie, poczucie własnej skuteczności…
  - Task aversiveness (niechęć do zadania), self-efficacy (poczucie własnej skuteczności) and impulsiveness (impulsywność) are named in the abstract. Weak part: the abstract names 'task delay' but does not define it; the gloss 'odległość nagro…
- Korzyść i dowody#3.2 (source_claim, partly): nie dowód jednej przyczyny prokrastynacji.
  - The abstract reports several separate predictors and calls what it analyses 'possible causes', which fits 'no single cause'. It does not say in so many words that these correlations do not prove a single cause; such a limits statement woul…
- Ocena dowodów#1.2 (source_claim, not_checkable): ale nie jest testem skuteczności proponowanego działania.
  - Clause says the synthesis did not test the effectiveness of the proposed action (a claim of absence). Both snapshots are abstract-level: the Europe PMC snapshot is an abstract, and the PubMed page holds only the abstract and metadata. The …
- Ocena redakcyjna#2 (source_claim, not_checkable): Sama zmiana sposobu myślenia nie ma tutaj zmierzonego efektu.
  - Clause says that no effect of a change in thinking was measured in the cited evidence (a claim of absence). Both snapshots are abstract-level, so absence cannot be shown. The abstract mentions no measured effect of a change in thinking, bu…
- Ograniczenia#1 (source_claim, not_checkable): Z tego przeglądu nie wynika, że każda prokrastynacja jest unikaniem przykrych emocji ani że wynika z braku wysiłku.
  - Claim says what the review does not show. The abstract lists group-level predictors (task aversiveness, task delay, self-efficacy, impulsiveness, conscientiousness and its facets) and says neuroticism, rebelliousness and sensation seeking …

The two runs differ; a person decides:
- Korzyść i dowody#3 (strength): A source_claim supported; B source_description supported, source_claim partly
- Ocena dowodów#1 (strength): A source_description supported; B source_description supported, source_claim not_checkable
- Ograniczenia#1 (strength): A source_claim partly; B source_claim not_checkable

Adversary: 0 blocker/major, 9 minor

Editor (needs_edits, 7 protected findings):
- W praktyce (calque): "Zapytaj, czy" → "Zapytaj siebie, czy"

## 04.12

Verifier A: UNAVAILABLE, 10 open row(s)
- title#1 (recommendation_derived, partly): Powtarzaj mały nawyk w stałej sytuacji i nie oczekuj jednego terminu dla wszystkich
  - Backed: no single timeline (time to 95% of the asymptote ranged from 18 to 254 days, 'considerable variation') and the studied practice of repeating a behaviour daily in the same context. Not backed: 'mały' - the abstract only says partici…
- W praktyce#1 (recommendation_derived, partly): Powiąż prostą czynność ze stałym zdarzeniem, na przykład odłożenie potrzebnych materiałów na biurko z zakończeniem śniadania.
  - Backed: tying a daily behaviour to a fixed context ('after breakfast' is the abstract's own example of a context) is the studied practice, and automaticity increased with repetition in a consistent context. Not backed: 'prostą' - the abstr…
- W praktyce#2 (recommendation_derived, partly): Obserwuj regularność, zamiast uznawać brak automatyzmu po 21 dniach za porażkę.
  - Backed: day 21 is not a threshold, because time to reach the modelled plateau ranged from 18 to 254 days and 'it can take a very long time'. Not backed: that tracking regularity is the right replacement - the abstract only associates more …
- Korzyść i dowody#1 (source_description, partly): Lally i współautorzy obserwowali przez 12 tygodni 96 osób wybierających prosty nawyk, głównie związany z jedzeniem, piciem lub ruchem.
  - Supported: authors, 96 volunteers, 12 weeks, self-chosen eating, drinking or activity behaviour. Not in the abstract: that the habit was 'prosty' (simple) and that the behaviours were 'głównie' (mainly) of these kinds; the abstract lists o…
- Korzyść i dowody#3.1 (source_claim, partly): W tej ostatniej grupie modelowany czas osiągnięcia 95% indywidualnego poziomu automatyzmu wynosił od 18 do 254 dni
  - The range 18 to 254 days to reach 95% of the asymptote is stated. The abstract gives it for 'participants' and does not say it applies to the 39 people with a good fit ('W tej ostatniej grupie'); that attribution would need the full text.
- Korzyść i dowody#3.2 (source_claim, not_checkable): mediana wyniosła 66 dni.
  - The abstract reports only the range 18 to 254 days and no median; I searched the whole abstract for a median or any central value and found none. The full text (the Wiley page was blocked, 403) would be needed to check 66 days and the grou…
- Ocena dowodów#1 (source_description, partly): B — jedno małe badanie obserwacyjne z samoopisem i modelowaniem.
  - The grade letter B is editorial and was not checked. Supported: one study, self-report (SRHI) and modelling (nonlinear regressions, asymptotic curve), 96 volunteers of whom 82 gave enough data. Not stated in the abstract: the design label …
- Ocena redakcyjna#2 (recommendation_derived, partly): Wybierz mały nawyk, którego koszt jesteś gotów ponosić dłużej.
  - Backed: forming a habit can take a very long time (up to 254 days to 95% of the asymptote), which supports choosing something whose cost you can keep paying. Not backed: 'mały' - nothing in the abstract says that small habits are easier to…
- Ograniczenia#3 (source_claim, not_checkable): Nie mierzono pracy twórczej ani oszczędności czasu.
  - The snapshot is an abstract only (Crossref, 1547 characters), so it cannot show that something was not measured. I searched the abstract for creative work, work output, time saved or any time-use measure and found none: it reports the self…
- Ograniczenia#4.2 (source_claim, not_checkable): nie badaną czynnością.
  - Says the desk activity was not a studied behaviour. The abstract lists only 'an eating, drinking or activity behaviour' chosen by each volunteer and names no desk or materials behaviour, but an abstract-only snapshot cannot show absence. T…

Adversary: 4 blocker/major, 4 minor
- MAJOR scope-words (Koszt#2): Potrzebny jest wielokrotny wysiłek powtarzania wybranej czynności.
  - The item never says how often to repeat. In the study the volunteers carried the behaviour out daily in the same context for 12 weeks, and the upstream cost line states daily repetition for several months. The word 'wielokrotny' fits weekly or occasional repetition, to which the 18 to 254 day figures do not apply. A r…
  - Direction: State the studied frequency (daily performance) and duration in the cost and practice fields, and say the timings do not carry over to less frequent repetition.
- MAJOR numbers (Korzyść i dowody#3): mediana wyniosła 66 dni
  - The median of 66 days is not in the stored abstract and not in the upstream span; both give only a range. The item's Źródła field points to the Results section and table 2 of the publisher full text, but the stored full text is blocked (403) and only the Crossref abstract is stored, so nothing checkable here supports …
  - Direction: Obtain stored full-text evidence for the median, or remove the figure, or state that it was not checked beyond the abstract.
- MAJOR scope-words (Korzyść i dowody#3): W tej ostatniej grupie
  - The item assigns the 18 to 254 day range to the 39 participants with a good fit. The abstract does not say which group the range describes (82, 62 or 39 participants), and the upstream span places the range directly after the sentence about the 62 fitted participants. The narrowing to 39 is a population claim the stor…
  - Direction: Confirm the group behind the range in a stored full-text passage, or describe the range without naming the subgroup.
- MAJOR preservation (W praktyce#2): Obserwuj regularność, zamiast uznawać brak automatyzmu po 21 dniach za porażkę.
  - The upstream reassurance that a missed day does not reset progress is dropped, although the stored abstract supports it and it is the fallback for a reader who breaks the routine. 'Obserwuj regularność' without it invites streak-counting and restarting after one miss. The omission is not disclosed in Zmiany w adaptacj…
  - Direction: Restore the missed-opportunity finding with its limits (the abstract says one missed opportunity, not repeated misses) and record the change.

Editor (needs_edits, 12 protected findings):
- Koszt (calque, needs re-verification): "Potrzebny jest wielokrotny wysiłek powtarzania wybranej czynności." → "Potrzebny jest wysiłek wielokrotnego powtarzania wybranej czynności."
- W praktyce (calque): "Powiąż prostą czynność ze stałym zdarzeniem, na przykład odłożenie potrzebnych materiałów na biurko…" → "Powiąż prostą czynność ze stałym zdarzeniem. Na przykład po śniadaniu połóż potrzebne materiały na biurku."
- W praktyce (register, needs re-verification): "Obserwuj regularność" → "Obserwuj, jak regularnie powtarzasz czynność"
- W praktyce (term, needs re-verification): "za porażkę." → "za porażkę. Automatyzm to wykonywanie czynności bez namysłu."
- Korzyść i dowody (term): "mediana wyniosła" → "mediana (wartość środkowa) wynosiła"

## 04.17

Verifier A: FAIL, 11 open row(s)
- title#1 (recommendation_derived, partly): Naucz się skrótów do czynności, które często wykonujesz w programie
  - Only the source title backs the general direction: it frames not moving from menus and icon toolbars to keyboard shortcuts as a failure. The snapshot holds metadata only (title, authors, journal, year), so no text states that shortcuts are…
- W praktyce#1 (recommendation_derived, partly): Wybierz często używane polecenie, sprawdź skrót w pomocy swojego programu i przećwicz go.
  - Only the general direction (moving to keyboard shortcuts) is hinted at by the source title. The concrete steps (choose a frequently used command, look the shortcut up in the program's help, practise it) are not in the snapshot, which is me…
- W praktyce#2 (recommendation_derived, unsupported): Zostań przy sposobie obsługi, który jest dla ciebie dostępny i wygodny.
  - Looked in the only snapshot (13d78a52f21a4281.txt, metadata only: title, authors, journal, year) for any text on accessibility, comfort or keeping to an alternative way of operating a program, or for a source finding this caveat rests on. …
- Korzyść i dowody#1.1 (source_description, partly): Lane i współautorzy zbadali ankietą
  - The author attribution (Lane with three co-authors) matches the metadata. That the study was a survey (ankieta) is not in the snapshot: it holds no abstract and no body text. The abstract or full text would be needed.
- Korzyść i dowody#1.2 (source_claim, not_checkable): 251 doświadczonych użytkowników Worda
  - The sample size 251, the description 'experienced' and the product Word do not occur in the snapshot, which holds only title, authors, journal and year (access: metadata-only, no abstract). The abstract or full text would be needed.
- Korzyść i dowody#2 (source_claim, partly): Większość rzadko używała skrótów.
  - The title suggests the gist (users fail to move to keyboard shortcuts) but does not say that most of the surveyed people, or how many, rarely used shortcuts. 'Most' and 'rarely' are not in the snapshot. The abstract or full text would be n…
- Korzyść i dowody#3.1 (source_description, partly): W osobnym porównaniu sześć osób wykonywało polecenia przez menu, ikony i klawiaturę
  - The title only names the three interaction methods (menus, icon toolbars, keyboard shortcuts) as the subject. That there was a separate comparison, that it had six participants and that commands were executed by each method are not in the …
- Korzyść i dowody#3.2 (source_claim, not_checkable): skróty były najszybszą z tych metod
  - The title speaks of 'Hidden Costs of Graphical User Interfaces' but does not say what the costs are, nor that shortcuts were the fastest method. No quote of the snapshot states or measures speed. The abstract or full text would be needed.
- Ocena dowodów#1 (source_description, not_checkable): B — ankieta i bardzo mały eksperyment dotyczący konkretnego interfejsu.
  - The grade letter B is editorial and was not checked. The words after it describe the source's design (survey plus a very small experiment) and scope (a specific interface). The snapshot is metadata only; its title speaks of graphical user …
- Ograniczenia#1 (source_claim, not_checkable): Abstrakt nie podaje liczby zaoszczędzonych sekund.
  - Absence from the abstract cannot be shown: the snapshot (13d78a52f21a4281.txt) is metadata only and contains no abstract at all (title, authors, journal, year). The abstract text, or the full text, would be needed.
- Ograniczenia#3 (source_claim, not_checkable): Nie badano tu automatyzacji skryptami.
  - Absence of script automation from the study cannot be shown from metadata alone. The snapshot (13d78a52f21a4281.txt) lacks abstract and body text; only the title (menus, icon toolbars, keyboard shortcuts) is available. The full text would …

Adversary: 3 blocker/major, 3 minor; not assessable: grade, recency
- MAJOR limitations (Ograniczenia#1): Abstrakt nie podaje liczby zaoszczędzonych sekund.
  - The stored source is metadata-only (packet: access 'metadata-only', 'tylko metadane, bez abstraktu'; the snapshot text holds only DOI, title, authors, journal and year). The item states what the abstract does not contain, and the Źródła link is labelled 'DOI i abstrakt wydawcy', although no abstract is stored. The sen…
  - Direction: Say that only bibliographic metadata was checked (or store the abstract or full text in a snapshot and re-verify). Do not describe the abstract's content, or label the link as an abstract, until it i…
- MAJOR numbers (Korzyść i dowody#1): Lane i współautorzy zbadali ankietą 251 doświadczonych użytkowników Worda.
  - The figure 251 (and 'doświadczonych', and that the users were Word users) occurs only in upstream line 5, which is a lead, not evidence. It is in no snapshot and is not an editorial calculation. The stored snapshot is metadata-only, so the sample size cannot be checked. Readers and the B grade lean on it.
  - Direction: Verify the figure against the abstract or full text in a stored snapshot, or present it explicitly as taken from the upstream summary and not confirmed.
- MAJOR numbers (Korzyść i dowody#3): W osobnym porównaniu sześć osób wykonywało polecenia przez menu, ikony i klawiaturę; skróty były najszybszą z tych meto…
  - Both the participant count ('sześć osób') and the headline result ('skróty były najszybszą z tych metod') appear only in the upstream span (lines 5 and 8, leads). No snapshot line states the experiment, its size or its direction; the snapshot title only names the menu/icon-to-shortcut transition. The central benefit c…
  - Direction: Confirm the experiment's size and result from a stored abstract or full text, or mark the sentence as an upstream claim not checked against the source.

Editor (needs_edits, 10 protected findings):
- title (title): "Naucz się skrótów do czynności" → "Naucz się skrótów klawiszowych do czynności"
- Koszt (register): "z posiadanego programu" → "z programu, który już masz"

## 04.18

Verifier A: UNAVAILABLE, 6 open row(s)
- W praktyce#1 (recommendation_derived, partly): Porównaj czas od drzwi do drzwi w godzinach, w których rzeczywiście podróżujesz.
  - Backed part: the Stutzer and Frey abstract links longer commuting time with lower reported subjective well-being, so commute time is worth comparing. Not backed: the method (door-to-door time, measured in the hours one actually travels). N…
- W praktyce#2 (recommendation_derived, partly): Zestaw go z kosztem mieszkania, warunkami pracy i potrzebami domowników.
  - Backed part: commute time matters for reported well-being (row Korzyść i dowody#1.2). Not backed: weighing it against housing cost, working conditions and household needs. The Stutzer and Frey abstract mentions compensation on the labor or…
- W praktyce#3 (recommendation_derived, partly): Nie zakładaj, że przeprowadzka zawsze się opłaci.
  - Backed part: the only checkable source fact is an association between longer commuting time and lower reported well-being (row Korzyść i dowody#1.2). Not backed: any statement about outcomes of moving or of a shortened commute; the snapsho…
- Korzyść i dowody#1.1 (source_description, partly): W analizie niemieckich danych panelowych Stutzer i Frey
  - Authors (Stutzer, Frey) and panel data are supported by the snapshot. The word 'niemieckich' (German data) is not in the abstract: it names no country or dataset. Confirming it needs the full text.
- Korzyść i dowody#2.2 (source_claim, not_checkable): potwierdza związek dłuższego dojazdu z mniejszym zadowoleniem z samej podróży, ale nie ustala spójnego związku z ogólną satysfakcją z życia.
  - The Chatterjee snapshot is metadata-only (title, authors, journal, year) and has no abstract or body text. No line speaks to travel satisfaction or life satisfaction. The finding about travel satisfaction and the mixed finding about overal…
- Ocena dowodów#1 (source_description, partly): B — badanie obserwacyjne i przegląd o niejednoznacznych wnioskach dla ogólnego zadowolenia z życia.
  - The grade letter B is editorial and was not checked. Supported part: a study using panel data on reported well-being (Stutzer and Frey) and a review-type document (Chatterjee et al.). Not supported by any line: the label 'observational' is…

Adversary: 2 blocker/major, 7 minor; not assessable: recency
- MAJOR limitations (Korzyść i dowody#2): Przegląd Chatterjee i współautorów potwierdza związek dłuższego dojazdu z mniejszym zadowoleniem z samej podróży, ale n…
  - Both halves of this sentence are stated as results of the review, but the only stored snapshot for it holds title, authors, journal and year (access: metadata-only, no abstract). Neither the finding about satisfaction with the trip nor the absence of a consistent link with overall life satisfaction appears in any snap…
  - Direction: Obtain and re-snapshot an abstract or full text of the review and re-check both clauses against it; until then do not word them as findings the review confirms (state them as unverified, or remove th…
- MAJOR limitations (Korzyść i dowody#2): Przegląd Chatterjee i współautorów potwierdza
  - The Źródła field labels the review link „[Przegląd, abstrakt]”, which tells the reader that an abstract of the review was checked. The stored snapshot says the opposite (access words: „tylko metadane, bez abstraktu”): there is no abstract, so nothing about the review's content was checked. AGENTS.md asks to state what…
  - Direction: Relabel the access level of the review honestly (metadata only) or replace it with a source whose abstract or text was actually stored; state the scope of the check in the item.

Editor (needs_edits, 8 protected findings):
- Ocena dowodów (calque): "wnioskach dla ogólnego zadowolenia z życia" → "wnioskach dotyczących ogólnego zadowolenia z życia"
- Korzyść i dowody (term, needs re-verification): "niemieckich danych panelowych" → "niemieckich danych panelowych (zebranych od tych samych osób w kolejnych latach)"

## 14.1

Verifier A: UNAVAILABLE, 4 open row(s)
- W praktyce#2.1 (source_claim, partly): Jeżeli usługa obsługuje klucze dostępu, czyli passkeys, lub klucz sprzętowy FIDO/WebAuthn
  - Supported part: klucze dostępu = passkeys (27b6 line 417), passkeys can be stored on a hardware key, and a hardware key is described as a separate method (6a185 lines 441, 457). Not supported part: labelling the hardware key as FIDO/WebAut…
- W praktyce#6 (recommendation_derived, partly): Nie zatwierdzaj logowania, którego nie rozpoczynasz.
  - Backed part: push confirmations are a weak point because a user approves them by reflex (27b6 line 395, in row Korzyść i dowody#3). Not backed: the specific rule about prompts the user did not start. The snapshots never give that advice, n…
- Korzyść i dowody#3 (source_claim, partly): Sama prośba push nie zapewnia takiej odporności jak poprawnie wdrożony WebAuthn.
  - Supported part: push notifications are less safe than phishable SMS or app codes against a fake login page (line 395), while passkeys are phishing-resistant (line 417). Not stated: the comparison is drawn to 'WebAuthn' and to a 'poprawnie …
- Ograniczenia#2 (source_claim, partly): Odporność na phishing nie chroni przed każdym złośliwym programem, kradzieżą aktywnej sesji lub oszustwem przy odzyskiwaniu konta.
  - Supported part: passkeys stored in a password manager can be stolen by malware (27b6 line 433). Not supported: theft of an active session (the only hit for 'sesj' is the navigation entry 'Zarządzanie sesją', a separate uncited page) and fr…

Verifier B: FAIL, 5 open row(s)
- W praktyce#2.1 (source_claim, partly): Jeżeli usługa obsługuje klucze dostępu, czyli passkeys, lub klucz sprzętowy FIDO/WebAuthn,
  - Supported: passkeys are called klucze dostępu in Polish, and hardware keys exist as a phishing-resistant method. Weak part: the label FIDO/WebAuthn for the hardware key. The string FIDO occurs in neither cited snapshot; WebAuthn occurs onl…
- W praktyce#6 (recommendation_derived, unsupported): Nie zatwierdzaj logowania, którego nie rozpoczynasz.
  - Looked for any line that gives this advice or describes the threat it answers (an approval request the user did not start, unsolicited or repeated prompts) in both cited snapshots, searching for zatwierdz, potwierdz, push, powiadomien. The…
- Korzyść i dowody#3 (source_claim, partly): Sama prośba push nie zapewnia takiej odporności jak poprawnie wdrożony WebAuthn.
  - The quotes support the two components: push approval is even less safe than phishable one-time codes, and passkeys are phishing-resistant. No snapshot line makes the push-versus-WebAuthn comparison itself; it is the editors' inference from…
- Ocena dowodów#1.1 (source_description, partly): C — aktualne zalecenia techniczne CERT Polska,
  - The grade letter C itself is editorial and was not checked. Both snapshots are CERT Polska knowledge-base pages, and the MFA page ends with a Rekomendacje list. Weak part: aktualne. Only the passwords page carries a date (last updated 2026…
- Ograniczenia#2 (source_claim, partly): Odporność na phishing nie chroni przed każdym złośliwym programem, kradzieżą aktywnej sesji lub oszustwem przy odzyskiwaniu konta.
  - Supported part: malware (passkeys kept in a password manager can be stolen by malicious software). Weak parts: theft of an active session and fraud at account recovery. Searched both cited snapshots for sesj, session, ciasteczk, cookie, od…

The two runs differ; a person decides:
- W praktyce#6 (strength): A recommendation_derived partly; B recommendation_derived unsupported
- Ocena dowodów#1 (strength): A source_description supported, source_claim absent_in_source; B source_description partly, source_claim absent_in_source

Adversary: 1 blocker/major, 10 minor
- MAJOR same-action (W praktyce#6): Nie zatwierdzaj logowania, którego nie rozpoczynasz.
  - No snapshot contains this action. The CERT page describes push approval as the case where the victim DID start the login (typed credentials on a fake page) and expects the prompt, so this rule gives false assurance in exactly the phishing scenario the item is about. The item does not label it an editorial example, and…
  - Direction: Either label the sentence as an editorial example, or drop it, or restate it so it covers only unsolicited prompts and says that a prompt arriving right after typing a password on a page the reader o…

Editor (needs_edits, 10 protected findings):
- Koszt (term, needs re-verification): "przechowanie zapasu" → "przechowanie kodów odzyskiwania lub zapasowego klucza"
- W praktyce (consistency): "Kody SMS i z aplikacji" → "Kody SMS i kody z aplikacji"
- W praktyce (calque): "Zapisz bezpiecznie oferowane kody odzyskiwania" → "Zapisz bezpiecznie kody odzyskiwania, które oferuje usługa"
- Ocena dowodów (calque, needs re-verification): "eksperyment o procencie zablokowanych ataków" → "eksperyment mierzący procent zablokowanych ataków"
- Ograniczenia (consistency): "Passkey" → "Klucz dostępu"
- Ograniczenia (calque, needs re-verification): "od wymagania i sprawdzenia weryfikacji użytkownika przez usługę" → "od tego, czy usługa wymaga weryfikacji użytkownika i ją sprawdza"

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

## 14.3

Verifier A: FAIL, 10 open row(s)
- title#1 (recommendation_derived, partly): Ustaw blokadę ekranu i rozważ PIN karty SIM
  - Only the screen-lock part is backed: the Google page gives the same advice (set a PIN, pattern or password), although in order to get help from the location network. The SIM PIN part is not backed: the Google snapshot does not mention SIM,…
- W praktyce#1 (recommendation_derived, partly): Włącz blokadę ekranu urządzenia i sprawdź możliwość używania PIN-u SIM lub eSIM.
  - Only the first action (turn on a screen lock) is backed, by the Google page advice to set a PIN, pattern or password. The second action (check whether a SIM or eSIM PIN can be used) is not backed: the Google snapshot says nothing about SIM…
- W praktyce#2 (recommendation_derived, unsupported): Nie zgaduj kodu początkowego ani PUK.
  - Nothing in the readable snapshot backs it. I searched the Google snapshot (7d4296b28eab6e78.txt) for SIM, PUK, PIN of a card, operator and blocking of a card after wrong attempts: no line speaks about a SIM initial code or PUK. The Apple p…
- Korzyść i dowody#1 (source_description, source_unavailable): Instrukcja Apple opisuje blokowanie SIM lub eSIM po ponownym uruchomieniu urządzenia albo wyjęciu karty.
  - The cited Apple page (https://support.apple.com/pl-pl/118228) has no snapshot: access blocked by the service, status 429, 0 characters. The sentence is a description of that page and cannot be checked against the Google snapshot, which doe…
- Korzyść i dowody#2 (source_claim, source_unavailable): To inne zabezpieczenie niż kod odblokowujący ekran.
  - That SIM locking differs from the screen unlock code would have to come from the Apple page, which has no snapshot (blocked, 429). The Google snapshot does not mention SIM, eSIM or a SIM PIN (searched for SIM, PUK, karty, operator), so it …
- Ocena dowodów#1.1 (source_description, partly): C — oficjalna dokumentacja urządzeń i usług,
  - The Google snapshot is a help page of Konto Google (Pomoc) about Android devices, which fits official documentation of a device and a service. The Apple page has no snapshot (blocked, 429), so its description as official documentation coul…
- Ocena redakcyjna#1 (source_claim, source_unavailable): Te zabezpieczenia dotyczą różnych dróg dostępu.
  - Classified as a source_claim because it states what the two safeguards cover, not a cost or value judgement. The SIM side of the contrast would have to come from the Apple page, which has no snapshot (blocked, 429). The Google snapshot cov…
- Ograniczenia#1 (source_claim, source_unavailable): Wiele błędnych prób może zablokować kartę i wymagać pomocy operatora lub wymiany.
  - The effect of repeated wrong SIM codes would have to come from the Apple page, which has no snapshot (blocked, 429). The Google snapshot has no text on SIM codes, blocking of a card, operator help or card replacement (searched for SIM, PUK…
- Ograniczenia#2 (source_claim, source_unavailable): PIN SIM nie jest gwarancją ochrony kont ani zabezpieczeniem każdej procedury operatora.
  - Classified as a source_claim because it states what a SIM PIN does not protect, a statement about the world. Both parts (accounts, operator procedures) concern a SIM PIN, which only the Apple page could address; it has no snapshot (blocked…
- Ograniczenia#3 (source_claim, partly): Dostępność i nazwy ustawień zależą od urządzenia i karty.
  - The Google page shows that availability of some features depends on the device (Android version). It says nothing about dependence on the card (SIM or eSIM), nothing about SIM PIN settings, and nothing that names of settings vary between d…

Verifier B: FAIL, 11 open row(s)
- title#1 (recommendation_derived, partly): Ustaw blokadę ekranu i rozważ PIN karty SIM
  - Only the screen-lock part is backed: the Google page gives the same advice for Android (set a PIN, pattern or password so the Find Hub network can help find the device). The 'rozważ PIN karty SIM' part is not backed by any readable snapsho…
- W praktyce#1 (recommendation_derived, partly): Włącz blokadę ekranu urządzenia i sprawdź możliwość używania PIN-u SIM lub eSIM.
  - Only 'Włącz blokadę ekranu urządzenia' is backed (Google, Android, line 13). 'sprawdź możliwość używania PIN-u SIM lub eSIM' is not backed: the Apple snapshot is unavailable (HTTP 429, no snapshot) and the Google snapshot says nothing abou…
- W praktyce#2 (recommendation_derived, unsupported): Nie zgaduj kodu początkowego ani PUK.
  - Looked for any text on a SIM initial code, PUK, wrong-attempt limits or SIM lockout in the only readable snapshot (7d4296b28eab6e78.txt, Google Find Hub page; searched SIM, PUK, karta, operator, and read the whole text): nothing backs this…
- Korzyść i dowody#1 (source_description, source_unavailable): Instrukcja Apple opisuje blokowanie SIM lub eSIM po ponownym uruchomieniu urządzenia albo wyjęciu karty.
  - The Apple page https://support.apple.com/pl-pl/118228 is the cited source for this description. Its fetch was blocked by the site (HTTP 429), 0 characters, snapshot null. The Google snapshot is a different document and has no SIM or eSIM t…
- Korzyść i dowody#2 (source_claim, source_unavailable): To inne zabezpieczenie niż kod odblokowujący ekran.
  - The distinction between the SIM lock and the screen-unlock code comes from the Apple page, which has no snapshot (HTTP 429, blocked). The Google snapshot describes the screen-lock PIN, pattern or password but never mentions a SIM lock, so …
- Ocena dowodów#1.1 (source_description, partly): oficjalna dokumentacja urządzeń i usług
  - The grade letter C is editorial and was not checked. The Google snapshot is an official help page (title ends 'Konto Google - Pomoc'), which fits 'usług'. The 'urządzeń' part rests on the Apple help page, which has no snapshot (HTTP 429, b…
- Ocena dowodów#1.2 (source_claim, partly): nie badanie strat finansowych
  - Google snapshot (region 'article', 9122 of 11280 chars kept, not truncated): it is a help page, and a search for straty, strat, finans, pieniądze, badanie, bank found nothing about measured financial loss, so absence is shown for that regi…
- Ocena redakcyjna#1 (source_claim, source_unavailable): Te zabezpieczenia dotyczą różnych dróg dostępu.
  - States a fact about two protections (screen lock and SIM lock) covering different access routes. The SIM-lock side comes from the Apple page, which has no snapshot (HTTP 429, blocked). The Google snapshot covers only the screen lock and re…
- Ograniczenia#1 (source_claim, source_unavailable): Wiele błędnych prób może zablokować kartę i wymagać pomocy operatora lub wymiany.
  - Claim about SIM lockout after wrong attempts and the need for operator help or replacement; it depends on the Apple page, which has no snapshot (HTTP 429, blocked). The Google snapshot has no text on SIM lockout, wrong attempts, replacemen…
- Ograniczenia#2 (source_claim, source_unavailable): PIN SIM nie jest gwarancją ochrony kont ani zabezpieczeniem każdej procedury operatora.
  - Claim about what a SIM PIN does not protect (accounts, operator procedures). The only cited source on SIM PIN is the Apple page, which has no snapshot (HTTP 429, blocked). The Google snapshot has no text on SIM PIN, account protection by S…
- Ograniczenia#3 (source_claim, partly): Dostępność i nazwy ustawień zależą od urządzenia i karty.
  - The Google page shows that availability of some lost-device features depends on the Android version, device capabilities and device model. Missing: any statement that availability depends on the SIM card, that the names of settings vary, o…

Adversary: 0 blocker/major, 7 minor; not assessable: same-action, recency, limitations

Editor (needs_edits, 7 protected findings):
- Koszt (calque): "bezpieczne zachowanie danych" → "bezpieczne przechowanie danych"
- W praktyce (consistency): "ani PUK" → "ani PUK-u"
- W praktyce (calque): "lub oficjalne wsparcie swojego operatora" → "lub skorzystaj z oficjalnego wsparcia swojego operatora"
- Korzyść i dowody (consistency): "kod odblokowujący ekran" → "kod blokady ekranu"
- Ocena redakcyjna (register): "zanim podejmie się próbę odblokowania" → "zanim spróbujesz je odblokować"
- Ograniczenia (term): "lub wymiany" → "lub wymiany karty"

## 14.4

Verifier A: FAIL, 11 open row(s)
- title#1 (recommendation_derived, partly): Po utracie telefonu zabezpiecz urządzenie, numer i zagrożone konta
  - Backed by the Google snapshot: securing the device (mark as lost, lock) and securing the Google account. Not backed by any readable snapshot: securing the number (SIM or phone number with the operator; the Apple page is blocked) and securi…
- W praktyce#1 (recommendation_derived, partly): Użyj oficjalnej usługi producenta, by oznaczyć telefon jako utracony lub go zablokować, jeżeli ta funkcja była dostępna.
  - Backed only for Android: the Google page gives the same advice (Oznacz jako utracone locks the device) and states the conditions under which the function is available. Not backed: the manufacturer's service for other phones, in particular …
- W praktyce#2 (recommendation_derived, unsupported): Powiadom operatora o utracie karty i ustal jej zabezpieczenie.
  - Searched the Google snapshot for the operator, SIM or card, blocking the number and the phone number. The only operator line (120: the operator can use the IMEI to disable the device) concerns disabling the handset, not notifying about the…
- W praktyce#3 (recommendation_derived, unsupported): Jeśli zagrożony jest dostęp do banku lub widzisz obce operacje, skontaktuj się pilnie z bankiem oficjalnym kanałem.
  - Searched the Google snapshot for bank, unauthorised operations, payment instrument and contacting a provider about transactions: the page is silent (it only points to securing the Google account, line 172). The Rzecznik Finansowy page that…
- W praktyce#4 (recommendation_derived, unsupported): Podejrzenie kradzieży zgłoś policji.
  - Searched the Google snapshot for police, reporting a theft and a report to authorities: the page mentions a stolen device only in line 172 and gives no advice to notify the police. The other two cited pages are blocked (no snapshot).
- W praktyce#5 (recommendation_derived, unsupported): Nie czekaj na zakończenie jednego zgłoszenia, jeżeli inne ryzyko jest pilne.
  - Searched the Google snapshot for ordering, priority, waiting or parallel reports: the page gives no advice on the order of actions. The item's own Ocena dowodów says there is no study of one optimal order. The other two cited pages are blo…
- Korzyść i dowody#1 (source_claim, partly): Google i Apple opisują zdalną blokadę i inne działania po utracie urządzenia.
  - The Google part is supported (remote securing, locking and erasing). The Apple part cannot be checked: the Apple page returned 429 and has no snapshot.
- Korzyść i dowody#2 (source_claim, source_unavailable): Apple wskazuje także kontakt z operatorem.
  - The cited Apple page (support.apple.com/pl-pl/101593) is blocked (status 429) and has no snapshot.
- Korzyść i dowody#3 (source_claim, source_unavailable): Rzecznik Finansowy zaleca kontakt z dostawcą i zabezpieczenie instrumentu przy nieautoryzowanych operacjach.
  - The cited Rzecznik Finansowy page (rf.gov.pl, transakcje nieautoryzowane) is blocked by the service and has no snapshot.
- Ocena dowodów#1.1 (source_description, partly): oficjalne instrukcje reagowania
  - The Google snapshot is a Google Account help page with step-by-step instructions for a lost device, which fits the description. The Apple and Rzecznik Finansowy pages are blocked and have no snapshot, so their description is unchecked. The…
- Ograniczenia#3 (source_claim, source_unavailable): Apple ostrzega przed usunięciem urządzenia z listy Znajdź, bo usuwa to blokadę aktywacji.
  - The cited Apple page (support.apple.com/pl-pl/101593) is blocked (status 429) and has no snapshot. The Google snapshot does not speak to Apple's Znajdź list or Activation Lock.

Verifier B: FAIL, 11 open row(s)
- title#1 (recommendation_derived, partly): Po utracie telefonu zabezpiecz urządzenie, numer i zagrożone konta
  - Backed: securing the (Android) device remotely, and the pointer to securing the Google account. Not backed by any readable snapshot: securing the phone number or SIM, and accounts other than the Google account (bank, payment instruments). …
- W praktyce#1 (recommendation_derived, partly): Użyj oficjalnej usługi producenta, by oznaczyć telefon jako utracony lub go zablokować, jeżeli ta funkcja była dostępna.
  - The Google snapshot backs mark-as-lost and lock for Android devices, including the conditions under which the function is available. The sentence addresses every phone's manufacturer service; the iPhone part rests on the Apple page, which …
- W praktyce#2 (recommendation_derived, partly): Powiadom operatora o utracie karty i ustal jej zabezpieczenie.
  - The only readable line says the mobile operator can use the device IMEI to disable the device. That concerns the handset, not the SIM card, and gives no advice to notify the operator of card loss or to secure the card. The card-specific ad…
- W praktyce#3 (recommendation_derived, unsupported): Jeśli zagrożony jest dostęp do banku lub widzisz obce operacje, skontaktuj się pilnie z bankiem oficjalnym kanałem.
  - Searched the Google snapshot 7d4296b28eab6e78.txt (whole kept text) for bank, unauthorised or foreign transactions, payment instruments and contacting a bank: nothing. The item attributes this advice to the Rzecznik Finansowy page, which h…
- W praktyce#4 (recommendation_derived, unsupported): Podejrzenie kradzieży zgłoś policji.
  - Searched the Google snapshot 7d4296b28eab6e78.txt for police, reporting a theft, law enforcement: nothing (line 172 only mentions a stolen device and securing the Google account). The item's Korzyść i dowody attributes no police advice to …
- W praktyce#5 (recommendation_derived, unsupported): Nie czekaj na zakończenie jednego zgłoszenia, jeżeli inne ryzyko jest pilne.
  - Searched the Google snapshot 7d4296b28eab6e78.txt for any guidance on order, parallel reports or urgency of steps: none; the page lists steps without ranking them. The item's own Ocena dowodów says the sources are not a study of the order …
- Korzyść i dowody#1 (source_claim, partly): Google i Apple opisują zdalną blokadę i inne działania po utracie urządzenia.
  - The Google part is supported (remote lock, find, erase for Android and Wear OS). The Apple part cannot be checked: the Apple page has no snapshot (blocked, HTTP 429).
- Korzyść i dowody#2 (source_claim, source_unavailable): Apple wskazuje także kontakt z operatorem.
  - The cited Apple page https://support.apple.com/pl-pl/101593 has no readable snapshot (access blocked, HTTP 429). The Google snapshot is not evidence for what Apple says.
- Korzyść i dowody#3 (source_claim, source_unavailable): Rzecznik Finansowy zaleca kontakt z dostawcą i zabezpieczenie instrumentu przy nieautoryzowanych operacjach.
  - The cited Rzecznik Finansowy page (rf.gov.pl, transakcje-nieautoryzowane) has no readable snapshot (access blocked). The Google snapshot is not evidence for what the Rzecznik says.
- Ocena dowodów#1.1 (source_description, partly): oficjalne instrukcje reagowania
  - The Google snapshot is a vendor help page (Konto Google - Pomoc) with step-by-step instructions for a lost Android device, which fits the description. The Apple page and the Rzecznik Finansowy page have no snapshot, so the description is n…
- Ograniczenia#3 (source_claim, source_unavailable): Apple ostrzega przed usunięciem urządzenia z listy Znajdź, bo usuwa to blokadę aktywacji.
  - The cited Apple page https://support.apple.com/pl-pl/101593 has no readable snapshot (access blocked, HTTP 429). The Google snapshot says nothing about Apple's Find list or Activation Lock.

The two runs differ; a person decides:
- W praktyce#2 (strength): A recommendation_derived unsupported; B recommendation_derived partly

Adversary: 3 blocker/major, 2 minor; not assessable: same-action, limitations, recency
- MAJOR preservation (title#1): zabezpiecz urządzenie, numer i zagrożone konta
  - The title promises to secure endangered accounts, but W praktyce only covers the bank (contact only if bank access is threatened or foreign operations appear). The upstream step of changing email and payment passwords from another device is dropped, and 'Zmiany w adaptacji' does not list this as a deliberate removal. …
  - Direction: Either add an account-securing action with its condition and source, or narrow the title so it does not promise account protection, and record the removal in 'Zmiany w adaptacji'.
- MAJOR scope-words (W praktyce#2): Powiadom operatora o utracie karty i ustal jej zabezpieczenie.
  - The word SIM never appears in any reader-facing field. 'Karty' sits next to a bank sentence and can be read as a payment card, so the reader may not ask the mobile operator to block the SIM. The upstream reason for this step (cutting the SMS verification codes) is also dropped, which removes the only explanation of wh…
  - Direction: Name the card as the SIM or phone-number card, state the risk it addresses (codes and calls reaching the finder), and say what to ask the operator, each backed by a readable cited source.
- MAJOR preservation (W praktyce#1): Użyj oficjalnej usługi producenta, by oznaczyć telefon jako utracony lub go zablokować, jeżeli ta funkcja była dostępna.
  - The remote action is conditional, and the condition fails exactly when it is needed (the Google page lists device and settings preconditions). The item gives no path for a reader whose phone cannot be reached remotely. The upstream instruction to give the model and IMEI to the police and operator is dropped, although …
  - Direction: State what to do when the remote function was not enabled or the phone is offline (for example the IMEI route through the operator, if the readable sources support it) and record the dropped IMEI ste…

Editor (needs_edits, 10 protected findings):
- W praktyce (term, needs re-verification): "o utracie karty" → "o utracie karty SIM"
- W praktyce (calque): "ustal jej zabezpieczenie" → "ustal, jak ją zabezpieczyć"
- W praktyce (calque): "dostęp do banku" → "dostęp do konta bankowego"
- W praktyce (calque, needs re-verification): "obce operacje" → "nierozpoznane operacje"
- Ocena dowodów (calque, needs re-verification): "jednego optymalnego porządku działań" → "jednej optymalnej kolejności działań"
- Ograniczenia (term): "Wymazanie może" → "Wymazanie urządzenia może"
- Ograniczenia (calque): "po resecie Android może przestać być widoczny" → "po resecie urządzenie z Androidem może przestać być widoczne"
- Ograniczenia (consistency, needs re-verification): "kasowanie lub usunięcie z konta" → "wymazanie lub usunięcie urządzenia z konta"

## 14.6

Verifier A: UNAVAILABLE, 6 open row(s)
- title#1 (recommendation_derived, partly): Sprawdzaj sesje, uprawnienia aplikacji i przekazywanie poczty
  - Backed: checking email forwarding rules (line 51) and making sure devices and apps still logged in are logged out after a password change (line 69), plus checking accounts for unauthorised activity (line 25). Not backed: 'uprawnienia aplik…
- W praktyce#1 (recommendation_derived, partly): Sprawdź dostępne w usłudze listy sesji i połączonych aplikacji.
  - Only the part about finding devices and apps that are still logged in and logging them out via the Settings/Privacy/Account menus of the service (line 69, after a password change) is backed. Not backed: a routine check of lists of sessions…
- W praktyce#2 (recommendation_derived, partly): Usuń zbędne dostępy.
  - Backed only in the narrow form: after changing passwords, log devices and apps that may still be logged in out of the account (line 69). Not backed: removing 'zbędne' (no longer needed) access as a general or preventive measure; the snapsh…
- W praktyce#3 (recommendation_derived, partly): Przy podejrzeniu przejęcia konta skorzystaj z oficjalnej instrukcji odzyskiwania, sprawdź obce reguły przekazywania poczty, zmień przejęte …
  - Each action is backed by the quoted lines: provider help pages for recovery, forwarding rules, changing the hacked and the reused passwords, logging devices and apps out per the service's support page. Not backed: the trigger. The snapshot…
- Ocena dowodów#1.1 (source_description, partly): oficjalny poradnik odzyskiwania konta
  - The document type (step-by-step guide to recovering accounts) and the publisher (NCSC) are supported. The word 'oficjalny' (that the NCSC is an official government body) is not stated in the snapshot text between the markers. The grade let…
- Ograniczenia#1 (source_claim, partly): Nieznana lokalizacja sama nie rozstrzyga o ataku.
  - The source lists logins from strange locations only as one of the 'things to look out for' when checking for unauthorised activity, which is consistent with a prompt to check. It never states that an unknown location alone does or does not…

Verifier B: UNAVAILABLE, 4 open row(s)
- title#1 (recommendation_derived, partly): Sprawdzaj sesje, uprawnienia aplikacji i przekazywanie poczty
  - Backed: checking email forwarding rules, and ending access of devices and apps that may still be logged in (both are steps of the NCSC recovery guide, see Korzyść i dowody#2). Not backed: reviewing lists of sessions and app permissions as …
- W praktyce#1 (recommendation_derived, partly): Sprawdź dostępne w usłudze listy sesji i połączonych aplikacji.
  - Backed: the source tells the reader to make sure devices and apps are logged out, usually via the Settings menus of the app or website. Not backed: checking a list of sessions or a list of connected apps/permissions; the snapshot has no su…
- W praktyce#2 (recommendation_derived, partly): Usuń zbędne dostępy.
  - Backed: after a password change the source says devices and apps that may still be logged in must be logged out. Not backed: removing 'zbędne' (no longer needed) access as general hygiene or routine; the source ties the log-out only to rec…
- Ograniczenia#1 (source_claim, partly): Nieznana lokalizacja sama nie rozstrzyga o ataku.
  - The source presents logins from strange locations as something to look out for while checking accounts for unauthorised activity, which implies a sign to investigate. It never states that an unfamiliar location alone does not establish com…

The two runs differ; a person decides:
- W praktyce#3 (strength): A recommendation_derived partly; B recommendation_derived not_applicable
- Ocena dowodów#1 (strength): A source_description partly, source_claim absent_in_source; B source_description supported, source_claim absent_in_source

Adversary: 2 blocker/major, 10 minor
- MAJOR preservation (W praktyce#2): Usuń zbędne dostępy.
  - Upstream routes an unrecognised device or long-unused software to 'change the password first, then log out of everything'. The Polish item routes the same finding to plain removal ('Usuń zbędne dostępy') and gives the password-and-logout sequence only in W praktyce#3 under 'Przy podejrzeniu przejęcia konta'. Nothing s…
  - Direction: State what a reader does on finding an unrecognised session or app (treat as a suspected takeover and follow the recovery steps, or say explicitly that the source does not decide this). Say that remo…
- MAJOR same-action (title#1): Sprawdzaj sesje, uprawnienia aplikacji i przekazywanie poczty
  - The only cited and stored source is a post-incident recovery guide (its steps are headed 'Steps to take if your account has been hacked'). It contains no instruction to review sessions, connected apps or app permissions, or to remove unused access, whether routinely or otherwise. Its only app-related action is 'Log al…
  - Direction: Label the routine review of sessions, connected apps and unused access as an editorial example built on a recovery guide, and say plainly that the source describes only the post-incident step of logg…

Editor (needs_edits, 7 protected findings):
- title (title): "Sprawdzaj sesje, uprawnienia aplikacji i przekazywanie poczty" → "Sprawdzaj sesje logowania, uprawnienia aplikacji i przekazywanie poczty e-mail"
- W praktyce (term): "Sprawdź dostępne w usłudze listy sesji i połączonych aplikacji." → "Sprawdź listy sesji i połączonych aplikacji dostępne w usłudze. Sesja to trwające zalogowanie na urządzeniu lub w przeglądarce."
- W praktyce (calque, needs re-verification): "Usuń zbędne dostępy." → "Wyloguj zbędne sesje i cofnij dostęp zbędnym aplikacjom."
- W praktyce (register): "Przy podejrzeniu przejęcia konta skorzystaj z oficjalnej instrukcji odzyskiwania, sprawdź obce regu…" → "Przy podejrzeniu przejęcia konta: skorzystaj z oficjalnej instrukcji odzyskiwania; sprawdź obce reguły przekazywania poczty; zmień przejęte…"
- Korzyść i dowody (consistency): "zakończenia dostępu urządzeń i aplikacji" → "cofnięcia dostępu urządzeniom i aplikacjom"
- Ograniczenia (consistency): "Nieznana lokalizacja sama nie rozstrzyga o ataku." → "Nieznana lokalizacja logowania sama nie rozstrzyga o ataku."

## 14.7

Verifier A: PASS

Verifier B: PASS

Adversary: 0 blocker/major, 7 minor

Editor (needs_edits, 11 protected findings):
- W praktyce (calque): "chce dostępu" → "chce mieć dostęp"
- Ograniczenia (calque): "miał przeglądu prawnika" → "został sprawdzony przez prawnika"

## 14.8

Verifier A: UNAVAILABLE, 1 open row(s)
- Ograniczenia#4 (recommendation_derived, partly): Nie wysyłaj dokumentu tożsamości bez sprawdzenia potrzeby i kanału.
  - Backed: the 'check whether it is needed' part (art. 12 ust. 6 allows only additional information necessary to confirm identity; UODO says the controller may not ask for more data than necessary and that existing login mechanisms should suf…

Verifier B: UNAVAILABLE, 1 open row(s)
- Ograniczenia#4 (recommendation_derived, partly): Nie wysyłaj dokumentu tożsamości bez sprawdzenia potrzeby i kanału.
  - Backed: the need check (art. 12 ust. 6 allows only information necessary to confirm identity and only with reasonable doubts; UODO says no more data than necessary and that existing login mechanisms should suffice). Not backed: the 'kanał'…

Adversary: 2 blocker/major, 9 minor
- MAJOR preservation (W praktyce#4): W razie odmowy przeczytaj uzasadnienie i informacje o skardze lub ochronie sądowej.
  - The upstream gives a path for the case where the other side stalls instead of acting (complain first, litigate later). The item covers only an explicit refusal. A reader who gets no answer at all, or only silence after the one-month limit, is told nothing to do. The item also never names the body that receives a compl…
  - Direction: State the no-response case next to the refusal case and name the complaint recipient as stated in the cited sources; keep it as a described route, not a promise of outcome.
- MAJOR self-containment (W praktyce#3): Przy usuwaniu wskaż, dlaczego warunki są spełnione; samo zamknięcie konta nie musi usuwać wszystkich danych.
  - The reader is told to show that 'the conditions' are met, but no field of the item states the grounds for erasure. Ograniczenia lists only the exceptions. A reader cannot write the justification, or judge whether erasure is available at all, without the grounds. The upstream line carries the grounds (service stopped, …
  - Direction: Say in the item itself which circumstances of Art. 17(1) make erasure available, in plain words, so that 'warunki' has a content and the reader can match their case; say that where a ground applies t…

Editor (needs_edits, 16 protected findings):
- Ocena dowodów (consistency): "badanie rezultatów sporów" → "badanie wyników sporów"
- Ograniczenia (calque): "praw i wolności innych" → "praw i wolności innych osób"
- Ograniczenia (calque): "nie miał przeglądu prawnika" → "nie został sprawdzony przez prawnika"

## 14.9

Verifier A: UNAVAILABLE, 3 open row(s)
- title#1 (recommendation_derived, partly): Zanim przekażesz biometrię, zapytaj o cel, podstawę i alternatywę
  - Weakest part: 'alternatywę'. Purpose and legal basis are backed: GDPR Art. 13(1)(c) lists them as information the controller gives the person when collecting data, and the UODO lecture says the controller must establish the legal basis. Fo…
- W praktyce#2 (recommendation_derived, partly): Zapytaj także o inną metodę.
  - Backed: whether another, less invasive method exists, and whether the person can be offered a choice, are questions the controller must answer when assessing biometrics (UODO lecture, and the Marseille court as relayed there). Not backed: …
- Ograniczenia#2 (source_claim, partly): Możliwość odmowy i żądania alternatywy zależy od kontekstu i podstawy prawnej.
  - Weakest part: 'żądania alternatywy'. Backed: refusal matters where processing rests on consent, and consent counts as voluntary only if the person can refuse without adverse consequences (recital 42; UODO school case); Art. 9(2) has other …

Verifier B: UNAVAILABLE, 1 open row(s)
- Ograniczenia#2 (source_claim, partly): Możliwość odmowy i żądania alternatywy zależy od kontekstu i podstawy prawnej.
  - The quotes support the part that the possibility to refuse depends on the legal basis and the context: consent counts as voluntary only where refusal has no adverse consequences, and the right to object is tied to particular legal bases. N…

The two runs differ; a person decides:
- title#1 (strength): A recommendation_derived partly; B recommendation_derived not_applicable
- W praktyce#2 (strength): A recommendation_derived partly; B recommendation_derived not_applicable

Adversary: 1 blocker/major, 8 minor
- MAJOR preservation (W praktyce#2): Zapytaj także o inną metodę.
  - The upstream gives the reader a next step in both failure cases: demand an alternative when told there is none, and report to the regulator when the organisation still refuses. The Polish item keeps only the question. A reader who asks and hears 'no' or gets no answer is left with no path at all, and the only caveat (…
  - Direction: Add a conditional, sourced next step for a reader whose organisation gives no alternative or no answer (for example, the information Art. 13 obliges the controller to provide, including the complaint…

Editor (needs_edits, 12 protected findings):
- Koszt (consistency): "inny sposób weryfikacji" → "inną metodę weryfikacji"

## 14.10

Verifier A: FAIL, 10 open row(s)
- W praktyce#1 (recommendation_derived, partly): Przed użyciem pośrednika ustal, kto otrzymuje treść, jakie dane przechowuje i komu je przekazuje.
  - Backed: the abstract says the routers have full plaintext access to every in-flight JSON payload, so who receives the content matters. Not backed: what data the intermediary stores (retention) and to whom it passes data beyond dispatching …
- W praktyce#2 (recommendation_derived, partly): Nie wysyłaj mu kluczy dostępu, cudzych danych ani prywatnego kodu bez właściwego upoważnienia i oceny poufności oraz podstaw przetwarzania …
  - Backed: credentials can be taken (secret exfiltration class, 17 routers touching canary credentials) and routers see all payload plaintext, so any data or code sent is exposed. Not backed: the need for authorisation, the confidentiality as…
- W praktyce#4 (recommendation_derived, unsupported): Przy ujawnieniu klucza skorzystaj z procedury jego unieważnienia u wystawcy.
  - Searched the whole abstract for any remedy for an exposed key (revocation, rotation, issuer procedure, mitigation advice). The abstract reports that a leaked key was abused and that credentials were touched, but gives no remediation step; …
- Korzyść i dowody#2 (source_claim, partly): W tej próbie wykryli między innymi wstrzykiwanie szkodliwego kodu do odpowiedzi oraz dostęp do badawczych kluczy kontrolnych.
  - Injection of malicious code by routers and the touching of researcher-owned canary credentials are stated. Not stated in the abstract: that the code was injected specifically into responses (it says payload injection and in-flight JSON pay…
- Ocena dowodów#1 (source_description, partly): B — pojedyncze badanie pomiarowe opublikowane jako preprint, nie reprezentatywna ocena całego rynku.
  - The grade letter B is editorial and was not checked. Supported: a systematic measurement of routers from named purchase channels and public communities (a convenience sample, no claim of market coverage). Narrower than the source: the pape…
- Ograniczenia#1 (source_claim, not_checkable): Nie wiadomo z tego badania, jaki odsetek wszystkich pośredników jest złośliwy.
  - The snapshot is an arXiv abstract page only, so absence of a market-wide prevalence estimate cannot be shown. The abstract reports counts within the sample (1 paid and 8 free injecting) and describes a purchased and a community-collected s…
- Ograniczenia#2.1 (recommendation_derived, unsupported): Oficjalny dostawca też wymaga oceny zasad przetwarzania
  - Searched the abstract for anything on official or upstream providers' data-processing terms, privacy or retention. It concerns third-party routers and only says no provider enforces cryptographic integrity between client and upstream model…
- Ograniczenia#2.2 (source_claim, not_checkable): bezpośrednie połączenie nie jest gwarancją poufności.
  - The abstract studies third-party routers. Its only statement about the client-to-provider link (line 21: no provider enforces cryptographic integrity between client and upstream model) concerns integrity, not confidentiality. Full text wou…
- Ograniczenia#3 (source_claim, unsupported): Sama zmiana nazwy lub zamaskowanie fragmentu nie musi usuwać danych osobowych.
  - Searched the abstract for personal data, pseudonymisation, masking, anonymisation or data-protection law. None appears. The claim is a data-protection (GDPR) statement outside the subject of the cited paper and needs its own source.
- Ograniczenia#4 (source_claim, not_checkable): Ocena polecenia przez człowieka ogranicza część ryzyka, ale nie gwarantuje wykrycia każdego ataku.
  - The abstract names three automated client-side defences and adaptive evasion variants, but reports no results and does not mention human review of commands. Full text would be needed to see whether human review is evaluated or its limits d…

Verifier B: FAIL, 13 open row(s)
- W praktyce#1 (recommendation_derived, partly): Przed użyciem pośrednika ustal, kto otrzymuje treść, jakie dane przechowuje i komu je przekazuje.
  - Backed: who receives the content (routers have full plaintext access to every payload) and to whom it is passed on (routers dispatch requests across multiple upstream providers). Not backed: what data the intermediary stores (retention); t…
- W praktyce#2 (recommendation_derived, partly): Nie wysyłaj mu kluczy dostępu, cudzych danych ani prywatnego kodu bez właściwego upoważnienia i oceny poufności oraz podstaw przetwarzania …
  - Backed: not sending access keys (17 routers touched researcher-owned canary credentials, 1 drained ETH from a researcher-owned private key) and that any content in a payload is visible in plaintext to the router. Not backed: the parts abou…
- W praktyce#3 (recommendation_derived, partly): Nie pozwalaj niezweryfikowanym odpowiedziom AI automatycznie wykonywać poleceń z szerokimi uprawnieniami.
  - Backed in part: routers were found injecting malicious code, and the source itself evaluates a fail-closed policy gate and response-side screening as client-side defenses; decoy sessions already ran in autonomous YOLO mode. Not backed: the…
- W praktyce#4 (recommendation_derived, partly): Przy ujawnieniu klucza skorzystaj z procedury jego unieważnienia u wystawcy.
  - Backed: exposed credentials were touched and misused in the study (canary credentials touched, ETH drained from a private key; the abstract also reports a leaked OpenAI key generating 100M tokens). Not backed: the revocation step itself an…
- Korzyść i dowody#1.1 (source_description, partly): Liu i współautorzy opisali w preprincie badanie
  - Authorship (Liu first author with co-authors) and a study are shown. The page is an arXiv submission (v1, no journal or venue given), but no line uses the word preprint or states the review status, so the document-type label rests on arXiv…
- Korzyść i dowody#2 (source_claim, partly): W tej próbie wykryli między innymi wstrzykiwanie szkodliwego kodu do odpowiedzi oraz dostęp do badawczych kluczy kontrolnych.
  - Supported: malicious code injection and routers touching researcher-owned canary credentials in this sample; the abstract lists further findings, so the wording among others is fair. Not stated in the abstract: that the code was injected s…
- Ocena dowodów#1.1 (source_description, partly): pojedyncze badanie pomiarowe opublikowane jako preprint
  - The grade letter B is editorial and was not checked. A single measurement study is supported by the title and the abstract. The word preprint (or a statement of review status) appears in no snapshot line; only an arXiv submission with no v…
- Ocena dowodów#1.2 (source_claim, partly): nie reprezentatywna ocena całego rynku.
  - The abstract shows how the sample was obtained (purchased from named channels and collected from public communities), which is consistent with a non-representative sample, but it neither states how the sample was drawn nor says the sample …
- Ograniczenia#1 (source_claim, partly): Nie wiadomo z tego badania, jaki odsetek wszystkich pośredników jest złośliwy.
  - The abstract reports findings only as counts within a purchased and collected sample of routers; this is consistent with the claim, but the abstract does not state whether the paper attempts or disclaims a population-wide share. Absence ca…
- Ograniczenia#2.1 (recommendation_derived, unsupported): Oficjalny dostawca też wymaga oceny zasad przetwarzania
  - Looked for any statement about official or upstream providers' data processing, retention or terms. The abstract concerns third-party routers; its only line on providers is about cryptographic integrity between client and upstream model, n…
- Ograniczenia#2.2 (source_claim, unsupported): bezpośrednie połączenie nie jest gwarancją poufności.
  - Looked for any statement on direct connections to an upstream provider and on confidentiality. The abstract is about third-party routers and says only that no provider enforces cryptographic integrity between client and upstream model, whi…
- Ograniczenia#3 (source_claim, unsupported): Sama zmiana nazwy lub zamaskowanie fragmentu nie musi usuwać danych osobowych.
  - Looked for personal data, masking, anonymisation, pseudonymisation or renaming in the snapshot; none occurs. The abstract is about malicious routers and credentials. A claim about when data stay personal data needs a Polish or EU data-prot…
- Ograniczenia#4 (source_claim, partly): Ocena polecenia przez człowieka ogranicza część ryzyka, ale nie gwarantuje wykrycia każdego ataku.
  - Supported in part: adaptive evasion variants and routers deploying evasion triggers show that not every attack is plainly visible. Not backed: that human review of a command reduces part of the risk; the abstract evaluates automated client…

The two runs differ; a person decides:
- Koszt#2 (checking): A source_claim supported; B recommendation_derived not_applicable
- W praktyce#3 (strength): A recommendation_derived not_applicable; B recommendation_derived partly
- W praktyce#4 (strength): A recommendation_derived unsupported; B recommendation_derived partly
- Korzyść i dowody#1 (strength): A source_description supported; B source_description partly, source_claim supported
- Ograniczenia#1 (strength): A source_claim not_checkable; B source_claim partly
- Ograniczenia#4 (strength): A source_claim not_checkable; B source_claim partly

Adversary: 7 blocker/major, 8 minor
- MAJOR scope-words (W praktyce#3): Nie pozwalaj niezweryfikowanym odpowiedziom AI automatycznie wykonywać poleceń z szerokimi uprawnieniami.
  - The upstream rule is flat for a session routed through an intermediary: do not let the AI run commands fully automatically, look at each command first. The item adds two qualifiers that are in neither the upstream nor the abstract: 'niezweryfikowanym' (the item gives no way to verify a response) and 'z szerokimi upraw…
  - Direction: Remove or define the permission qualifier, tie the rule to sessions routed through an intermediary, and keep the look-before-release step as an instruction rather than only as a limitation.
- MAJOR preservation (W praktyce#4): Przy ujawnieniu klucza skorzystaj z procedury jego unieważnienia u wystawcy.
  - The upstream trigger is having already used a relay of unknown origin, and its scope is the used keys plus cloud-service and code-repository keys. The item narrows the trigger to 'przy ujawnieniu' (a known disclosure) and the scope to 'klucza' (one key). The abstract says routers have full plaintext access to every in…
  - Direction: State that a key which passed through an unverified intermediary is to be treated as exposed even without a symptom, and restore the upstream scope of which keys are included.
- MAJOR preservation (W praktyce#4): Przy ujawnieniu klucza skorzystaj z procedury jego unieważnienia u wystawcy.
  - The upstream fallback after anomalies has four steps: stop using at once, change keys, scan for malware, preserve evidence. It also explains that one altered command can get malicious code installed on the computer. The item keeps only the key revocation. The abstract's headline result is that routers injected malicio…
  - Direction: Either restore a sourced path for a computer that may have run altered commands (stop using, check the machine, keep evidence) or record in 'Zmiany w adaptacji' that these steps were left out and why.
- MAJOR preservation (W praktyce#2): Nie wysyłaj mu kluczy dostępu, cudzych danych ani prywatnego kodu bez właściwego upoważnienia i oceny poufności oraz po…
  - The upstream is a flat prohibition, for relays of unknown origin, on handing over code, keys and privacy materials. The item (a) limits the data to 'cudzych danych', so the reader's own personal data is not named at all, and (b) attaches 'bez właściwego upoważnienia i oceny...' to all three objects, so for keys the se…
  - Direction: Keep the prohibition unconditional for unverified intermediaries, name the reader's own personal data, separate secrets that appear inside requests from the account key the service needs, and move au…
- MAJOR limitations (W praktyce#1): Przed użyciem pośrednika ustal, kto otrzymuje treść, jakie dane przechowuje i komu je przekazuje.
  - The abstract reports two poisoning studies showing that ostensibly benign routers can be pulled into the same attack surface, including a leaked key that generated 100M tokens. The item is built on a split between unverified and verified operators, and its Ograniczenia field never says that an operator who looks hones…
  - Direction: Add the poisoning result as a limit of the operator check and describe the design of the paper completely enough that the check is not read as sufficient.
- MAJOR leak (W praktyce#2): bez właściwego upoważnienia i oceny poufności oraz podstaw przetwarzania danych
  - The wording carries a data-protection condition (a basis for processing other people's data) into advice. The only cited source is a cs.CR measurement abstract, and the upstream has no such condition: its only legal content is a pointer to the criminal risk of operating a relay under Chinese law, which was correctly r…
  - Direction: Either cite a primary Polish or EU source for the processing-basis condition and give it a verification scope, or reduce the sentence to an instruction that needs no legal claim.
- MAJOR scope-words (title#1): Nie przekazuj sekretów niesprawdzonym pośrednikom AI
  - The source population is third-party API routers that dispatch tool-calling requests of LLM agents across several upstream providers. The title widens this to 'pośrednicy AI', and the item never defines the term. 'pośrednika' (W praktyce#1) and 'pośredników API modeli' (Korzyść i dowody#1) appear without explanation, …
  - Direction: Define the intermediary in plain words at first use and align the title wording with the population the source actually studied.

Editor (needs_edits, 11 protected findings):
- title (title, needs re-verification): "pośrednikom AI" → "pośrednikom w dostępie do modeli AI"
- W praktyce (term, needs re-verification): "Przed użyciem pośrednika ustal," → "Przed użyciem pośrednika (usługi pośredniczącej w dostępie do modeli AI) ustal,"
- W praktyce (register): "skorzystaj z procedury jego unieważnienia u wystawcy" → "unieważnij go zgodnie z procedurą wystawcy"
- Korzyść i dowody (term, needs re-verification): "w preprincie badanie" → "w preprincie (tekście sprzed recenzji naukowej) badanie"
- Korzyść i dowody (calque, needs re-verification): "pośredników API modeli" → "pośredników w dostępie do modeli AI przez interfejs programistyczny (API)"

## 14.12

Verifier A: UNAVAILABLE, 1 open row(s)
- W praktyce#1 (recommendation_derived, partly): W usługach, które korzystają ze starego numeru, ustaw i sprawdź nowy numer lub inną metodę odzyskiwania, zanim stracisz do niego dostęp.
  - Backed: the number serves for login and recovery and a Google account change does not reach every service (Korzyść i dowody#1), and a new number may need time before it can verify sensitive actions (line 13). Not backed by any snapshot: th…

Verifier B: PASS

The two runs differ; a person decides:
- W praktyce#1 (strength): A recommendation_derived partly; B recommendation_derived not_applicable

Adversary: 2 blocker/major, 5 minor
- MAJOR preservation (Ocena redakcyjna#1): Warto sprawdzić działanie nowej metody przed wyłączeniem starej.
  - The upstream tells the reader not to stop the old number right after rebinding, but to keep it for a period to catch verification SMS from accounts that were missed, and it names missing accounts as the hard part. The item keeps only an ordering (check the new method before switching off the old one). Its change note …
  - Direction: Restore the action without the Chinese duration: keep the old number active and reachable for some time after the changes and watch for verification messages from missed accounts, labelled as an edit…
- MAJOR scope-words (W praktyce#1): ustaw i sprawdź nowy numer lub inną metodę odzyskiwania, zanim stracisz do niego dostęp
  - The item makes checking the new number the checkpoint before the old number is given up. The Google page cited as the evidence says that a new number may need up to a week before it can be used to verify identity for sensitive actions such as a password change. A reader who adds the new number, sees it saved and drops…
  - Direction: State the Google delay as a condition of that provider, in the snapshot's own terms, and tie the checkpoint to the new number actually working. Do not generalise the one-week period to other provider…

Editor (needs_edits, 9 protected findings):
- Koszt (term): "nowych sposobów kontaktu oraz odzyskiwania." → "nowych sposobów kontaktu oraz odzyskiwania konta."
- W praktyce (term): "Uwzględnij pocztę, bank i inne ważne konta" → "Uwzględnij pocztę e-mail, bank i inne ważne konta"
- W praktyce (register): "inną metodę odzyskiwania, zanim stracisz do niego dostęp" → "inną metodę odzyskiwania konta, zanim stracisz dostęp do starego numeru"
- Korzyść i dowody (term, needs re-verification): "do logowania lub odzyskiwania, a jego zmiana" → "do logowania lub odzyskiwania konta, a jego zmiana"

