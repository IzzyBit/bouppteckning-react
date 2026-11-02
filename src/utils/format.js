export const num = value => Number(String(value ?? '').replace(/\s/g, '').replace(',', '.')) || 0;
export const money = value => `${num(value).toLocaleString('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr`;
export const fullName = p => [p?.firstName, p?.lastName].filter(Boolean).join(' ').trim();
