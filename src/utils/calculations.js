import { num } from './format.js';
import { hasSurvivingSpouse } from './relationships.js';

const PROPERTY_TYPES = [
  'giftorättsgods',
  'enskild eg. ä-förord',
  'enskild eg. gåva m.m.',
  'sambogemensam',
  'anges inte',
];

const SECURITY_KINDS = new Set([
  'Aktier, obligationer/värdepapper',
  'Fonder',
]);

export function isSecurity(kind) {
  return SECURITY_KINDS.has(kind);
}

// Single source of truth for asset values.
export function getAssetValue(asset) {
  if (isSecurity(asset.kind)) {
    return num(asset.share) * num(asset.rate);
  }

  return num(asset.value);
}

function propertyType(item) {
  return item?.type?.trim() || 'anges inte';
}

function sumRows(rows) {
  return rows.reduce(
    (total, row) => ({
      assets: total.assets + row.assets,
      debts: total.debts + row.debts,
      net: total.net + row.net,
    }),
    {
      assets: 0,
      debts: 0,
      net: 0,
    }
  );
}

export class EstateCalculator {
  constructor(data) {
    this.data = data;
  }

  assetTotal(items = []) {
    return items.reduce(
      (total, asset) => total + getAssetValue(asset),
      0
    );
  }

  debtTotal(items = []) {
    return items.reduce(
      (total, debt) =>
        total + num(debt.value) + num(debt.interest),
      0
    );
  }

  expenseTotal(items = []) {
    return items.reduce(
      (total, expense) => total + num(expense.value),
      0
    );
  }

  summary() {
    const data = this.data;
    const hasSpouse = hasSurvivingSpouse(data);

    const deceasedAssets = data.assets ?? [];
    const deceasedDebts = data.debts ?? [];
    const expenses = data.expenses ?? [];

    // Ignore stale survivor data if no surviving spouse exists.
    const survivorAssets = hasSpouse
      ? data.survivorAssets ?? []
      : [];

    const survivorDebts = hasSpouse
      ? data.survivorDebts ?? []
      : [];

    // Include every property type found in the case.
    const allItems = [
      ...deceasedAssets,
      ...deceasedDebts,
      ...expenses,
      ...survivorAssets,
      ...survivorDebts,
    ];

    const types = [
      ...new Set([
        ...PROPERTY_TYPES,
        ...allItems.map(propertyType),
      ]),
    ];

    // Calculate a single property category.
    const group = (
      assets = [],
      debts = [],
      expensesList = []
    ) => {
      return types.map((type) => {
        const filteredAssets = assets.filter(
          (item) => propertyType(item) === type
        );

        const filteredDebts = debts.filter(
          (item) => propertyType(item) === type
        );

        const filteredExpenses = expensesList.filter(
          (item) => propertyType(item) === type
        );

        const assetSum = this.assetTotal(filteredAssets);
        const debtSum =
          this.debtTotal(filteredDebts) +
          this.expenseTotal(filteredExpenses);

        return {
          type,
          assets: assetSum,
          debts: debtSum,
          net: assetSum - debtSum,
        };
      });
    };

    // Deceased person's finances.
    const deceased = group(
      deceasedAssets,
      deceasedDebts,
      expenses
    );

    // Survivor finances only when there is a spouse.
    const survivor = hasSpouse
      ? group(survivorAssets, survivorDebts)
      : [];

    // Previously undivided estate.
    // Currently included as an unclassified estate item.
    const undivided = data.undivided ?? [];

    if (undivided.length > 0) {
      const assets = undivided.reduce(
        (total, item) => total + num(item.value),
        0
      );

      const debts = undivided.reduce(
        (total, item) => total + num(item.deduction),
        0
      );

      deceased.push({
        type: 'Oskiftat bo (oklassificerat)',
        assets,
        debts,
        net: assets - debts,
      });
    }

    // Totals before matrimonial division.
    const deceasedTotal = sumRows(deceased);
    const survivorTotal = sumRows(survivor);

    const deceasedGift = deceased.find(
      (row) => row.type === 'giftorättsgods'
    )?.net ?? 0;

    const survivorGift = survivor.find(
      (row) => row.type === 'giftorättsgods'
    )?.net ?? 0;

    // Simplified matrimonial-property calculation.
    const joint = hasSpouse
      ? Math.max(0, deceasedGift) +
        Math.max(0, survivorGift)
      : 0;

    const deceasedShare = hasSpouse
      ? joint / 2
      : 0;

    const survivorShare = hasSpouse
      ? joint / 2
      : 0;

    // Deceased assets outside matrimonial property.
    const otherNet = deceasedTotal.net - deceasedGift;

    // Preliminary estate value.
    const distribute = hasSpouse
      ? deceasedShare + otherNet
      : deceasedTotal.net;

    return {
      deceased,
      survivor,
      deceasedTotal,
      survivorTotal,
      joint,
      deceasedShare,
      survivorShare,
      distribute,
      hasSpouse,
    };
  }
}
