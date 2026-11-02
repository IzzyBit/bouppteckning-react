<<<<<<< HEAD
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
=======
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle, Footer, PageNumber, PageBreak } from 'docx';
import { documentCase } from '../models/case.js';
import { num } from '../utils/format.js';

// Retains the structure and document wording of the original single-file app.
// All data is passed in explicitly instead of being read from document.getElementById.
export async function generateWordDocument(sourceCase) {
  const d = documentCase(sourceCase);
  const { assets, debts, survivorAssets, survivorDebts, officials, expenses } = d;

  const noBorders = {
    top: {
      style: BorderStyle.NONE,
      size: 0,
      color: "FFFFFF"
    },
    bottom: {
      style: BorderStyle.NONE,
      size: 0,
      color: "FFFFFF"
    },
    left: {
      style: BorderStyle.NONE,
      size: 0,
      color: "FFFFFF"
    },
    right: {
      style: BorderStyle.NONE,
      size: 0,
      color: "FFFFFF"
    },
    insideHorizontal: {
      style: BorderStyle.NONE,
      size: 0,
      color: "FFFFFF"
    },
    insideVertical: {
      style: BorderStyle.NONE,
      size: 0,
      color: "FFFFFF"
    }
  };
  const docMoney = n => (Number(n) || 0).toLocaleString("sv-SE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  const fullName = p => [p?.firstName, p?.lastName].filter(Boolean).join(" ").trim();
  const addressLine = p => [p?.postalCode, p?.city].filter(Boolean).join(" ").trim();
  function wp(text = "", opts = {}) {
    return new Paragraph({
      alignment: opts.alignment,
      spacing: {
        before: opts.before ?? 0,
        after: opts.after ?? 90,
        line: opts.line ?? 276
      },
      keepNext: !!opts.keepNext,
      children: [new TextRun({
        text: String(text ?? ""),
        bold: !!opts.bold,
        size: opts.size ?? 22
      })]
    });
  }
  function wtitle(t) {
    return wp(t, {
      bold: true,
      size: 52,
      after: 560,
      keepNext: true
    })
  }
  function wh2(t) {
    return wp(t, {
      bold: true,
      size: 32,
      before: 300,
      after: 180,
      keepNext: true
    })
  }
  function wh3(t) {
    return wp(t, {
      bold: true,
      size: 24,
      before: 230,
      after: 120,
      keepNext: true
    })
  }
  function wh4(t) {
    return wp(t, {
      bold: true,
      size: 22,
      before: 140,
      after: 80,
      keepNext: true
    })
  }
  function wblank(h = 100) {
    return new Paragraph({
      spacing: {
        after: h
      },
      children: [new TextRun("")]
    })
  }
  function pageBreak() {
    return new Paragraph({
      children: [new PageBreak()]
    })
  }
  function wcell(content,
    { bold = false, width = 50, align, after = 40, size = 22 } = {}) {
    const para = content instanceof Paragraph ? content : new Paragraph(
      {
        alignment: align,
        spacing: { after },
        children: [new TextRun(
          {
            text: String(content ?? ""),
            bold,
            size
          })]
      });
    return new TableCell(
      {
        width:
        {
          size: width,
          type: WidthType.PERCENTAGE
        }, borders: noBorders,
        margins: { top: 0, bottom: 0, left: 0, right: 70 },
        children: [para]
      });
  }
  function borderlessTable(rows, widths = [50, 50]) {
    return new Table(
      {
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: noBorders,
        rows: rows.map(r => new TableRow(
          {
            children: r.map((x, i) => wcell(x, {
              width: widths[i] ?? (100 / rows[0].length)
            }))
          }))
      });
  }
  function labelValueTable(rows) {
    return new Table({
      width: {
        size: 100,
        type: WidthType.PERCENTAGE
      },
      borders: noBorders,
      rows: rows.map(([label, value]) => new TableRow(
        {
          children: [wcell(label, { width: 37 }), wcell(new Paragraph(
            {
              spacing: { after: 30 },
              children: [new TextRun(
                { text: String(value || ""), bold: true, size: 22 })]
            }), { width: 63 })]
        }))
    });
  }
  function personDetailParagraph(p, includeAddress = true) {
    const runs = []; const add = (text, first = false) => {
      if (!text) return; runs.push(new TextRun({
        text: String(text),
        size: 22,
        break: first ? 0 : 1
      }));
    }; add(fullName(p), true); add(p?.personnummer); if (includeAddress) { add(p?.address); add(addressLine(p)); } return new Paragraph(
      {
        spacing:
          { after: 70, line: 276 },
        children: runs.length ? runs : [new TextRun(
          { text: "", size: 22 })]
      });
  }
  function amountRow(label, value, { bold = false, indent = false } = {}) {
    return new Table({
      width: {
        size: 100,
        type: WidthType.PERCENTAGE
      },
      borders: noBorders,
      rows: [new TableRow({
        children: [wcell(new Paragraph({
          indent: indent ? { left: 240 } : undefined,
          spacing: { after: 35 },
          children: [new TextRun({
            text: String(label || ""),
            bold,
            size: 22
          })]
        }),
          { width: 78 }),
        wcell(new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: { after: 35 },
          children: [new TextRun({
            text: docMoney(value),
            bold,
            size: 22
          })]
        }),
          { width: 22 })]
      })]
    });
  }
  function partnerCodes(types = []) {
    return types.map(x => (x.match(/\(([DUETL])\)/) || [])[1]).filter(Boolean)
  }
  function allEstatePeople(d) {
    const people = d.heirs.map(x => ({
      ...x, isPartner: false
    })); if (fullName(d.partner)) {
      const codes = partnerCodes(d.partner.heirTypes); if (codes.length) people.unshift({
        ...d.partner,
        types: codes,
        relation: "make/maka",
        isPartner: true
      });
    } return people;
  }
  function roleName(p, index = 0) {
    if (p.isPartner) {
      if (p.gender === "Kvinna") return "Makan";
      if (p.gender === "Man") return "Maken";
      return "Efterlevande make/partner";
    }
    const r = (p.relation || "").toLowerCase();
    const g = p.gender || ""; let role = "";
    if (r === "barn" || r === "särkullbarn") {
      role = g === "Kvinna" ? "Dottern" : g === "Man" ? "Sonen" : "Barnet";
      if (r === "särkullbarn") role = "Särkulls" + role.toLowerCase();
    } else if (r === "barnbarn" || r === "särkullbarnbarn") role = g === "Kvinna" ? "Dotterdottern/barnbarnet" : g === "Man" ? "Sonen/barnbarnet" : "Barnbarnet";
    else if (r === "syskon") role = g === "Kvinna" ? "Systern" : g === "Man" ? "Brodern" : "Syskonet";
    else role = r ? r.charAt(0).toUpperCase() + r.slice(1) : "Arvtagaren";
    return `${index + 1}. ${role}`;
  }
  function relationGroupHeading(p, d) {
    const r = (p.relation || "").toLowerCase();
    const partner = fullName(d.partner);
    if (r === "barn" && partner) return `Barn gemensamma med ${partner}`;
    if (r === "särkullbarn") return "Särkullbarn";
    if (r === "barnbarn") return "Barnbarn";
    if (r === "syskon") return "Syskon";
    return "";
  }
  function heirBlock(d, code, sectionTitle, subTitle) {
    const people = allEstatePeople(d).filter(p => (p.types || []).includes(code));
    if (!people.length) return []; const out = [];
    if (sectionTitle) out.push(wh2(sectionTitle));
    if (subTitle) out.push(wh3(subTitle));
    let lastGroup = "";
    let count = 0;
    for (const p of people) {
      const group = relationGroupHeading(p, d);
      if (group && group !== lastGroup) {
        out.push(wh4(group)); lastGroup = group;
      }
      const left = roleName(p, count);
      if (!p.isPartner) count++;
      out.push(new Table({
        width: {
          size: 100,
          type: WidthType.PERCENTAGE
        },
        borders: noBorders,
        rows: [new TableRow({
          children: [wcell(left, { width: 40 }), wcell(personDetailParagraph(p, true), { width: 60 })]
        })]
      }));
    } return out;
  }
  function shownDocuments(d) {
    const docs = [];
    if (d.documents.prev) docs.push(["en", `bouppteckning efter tidigare avliden ${d.documents.prevName || ""}${d.documents.prevDate ? ` upprättad ${d.documents.prevDate}` : ""},`]);
    if (d.documents.will) docs.push(["ett", `testamente ${d.documents.willNote ? d.documents.willNote : "upprättat av den avlidne"},`]);
    if (d.documents.power) docs.push(["en", `fullmakt eller behörighetshandling${d.documents.powerNote ? `: ${d.documents.powerNote}` : ""},`]);
    if (d.documents.prenup) docs.push(["ett", `äktenskapsförord${d.documents.prenupDate ? ` upprättat ${d.documents.prenupDate}` : ""}${d.documents.prenupRegistered ? ` och registrerat ${d.documents.prenupRegistered}` : ""},`]);
    for (const x of d.documents.custom.filter(x => x.enabled && x.text.trim())) docs.push(["", x.text.trim()]); return docs;
  }
  function statementRow(prefix, text) {
    return new Table({
      width: {
        size: 100, type: WidthType.PERCENTAGE
      },
      borders: noBorders,
      rows: [new TableRow({
        children: [wcell(prefix, {
          bold: true,
          width: 8
        }), wcell(text, {
          width: 92
        })]
      })]
    });
  }
  function presenceRows(d) {
    const people = [];
    if (fullName(d.partner) && (d.partner.called || d.partner.presence)) people.push(d.partner);
    people.push(...d.heirs.filter(x => x.called || x.presence));
    return people;
  }
  const assetKindOrder = [
    "Fast egendom",
    "Bostadsrätt",
    "Konto",
    "Aktier, obligationer/värdepapper",
    "Fonder",
    "Lösöre",
    "Försäkringar",
    "Övrigt"
  ];
  const assetKindHeading = {
    "Fast egendom": "Fast egendom",
    "Bostadsrätt": "Bostadsrätt",
    "Konto": "Konton",
    "Aktier, obligationer/värdepapper": "Aktier, obligationer, värdepapper",
    "Fonder": "Fonder",
    "Lösöre": "Lösöre",
    "Försäkringar": "Försäkringar som ingår i boets behållning",
    "Övrigt": "Övriga tillgångar"
  };
  const propertyHeading = {
    "giftorättsgods": "Giftorättsgods",
    "enskild eg. ä-förord": "Enskild egendom enligt äktenskapsförord",
    "enskild eg. gåva m.m.": "Enskild egendom enligt gåva/testamente",
    "sambogemensam": "Samboegendom",
    "anges inte": "Övriga tillgångar"
  };
  function assetsDocument(ownerTitle, list) {
    const out = [wh2(ownerTitle)];
    if (!list.length) {
      out.push(wp("Inga tillgångar registrerade."));
      return out;
    } const typeOrder = [
      "giftorättsgods",
      "enskild eg. ä-förord",
      "enskild eg. gåva m.m.",
      "sambogemensam",
      "anges inte"
    ];
    for (const type of typeOrder) {
      const subset = list.filter(x => x.type === type);
      if (!subset.length) continue;
      out.push(wh2(propertyHeading[type] || type));
      for (const kind of assetKindOrder) {
        const rows = subset.filter(x => x.kind === kind);
        if (!rows.length) continue;
        out.push(wh3(assetKindHeading[kind] || kind));
        if (kind === "Aktier, obligationer/värdepapper" || kind === "Fonder") out.push(borderlessTable([[new Paragraph({
          children: [new TextRun({
            text: "Benämning",
            bold: true,
            size: 22
          })]
        }), new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({
            text: "Antal",
            bold: true,
            size: 22
          })]
        }), new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({
            text: "Kurs",
            bold: true,
            size: 22
          })]
        }), ""]], [55, 13, 14, 18]));
        for (const a of rows) {
          if (kind === "Aktier, obligationer/värdepapper" || kind === "Fonder") out.push(new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE
            },
            borders: noBorders,
            rows: [new TableRow({
              children: [wcell(a.name, { width: 55 }), wcell(a.share || "", {
                width: 13,
                align: AlignmentType.CENTER
              }), wcell(a.rate ? docMoney(a.rate) : "", {
                width: 14,
                align: AlignmentType.CENTER
              }), wcell(new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [new TextRun({
                  text: docMoney(a.value),
                  size: 22
                })]
              }), {
                width: 18
              })]
            })]
          }));
          else out.push(amountRow(a.name || assetKindHeading[kind] || kind, a.value));
        }
      }
      const sum = subset.reduce((n, x) => n + num(x.value), 0);
      out.push(wblank(20));
      out.push(amountRow(`Summa ${propertyHeading[type]?.toLowerCase() || type}`,
        sum,
        { bold: true }));
    } return out;
  }
  function debtHeading(kind) { return kind === "Inteckningslån/skuld" ? "Intecknings- och andra låneskulder" : "Övriga skulder" }
  function debtsDocument(ownerTitle, list, includeExpenses = false) {
    const out = [wh2(ownerTitle)]; if (!list.length && !includeExpenses) {
      out.push(wp("Inga skulder registrerade."));
      return out;
    } for (const kind of ["Inteckningslån/skuld", "Personlig skuld", "Övrig skuld"]) {
      const rows = list.filter(x => x.kind === kind);
      if (!rows.length) continue;
      out.push(wh3(debtHeading(kind)));
      for (const d of rows) {
        out.push(amountRow(d.name || debtHeading(kind), d.value));
        if (num(d.interest)) out.push(amountRow("beräknad ränta", d.interest, { indent: true }));
      }
    }
    if (includeExpenses) {
      const exp = expenses.filter(x => num(x.value) > 0);
      if (exp.length) {
        out.push(wh3("Avgående poster"));
        for (const e of exp) out.push(amountRow(e.name, e.value));
      }
    }
    const total = list.reduce((n, x) => n + num(x.value) + num(x.interest), 0) + (includeExpenses ? expenses.reduce((n, x) => n + num(x.value), 0) : 0);
    out.push(wblank(30));
    out.push(amountRow("Summa skulder", total, { bold: true }));
    return out;
  }
  function summaryDocument(d) {
    const sum = (arr, filter) => arr.filter(filter).reduce((n, x) => n + num(x.value), 0);
    const debtSum = (arr, filter) => arr.filter(filter).reduce((n, x) => n + num(x.value) + num(x.interest), 0);
    const dGiftA = sum(assets, x => x.type === "giftorättsgods"),
      dGiftD = debtSum(debts, x => x.type === "giftorättsgods") + expenses.filter(e => e.type === "giftorättsgods").reduce((n, e) => n + num(e.value), 0),
      sGiftA = sum(survivorAssets, x => x.type === "giftorättsgods"),
      sGiftD = debtSum(survivorDebts, x => x.type === "giftorättsgods");
    const dGiftNet = dGiftA - dGiftD,
      sGiftNet = sGiftA - sGiftD, joint = Math.max(0, dGiftNet) + Math.max(0, sGiftNet),
      half = joint / 2;
    const dOther = assets.filter(x => x.type !== "giftorättsgods").reduce((n, x) => n + num(x.value), 0) - debts.filter(x => x.type !== "giftorättsgods").reduce((n, x) => n + num(x.value) + num(x.interest), 0);
    const toDistribute = half + dOther; return [
      wh2("Sammanställning"),
      amountRow("Den avlidnas giftorättsgods", dGiftA),
      amountRow("Den avlidnas giftorättsskuld", -dGiftD),
      amountRow("Den avlidnas behållning", dGiftNet, { bold: true }),
      wblank(60),
      amountRow("Den efterlevande makans/makens giftorättsgods", sGiftA),
      amountRow("Den efterlevande makans/makens giftorättsskuld", -sGiftD),
      amountRow("Den efterlevandes behållning", sGiftNet, { bold: true }),
      wblank(60),
      amountRow("Boets summa behållning", joint, { bold: true }),
      wh3("Avräkning av bodelningsandel"),
      amountRow("Den avlidnes bodelningsandel", half),
      amountRow("Den efterlevandes bodelningsandel", half),
      amountRow("Att fördela", toDistribute, { bold: true })];
  }
  function signatureCell(o) {
    return wcell(new Paragraph({
      spacing: { after: 40 },
      children: [new TextRun({
        text: "................................................................", size: 22
      }), new TextRun({
        text: fullName(o) || " ", break: 1, size: 22
      }), ...(o?.title ? [new TextRun({
        text: o.title,
        break: 1,
        size: 22
      })] : []), ...(o?.address ? [new TextRun({
        text: o.address,
        break: 1,
        size: 22
      })] : []), ...(addressLine(o) ? [new TextRun({
        text: addressLine(o),
        break: 1,
        size: 22
      })] : [])]
    }),
      { width: 50 })
  }

  const declarant = d.meeting.declarant || fullName(d.partner) || fullName(d.heirs.find(x => (x.types || []).includes("D"))) || "Bouppgivare";
  const children = [];

  children.push(wtitle("Bouppteckning"),
    wp(`Förrättningsdag ${d.meeting.date || ""}`, { after: 420 }),
    labelValueTable([
      ["Namn", fullName(d.deceased)],
      ["Personnummer", d.deceased.personnummer],
      ["Adress", d.deceased.address],
      ["", addressLine(d.deceased)],
      ["Civilstånd", d.deceased.civilStatus],
      ["Avliden", d.deceased.deathDate]
    ]), wblank(240));
  children.push(...heirBlock(d, "D", "Dödsbodelägare", "Den avlidnas arvingar enligt lag"));
  children.push(...heirBlock(d, "U", "", "Den avlidnas universella testamentstagare"));
  children.push(...heirBlock(d, "E", "Efterarvingar", "Den avlidnas arvingar enligt lag"));
  children.push(pageBreak());
  children.push(...heirBlock(d, "T", "", "Den avlidnas arvingar enligt testamente"));
  children.push(...heirBlock(d, "L", "Legatarier", "Den avlidnas legatarier"));
  const docs = shownDocuments(d); if (docs.length) {
    children.push(wh2("Vid förrättningen uppvisades följande handlingar"));
    for (const [article, text] of docs) children.push(statementRow(article, text));
  }
  children.push(wh2("Det antecknades"));
  for (const c of d.clauses) children.push(statementRow("att", String(c).replace(/^att\s+/i, "").replace(/[.]+$/, "") + ","));
  const pres = presenceRows(d);
  if (pres.length) {
    children.push(wh3("Närvaro vid förrättning"),
      borderlessTable([[new Paragraph({
        children: [new TextRun({ text: "Namn", bold: true, size: 22 })]
      }), new Paragraph({
        children: [new TextRun({ text: "Närvarande", bold: true, size: 22 })]
      })]], [55, 45]));
    for (const p of pres) children.push(borderlessTable([[fullName(p), p.presence || (p.called ? "Kallad" : "")]], [55, 45]));
  }
  children.push(statementRow("att", `boet uppgavs av ${declarant} samt antecknades och värderades per dödsdagen sålunda:`));
  children.push(pageBreak(), ...assetsDocument("Den avlidnas tillgångar", assets));
  children.push(pageBreak(), ...debtsDocument("Den avlidnas skulder", debts, true));
  const hasSurvivor = !!fullName(d.partner) || survivorAssets.length || survivorDebts.length;
  if (hasSurvivor) {
    children.push(pageBreak(), ...assetsDocument("Den efterlevande makans/makens tillgångar", survivorAssets));
    children.push(pageBreak(), ...debtsDocument(
      "Den efterlevande makans/makens skulder",
      survivorDebts,
      false
    ),
      wblank(140),
      ...summaryDocument(d));
  } else {
    children.push(pageBreak(), ...summaryDocument(d));
  }
  children.push(
    pageBreak(),
    wp("Härmed försäkras på heder och samvete",
      { after: 240 }),
    statementRow(
      "att",
      "mina uppgifter till bouppteckningen är riktiga,"
    ),
    statementRow(
      "att",
      "inga uppgifter avsiktligt har utelämnats,"
    ),
    wblank(420),
    wp("................................................................", { after: 15 }),
    wp(declarant, { after: 420 }),
    wp("Att allt blivit riktigt antecknat och tillgångarna efter bästa förstånd värderade,", { after: 0 }),
    wp("intygar undertecknade gode män.", { after: 340 }),
    wp(`${d.meeting.location || "Förrättningsort"} dag som ovan`, { after: 360 }));
  const sig = officials.filter(o => fullName(o) || o.address || o.title);
  for (let i = 0; i < Math.max(sig.length, 2); i += 2) {
    children.push(new Table({
      width: {
        size: 100,
        type: WidthType.PERCENTAGE
      },
      borders: noBorders,
      rows: [new TableRow({
        children: [signatureCell(sig[i] || {}),
        signatureCell(sig[i + 1] || {})]
      })]
    }),
      wblank(160));
  }
  const footer = new Footer({
    children: [new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [new TextRun({
        children: [PageNumber.CURRENT, "(", PageNumber.TOTAL_PAGES, ")"],
        size: 20
      })]
    })]
  });
  const wordDocument = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Calibri",
            size: 22
          },
          paragraph: {
            spacing: {
              after: 80,
              line: 276
            }
          }
        }
      }
    },
    sections: [{
      properties: {
        page: {
          margin: {
            top: 850,
            right: 567,
            bottom: 850,
            left: 1701
          }
        }
      },
      footers: { default: footer },
      children
    }]
  });
  return Packer.toBlob(wordDocument);
>>>>>>> 7e794b9d2a2ddf3ad1a206a45ff016911fee9628
}
