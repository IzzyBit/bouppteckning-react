import {
  AlignmentType,
  BorderStyle,
  Footer,
  PageNumber,
  Paragraph,
  TextRun,
} from 'docx';

export const noBorders = {
  top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  insideHorizontal: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  insideVertical: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
};

export const documentStyles = {
  default: {
    document: {
      run: { font: 'Calibri', size: 22 },
      paragraph: { spacing: { after: 80, line: 276 } },
    },
  },
};

export const pageSettings = {
  page: {
    margin: { top: 1700, right: 1700, bottom: 1700, left: 1700 },
  },
};

export function createFooter() {
  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({
            children: [PageNumber.CURRENT, '(', PageNumber.TOTAL_PAGES, ')'],
            size: 20,
          }),
        ],
      }),
    ],
  });
}
