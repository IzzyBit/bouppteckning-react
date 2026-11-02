export function hasSurvivingSpouse(data) {
  const status = (
    data.deceased?.civilStatus ?? ''
  ).trim().toLowerCase();

  const married =
    /^(gift|registrerad partner|registrerat partnerskap)\b/.test(status);

  return married && !data.partner?.deceased;
}
