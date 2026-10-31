// Editorial regression guards, not scientific or legal verification.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { CHAPTERS, parseChapter } from '../reader.mjs';

const records = CHAPTERS.flatMap(c => parseChapter(readFileSync(new URL('../' + c.path, import.meta.url), 'utf8'), c.id).entries);
const fields = number => {
  const entry = records.find(e => e.number === number);
  assert.ok(entry, number);
  return entry.fields;
};

test('payment advice keeps consumer scope, prompt reporting and conditional liability', () => {
  const f = fields('14.5');
  assert.equal(f.Status, 'verified');
  assert.match(f['Ocena dowodów'], /^C —/);
  assert.match(f['W praktyce'], /Nie każde oszustwo/);
  assert.match(f['W praktyce'], /Nie opóźniaj kontaktu/);
  assert.match(f['Korzyść i dowody'], /następnego dnia roboczego/);
  assert.match(f.Ograniczenia, /konsument/);
  assert.match(f.Ograniczenia, /13 miesięcy od obciążenia rachunku/);
  assert.match(f.Ograniczenia, /nieudostępnienia wymaganych informacji/);
  assert.match(f.Ograniczenia, /50 euro nie jest uniwersalnym/);
  assert.match(f.Ograniczenia, /pisemnego powiadomienia organów ścigania/);
  assert.match(f['Źródła'], /eli\.gov\.pl\/api\/acts\/DU\/2026\/623\/text\.pdf/);
});

test('GDPR and credentials retain the distinctions the legal review required', () => {
  assert.match(fields('14.7').Ograniczenia, /Nie wykluczamy, że jedno działanie może spełniać obie funkcje/);
  const rights = fields('14.8');
  assert.match(rights['W praktyce'], /nie musisz sporządzać uzasadnienia prawnego/);
  assert.match(rights['W praktyce'], /Prezesa UODO/);
  assert.match(rights['Korzyść i dowody'], /nie automatycznie 30 dni/);
  assert.match(fields('14.9')['Korzyść i dowody'], /art\. 6 oraz.*art\. 9/);
  assert.match(fields('14.9').Ograniczenia, /nie oznacza bezwarunkowego prawa/);
  const ai = fields('14.10');
  assert.match(ai['W praktyce'], /Klucz API nie jest kluczem dostępu typu passkey/);
  assert.match(ai['W praktyce'], /Zgoda na przetwarzanie danych nie upoważnia do ujawnienia haseł/);
  assert.match(fields('14.12')['Korzyść i dowody'], /może upłynąć tydzień/);
  assert.match(fields('14.12').Ograniczenia, /nie wszystkich usług/);
});

test('caffeine model estimates stay out of personal cutoff instructions', () => {
  const f = fields('03.4');
  assert.doesNotMatch(f['W praktyce'], /8,8|13,2/);
  assert.match(f['Korzyść i dowody'], /modelu statystycznego/);
  assert.match(f['Korzyść i dowody'], /18–65/);
  assert.match(f.Ograniczenia, /nie wyznaczają indywidualnej granicy bezpieczeństwa/);
  assert.match(f.Weryfikacja, /2\.5.*3\.3\.9/);
});
