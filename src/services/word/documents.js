import { Paragraph, TextRun } from 'docx';
import {
  borderlessTable,
  statementRow,
  wh2,
  wh3,
} from './components.js';
import { fullName } from './people.js';
import { getShownDocuments } from '../../utils/documentAttachments.js'; 

function isInsuranceClause(text) {
  return (
    /försäkringar/i.test(text) &&
    /förmånstagarförordnande/i.test(text)
  );
}

function insuranceDescription(insurance) {
  const parts = [];

  if (insurance.provider) {
    parts.push(`Försäkringsgivare: ${insurance.provider}`);
  }

  if (insurance.beneficiary) {
    parts.push(`Förmånstagare: ${insurance.beneficiary}`);
  }

  if (
    insurance.amount !== '' &&
    insurance.amount != null
  ) {
    const amount = Number(insurance.amount);

    if (Number.isFinite(amount)) {
      parts.push(
        `Försäkringsbelopp: ${amount.toLocaleString('sv-SE', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} kr`
      );
    }
  }

  if (insurance.attachment) {
    parts.push(`Bilaga: ${insurance.attachment}`);
  }

  return parts.join(', ');
}



function presenceRows(data) {
  const people = [];
  if (fullName(data.partner) && (data.partner.called || data.partner.presence)) {
    people.push(data.partner);
  }
  people.push(...data.heirs.filter((person) => person.called || person.presence));
  return people;
}

export function createDocumentSections(data, declarant) {
  const children = [];
  
  const docs = getShownDocuments(data.documents);

  if (docs.length > 0) {
    children.push(
      wh2('Vid förrättningen uppvisades följande handlingar')
    );

    for (const doc of docs) {
      children.push(
        statementRow(
          doc.article,
          `${doc.text} (bilaga ${doc.number}),`
        )
      );
    }
  }

  children.push(wh2('Det antecknades'));
  
  for (const clause of data.clauses) {
    if (isInsuranceClause(clause)) {
      children.push(
        statementRow(
          'att',
          'följande försäkringar med förmånstagarförordnande fanns på den avlidnes liv:'
        )
      );

      for (const insurance of data.insurancePolicies ?? []) {
        const description = insuranceDescription(insurance);

        if (description) {
          children.push(
            statementRow('', description + ',')
          );
        }
      }
    } else {
      children.push(
        statementRow(
          'att',
          String(clause)
            .replace(/^att\s+/i, '')
            .replace(/[.]+$/, '') + ','
        )
      );
    }
  }


  const people = presenceRows(data);
  if (people.length) {
    children.push(
      wh3('Närvaro vid förrättning'),
      borderlessTable([[
        new Paragraph({ children: [new TextRun({ text: 'Namn', bold: true, size: 22 })] }),
        new Paragraph({ children: [new TextRun({ text: 'Närvarande', bold: true, size: 22 })] }),
      ]], [55, 45]),
    );
    for (const person of people) {
      children.push(borderlessTable([
        [fullName(person), person.presence || (person.called ? 'Kallad' : '')],
      ], [55, 45]));
    }
  }

  if (declarant) {
    children.push(
      statementRow(
        "att",
        `boet uppgavs av ${declarant} samt antecknades och värderades per dödsdagen sålunda:`
      )
    );
  }
  return children;
}
