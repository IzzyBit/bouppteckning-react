import { clauseDefs } from '../config/options.js';
<<<<<<< HEAD
export const newPerson = () => ({ firstName: '', lastName: '', personnummer: '', gender: '', address: '', postalCode: '', city: '', country: 'Sverige' });
export const newHeir = () => ({ ...newPerson(), called: false, proof: false, presence: '', attachment: '', repFirst: '', repLast: '', repAddress: '', deceased: false, notEstateParty: false, reasons: [], types: [], relation: '' });
export const newOfficial = () => ({ firstName: '', lastName: '', title: '', address: '', postalCode: '', city: '' });
export const newAsset = () => ({ name: '', kind: 'Fast egendom', share: '', rate: 0, value: 0, type: 'giftorättsgods', attachment: '' });
export const newDebt = () => ({ name: '', kind: 'Inteckningslån/skuld', value: 0, interest: 0, type: 'giftorättsgods', attachment: '' });
export const newUndivided = () => ({ name: '', value: 0, deduction: 0 });
export const newClause = () => ({ enabled: true, text: '',insurancePolicies: [] });
export const newEstateCase = () => ({
  deceased: { ...newPerson(), deathDate: '', birthYear: '', domicile: '', citizenship: '', civilStatus: '', marriageDate: '', cohabitant: false, cohabClaim: '', multipleDeceased: false },
  partner: { ...newPerson(), heirTypes: [], deceased: false, deathDate: '', called: false, presence: '', attachment: '' },
  heirs: [],
  meeting: { location: '', date: '', caseNumber: '', declarant: '' },
  officials: [newOfficial(), newOfficial()],
  documents: { prev: false, prevName: '', prevDate: '', will: false, willNote: '', power: false, powerNote: '', prenup: false, prenupDate: '', prenupRegistered: '', custom: [] },
  standardClauses: [], customClauses: [],
  assets: [], debts: [], survivorAssets: [], survivorDebts: [], undivided: [],
  undividedAfter: '', undividedShare: '', assetsSeparatePrenup: false, assetsSeparateWill: false, debtsSeparatePrenup: false, debtsSeparateWill: false,
  expenses: [{name: 'Begravningskostnader', value: 0, type: 'giftorättsgods'}, {name: 'Avtal till gravsten', value: 0, type: 'giftorättsgods'}, {name: 'Bouppteckningskostnader', value: 0, type: 'giftorättsgods'}]
});
=======
export const newPerson = () => (
  {
    firstName: '',
    lastName: '',
    personnummer: '',
    gender: '',
    address: '',
    postalCode: '',
    city: '',
    country: 'Sverige'
  });
export const newHeir = () => (
  {
    ...newPerson(),
    called: false,
    proof: false,
    presence: '',
    attachment: '',
    repFirst: '',
    repLast: '',
    repAddress: '',
    deceased: false,
    notEstateParty: false,
    reasons: [],
    types: [],
    relation: ''
  });
export const newOfficial = () => (
  {
    firstName: '',
    lastName: '',
    title: '',
    address: '',
    postalCode: '',
    city: ''
  });
export const newAsset = () => (
  {
    name: '',
    kind: 'Fast egendom',
    share: '',
    rate: 0,
    value: 0,
    type: 'giftorättsgods',
    attachment: ''
  });
export const newDebt = () => (
  {
    name: '',
    kind: 'Inteckningslån/skuld',
    value: 0,
    interest: 0,
    type: 'giftorättsgods',
    attachment: ''
  });
export const newUndivided = () => (
  {
    name: '',
    value: 0,
    deduction: 0
  });
export const newClause = () => (
  {
    enabled: true,
    text: ''
  });
export const newEstateCase = () => (
  {
    deceased: {
      ...newPerson(),
      deathDate: '',
      birthYear: '',
      domicile: '',
      citizenship: '',
      civilStatus: '',
      marriageDate: '',
      cohabitant: false,
      cohabClaim: '',
      multipleDeceased: false
    },
    partner: {
      ...newPerson(),
      heirTypes: [],
      deceased: false,
      deathDate: '',
      called: false,
      presence: '',
      attachment: ''
    },
    heirs: [],
    meeting: {
      location: '',
      date: '',
      caseNumber: '',
      declarant: ''
    },
    officials: [newOfficial(), newOfficial()],
    documents: {
      prev: false,
      prevName: '',
      prevDate: '',
      will: false,
      willNote: '',
      power: false,
      powerNote: '',
      prenup: false,
      prenupDate: '',
      prenupRegistered: '',
      custom: []
    },
    standardClauses: [],
    customClauses: [],
    assets: [],
    debts: [],
    survivorAssets: [],
    survivorDebts: [],
    undivided: [],
    undividedAfter: '',
    undividedShare: '',
    assetsSeparatePrenup: false,
    assetsSeparateWill: false,
    debtsSeparatePrenup: false,
    debtsSeparateWill: false,
    expenses: [
      {
        name: 'Begravningskostnader',
        value: 0,
        type: 'giftorättsgods'
      }, {
        name: 'Avtal till gravsten',
        value: 0,
        type: 'giftorättsgods'
      }, {
        name: 'Bouppteckningskostnader',
        value: 0,
        type: 'giftorättsgods'
      }]
  });
>>>>>>> 7e794b9d2a2ddf3ad1a206a45ff016911fee9628
// Import both the modular format and drafts saved by the original single-file application.
export function normalizeCase(raw) {
  const defaults = newEstateCase();
  if (!raw || typeof raw !== 'object') return defaults;
  return {
    ...defaults, ...raw,
<<<<<<< HEAD
    deceased: { ...defaults.deceased, ...raw.deceased },
    partner: { ...defaults.partner, ...raw.partner, heirTypes: (raw.partner?.heirTypes ?? []).map(x => (x.match?.(/\(([DUETL])\)/) ?? [])[1] || x) },
    meeting: { ...defaults.meeting, ...raw.meeting },
    documents: { ...defaults.documents, ...raw.documents },
=======
    deceased: {
      ...defaults.deceased,
      ...raw.deceased
    },
    partner: {
      ...defaults.partner,
      ...raw.partner,
      heirTypes: (raw.partner?.heirTypes ?? []).map(x => (x.match?.(/\(([DUETL])\)/) ?? [])[1] || x)
    },
    meeting: {
      ...defaults.meeting,
      ...raw.meeting
    },
    documents: {
      ...defaults.documents,
      ...raw.documents
    },
>>>>>>> 7e794b9d2a2ddf3ad1a206a45ff016911fee9628
    standardClauses: raw.standardClauses ?? (raw.clauses ?? []).filter(c => clauseDefs.includes(c)),
    customClauses: raw.customClauses ?? (raw.clauses ?? []).filter(c => !clauseDefs.includes(c)).map(text => ({ enabled: true, text })),
    officials: Array.isArray(raw.officials) ? raw.officials : defaults.officials,
    expenses: Array.isArray(raw.expenses) ? raw.expenses : defaults.expenses
  };
}
export function documentCase(data) {
  return {
    ...data,
<<<<<<< HEAD
    clauses: [...(data.standardClauses ?? []), ...(data.customClauses ?? []).filter(x => x.enabled && x.text.trim()).map(x => x.text.trim())],
    partner: { ...data.partner, heirTypes: (data.partner.heirTypes ?? []).map(code => ({ D: 'Legal arvinge (D)', U: 'Universell testamentstagare (U)', E: 'Efterarvinge (E)', T: 'Testamentarisk efterarvinge (T)', L: 'Legatarie (L)' }[code] ?? code)) }
=======
    clauses: [
      ...(data.standardClauses ?? []),
      ...(data.customClauses ?? []).filter(x => x.enabled && x.text.trim()).map(x => x.text.trim())
    ],
    partner: {
      ...data.partner, heirTypes: (data.partner.heirTypes ?? []).map(code => (
        {
          D: 'Legal arvinge (D)',
          U: 'Universell testamentstagare (U)',
          E: 'Efterarvinge (E)',
          T: 'Testamentarisk efterarvinge (T)',
          L: 'Legatarie (L)'
        }[code] ?? code))
    }
>>>>>>> 7e794b9d2a2ddf3ad1a206a45ff016911fee9628
  };
}
