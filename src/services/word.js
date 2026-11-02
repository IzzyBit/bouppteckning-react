import { Document, Packer } from 'docx';
import { documentCase } from '../models/case.js';
import { createDocumentSections } from './word/documents.js';
import { createFinancialSections } from './word/finances.js';
import { createCoverSection, createHeirSections } from './word/people.js';
import { createSignatureSection, getDeclarant } from './word/signatures.js';
import { createFooter, documentStyles, pageSettings } from './word/styles.js';

export async function generateWordDocument(sourceCase) {
  const data = documentCase(sourceCase);

  const declarant = getDeclarant(data);

  const children = [
    ...createCoverSection(data),
    ...createHeirSections(data),
    ...createDocumentSections(data, declarant),
    ...createFinancialSections(data),
    ...createSignatureSection(data, declarant),
  ];

  const document = new Document({
    styles: documentStyles,
    sections: [{
      properties: pageSettings,
      footers: { default: createFooter() },
      children,
    }],
  });

  return Packer.toBlob(document);
}
