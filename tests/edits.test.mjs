import test from 'node:test';
import assert from 'node:assert/strict';
import { checkEdits, protectedChanges } from '../tools/pl/edits.mjs';

const changed = (a, b) => protectedChanges(a, b);

test('wording that carries meaning in evidence-based text cannot change silently', () => {
  assert.deepEqual(changed('Trwa 30 minut.', 'Trwa 40 minut.'), ['numbers']);
  assert.deepEqual(changed('Kody SMS można wyłudzić.', 'Kody SMS zawsze można wyłudzić.'), ['stems']);
  assert.deepEqual(changed('Nie używaj tego hasła.', 'Używaj tego hasła.'), ['stems']);
  assert.deepEqual(changed('Może pomóc.', 'Pomaga.'), ['stems']);
  assert.deepEqual(changed('To pomaga zdrowym dorosłym.', 'To pomaga każdemu.'), ['stems']);
  assert.deepEqual(changed('Według CERT Polska.', 'Zgodnie z CERT Polska.'), ['stems']);
  assert.deepEqual(changed('Zmień hasło [teraz](#porada-14-1).', 'Zmień hasło [teraz](#porada-14-2).'), ['links']);
  assert.deepEqual(changed('Wynik 30,7 i nie więcej.', 'Wynik 31 i więcej.'), ['numbers', 'stems']);
  assert.deepEqual(changed('To trwa 3 lata.', 'To trwa 3 rok.'), ['stems']);
});

test('wording that carries nothing protected may change freely', () => {
  assert.deepEqual(changed('Zrób to rano.', 'Wykonaj to rano.'), []);
  assert.deepEqual(changed('Zabezpiecz dostęp do menedżera.', 'Zabezpiecz menedżer.'), []);
  assert.deepEqual(changed('To jest łatwe.', 'To jest proste.'), [], 'łatwe is not the unit "lat"');
  assert.deepEqual(changed('Trwa 30 minut.', 'Trwa 30 minut.'), []);
  assert.deepEqual(changed('Zob. [14.1](#porada-14-1).', 'Zob. [14.1](#porada-14-1).'), []);
});

const packet = { item: '14.2', title: 'Używaj osobnego hasła', fields: { 'W praktyce': 'Wygeneruj długie hasła. Nie powtarzaj ich.' } };
const report = (edits, item = '14.2') => ({ item, edits });

test('an edit that changes protected wording must say so, whatever the editor believes', () => {
  const honest = checkEdits(report([{ field: 'W praktyce', original: 'Nie powtarzaj ich.', replacement: 'Powtarzaj je.', requires_reverification: true }]), packet);
  assert.equal(honest.ok, true);
  assert.deepEqual(honest.forced, [{ edit: 1, changed: ['stems'] }]);
  const silent = checkEdits(report([{ field: 'W praktyce', original: 'Nie powtarzaj ich.', replacement: 'Powtarzaj je.', requires_reverification: false }]), packet);
  assert.equal(silent.ok, false);
  assert.match(silent.failures[0], /not marked requires_reverification/);
  assert.equal(checkEdits(report([{ field: 'W praktyce', original: 'Wygeneruj długie hasła.', replacement: 'Utwórz długie hasła.', requires_reverification: false }]), packet).ok, true);
});

test('an edit for the wrong item, an unknown field or text that is not there is rejected', () => {
  assert.equal(checkEdits(report([], '14.3'), packet).ok, false);
  assert.match(checkEdits(report([{ field: 'Koszt', original: 'x', replacement: 'y' }]), packet).failures[0], /unknown field/);
  assert.match(checkEdits(report([{ field: 'W praktyce', original: 'Tego tu nie ma.', replacement: 'y' }]), packet).failures[0], /not in that field/);
  assert.equal(checkEdits(null, packet).ok, false);
  assert.equal(checkEdits(report([{ field: 'title', original: 'Używaj osobnego hasła', replacement: 'Używaj osobnych haseł', requires_reverification: false }]), packet).ok, true);
  assert.equal(checkEdits({ item: '14.2' }, packet).ok, true, 'no edits is a valid answer');
});
