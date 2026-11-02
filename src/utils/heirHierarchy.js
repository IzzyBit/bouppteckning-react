export const newSpouse = () => ({
  firstName: '',
  lastName: '',
  personnummer: '',
  gender: '',
});

// Give each heir a unique ID.
export function ensureHeirIds(heirs = []) {
  const used = new Set();

  return heirs.map((heir) => {
    let id = heir.id;

    if (!id || used.has(id)) {
      id = crypto.randomUUID();
    }

    used.add(id);

    return id === heir.id
      ? heir
      : { ...heir, id };
  });
}

export function heirName(heir) {
  return [
    heir?.firstName,
    heir?.lastName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim();
}

// Prevent assigning an heir as their own parent
// or as a descendant's child.
export function descendantIds(heirs = [], ancestorId) {
  const ids = new Set(
    ancestorId ? [ancestorId] : []
  );

  let changed = true;

  while (changed) {
    changed = false;

    for (const heir of heirs) {
      if (
        heir.id &&
        heir.parentId &&
        ids.has(heir.parentId) &&
        !ids.has(heir.id)
      ) {
        ids.add(heir.id);
        changed = true;
      }
    }
  }

  return ids;
}

// Build numbered hierarchy:
// 1, 1.1, 1.2, 1.2.1, 2, 2.1 ...
export function numberedHeirs(heirs = []) {
  const records = heirs.map((heir, index) => ({
    ...heir,
    id: heir.id || `legacy-${index}`,
  }));

  const ids = new Set(records.map((heir) => heir.id));
  const children = new Map();
  const roots = [];

  for (const heir of records) {
    if (
      !heir.parentId ||
      !ids.has(heir.parentId) ||
      heir.parentId === heir.id
    ) {
      roots.push(heir);
    } else {
      if (!children.has(heir.parentId)) {
        children.set(heir.parentId, []);
      }

      children.get(heir.parentId).push(heir);
    }
  }

  const result = [];
  const visited = new Set();

  function visit(heir, number, depth) {
    if (visited.has(heir.id)) return;

    visited.add(heir.id);

    result.push({
      heir,
      number,
      depth,
    });

    let index = 0;

    for (const child of children.get(heir.id) ?? []) {
      if (visited.has(child.id)) continue;

      visit(
        child,
        `${number}.${++index}`,
        depth + 1
      );
    }
  }

  let rootNumber = 0;

  for (const heir of roots) {
    if (!visited.has(heir.id)) {
      visit(heir, String(++rootNumber), 0);
    }
  }

  // Keep malformed records visible.
  for (const heir of records) {
    if (!visited.has(heir.id)) {
      visit(heir, String(++rootNumber), 0);
    }
  }

  return result;
}
