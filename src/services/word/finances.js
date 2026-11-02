import {
  AlignmentType,
  Paragraph,
  Table,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';
import { num } from '../../utils/format.js';
import {
  amountRow,
  borderlessTable,
  docMoney,
  pageBreak,
  wblank,
  wcell,
  wh2,
  wh3,
  wp,
} from './components.js';
import { fullName } from './people.js';
import { noBorders } from './styles.js';

const assetKindOrder = [
  'Fast egendom',
  'Bostadsrätt',
  'Konto',
  'Aktier, obligationer/värdepapper',
  'Fonder',
  'Lösöre',
  'Försäkringar',
  'Övrigt',
];

const assetKindHeading = {
  'Fast egendom': 'Fast egendom',
  Bostadsrätt: 'Bostadsrätt',
  Konto: 'Konton',
  'Aktier, obligationer/värdepapper': 'Aktier, obligationer, värdepapper',
  Fonder: 'Fonder',
  Lösöre: 'Lösöre',
  Försäkringar: 'Försäkringar som ingår i boets behållning',
  Övrigt: 'Övriga tillgångar',
};

const propertyHeading = {
  giftorättsgods: 'Giftorättsgods',
  'enskild eg. ä-förord': 'Enskild egendom enligt äktenskapsförord',
  'enskild eg. gåva m.m.': 'Enskild egendom enligt gåva/testamente',
  sambogemensam: 'Samboegendom',
  'anges inte': 'Övriga tillgångar',
};

const propertyTypeOrder = [
  'giftorättsgods',
  'enskild eg. ä-förord',
  'enskild eg. gåva m.m.',
  'sambogemensam',
  'anges inte',
];

function isSecurity(kind) {
  return kind === 'Aktier, obligationer/värdepapper' || kind === 'Fonder';
}

export function getAssetValue(asset) {
  if (isSecurity(asset.kind)) {
    return num(asset.share) * num(asset.rate);
  }

  return num(asset.value);
}

function securityHeader() {
  return borderlessTable([[
    new Paragraph({ children: [new TextRun({ text: 'Benämning', bold: true, size: 22 })] }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: 'Antal', bold: true, size: 22 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: 'Kurs', bold: true, size: 22 })],
    }),
    '',
  ]], [55, 13, 14, 18]);
}

function securityRow(asset) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: noBorders,
    rows: [
      new TableRow({
        children: [
          wcell(asset.name, { width: 55 }),
          wcell(asset.share || '', { width: 13, align: AlignmentType.CENTER }),
          wcell(asset.rate ? docMoney(asset.rate) : '', {
            width: 14,
            align: AlignmentType.CENTER,
          }),
          wcell(new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ 
              text: docMoney(getAssetValue(asset)), 
              size: 22 
            })],
          }), { width: 18 }),
        ],
      }),
    ],
  });
}

export function assetsDocument(ownerTitle, list) {
  const children = [wh2(ownerTitle)];
  if (!list.length) {
    children.push(wp('Inga tillgångar registrerade.'));
    return children;
  }

  for (const type of propertyTypeOrder) {
    const subset = list.filter((asset) => asset.type === type);
    if (!subset.length) continue;

    children.push(wh2(propertyHeading[type] || type));
    for (const kind of assetKindOrder) {
      const rows = subset.filter((asset) => asset.kind === kind);
      if (!rows.length) continue;

      children.push(wh3(assetKindHeading[kind] || kind));
      if (isSecurity(kind)) children.push(securityHeader());

      for (const asset of rows) {
        children.push(isSecurity(kind)
          ? securityRow(asset)
          : amountRow(asset.name || assetKindHeading[kind] || kind, asset.value));
      }
    }

    const sum = subset.reduce((total, asset) => total + getAssetValue(asset),0);
    children.push(wblank(20));
    children.push(amountRow(
      `Summa ${propertyHeading[type]?.toLowerCase() || type}`,
      sum,
      { bold: true },
    ));
  }
  return children;
}

function debtHeading(kind) {
  return kind === 'Inteckningslån/skuld'
    ? 'Intecknings- och andra låneskulder'
    : 'Övriga skulder';
}

export function debtsDocument(ownerTitle, list, expenses = [], includeExpenses = false) {
  const children = [wh2(ownerTitle)];
  if (!list.length && !includeExpenses) {
    children.push(wp('Inga skulder registrerade.'));
    return children;
  }

  for (const kind of ['Inteckningslån/skuld', 'Personlig skuld', 'Övrig skuld']) {
    const rows = list.filter((debt) => debt.kind === kind);
    if (!rows.length) continue;

    children.push(wh3(debtHeading(kind)));
    for (const debt of rows) {
      children.push(amountRow(debt.name || debtHeading(kind), debt.value));
      if (num(debt.interest)) {
        children.push(amountRow('beräknad ränta', debt.interest, { indent: true }));
      }
    }
  }

  if (includeExpenses) {
    const positiveExpenses = expenses.filter((expense) => num(expense.value) > 0);
    if (positiveExpenses.length) {
      children.push(wh3('Avgående poster'));
      for (const expense of positiveExpenses) {
        children.push(amountRow(expense.name, expense.value));
      }
    }
  }

  // Match the original calculation: all expenses count in the total,
  // although only positive expense rows are shown above.
  const total = list.reduce(
    (sum, debt) => sum + num(debt.value) + num(debt.interest),
    0,
  ) + (includeExpenses
    ? expenses.reduce((sum, expense) => sum + num(expense.value), 0)
    : 0);

  children.push(wblank(30));
  children.push(amountRow('Summa skulder', total, { bold: true }));
  return children;
}

// Pure financial calculation. It deliberately preserves the original
// giftorättsgods summary logic, without adding any inheritance distribution.
export function calculateSummary(data) {
  const sumAssets = (items) => items
    .filter((item) => item.type === 'giftorättsgods')
    .reduce((sum, item) => sum + getAssetValue(item), 0);

  const sumDebts = (items) => items
    .filter((item) => item.type === 'giftorättsgods')
    .reduce((sum, item) => sum + num(item.value) + num(item.interest), 0);

  const deceasedAssets = sumAssets(data.assets);
  const deceasedDebts = sumDebts(data.debts)
    + data.expenses
      .filter((expense) => expense.type === 'giftorättsgods')
      .reduce((sum, expense) => sum + num(expense.value), 0);
  const survivorAssets = sumAssets(data.survivorAssets);
  const survivorDebts = sumDebts(data.survivorDebts);
  const deceasedNet = deceasedAssets - deceasedDebts;
  const survivorNet = survivorAssets - survivorDebts;
  const jointNet = Math.max(0, deceasedNet) + Math.max(0, survivorNet);

  return {
    deceasedAssets,
    deceasedDebts,
    deceasedNet,
    survivorAssets,
    survivorDebts,
    survivorNet,
    jointNet,
  };
}

export function summaryDocument(data) {
  const amounts = calculateSummary(data);
  return [
    wh2('Sammanställning'),
    amountRow('Den avlidnas giftorättsgods', amounts.deceasedAssets),
    amountRow('Den avlidnas giftorättsskuld', -amounts.deceasedDebts),
    amountRow('Den avlidnas behållning', amounts.deceasedNet, { bold: true }),
    wblank(60),
    amountRow('Den efterlevande makans/makens giftorättsgods', amounts.survivorAssets),
    amountRow('Den efterlevande makans/makens giftorättsskuld', -amounts.survivorDebts),
    amountRow('Den efterlevandes behållning', amounts.survivorNet, { bold: true }),
    wblank(60),
    amountRow('Boets summa behållning', amounts.jointNet, { bold: true }),
  ];
}

export function createFinancialSections(data) {
  const children = [
    pageBreak(),
    ...assetsDocument('Den avlidnas tillgångar', data.assets),
    pageBreak(),
    ...debtsDocument('Den avlidnas skulder', data.debts, data.expenses, true),
  ];

  const hasSurvivor = !!fullName(data.partner)
    || data.survivorAssets.length > 0
    || data.survivorDebts.length > 0;

  if (hasSurvivor) {
    children.push(
      pageBreak(),
      ...assetsDocument('Den efterlevande makans/makens tillgångar', data.survivorAssets),
      pageBreak(),
      ...debtsDocument('Den efterlevande makans/makens skulder', data.survivorDebts),
      wblank(140),
      ...summaryDocument(data),
    );
  } else {
    children.push(pageBreak(), ...summaryDocument(data));
  }

  return children;
}
