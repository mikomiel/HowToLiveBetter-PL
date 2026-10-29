# Audit digest

| Item | Verifier A | Verifier B | Runs agree | Adversary (blocker/major/minor) | Editor |
|---|---|---|---|---|---|
| 14.1 | UNAVAILABLE | FAIL | no (2) | 0/1/10 | needs_edits, 6 edits |
| 14.3 | FAIL | FAIL | yes | 0/0/7 | needs_edits, 6 edits |
| 14.4 | FAIL | FAIL | no (2) | 0/3/2 | needs_edits, 8 edits |
| 14.6 | UNAVAILABLE | UNAVAILABLE | no (2) | 0/2/10 | needs_edits, 6 edits |
| 14.9 | UNAVAILABLE | - | - | 0/1/8 | needs_edits, 1 edits |

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

Verifier A: FAIL, 12 open row(s)
- title#1 (recommendation_derived, partly): Po utracie telefonu zabezpiecz urządzenie, numer i zagrożone konta
  - Backed in the readable Google snapshot: securing the device (remote lock) and, for a Google account only, securing the account (line 172 points to another page, it does not give the steps). Not backed: securing the phone number or SIM card…
- W praktyce#1 (recommendation_derived, partly): Użyj oficjalnej usługi producenta, by oznaczyć telefon jako utracony lub go zablokować, jeżeli ta funkcja była dostępna.
  - The Google help page gives the same advice for Android and Wear OS (mark as lost = lock; preconditions listed in the preparation section, which matches 'jeżeli ta funkcja była dostępna'). The sentence says 'producenta' in general; the iPho…
- W praktyce#2 (recommendation_derived, partly): Powiadom operatora o utracie karty i ustal jej zabezpieczenie.
  - Only the role of the mobile operator is backed: the Google page says the operator can disable the device using its IMEI. Not backed: a duty or advice to notify the operator, and anything about the SIM card or its protection (the snapshot n…
- W praktyce#3 (recommendation_derived, source_unavailable): Jeśli zagrożony jest dostęp do banku lub widzisz obce operacje, skontaktuj się pilnie z bankiem oficjalnym kanałem.
  - The item attributes this advice to the Rzecznik Finansowy FAQ (Korzyść i dowody#3). That page has no snapshot (access blocked by the service, snapshot null). The only readable snapshot (Google help page) never mentions a bank or unauthoris…
- W praktyce#4 (recommendation_derived, unsupported): Podejrzenie kradzieży zgłoś policji.
  - Searched the only readable snapshot (Google help page) for police, reporting a theft or law enforcement: no hit. The page mentions a stolen device only on line 172 and gives no advice to report it. The item attributes this advice to no sou…
- W praktyce#5 (recommendation_derived, unsupported): Nie czekaj na zakończenie jednego zgłoszenia, jeżeli inne ryzyko jest pilne.
  - Searched the only readable snapshot (Google help page) for any advice on the order of actions, doing steps in parallel or not waiting for one report to finish: no hit. The item attributes this advice to no source and its own Ocena dowodów …
- Korzyść i dowody#1 (source_description, partly): Google i Apple opisują zdalną blokadę i inne działania po utracie urządzenia.
  - Google part supported: the help page describes remote locating, locking (mark as lost) and erasing for a lost Android or Wear OS device. Apple part not checked: the Apple page (support.apple.com/pl-pl/101593) has no snapshot (access blocke…
- Korzyść i dowody#2 (source_claim, source_unavailable): Apple wskazuje także kontakt z operatorem.
  - The Apple page (support.apple.com/pl-pl/101593) has no snapshot: access blocked by the service, HTTP 429, snapshot null. The Google snapshot line 120 mentions the operator, but the sentence attributes the statement to Apple, so it is not e…
- Korzyść i dowody#3 (source_claim, source_unavailable): Rzecznik Finansowy zaleca kontakt z dostawcą i zabezpieczenie instrumentu przy nieautoryzowanych operacjach.
  - The Rzecznik Finansowy FAQ page on unauthorised transactions has no snapshot: access blocked by the service (HTTP status 200 but blocked), snapshot null. Nothing in the readable Google snapshot concerns payment instruments or unauthorised …
- Ocena dowodów#1.1 (source_description, partly): C — oficjalne instrukcje reagowania
  - The grade letter C is editorial and was not checked. Description checked for the Google source only: an official help page with step-by-step instructions for a lost device. The Apple support page and the Rzecznik Finansowy FAQ have no snap…
- Ograniczenia#1 (source_claim, partly): Zdalne funkcje zależą od wcześniejszych ustawień i łączności.
  - Supported for Android (and Wear OS) by the Google page: the device must be connected to a network, linked to a Google account and have Find Hub switched on. The sentence speaks of remote functions in general; nothing was checked for iPhone…
- Ograniczenia#3 (source_claim, source_unavailable): Apple ostrzega przed usunięciem urządzenia z listy Znajdź, bo usuwa to blokadę aktywacji.
  - The Apple page (support.apple.com/pl-pl/101593) has no snapshot: access blocked by the service, HTTP 429, snapshot null. The Google snapshot is about Android and says nothing about Apple's Activation Lock.

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
- W praktyce#3 (strength): A recommendation_derived source_unavailable; B recommendation_derived unsupported
- Ograniczenia#1 (strength): A source_claim partly; B source_claim supported

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

## 14.9

Verifier A: UNAVAILABLE, 3 open row(s)
- title#1 (recommendation_derived, partly): Zanim przekażesz biometrię, zapytaj o cel, podstawę i alternatywę
  - Weakest part: 'alternatywę'. Purpose and legal basis are backed: GDPR Art. 13(1)(c) lists them as information the controller gives the person when collecting data, and the UODO lecture says the controller must establish the legal basis. Fo…
- W praktyce#2 (recommendation_derived, partly): Zapytaj także o inną metodę.
  - Backed: whether another, less invasive method exists, and whether the person can be offered a choice, are questions the controller must answer when assessing biometrics (UODO lecture, and the Marseille court as relayed there). Not backed: …
- Ograniczenia#2 (source_claim, partly): Możliwość odmowy i żądania alternatywy zależy od kontekstu i podstawy prawnej.
  - Weakest part: 'żądania alternatywy'. Backed: refusal matters where processing rests on consent, and consent counts as voluntary only if the person can refuse without adverse consequences (recital 42; UODO school case); Art. 9(2) has other …

Adversary: 1 blocker/major, 8 minor
- MAJOR preservation (W praktyce#2): Zapytaj także o inną metodę.
  - The upstream gives the reader a next step in both failure cases: demand an alternative when told there is none, and report to the regulator when the organisation still refuses. The Polish item keeps only the question. A reader who asks and hears 'no' or gets no answer is left with no path at all, and the only caveat (…
  - Direction: Add a conditional, sourced next step for a reader whose organisation gives no alternative or no answer (for example, the information Art. 13 obliges the controller to provide, including the complaint…

Editor (needs_edits, 12 protected findings):
- Koszt (consistency): "inny sposób weryfikacji" → "inną metodę weryfikacji"

