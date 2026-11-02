<<<<<<< HEAD

import {
  Page,
  Grid,
  Section,
  Field,
  Radio,
  Check,
  CheckArray,
} from '../../components/ui/Controls.jsx';

import { useCase } from '../../context/CaseContext.jsx';

import {
  civilStatuses,
  heirTypes,
  presenceOptions,
} from '../../config/options.js';

export default function PersonPage() {
  const { data } = useCase();

  const civilStatus = (
    data.deceased?.civilStatus ?? ''
  ).trim().toLowerCase();

  const isMarried =
    /^(gift\b|registrerad partner|registrerat partnerskap)/.test(
      civilStatus
    );

  const isCohabitant = !!data.deceased?.cohabitant;

  // Show partner details only when relevant.
  const showPartner = isMarried || isCohabitant;

  return (
    <Page
      title="Personuppgifter avlåtare/efterlevande"
      description="Uppgifter om den avlidne och eventuell make, registrerad partner eller sambo."
    >
      <div
        className={`grid gap-10 ${
          showPartner ? 'xl:grid-cols-2' : 'grid-cols-1'
        }`}
      >
        {/* Deceased person */}
        <Section title="Personuppgifter avlåtare/efterlevande">
          <Grid>
            <Field
              label="Avliden datum"
              path="deceased.deathDate"
              type="date"
            />

            <Field
              label="Personnr"
              path="deceased.personnummer"
              placeholder="ÅÅÅÅMMDD-XXXX"
            />

            <Field
              label="Födelseår"
              path="deceased.birthYear"
              type="number"
            />

            <Radio
              label="Kön"
              path="deceased.gender"
              options={['Kvinna', 'Man']}
            />

            <Field
              label="Förnamn"
              path="deceased.firstName"
            />

            <Field
              label="Efternamn"
              path="deceased.lastName"
            />

            <Field
              label="Postutdelningsadress"
              path="deceased.address"
            />

            <Field
              label="Postnr"
              path="deceased.postalCode"
            />

            <Field
              label="Ort"
              path="deceased.city"
            />

            <Field
              label="Land"
              path="deceased.country"
            />

            <Field
              label="Hemvist"
              path="deceased.domicile"
            />

            <Field
              label="Medborgarskap"
              path="deceased.citizenship"
            />

            <Field
              label="Civilstånd"
              path="deceased.civilStatus"
              options={civilStatuses}
            />

            {isMarried && (
              <Field
                label="Gift datum"
                path="deceased.marriageDate"
                type="date"
              />
            )}
          </Grid>

          <div className="mt-5 space-y-3">
            <Check
              path="deceased.cohabitant"
              label="Sambo"
            />

            {isCohabitant && (
              <Radio
                label="Bodelning för sambo"
                path="deceased.cohabClaim"
                options={[
                  'begär bodelning',
                  'inte begär bodelning',
                ]}
              />
            )}

            <Check
              path="deceased.multipleDeceased"
              label="Ytterligare avlåtare finns förutom den nu avlidne"
            />
          </div>
        </Section>

        {/* Spouse or cohabitant */}
        {showPartner && (
          <Section title="Make, registrerad partner eller sambo">
            <Grid>
              <Field
                label="Personnr"
                path="partner.personnummer"
              />

              <Radio
                label="Kön"
                path="partner.gender"
                options={['Kvinna', 'Man']}
              />

              <Field
                label="Förnamn"
                path="partner.firstName"
              />

              <Field
                label="Efternamn"
                path="partner.lastName"
              />

              <Field
                label="Postutdelningsadress"
                path="partner.address"
              />

              <Field
                label="Postnr"
                path="partner.postalCode"
              />

              <Field
                label="Ort"
                path="partner.city"
              />

              <Field
                label="Land"
                path="partner.country"
              />
            </Grid>

            <h3 className="mt-5 mb-2 text-sm font-semibold">
              Typ av arvtagare
            </h3>

            <div className="grid gap-2 sm:grid-cols-2">
              {heirTypes.map((type) => (
                <CheckArray
                  key={type.value}
                  label={type.label}
                  path="partner.heirTypes"
                  value={type.value}
                />
              ))}
            </div>

            <div className="mt-5 space-y-3 rounded-lg bg-brand-soft p-4">
              <Check
                path="partner.deceased"
                label="Avliden"
              />

              {data.partner?.deceased && (
                <Field
                  label="Datum"
                  path="partner.deathDate"
                  type="date"
                />
              )}

              <Check
                path="partner.called"
                label="Kallas till förrättning"
              />

              <Grid>
                <Field
                  label="Närvaro"
                  path="partner.presence"
                  options={presenceOptions}
                />

                <Field
                  label="Bilaga"
                  path="partner.attachment"
                />
              </Grid>
            </div>
          </Section>
        )}
      </div>
    </Page>
  );
=======
import { Page, Grid, Section, Field, Radio, Check, CheckArray } from '../../components/ui/Controls.jsx';
import { civilStatuses, heirTypes, presenceOptions } from '../../config/options.js';
export default function PersonPage() {
    return <Page title="Personuppgifter avlåtare/efterlevande" description="Uppgifter om den avlidne och eventuell make, registrerad partner eller sambo.">
        <div className="grid gap-10 xl:grid-cols-2">
            <Section title="Personuppgifter avlåtare/efterlevande"><Grid>
                <Field label="Avliden datum" path="deceased.deathDate" type="date" />
                <Field label="Personnr" path="deceased.personnummer" placeholder="ÅÅÅÅMMDD-XXXX" />
                <Field label="Födelseår" path="deceased.birthYear" type="number" />
                <Radio label="Kön" path="deceased.gender" options={['Kvinna', 'Man']} />
                <Field label="Förnamn" path="deceased.firstName" />
                <Field label="Efternamn" path="deceased.lastName" />
                <Field label="Postutdelningsadress" path="deceased.address" />
                <Field label="Postnr" path="deceased.postalCode" />
                <Field label="Ort" path="deceased.city" />
                <Field label="Land" path="deceased.country" />
                <Field label="Hemvist" path="deceased.domicile" />
                <Field label="Medborgarskap" path="deceased.citizenship" />
                <Field label="Civilstånd" path="deceased.civilStatus" options={civilStatuses} />
                <Field label="Gift datum" path="deceased.marriageDate" type="date" />
            </Grid>
                <div className="mt-5 space-y-3">
                    <Check path="deceased.cohabitant" label="Sambo" />
                    <Radio label="Bodelning för sambo" path="deceased.cohabClaim" options={['begär bodelning', 'inte begär bodelning']} />
                    <Check path="deceased.multipleDeceased" label="Ytterligare avlåtare finns förutom den nu avlidne" />
                </div>
            </Section>
            <Section title="Make, registrerad partner eller sambo">
                <Grid>
                    <Field label="Personnr" path="partner.personnummer" />
                    <Radio label="Kön" path="partner.gender" options={['Kvinna', 'Man']} />
                    <Field label="Förnamn" path="partner.firstName" />
                    <Field label="Efternamn" path="partner.lastName" />
                    <Field label="Postutdelningsadress" path="partner.address" />
                    <Field label="Postnr" path="partner.postalCode" />
                    <Field label="Ort" path="partner.city" />
                    <Field label="Land" path="partner.country" />
                </Grid>
                <h3 className="mt-5 mb-2 text-sm font-semibold">Typ av arvtagare</h3>
                <div className="grid gap-2 sm:grid-cols-2">{heirTypes.map(t => <CheckArray key={t.value} label={t.label} path="partner.heirTypes" value={t.value} />)}</div>
                <div className="mt-5 space-y-3 rounded-lg bg-brand-soft p-4">
                    <Check path="partner.deceased" label="Avliden" />
                    <Field label="Datum" path="partner.deathDate" type="date" />
                    <Check path="partner.called" label="Kallas till förrättning" />
                    <Grid>
                        <Field label="Närvaro" path="partner.presence" options={presenceOptions} />
                        <Field label="Bilaga" path="partner.attachment" />
                    </Grid>
                </div>
            </Section>
        </div>
    </Page>;
>>>>>>> 7e794b9d2a2ddf3ad1a206a45ff016911fee9628
}
