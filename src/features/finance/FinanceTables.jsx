<<<<<<< HEAD

import { useCase } from '../../context/CaseContext.jsx';

import {
  newAsset,
  newDebt,
  newUndivided,
} from '../../models/case.js';

import {
  assetKinds,
  debtKinds,
  propertyTypes,
} from '../../config/options.js';

import { num, money } from '../../utils/format.js';

import {
  isSecurity,
  getAssetValue,
} from '../../utils/calculations.js';

import {
  hasSurvivingSpouse,
} from '../../utils/relationships.js';

import {
  Button,
  TableBox,
  Head,
  Th,
  Td,
  CellInput,
} from '../../components/ui/Controls.jsx';

const assetFields = [
  { key: 'name', title: 'Beteckning' },
  { key: 'kind', title: 'Egendom', options: assetKinds },
  { key: 'share', title: 'Andel' },
  { key: 'rate', title: 'Kurs', number: true },
  { key: 'value', title: 'Värde', number: true },
  { key: 'type', title: 'Typ', options: propertyTypes },
];

const debtFields = [
  { key: 'name', title: 'Benämning' },
  { key: 'kind', title: 'Skuld', options: debtKinds },
  { key: 'value', title: 'Belopp', number: true },
  { key: 'interest', title: 'Ber. ränta', number: true },
  { key: 'type', title: 'Typ/rubrik', options: propertyTypes },
];

export function FinanceTable({
  kind,
  path,
  title,
  includeAttachment = false,
}) {
  const { data, set, append, remove } = useCase();

  const isAsset = kind === 'asset';
  const isSurvivorList = [
    'survivorAssets',
    'survivorDebts',
  ].includes(path);

  const arr = data[path] ?? [];

  const fields = [
    ...(isAsset ? assetFields : debtFields),
    ...(includeAttachment
      ? [{ key: 'attachment', title: 'Bilaga' }]
      : []),
  ];

  function updateField(item, index, field, value) {
    const updated = {
      ...item,
      [field.key]: value,
    };

    // Recalculate securities when kind, share or rate changes.
    if (
      isAsset &&
      isSecurity(updated.kind) &&
      ['kind', 'share', 'rate'].includes(field.key)
    ) {
      updated.value = getAssetValue(updated);
    }

    set([path, index], updated);
  }

  function renderCell(item, index, field) {
    const security = isAsset && isSecurity(item.kind);

    const calculatedValue =
      security && field.key === 'value';

    const disabledRate =
      isAsset &&
      field.key === 'rate' &&
      !security;

    const value = calculatedValue
      ? getAssetValue(item)
      : item[field.key] ?? '';

    const inputType = field.key === 'share'
      ? security ? 'number' : 'text'
      : field.number ? 'number' : 'text';

    return (
      <Td key={field.key}>
        <CellInput
          value={value}
          type={inputType}
          options={field.options}
          disabled={calculatedValue || disabledRate}
          step={inputType === 'number' ? 'any' : undefined}
          onChange={(newValue) =>
            updateField(item, index, field, newValue)
          }
        />
      </Td>
    );
  }

  // Do not display spouse-specific finances without a spouse.
  if (
    isSurvivorList &&
    !hasSurvivingSpouse(data)
  ) {
    return null;
  }

  return (
    <div className="space-y-3">
      {title && (
        <h3 className="font-semibold">
          {title}
        </h3>
      )}

      <TableBox>
        <Head>
          {fields.map((field) => (
            <Th key={field.key}>
              {field.title}
            </Th>
          ))}
          <Th />
        </Head>

        <tbody>
          {arr.length > 0 ? (
            arr.map((item, index) => (
              <tr key={index}>
                {fields.map((field) =>
                  renderCell(item, index, field)
                )}

                <Td>
                  <Button
                    variant="danger"
                    onClick={() => remove(path, index)}
                  >
                    ×
                  </Button>
                </Td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={fields.length + 1}
                className="p-7 text-center text-slate-500"
              >
                Inga {isAsset ? 'tillgångar' : 'skulder'} registrerade.
              </td>
            </tr>
          )}
        </tbody>
      </TableBox>

      <Button
        onClick={() =>
          append(
            path,
            isAsset ? newAsset() : newDebt()
          )
        }
      >
        + Lägg till {isAsset ? 'tillgång' : 'skuld'}
      </Button>
    </div>
  );
}

export function UndividedTable() {
  const { data, set, append, remove } = useCase();

  const rows = data.undivided ?? [];

  return (
    <div className="space-y-3">
      <TableBox>
        <Head>
          {['Benämning', 'Belopp', 'Avgår', ''].map((title) => (
            <Th key={title}>{title}</Th>
          ))}
        </Head>

        <tbody>
          {rows.length > 0 ? (
            rows.map((row, index) => (
              <tr key={index}>
                {['name', 'value', 'deduction'].map((key) => (
                  <Td key={key}>
                    <CellInput
                      type={key === 'name' ? 'text' : 'number'}
                      value={row[key]}
                      onChange={(value) =>
                        set(['undivided', index, key], value)
                      }
                    />
                  </Td>
                ))}

                <Td>
                  <Button
                    variant="danger"
                    onClick={() => remove('undivided', index)}
                  >
                    ×
                  </Button>
                </Td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={4}
                className="p-6 text-center text-slate-500"
              >
                Inga poster registrerade.
              </td>
            </tr>
          )}
        </tbody>
      </TableBox>

      <Button
        onClick={() =>
          append('undivided', newUndivided())
        }
      >
        + Lägg till post
      </Button>
    </div>
  );
}

export function ExpenseTable() {
  const { data, set } = useCase();

  const expenses = data.expenses ?? [];

  return (
    <TableBox>
      <Head>
        {['Benämning', 'Belopp', 'Typ'].map((title) => (
          <Th key={title}>{title}</Th>
        ))}
      </Head>

      <tbody>
        {expenses.map((expense, index) => (
          <tr key={index}>
            <Td>{expense.name}</Td>

            <Td>
              <CellInput
                type="number"
                value={expense.value}
                onChange={(value) =>
                  set(['expenses', index, 'value'], value)
                }
              />
            </Td>

            <Td>
              <CellInput
                options={propertyTypes}
                value={expense.type}
                onChange={(value) =>
                  set(['expenses', index, 'type'], value)
                }
              />
            </Td>
          </tr>
        ))}
      </tbody>
    </TableBox>
  );
}

export function TotalStrip({
  label = 'Summa',
  value,
}) {
  return (
    <div className="flex justify-end gap-3 text-sm font-semibold">
      <span>{label}</span>

      <span className="min-w-32 rounded bg-slate-100 px-3 py-1 text-right tabular-nums">
        {money(value)}
      </span>
    </div>
  );
=======
import { useCase } from '../../context/CaseContext.jsx';
import { newAsset, newDebt, newUndivided } from '../../models/case.js';
import { assetKinds, debtKinds, propertyTypes } from '../../config/options.js';
import { num, money } from '../../utils/format.js';
import { Button, TableBox, Head, Th, Td, CellInput } from '../../components/ui/Controls.jsx';
export function FinanceTable({ kind, path, title, includeAttachment = false }) {
    const { data, set, append, remove } = useCase();
    const arr = data[path] ?? [];
    const isAsset = kind === 'asset';
    const fields = isAsset ? [
        { 
            key: 'name', 
            title: 'Beteckning' 
        }, { 
            key: 'kind', 
            title: 'Egendom', 
            options: assetKinds 
        },
        { 
            key: 'share', 
            title: 'Andel' 
        }, { 
            key: 'rate', 
            title: 'Kurs', 
            number: true 
        }, { 
            key: 'value', 
            title: 'Värde', 
            number: true 
        },
        { 
            key: 'type', 
            title: 'Typ', 
            options: propertyTypes 
        }] : [
        {
            key: 'name', 
            title: 'Benämning' 
        }, { 
            key: 'kind', 
            title: 'Skuld', 
            options: debtKinds 
        }, { 
            key: 'value', 
            title: 'Belopp', 
            number: true 
        },
        { 
            key: 'interest', 
            title: 'Ber. ränta', 
            number: true 
        }, { 
            key: 'type', 
            title: 'Typ/rubrik', 
            options: propertyTypes 
        }];
    if (includeAttachment) fields.push({ key: 'attachment', title: 'Bilaga' });
    return <div className="space-y-3">{title && <h3 className="font-semibold">{title}</h3>}
        <TableBox>
            <Head>{fields.map(f => <Th key={f.key}>{f.title}</Th>)}
                <Th />
            </Head>
            <tbody>{arr.length ? arr.map((x, i) => <tr key={i}>{fields.map(f => <Td key={f.key}>
                <CellInput value={x[f.key]} type={f.number ? 'number' : 'text'} options={f.options} onChange={v => set([path, i, f.key], f.number ? num(v) : v)} /></Td>)}<Td>
                    <Button variant="danger" onClick={() => remove(path, i)}>×</Button>
                </Td></tr>) : <tr>
                <td colSpan={fields.length + 1} className="p-7 text-center text-slate-500">Inga {isAsset ? 'tillgångar' : 'skulder'} registrerade.</td>
            </tr>}</tbody>
        </TableBox>
        <Button onClick={() => append(path, isAsset ? newAsset() : newDebt())}>+ Lägg till {isAsset ? 'tillgång' : 'skuld'}</Button>
    </div>;
}
export function UndividedTable() {
    const { data, set, append, remove } = useCase();
    return <div className="space-y-3"><TableBox>
        <Head>{['Benämning', 'Belopp', 'Avgår', ''].map(s => <Th key={s}>{s}</Th>)}</Head>
        <tbody>{data.undivided.length ? data.undivided.map((row, i) => <tr key={i}>{['name', 'value', 'deduction'].map(key => <Td key={key}>
            <CellInput type={key === 'name' ? 'text' : 'number'} value={row[key]} onChange={v => set(['undivided', i, key], key === 'name' ? v : num(v))} /></Td>)}<Td>
                <Button variant="danger" onClick={() => remove('undivided', i)}>×</Button>
            </Td></tr>) : <tr><td colSpan="4" className="p-6 text-center text-slate-500">Inga poster registrerade.</td></tr>}
        </tbody>
    </TableBox>
        <Button onClick={() => append('undivided', newUndivided())}>+ Lägg till post</Button>
    </div>;
}
export function ExpenseTable() {
    const { data, set } = useCase();
    return <TableBox>
        <Head>{['Benämning', 'Belopp', 'Typ'].map(s => <Th key={s}>{s}</Th>)}</Head>
        <tbody>{data.expenses.map((e, i) => <tr key={i}><Td>{e.name}</Td>
            <Td>
                <CellInput type="number" value={e.value} onChange={v => set(['expenses', i, 'value'], num(v))} />
            </Td>
            <Td>
                <CellInput options={propertyTypes} value={e.type} onChange={v => set(['expenses', i, 'type'], v)} />
            </Td></tr>)}
        </tbody>
    </TableBox>;
}
export function TotalStrip({ label = 'Summa', value }) {
    return <div className="flex justify-end gap-3 text-sm font-semibold">
        <span>{label}</span>
        <span className="min-w-32 rounded bg-slate-100 px-3 py-1 text-right tabular-nums">{money(value)}</span>
    </div>
>>>>>>> 7e794b9d2a2ddf3ad1a206a45ff016911fee9628
}
