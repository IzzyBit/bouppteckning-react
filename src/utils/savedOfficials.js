let savedOfficials = [];

export function loadSavedOfficials() {
  return structuredClone(savedOfficials);
}

export function saveOfficials(officials) {
  savedOfficials = structuredClone(officials);
}


export function officialDetails(person) {
  return {
    firstName: person.firstName?.trim() || '',
    lastName: person.lastName?.trim() || '',
    title: person.title || '',
    address: person.address || '',
    postalCode: person.postalCode || '',
    city: person.city || '',
  };
}
