import {
  AlignmentType,
  PageBreak,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';
import { noBorders } from './styles.js';

export const docMoney = (value) =>
  (Number(value) || 0).toLocaleString('sv-SE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export function wp(text = '', opts = {}) {
  return new Paragraph({
    alignment: opts.alignment,
    spacing: {
      before: opts.before ?? 0,
      after: opts.after ?? 90,
      line: opts.line ?? 276,
    },
    keepNext: !!opts.keepNext,
    children: [
      new TextRun({
        text: String(text ?? ''),
        bold: !!opts.bold,
        size: opts.size ?? 22,
      }),
    ],
  });
}

export const wtitle = (text) =>
  wp(text, { bold: true, size: 52, after: 560, keepNext: true });
export const wh2 = (text) =>
  wp(text, { bold: true, size: 32, before: 300, after: 180, keepNext: true });
export const wh3 = (text) =>
  wp(text, { bold: true, size: 24, before: 230, after: 120, keepNext: true });
export const wh4 = (text) =>
  wp(text, { bold: true, size: 22, before: 140, after: 80, keepNext: true });

export function wblank(height = 100) {
  return new Paragraph({
    spacing: { after: height },
    children: [new TextRun('')],
  });
}

export function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

export function wcell(
  content,
  { bold = false, width = 50, align, after = 40, size = 22 } = {},
) {
  const paragraph = content instanceof Paragraph
    ? content
    : new Paragraph({
        alignment: align,
        spacing: { after },
        children: [
          new TextRun({ text: String(content ?? ''), bold, size }),
        ],
      });

  return new TableCell({
    width: { size: width, type: WidthType.PERCENTAGE },
    borders: noBorders,
    margins: { top: 0, bottom: 0, left: 0, right: 70 },
    children: [paragraph],
  });
}

export function borderlessTable(rows, widths = [50, 50]) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: noBorders,
    rows: rows.map(
      (row) =>
        new TableRow({
          children: row.map((value, index) =>
            wcell(value, {
              width: widths[index] ?? 100 / rows[0].length,
            }),
          ),
        }),
    ),
  });
}

export function labelValueTable(rows) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: noBorders,
    rows: rows.map(
      ([label, value]) =>
        new TableRow({
          children: [
            wcell(label, { width: 37 }),
            wcell(
              new Paragraph({
                spacing: { after: 30 },
                children: [
                  new TextRun({ text: String(value || ''), bold: true, size: 22 }),
                ],
              }),
              { width: 63 },
            ),
          ],
        }),
    ),
  });
}

export function amountRow(label, value, { bold = false, indent = false } = {}) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: noBorders,
    rows: [
      new TableRow({
        children: [
          wcell(
            new Paragraph({
              indent: indent ? { left: 240 } : undefined,
              spacing: { after: 35 },
              children: [
                new TextRun({ text: String(label || ''), bold, size: 22 }),
              ],
            }),
            { width: 78 },
          ),
          wcell(
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              spacing: { after: 35 },
              children: [new TextRun({ text: docMoney(value), bold, size: 22 })],
            }),
            { width: 22 },
          ),
        ],
      }),
    ],
  });
}

export function statementRow(prefix, text) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: noBorders,
    rows: [
      new TableRow({
        children: [
          wcell(prefix, { bold: true, width: 8 }),
          wcell(text, { width: 92 }),
        ],
      }),
    ],
  });
}
