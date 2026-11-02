export const num = value => Number(String(value ?? '').replace(/\s/g, '').replace(',', '.')) || 0;
<<<<<<< HEAD
export const money = value => `${num(value).toLocaleString('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr`;
=======
export const money = value => `${num(value).toLocaleString('sv-SE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
})
    } kr`;
>>>>>>> 7e794b9d2a2ddf3ad1a206a45ff016911fee9628
export const fullName = p => [p?.firstName, p?.lastName].filter(Boolean).join(' ').trim();
