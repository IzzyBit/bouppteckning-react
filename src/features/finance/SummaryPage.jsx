<<<<<<< HEAD

import { useMemo } from 'react';

import { useCase } from '../../context/CaseContext.jsx';
import { EstateCalculator } from '../../utils/calculations.js';
import { money } from '../../utils/format.js';

import {
  Page,
  Section,
  TableBox,
  Head,
  Th,
  Td,
} from '../../components/ui/Controls.jsx';

// Financial summary table
function SummaryTable({ title, rows, total }) {
  const columns = [
    'Egendom',
    'Tillgångar',
    'Skulder',
    'Behållning',
  ];

  return (
    <Section title={title}>
      <TableBox>
        <Head>
          {columns.map((column) => (
            <Th key={column}>
              {column}
            </Th>
          ))}
        </Head>

        <tbody>
          {rows.map((row) => (
            <tr key={row.type}>
              <Td>{row.type}</Td>
              <Td>{money(row.assets)}</Td>
              <Td>{money(row.debts)}</Td>
              <Td>{money(row.net)}</Td>
            </tr>
          ))}

          <tr className="bg-slate-50 font-semibold">
            <Td>Summa</Td>
            <Td>{money(total.assets)}</Td>
            <Td>{money(total.debts)}</Td>
            <Td>{money(total.net)}</Td>
          </tr>
        </tbody>
      </TableBox>
    </Section>
  );
}

// Reusable amount display
function AmountRow({ label, value, highlight = false }) {
  return (
    <div
      className={`flex items-center justify-between gap-6 py-2 text-sm ${
        highlight
          ? 'border-t border-slate-200 pt-4 font-bold'
          : ''
      }`}
    >
      <span>{label}</span>

      <span className="text-right tabular-nums">
        {money(value)}
      </span>
    </div>
  );
}

// Preliminary matrimonial division
function DivisionSummary({ summary }) {
  const rows = [
    {
      label: 'Förs ut till bodelning',
      value: summary.joint,
    },
    {
      label: 'Den avlidnes bodelningsandel (50 %)',
      value: summary.deceasedShare,
    },
    {
      label: 'Den efterlevandes bodelningsandel (50 %)',
      value: summary.survivorShare,
    },
    {
      label: 'Att fördela',
      value: summary.distribute,
      highlight: true,
    },
  ];

  return (
    <Section title="Avräkning av bodelningsandel">
      <div className="max-w-2xl rounded-lg border border-slate-200 bg-white p-5">
        {rows.map((row) => (
          <AmountRow
            key={row.label}
            label={row.label}
            value={row.value}
            highlight={row.highlight}
          />
        ))}
      </div>
    </Section>
  );
}

// Estate balance without a surviving spouse
function EstateBalance({ summary }) {
  return (
    <Section title="Boets behållning">
      <div className="max-w-2xl rounded-lg border border-slate-200 bg-white p-5">
        <AmountRow
          label="Summa tillgångar"
          value={summary.deceasedTotal.assets}
        />

        <AmountRow
          label="Summa skulder och avgående poster"
          value={summary.deceasedTotal.debts}
        />

        <AmountRow
          label="Preliminär behållning"
          value={summary.distribute}
          highlight
        />
      </div>
    </Section>
  );
}

// Main page
export default function SummaryPage() {
  const { data } = useCase();

  const summary = useMemo(
    () => new EstateCalculator(data).summary(),
    [data]
  );

  const hasSpouse = summary.hasSpouse;

  return (
    <Page
      title="Sammanställning bobehållning"
      description="Beräknade värden utifrån registrerade tillgångar och skulder."
    >
      {/* Financial overview */}
      <div
        className={`grid gap-6 ${
          hasSpouse ? 'xl:grid-cols-2' : 'grid-cols-1'
        }`}
      >
        <SummaryTable
          title="Den avlidne"
          rows={summary.deceased}
          total={summary.deceasedTotal}
        />

        {hasSpouse && (
          <SummaryTable
            title="Den efterlevande"
            rows={summary.survivor}
            total={summary.survivorTotal}
          />
        )}
      </div>

      {/* Division or estate balance */}
      {hasSpouse ? (
        <DivisionSummary summary={summary} />
      ) : (
        <EstateBalance summary={summary} />
      )}

      {/* Disclaimer */}
      <p className="text-xs text-slate-500">
        Beräkningarna är preliminära och bygger på
        registrerade tillgångar, skulder och egendomstyper.
        De ska granskas innan juridisk användning.
      </p>
    </Page>
  );
=======
import { useMemo } from 'react';
import { useCase } from '../../context/CaseContext.jsx';
import { EstateCalculator } from '../../utils/calculations.js';
import { money } from '../../utils/format.js';
import { Page, Section, TableBox, Head, Th, Td } from '../../components/ui/Controls.jsx';
function SummaryTable({ title, rows, total }) {
    return <Section title={title}>
        <TableBox>
            <Head>{['Egendom', 'Tillgångar', 'Skulder', 'Behållning'].map(c => <Th key={c}>{c}</Th>)}</Head>
            <tbody>{rows.map(r => <tr key={r.type}>
                <Td>{r.type}</Td>
                <Td>{money(r.assets)}</Td>
                <Td>{money(r.debts)}</Td>
                <Td>{money(r.net)}</Td>
            </tr>)}
                <tr className="bg-slate-50 font-semibold">
                    <Td>Summa</Td>
                    <Td>{money(total.assets)}</Td>
                    <Td>{money(total.debts)}</Td>
                    <Td>{money(total.net)}</Td>
                </tr>
            </tbody>
        </TableBox>
    </Section>;
}
export default function SummaryPage() {
    const { data } = useCase(); const s = useMemo(() => new EstateCalculator(data).summary(), [data]);
    return <Page title="Sammanställning bobehållning" description="Beräknade värden utifrån registrerade tillgångar och skulder.">
        <div className="grid gap-6 xl:grid-cols-2">
            <SummaryTable title="Den avlidne" rows={s.deceased} total={s.deceasedTotal} />
            <SummaryTable title="Den efterlevande" rows={s.survivor} total={s.survivorTotal} />
        </div>
        <Section title="Avräkning av bodelningsandel">
            <div className="max-w-2xl space-y-2 rounded-lg border border-slate-200 bg-white p-5">{
                [
                    ['Förs ut till bodelning', s.joint],
                    ['Den avlidnes bodelningsandel (50 %)', s.deceasedShare],
                    ['Den efterlevandes bodelningsandel (50 %)', s.survivorShare],
                    ['Att fördela', s.distribute]
                ].map(([label, value], i) =>
                    <div key={label} className={`flex items-center justify-between gap-6 py-1 text-sm ${i === 3 ? 'border-t border-slate-200 pt-4 font-bold' : ''}`}>
                        <span>{label}</span>
                        <span className="tabular-nums">{money(value)}</span>
                    </div>)}
            </div>
        </Section>
        <p className="text-xs text-slate-500">Beräkningarna följer logiken i det ursprungliga formuläret och ska granskas innan juridisk användning.</p>
    </Page>;
>>>>>>> 7e794b9d2a2ddf3ad1a206a45ff016911fee9628
}
