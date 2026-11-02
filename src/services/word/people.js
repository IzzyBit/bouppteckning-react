
import {
  Paragraph,
  TextRun,
} from 'docx';

import {
  borderlessTable,
  labelValueTable,
  pageBreak,
  wblank,
  wh2,
  wh3,
  wtitle,
  wp,
} from './components.js';

import {
  numberedHeirs,
  heirName,
} from '../../utils/heirHierarchy.js';

import {
  hasSurvivingSpouse,
} from '../../utils/relationships.js';

export const fullName = heirName;

export const addressLine = (person) =>
  [person?.postalCode, person?.city]
    .filter(Boolean)
    .join(' ')
    .trim();

// Person information displayed in Word.
function personDetailParagraph(
  person,
  includeAddress = true
) {
  const runs = [];

  const add = (value) => {
    if (!value) return;

    runs.push(
      new TextRun({
        text: String(value),
        size: 22,
        break: runs.length > 0 ? 1 : 0,
      })
    );
  };

  add(fullName(person));
  add(person.personnummer);

  if (includeAddress) {
    add(person.address);
    add(addressLine(person));
  }

  // Each heir can have their own spouse.
  if (fullName(person.spouse)) {
    add(`Make/maka: ${fullName(person.spouse)}`);

    if (person.spouse.personnummer) {
      add(
        `Personnummer: ${person.spouse.personnummer}`
      );
    }
  }

  return new Paragraph({
    spacing: {
      after: 70,
      line: 276,
    },
    children: runs.length
      ? runs
      : [
          new TextRun({
            text: '',
            size: 22,
          }),
        ],
  });
}

// Extract estate heir codes.
function partnerCodes(types = []) {
  return types
    .map(
      (item) =>
        (String(item).match(/\(([DUETL])\)/) || [])[1] ||
        (['D', 'U', 'E', 'T', 'L'].includes(item)
          ? item
          : null)
    )
    .filter(Boolean);
}

// Include deceased person's surviving spouse.
function deceasedPartner(data, code) {
  if (
    !hasSurvivingSpouse(data) ||
    !fullName(data.partner)
  ) {
    return null;
  }

  const codes = partnerCodes(
    data.partner.heirTypes
  );

  if (!codes.includes(code)) return null;

  return data.partner;
}

// Describe the person's relationship.
function relationRole(person) {
  const relation = (
    person.relation || ''
  ).toLowerCase();

  const gender = person.gender || '';

  if (
    relation === 'barn' ||
    relation === 'särkullbarn'
  ) {
    const role =
      gender === 'Kvinna'
        ? 'Dottern'
        : gender === 'Man'
          ? 'Sonen'
          : 'Barnet';

    return relation === 'särkullbarn'
      ? `Särkulls${role.toLowerCase()}`
      : role;
  }

  if (
    relation === 'barnbarn' ||
    relation === 'särkullbarnbarn'
  ) {
    return 'Barnbarnet';
  }

  if (relation === 'syskon') {
    return gender === 'Kvinna'
      ? 'Systern'
      : gender === 'Man'
        ? 'Brodern'
        : 'Syskonet';
  }

  return relation
    ? relation.charAt(0).toUpperCase() +
        relation.slice(1)
    : 'Arvtagaren';
}

// Number and indent the heir in Word.
function numberedRole(number, depth, role) {
  return new Paragraph({
    indent:
      depth > 0
        ? { left: depth * 240 }
        : undefined,

    spacing: {
      after: 45,
    },

    children: [
      new TextRun({
        text: `${number}. ${role}`,
        size: 22,
      }),
    ],
  });
}

// Generate a section of heirs.
function heirBlock(
  data,
  code,
  sectionTitle,
  subTitle
) {
  // Number all heirs before filtering by heir type.
  const tree = numberedHeirs(data.heirs ?? []);

  const people = tree.filter(
    ({ heir }) =>
      (heir.types || []).includes(code)
  );

  const partner = deceasedPartner(data, code);

  if (!people.length && !partner) {
    return [];
  }

  const out = [];

  if (sectionTitle) {
    out.push(wh2(sectionTitle));
  }

  if (subTitle) {
    out.push(wh3(subTitle));
  }

  // Surviving spouse of the deceased.
  if (partner) {
    const partnerRole =
      partner.gender === 'Kvinna'
        ? 'Makan'
        : partner.gender === 'Man'
          ? 'Maken'
          : 'Efterlevande make/partner';

    out.push(
      borderlessTable(
        [
          [
            partnerRole,
            personDetailParagraph(partner),
          ],
        ],
        [40, 60]
      )
    );

    out.push(wblank(200));
  }

  // Hierarchical heirs.
  for (const {
    heir,
    number,
    depth,
  } of people) {
    out.push(
      borderlessTable(
        [
          [
            numberedRole(
              number,
              depth,
              relationRole(heir)
            ),
            personDetailParagraph(heir),
          ],
        ],
        [40, 60]
      )
    );

    // Spacing between heirs.
    out.push(wblank(200));
  }

  return out;
}

// Cover page.
export function createCoverSection(data) {
  return [
    wtitle('Bouppteckning'),

    wp(
      `Förrättningsdag ${data.meeting?.date || ''}`,
      { after: 420 }
    ),

    labelValueTable([
      ['Namn', fullName(data.deceased)],
      [
        'Personnummer',
        data.deceased?.personnummer,
      ],
      ['Adress', data.deceased?.address],
      ['', addressLine(data.deceased)],
      ['Civilstånd', data.deceased?.civilStatus],
      ['Avliden', data.deceased?.deathDate],
    ]),

    wblank(240),
  ];
}

// Estate heirs in document order.
export function createHeirSections(data) {
  return [
    ...heirBlock(
      data,
      'D',
      'Dödsbodelägare',
      'Den avlidnas arvingar enligt lag'
    ),

    ...heirBlock(
      data,
      'U',
      '',
      'Den avlidnas universella testamentstagare'
    ),

    ...heirBlock(
      data,
      'E',
      'Efterarvingar',
      'Den avlidnas arvingar enligt lag'
    ),

    pageBreak(),

    ...heirBlock(
      data,
      'T',
      '',
      'Den avlidnas arvingar enligt testamente'
    ),

    ...heirBlock(
      data,
      'L',
      'Legatarier',
      'Den avlidnas legatarier'
    ),
  ];
}
