
import { clauseDefs } from '../../config/options.js';
import { useCase } from '../../context/CaseContext.jsx';

import {
  Page,
  Section,
  Grid,
  Field,
  Button,
  InlineList,
} from '../../components/ui/Controls.jsx';

const isInsuranceClause = (text) =>
  /försäkringar/i.test(text) &&
  /förmånstagarförordnande/i.test(text);

const newInsurance = () => ({
  id: crypto.randomUUID(),
  provider: '',
  beneficiary: '',
  amount: '',
  attachment: '',
});

export default function ClausesPage() {
  const { data, set } = useCase();

  const selectedClauses = data.standardClauses ?? [];
  const insurances = data.insurancePolicies ?? [];

  function toggleClause(clause, checked) {
    set(
      'standardClauses',
      checked
        ? [...selectedClauses, clause]
        : selectedClauses.filter((c) => c !== clause)
    );

    // Add an empty insurance when first selected.
    if (
      checked &&
      isInsuranceClause(clause) &&
      insurances.length === 0
    ) {
      set('insurancePolicies', [newInsurance()]);
    }
  }

  function addInsurance() {
    set('insurancePolicies', [
      ...insurances,
      newInsurance(),
    ]);
  }

  function removeInsurance(index) {
    set(
      'insurancePolicies',
      insurances.filter((_, i) => i !== index)
    );
  }

  return (
    <Page
      title="Att-satser för bouppteckning"
      description="Endast markerade att-satser kommer med i Word-dokumentet."
    >
      <Section title="Standardupplysningar">
        <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5">
          {clauseDefs.map((clause) => {
            const checked = selectedClauses.includes(clause);
            const isInsurance = isInsuranceClause(clause);

            return (
              <div key={clause} className="space-y-3">
                <label className="flex items-start gap-3 text-sm">
                  <input
                    type="checkbox"
                    className="mt-1 accent-blue-700"
                    checked={checked}
                    onChange={(e) =>
                      toggleClause(clause, e.target.checked)
                    }
                  />

                  <span>{clause}</span>
                </label>

                {/* Insurance details */}
                {isInsurance && checked && (
                  <div className="ml-6 space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">
                        Försäkringar med förmånstagarförordnande
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        Ange försäkringsgivare, förmånstagare,
                        försäkringsbelopp och eventuell bilaga.
                      </p>
                    </div>

                    {insurances.map((insurance, index) => (
                      <div
                        key={insurance.id ?? index}
                        className="space-y-3 rounded-lg border border-slate-200 bg-white p-4"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-slate-700">
                            Försäkring {index + 1}
                          </h4>

                          <Button
                            variant="danger"
                            onClick={() => removeInsurance(index)}
                          >
                            Ta bort
                          </Button>
                        </div>

                        <Grid>
                          <Field
                            label="Försäkringsgivare"
                            path={`insurancePolicies.${index}.provider`}
                            placeholder="Ex. Nordea"
                          />

                          <Field
                            label="Förmånstagare"
                            path={`insurancePolicies.${index}.beneficiary`}
                            placeholder="Namn på förmånstagare"
                          />

                          <Field
                            label="Försäkringsbelopp (kr)"
                            path={`insurancePolicies.${index}.amount`}
                            type="number"
                            min="0"
                            step="0.01"
                          />

                          <Field
                            label="Bilaga"
                            path={`insurancePolicies.${index}.attachment`}
                            placeholder="Ex. Bilaga 3"
                          />
                        </Grid>
                      </div>
                    ))}

                    <Button onClick={addInsurance}>
                      + Lägg till försäkring
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="Egna att-satser">
        <InlineList path="customClauses" />
      </Section>
    </Page>
  );
}
