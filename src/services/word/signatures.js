import { Paragraph, Table, TableRow, TextRun, WidthType } from 'docx';
import {
  pageBreak,
  statementRow,
  wblank,
  wcell,
  wp,
} from './components.js';
import { addressLine, fullName } from './people.js';
import { noBorders } from './styles.js';

export function getDeclarant(data) {
  return data.meeting.declarant?.trim() || '';
}

function signatureCell(official) {
  return wcell(
    new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({ text: '................................................................', size: 22 }),
        new TextRun({ text: fullName(official) || ' ', break: 1, size: 22 }),
        ...(official?.title
          ? [new TextRun({ text: official.title, break: 1, size: 22 })]
          : []),
        ...(official?.address
          ? [new TextRun({ text: official.address, break: 1, size: 22 })]
          : []),
        ...(addressLine(official)
          ? [new TextRun({ text: addressLine(official), break: 1, size: 22 })]
          : []),
      ],
    }),
    { width: 50 },
  );
}

export function createSignatureSection(data, declarant) {
  const children = [
    pageBreak(),
    wp('Härmed försäkras på heder och samvete', { after: 240 }),
    statementRow('att', 'mina uppgifter till bouppteckningen är riktiga,'),
    statementRow('att', 'inga uppgifter avsiktligt har utelämnats,'),
    wblank(420),
    wp('................................................................', { after: 15 }),
    wp(declarant, { after: 420 }),
    wp('Att allt blivit riktigt antecknat och tillgångarna efter bästa förstånd värderade,', {
      after: 0,
    }),
    wp('intygar undertecknade gode män.', { after: 340 }),
    wp(`${data.meeting.location || 'Förrättningsort'} dag som ovan`, { after: 360 }),
  ];

  const officials = data.officials.filter((official) =>
    fullName(official) || official.address || official.title,
  );

  for (let index = 0; index < Math.max(officials.length, 2); index += 2) {
    // Use the original table structure with explicit signature cells.
    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: noBorders,
        rows: [
          new TableRow({
            children: [
              signatureCell(officials[index] || {}),
              signatureCell(officials[index + 1] || {}),
            ],
          }),
        ],
      }),
      wblank(160),
    );
  }
  return children;
}
