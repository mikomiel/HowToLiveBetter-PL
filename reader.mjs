// Adapted from HowToLiveBetter's line-based parser and DOM rendering approach.
// Copyright (c) 2026 eternity4719. MIT; see LICENSE-CODE.
export const CONTENT_PATH = 'book/pl/04-nie-marnuj-czasu.md';
export const FIELDS = [
  'Status', 'Koszt', 'W praktyce', 'Korzyść i dowody', 'Ocena dowodów',
  'Ocena redakcyjna', 'Ograniczenia', 'Źródła', 'Oryginał', 'Weryfikacja',
  'Zmiany w adaptacji',
];
const STATES = new Set(['verified', 'needs_verification', 'needs_localization', 'not_applicable']);

export function parseChapter(markdown) {
  const entries = [];
  const ids = new Set();
  let chapter = null;
  let entry = null;
  const flush = () => {
    if (!entry) return;
    if (!STATES.has(entry.fields.Status)) throw new Error('Nieprawidłowy stan porady ' + entry.id);
    if (ids.has(entry.id)) throw new Error('Powtórzony numer porady ' + entry.id);
    ids.add(entry.id);
    if (entry.fields.Status === 'verified') {
      for (const field of FIELDS) {
        if (!entry.fields[field]?.trim()) throw new Error('Brak pola ' + field + ' w ' + entry.id);
      }
      if (!/^[ABC] — .+/.test(entry.fields['Ocena dowodów'])) throw new Error('Brak oceny dowodów');
      if (!/^\d{4}-\d{2}-\d{2}; .+/.test(entry.fields.Weryfikacja)) throw new Error('Brak daty i zakresu weryfikacji');
    }
    entries.push(entry);
    entry = null;
  };
  for (const line of markdown.split(/\r?\n/)) {
    let match;
    if ((match = /^# (\d+)\. (.+)$/.exec(line))) {
      flush();
      chapter = match[1];
    } else if (/^#{1,2} /.test(line)) {
      flush();
      chapter = null;
    } else if ((match = /^### (\d+)\. (.+)$/.exec(line)) && chapter) {
      flush();
      entry = { id: `porada-${chapter}-${match[1]}`, number: `${chapter.padStart(2, '0')}.${match[1]}`, title: match[2], fields: {} };
    } else if ((match = /^- ([^:]+): (.+)$/.exec(line)) && entry) {
      const [, label, value] = match;
      if (!FIELDS.includes(label) || label in entry.fields) throw new Error('Nieprawidłowe lub powtórzone pole ' + label);
      entry.fields[label] = value;
    }
  }
  flush();
  return entries;
}

export const fold = text => text.toLocaleLowerCase('pl').normalize('NFD').replace(/\p{M}/gu, '').replace(/ł/g, 'l');
export const published = entries => entries.filter(entry => entry.fields.Status === 'verified');

// This intentionally supports only inline links. Raw HTML stays plain text.
export function inline(element, text) {
  const links = /\[([^\]]+)\]\(([^()\s]+)\)/g;
  let offset = 0;
  for (const match of text.matchAll(links)) {
    element.append(document.createTextNode(text.slice(offset, match.index)));
    if (/^(https:\/\/|#porada-\d+-\d+$)/.test(match[2])) {
      const link = document.createElement('a');
      link.href = match[2];
      link.textContent = match[1];
      element.append(link);
    } else {
      element.append(document.createTextNode(match[0]));
    }
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
  const retry = document.getElementById('retry');
  const main = document.getElementById('porady');
  const toc = document.getElementById('toc');
  if (window.matchMedia('(max-width: 48rem)').matches) document.getElementById('nav-list').open = false;
  let cards = [];
  function apply() {
    const query = fold(search.value.trim());
    let visible = 0;
    for (const { entry, article, nav, haystack } of cards) {
      const match = (!query || haystack.includes(query)) && (!grade.value || entry.fields['Ocena dowodów'].startsWith(grade.value));
      article.hidden = nav.hidden = !match;
      if (match) visible++;
    }
    status.textContent = `Wyświetlono ${visible} z ${cards.length} zweryfikowanych polskich porad.` + (visible ? '' : ' Brak wyników. Zmień wyszukiwanie lub filtr.');
  }
  function reset() {
    search.value = '';
    grade.value = '';
    apply();
  }
  function revealHash() {
    const card = cards.find(card => '#' + card.entry.id === location.hash);
    if (!card) return;
    if (card.article.hidden) reset();
    card.article.scrollIntoView();
    card.article.querySelector('h3').focus({ preventScroll: true });
  }
  async function load() {
    cards = [];
    main.replaceChildren();
    toc.replaceChildren();
    retry.hidden = true;
    status.textContent = 'Wczytywanie polskich porad…';
    try {
      if (location.protocol === 'file:') throw new Error('Użyj lokalnego serwera HTTP zgodnie z README.');
      const response = await fetch(CONTENT_PATH, { cache: 'no-cache', signal: AbortSignal.timeout(10000) });
      if (!response.ok) throw new Error('Nie można odczytać polskiego pliku Markdown.');
      const entries = published(parseChapter(await response.text()));
      if (!entries.length) throw new Error('Plik nie zawiera zweryfikowanych polskich porad.');
      for (const entry of entries) {
        const article = document.createElement('article');
        article.id = entry.id;
        const badge = document.createElement('span');
        badge.className = 'badge';
        badge.textContent = `Porada ${entry.number} · Dowody ${entry.fields['Ocena dowodów'][0]}`;
        const title = document.createElement('h3');
        title.tabIndex = -1;
        title.textContent = entry.title;
        article.setAttribute('aria-labelledby', entry.id + '-tytul');
        title.id = entry.id + '-tytul';
        const practical = document.createElement('p');
        practical.className = 'practical';
        inline(practical, entry.fields['W praktyce']);
        article.append(badge, title, practical);
        article.append(fieldsList(entry, ['Koszt', 'Korzyść i dowody', 'Ograniczenia', 'Ocena redakcyjna']));
        const details = document.createElement('details');
        const summary = document.createElement('summary');
        summary.textContent = 'Dowody, źródła i adaptacja';
        details.append(summary);
        details.append(fieldsList(entry, ['Ocena dowodów', 'Źródła', 'Oryginał', 'Weryfikacja', 'Zmiany w adaptacji']));
        article.append(details);
        const nav = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#' + entry.id;
        link.textContent = entry.number + '. ' + entry.title;
        nav.append(link);
        const haystack = fold([entry.number, entry.title, ...Object.values(entry.fields)].join('\n'));
        cards.push({ entry, article, nav, haystack });
      }
      main.append(...cards.map(card => card.article));
      toc.append(...cards.map(card => card.nav));
      apply();
      revealHash();
    } catch (error) {
      cards = [];
      main.replaceChildren();
      toc.replaceChildren();
      const message = error instanceof TypeError || ['AbortError', 'TimeoutError'].includes(error.name)
        ? 'Nie można połączyć się z lokalnym serwerem. Sprawdź jego działanie i spróbuj ponownie.'
        : error.message;
      status.textContent = 'Nie wczytano porad. ' + message;
      retry.hidden = false;
    }
  }
  search.addEventListener('input', apply);
  grade.addEventListener('change', apply);
  document.querySelector('form').addEventListener('submit', event => event.preventDefault());
  document.getElementById('reset').addEventListener('click', () => { reset(); search.focus(); });
  retry.addEventListener('click', load);
  window.addEventListener('hashchange', revealHash);
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#porada-"]');
    if (!link) return;
    const card = cards.find(card => '#' + card.entry.id === link.getAttribute('href'));
    if (card?.article.hidden) reset();
  });
  await load();
}

if (typeof document !== 'undefined') startReader();
