import test from 'node:test';
import assert from 'node:assert/strict';
import { newEstateCase, normalizeCase, documentCase } from '../src/models/case.js';
import { EstateCalculator } from '../src/utils/calculations.js';

test('new estate case has two officials and expense categories', () => {
  const d = newEstateCase();
  assert.equal(d.officials.length, 2);
  assert.equal(d.expenses.length, 3);
});

test('load old session draft and restore clauses plus partner heir codes', () => {
  const d = normalizeCase({
    deceased: {firstName:'Anna'}, partner:{heirTypes:['Legal arvinge (D)']},
    clauses:['testamente föreligger','en egen att-sats']
  });
  assert.equal(d.deceased.country,'Sverige');
  assert.deepEqual(d.partner.heirTypes,['D']);
  assert.deepEqual(d.standardClauses,['testamente föreligger']);
  assert.equal(d.customClauses[0].text,'en egen att-sats');
  assert.equal(documentCase(d).clauses.length,2);
});

test('summary matches original giftorättsgods split', () => {
  const d=newEstateCase();
  d.assets=[{type:'giftorättsgods',value:10000},{type:'enskild eg. ä-förord',value:2000}];
  d.debts=[{type:'giftorättsgods',value:1000,interest:100}];
  d.survivorAssets=[{type:'giftorättsgods',value:4000}];
  d.expenses[0].value=900;
  const s=new EstateCalculator(d).summary();
  assert.equal(s.deceased[0].net,8000);
  assert.equal(s.joint,12000);
  assert.equal(s.deceasedShare,6000);
  assert.equal(s.distribute,8000);
});
