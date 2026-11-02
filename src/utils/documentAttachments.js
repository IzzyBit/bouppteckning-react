
export function getShownDocuments(documents = {}) {
  const shown = [];

  function add(key, article, text, title) {
    const number = shown.length + 1;

    shown.push({
      key,
      article,
      text: String(text).trim().replace(/[,\s]+$/, ''),
      title,
      number,
      attachmentLabel: `Bilaga ${number}`,
    });
  }

  if (documents.prev) {
    add(
      'prev',
      'en',
      `bouppteckning efter tidigare avliden ${documents.prevName || ''}${
        documents.prevDate
          ? ` upprättad ${documents.prevDate}`
          : ''
      }`,
      'Bouppteckning efter tidigare avliden'
    );
  }

  if (documents.will) {
    add(
      'will',
      'ett',
      `testamente ${
        documents.willNote || 'upprättat av den avlidne'
      }`,
      'Testamente'
    );
  }

  if (documents.power) {
    add(
      'power',
      'en',
      `fullmakt eller behörighetshandling${
        documents.powerNote
          ? `: ${documents.powerNote}`
          : ''
      }`,
      'Fullmakt eller behörighetshandling'
    );
  }

  if (documents.prenup) {
    add(
      'prenup',
      'ett',
      `äktenskapsförord${
        documents.prenupDate
          ? ` upprättat ${documents.prenupDate}`
          : ''
      }${
        documents.prenupRegistered
          ? ` och registrerat ${documents.prenupRegistered}`
          : ''
      }`,
      'Äktenskapsförord'
    );
  }

  for (const [index, item] of (
    documents.custom ?? []
  ).entries()) {
    if (item?.enabled && item?.text?.trim()) {
      add(
        `custom-${index}`,
        '',
        item.text,
        item.text.trim()
      );
    }
  }

  return shown;
}
