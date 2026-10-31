// Adapted from HowToLiveBetter's line-based parser and DOM rendering approach.
// Copyright (c) 2026 eternity4719. MIT; see LICENSE-CODE.
export const CHAPTERS = [
  { id: '01', path: 'book/pl/01-unikaj-przedwczesnej-smierci.md' },
  { id: '02', path: 'book/pl/02-dbaj-o-zdrowie-na-co-dzien.md' },
  { id: '03', path: 'book/pl/03-nie-marnuj-energii.md' },
  { id: '04', path: 'book/pl/04-nie-marnuj-czasu.md' },
  { id: '05', path: 'book/pl/05-nie-marnuj-pieniedzy.md' },
  { id: '14', path: 'book/pl/14-bezpieczenstwo-kont-i-danych.md' },
];
export const FIELDS = [
  'Status', 'Koszt', 'W praktyce', 'Korzyść i dowody', 'Ocena dowodów',
  'Ocena redakcyjna', 'Ograniczenia', 'Źródła', 'Oryginał', 'Weryfikacja',
  'Zmiany w adaptacji',
];
const STATES = new Set(['verified', 'needs_verification', 'needs_localization', 'not_applicable']);

export function parseChapter(markdown, expectedId) {
  const ids = new Set();
  let chapter = null;
  let active = false;
  let entry = null;
  const flush = () => {
    if (!entry) return;
    if (!STATES.has(entry.fields.Status)) throw new Error('Nieprawidłowy stan porady ' + entry.id);
    if (ids.has(entry.id)) throw new Error('Powtórzony numer porady ' + entry.id);
    ids.add(entry.id);
    const required = entry.fields.Status === 'verified' ? FIELDS : ['Ograniczenia', 'Źródła', 'Oryginał', 'Weryfikacja'];
    for (const field of required) {
      if (!entry.fields[field]?.trim()) throw new Error('Brak pola ' + field + ' w ' + entry.id);
    }
    const date = /^(\d{4}-\d{2}-\d{2}); .+/.exec(entry.fields.Weryfikacja)?.[1];
    if (!date || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date) {
      throw new Error('Brak poprawnej daty i zakresu weryfikacji');
    }
    if (!entry.fields['Oryginał'].includes(`[${entry.number}]`)) throw new Error('Niezgodny identyfikator oryginału');
    if (entry.fields.Status === 'verified' && !/^[ABC] [—-] .+/.test(entry.fields['Ocena dowodów'])) {
      throw new Error('Brak oceny dowodów');
    }
    chapter.entries.push(entry);
    entry = null;
  };
  for (const line of markdown.split(/\r?\n/)) {
    let match;
    if ((match = /^# ([1-9]\d*)\. (.+)$/.exec(line))) {
      if (chapter) throw new Error('Plik musi zawierać jeden rozdział');
      chapter = { id: match[1].padStart(2, '0'), title: match[2], entries: [] };
      active = true;
    } else if (/^#{1,2} /.test(line)) {
      flush();
      active = false;
    } else if ((match = /^### ([1-9]\d*)\. (.+)$/.exec(line))) {
      if (!chapter || !active) throw new Error('Pozycja poza rozdziałem');
      flush();
      entry = {
        id: `porada-${Number(chapter.id)}-${match[1]}`,
        number: `${chapter.id}.${match[1]}`,
        chapterId: chapter.id,
        title: match[2],
        fields: {},
      };
    } else if ((match = /^- ([^:]+): (.+)$/.exec(line)) && entry) {
      const [, label, value] = match;
      if (!FIELDS.includes(label) || label in entry.fields) throw new Error('Nieprawidłowe lub powtórzone pole ' + label);
      entry.fields[label] = value;
    } else if (entry && line.trim() && !/^<a id="porada-\d+-\d+"><\/a>$/.test(line)) {
      throw new Error('Nieobsługiwany wiersz porady ' + entry.id);
    }
  }
  flush();
  if (!chapter?.entries.length) throw new Error('Brak rozdziału lub jego pozycji');
  if (expectedId && chapter.id !== expectedId) throw new Error('Niezgodny numer rozdziału: ' + chapter.id);
  return chapter;
}

export const fold = text => text.toLocaleLowerCase('pl').normalize('NFD').replace(/\p{M}/gu, '').replace(/ł/g, 'l');
export const published = entries => entries.filter(entry => entry.fields.Status === 'verified');

export function safeHref(href) {
  if (/^https:\/\//.test(href)) {
    try {
      const url = new URL(href);
      return url.hostname && !url.username && !url.password ? href : null;
    } catch { return null; }
  }
  if (/^#porada-[1-9]\d*-[1-9]\d*$/.test(href)) return href;
  const match = /^([^/#]+\.md)(#porada-([1-9]\d*)-[1-9]\d*)$/.exec(href);
  if (match && CHAPTERS.some(c => c.path.split('/').at(-1) === match[1] && Number(c.id) === Number(match[3]))) return match[2];
  return null;
}

// Only inline links are supported. Raw HTML stays plain text.
export function inline(element, text) {
  const links = /\[([^\]]+)\]\(([^()\s]+)\)/g;
  let offset = 0;
  for (const match of text.matchAll(links)) {
    element.append(document.createTextNode(text.slice(offset, match.index)));
    const href = safeHref(match[2]);
    if (href) {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = match[1];
      element.append(link);
    } else element.append(document.createTextNode(match[0]));
    offset = match.index + match[0].length;
  }
  element.append(document.createTextNode(text.slice(offset)));
}

function fieldsList(entry, labels) {
  const list = document.createElement('dl');
  for (const label of labels) {
    const term = document.createElement('dt');
    term.textContent = label;
    const description = document.createElement('dd');
    inline(description, entry.fields[label]);
    list.append(term, description);
  }
  return list;
}

async function startReader() {
  const status = document.getElementById('status');
  const search = document.getElementById('search');
  const grade = document.getElementById('grade');
  const chapterFilter = document.getElementById('chapter');
  const retry = document.getElementById('retry');
  const resetButton = document.getElementById('reset');
  const controls = [search, grade, chapterFilter, resetButton];
  const main = document.getElementById('porady');
  const toc = document.getElementById('toc');
  const chapterNav = document.getElementById('chapters');
  if (window.matchMedia('(max-width: 48rem)').matches) document.getElementById('nav-list').open = false;
  let chapters = [];
  let cards = [];
  let sections = [];
  const chapterAnchor = id => 'rozdzial-' + Number(id);

  function updateCurrentLinks() {
    for (const link of document.querySelectorAll('#toc a, #chapters a')) {
      const target = document.getElementById(link.hash.slice(1));
      if (link.hash === location.hash && target && !target.hidden) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }
  function apply() {
    if (!chapters.length) return;
    const query = fold(search.value.trim());
    let visible = 0;
    for (const { entry, article, nav, haystack } of cards) {
      const match = (!query || haystack.includes(query))
        && (!grade.value || entry.fields['Ocena dowodów'].startsWith(grade.value))
        && (!chapterFilter.value || entry.chapterId === chapterFilter.value);
      article.hidden = nav.hidden = !match;
      if (match) visible++;
    }
    for (const { id, section } of sections) section.hidden = !cards.some(c => c.entry.chapterId === id && !c.article.hidden);
    status.textContent = `Wyświetlono ${visible} z ${cards.length} opracowanych polskich porad. Wczytane rozdziały: ${chapters.length}.`
      + (visible ? '' : ' Brak wyników. Zmień wyszukiwanie lub filtr.');
    updateCurrentLinks();
  }
  function reset() {
    search.value = grade.value = chapterFilter.value = '';
    apply();
  }
  function revealHash() {
    updateCurrentLinks();
    const card = cards.find(c => '#' + c.entry.id === location.hash);
    if (card) {
      if (card.article.hidden) reset();
      card.article.scrollIntoView();
      card.article.querySelector('h3').focus({ preventScroll: true });
      return;
    }
    const target = sections.find(c => '#' + chapterAnchor(c.id) === location.hash);
    if (target) {
      search.value = grade.value = '';
      chapterFilter.value = target.id;
      apply();
      target.section.scrollIntoView();
      target.section.querySelector('h2').focus({ preventScroll: true });
    }
  }
  async function load() {
    chapters = []; cards = []; sections = [];
    main.replaceChildren(); toc.replaceChildren(); chapterNav.replaceChildren();
    main.setAttribute('aria-busy', 'true');
    controls.forEach(control => { control.disabled = true; });
    retry.hidden = retry.disabled = true;
    status.textContent = 'Wczytywanie wszystkich polskich rozdziałów…';
    try {
      if (location.protocol === 'file:') throw new Error('Użyj lokalnego serwera HTTP zgodnie z README.');
      const loaded = await Promise.all(CHAPTERS.map(async ({ id, path }) => {
        try {
          const response = await fetch(path, { cache: 'no-cache', signal: AbortSignal.timeout(10000) });
          if (!response.ok) throw new Error(`Nie można odczytać pliku ${path} (HTTP ${response.status}).`);
          return parseChapter(await response.text(), id);
        } catch (error) {
          const message = error instanceof TypeError || ['AbortError', 'TimeoutError'].includes(error.name)
            ? 'Nie można pobrać rozdziału. Sprawdź połączenie z internetem (przy lokalnym uruchomieniu także działanie serwera) i spróbuj ponownie.' : error.message;
          throw new Error(`Rozdział ${id}: ${message}`);
        }
      }));
      if (!loaded.some(c => published(c.entries).length)) throw new Error('Zbiór nie zawiera zweryfikowanych porad.');
      chapterFilter.replaceChildren(new Option('Wszystkie rozdziały', ''));
      for (const chapter of loaded) {
        const entries = published(chapter.entries);
        const label = `${Number(chapter.id)}. ${chapter.title}`;
        chapterFilter.add(new Option(label, chapter.id));
        const chapterItem = document.createElement('li');
        const chapterLink = document.createElement('a');
        chapterLink.href = '#' + chapterAnchor(chapter.id);
        chapterLink.textContent = `${label} (${entries.length})`;
        chapterItem.append(chapterLink);
        chapterNav.append(chapterItem);
        const section = document.createElement('section');
        section.id = chapterAnchor(chapter.id);
        const heading = document.createElement('h2');
        heading.textContent = label;
        heading.tabIndex = -1;
        heading.id = section.id + '-tytul';
        section.setAttribute('aria-labelledby', heading.id);
        section.append(heading);
        sections.push({ id: chapter.id, section });
        for (const entry of entries) {
          const article = document.createElement('article');
          article.id = entry.id;
          const badge = document.createElement('span');
          badge.className = 'badge';
          badge.textContent = `Porada ${entry.number} · Dowody ${entry.fields['Ocena dowodów'][0]}`;
          const title = document.createElement('h3');
          title.tabIndex = -1;
          title.textContent = entry.title;
          title.id = entry.id + '-tytul';
          article.setAttribute('aria-labelledby', title.id);
          const practical = document.createElement('p');
          practical.className = 'practical';
          inline(practical, entry.fields['W praktyce']);
          const permalink = document.createElement('a');
          permalink.className = 'permalink';
          permalink.href = '#' + entry.id;
          permalink.textContent = 'Stały link';
          permalink.setAttribute('aria-label', 'Stały link do porady ' + entry.number);
          article.append(badge, title, permalink, practical);
          article.append(fieldsList(entry, ['Koszt', 'Korzyść i dowody', 'Ocena dowodów', 'Ograniczenia', 'Ocena redakcyjna']));
          const details = document.createElement('details');
          const summary = document.createElement('summary');
          summary.textContent = 'Dowody, źródła i adaptacja';
          details.append(summary, fieldsList(entry, ['Źródła', 'Oryginał', 'Weryfikacja', 'Zmiany w adaptacji']));
          article.append(details);
          section.append(article);
          const nav = document.createElement('li');
          const link = document.createElement('a');
          link.href = '#' + entry.id;
          link.textContent = entry.number + '. ' + entry.title;
          nav.append(link);
          toc.append(nav);
          cards.push({ entry, article, nav, haystack: fold([label, entry.number, entry.title, ...Object.values(entry.fields)].join('\n')) });
        }
        main.append(section);
      }
      chapters = loaded;
      controls.forEach(control => { control.disabled = false; });
      apply();
      revealHash();
    } catch (error) {
      chapters = []; cards = []; sections = [];
      main.replaceChildren(); toc.replaceChildren(); chapterNav.replaceChildren();
      status.textContent = 'Nie wczytano kompletnego zbioru. Nie pokazano żadnej jego części. ' + error.message;
      retry.hidden = false;
    } finally {
      main.setAttribute('aria-busy', 'false');
      retry.disabled = false;
    }
  }
  search.addEventListener('input', apply);
  grade.addEventListener('change', apply);
  chapterFilter.addEventListener('change', apply);
  document.querySelector('form').addEventListener('submit', event => event.preventDefault());
  resetButton.addEventListener('click', () => { reset(); search.focus(); });
  retry.addEventListener('click', load);
  window.addEventListener('hashchange', revealHash);
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#porada-"], a[href^="#rozdzial-"]');
    if (link && link.getAttribute('href') === location.hash) { event.preventDefault(); revealHash(); }
  });
  await load();
}

if (typeof document !== 'undefined') startReader();
