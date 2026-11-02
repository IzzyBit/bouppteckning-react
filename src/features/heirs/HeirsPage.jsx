
import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useCase } from '../../context/CaseContext.jsx';
import { newHeir } from '../../models/case.js';

import {
  relations,
  presenceOptions,
  heirTypes,
} from '../../config/options.js';

import {
  Page,
  Button,
  Grid,
  TableBox,
  Head,
  Th,
  Td,
} from '../../components/ui/Controls.jsx';

import {
  descendantIds,
  ensureHeirIds,
  heirName,
  newSpouse,
  numberedHeirs,
} from '../../utils/heirHierarchy.js';

const control =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand focus:outline-none';

function ModalField({
  label,
  field,
  form,
  setForm,
  options,
  type = 'text',
}) {
  const update = (value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  return (
    <label className="space-y-1">
      <span className="block text-xs font-semibold">
        {label}
      </span>

      {options ? (
        <select
          className={control}
          value={form[field] ?? ''}
          onChange={(e) => update(e.target.value)}
        >
          <option value="">Välj</option>

          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          className={control}
          value={form[field] ?? ''}
          onChange={(e) => update(e.target.value)}
        />
      )}
    </label>
  );
}

function SpouseField({
  label,
  field,
  form,
  setForm,
  options,
}) {
  const value = form.spouse?.[field] ?? '';

  const update = (next) => {
    setForm((current) => ({
      ...current,
      spouse: {
        ...newSpouse(),
        ...(current.spouse ?? {}),
        [field]: next,
      },
    }));
  };

  return (
    <label className="space-y-1">
      <span className="block text-xs font-semibold">
        {label}
      </span>

      {options ? (
        <select
          className={control}
          value={value}
          onChange={(e) => update(e.target.value)}
        >
          <option value="">Välj</option>

          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          className={control}
          value={value}
          onChange={(e) => update(e.target.value)}
        />
      )}
    </label>
  );
}

function Flag({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={!!checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-blue-700"
      />

      {label}
    </label>
  );
}

export default function HeirsPage() {
  const { data, append, set } = useCase();

  const heirs = data.heirs ?? [];

  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Give existing heirs permanent IDs.
  useEffect(() => {
    if (heirs.some((heir) => !heir.id)) {
      set('heirs', ensureHeirIds(heirs));
    }
  }, [heirs, set]);

  // Generate family tree.
  const tree = useMemo(
    () => numberedHeirs(heirs),
    [heirs]
  );

  const byId = useMemo(
    () => new Map(
      heirs.map((heir) => [heir.id, heir])
    ),
    [heirs]
  );

  const editingIndex = heirs.findIndex(
    (heir) => heir.id === editingId
  );

  // Add or edit a person.
  function edit(id = null) {
    const existing = id ? byId.get(id) : null;

    if (id && !existing) return;

    setEditingId(id);

    setForm(
      existing
        ? structuredClone(existing)
        : {
            ...newHeir(),
            id: crypto.randomUUID(),
            parentId: null,
            spouse: null,
          }
    );
  }

  // Save the person.
  function save() {
    if (!form) return;

    const person = {
      ...form,
      id: form.id || crypto.randomUUID(),
    };

    const forbidden = descendantIds(
      heirs,
      person.id
    );

    // Prevent circular relationships.
    if (
      person.parentId &&
      forbidden.has(person.parentId)
    ) {
      person.parentId = null;
    }

    if (editingId === null) {
      append('heirs', person);
    } else if (editingIndex >= 0) {
      set(['heirs', editingIndex], person);
    }

    setSelectedId(person.id);
    setForm(null);
  }

  // Delete person and promote their children.
  function deleteSelected() {
    const person = byId.get(selectedId);

    if (!person) return;

    const next = heirs
      .filter((heir) => heir.id !== selectedId)
      .map((heir) =>
        heir.parentId === selectedId
          ? {
              ...heir,
              parentId: person.parentId ?? null,
            }
          : heir
      );

    set('heirs', next);
    setSelectedId(null);
  }

  const forbiddenParents = form
    ? descendantIds(heirs, form.id)
    : new Set();

  const availableParents = tree.filter(
    ({ heir }) => !forbiddenParents.has(heir.id)
  );

  const selectedExists =
    selectedId && byId.has(selectedId);

  return (
    <Page
      title="Arvtagare"
      description="Skapa en familjehierarki med separata makar/makor och barn för varje arvtagare."
    >
      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="primary"
          onClick={() => edit()}
        >
          + Lägg till person
        </Button>

        <Button
          disabled={!selectedExists}
          onClick={() => edit(selectedId)}
        >
          Ändra person
        </Button>

        <Button
          disabled={!selectedExists}
          onClick={() => {
            const parentId = selectedId;

            setEditingId(null);

            setForm({
              ...newHeir(),
              id: crypto.randomUUID(),
              parentId,
              spouse: null,
            });
          }}
        >
          + Lägg till barn / underordnad
        </Button>

        <Button
          variant="danger"
          disabled={!selectedExists}
          onClick={deleteSelected}
        >
          Ta bort person
        </Button>
      </div>

      {/* Family tree table */}
      <TableBox>
        <Head>
          {[
            'Nr',
            'Namn / familjeträd',
            'Make / maka',
            'Personnr',
            'Typ av arvtagare',
            'Relation',
            'Avl.',
          ].map((heading) => (
            <Th key={heading}>
              {heading}
            </Th>
          ))}
        </Head>

        <tbody>
          {tree.length > 0 ? (
            tree.map(({ heir, number, depth }) => (
              <tr
                key={heir.id}
                onClick={() => setSelectedId(heir.id)}
                onDoubleClick={() => edit(heir.id)}
                className={`cursor-pointer hover:bg-brand-soft ${
                  selectedId === heir.id
                    ? 'bg-blue-100'
                    : ''
                }`}
              >
                <Td>{number}</Td>

                <Td>
                  <div
                    style={{
                      paddingLeft: `${depth * 18}px`,
                    }}
                    className="font-medium"
                  >
                    {depth > 0 ? '↳ ' : ''}
                    {heirName(heir) || 'Namnlös person'}
                  </div>
                </Td>

                <Td>{heirName(heir.spouse)}</Td>
                <Td>{heir.personnummer}</Td>

                <Td>
                  {(heir.types ?? []).join(', ')}
                </Td>

                <Td>{heir.relation}</Td>
                <Td>{heir.deceased ? 'Ja' : ''}</Td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={7}
                className="p-7 text-center text-slate-500"
              >
                Inga arvtagare registrerade.
              </td>
            </tr>
          )}
        </tbody>
      </TableBox>

      {/* Add / edit modal */}
      {form && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Personuppgifter arvtagare"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3"
        >
          <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-xl bg-white shadow-xl">
            {/* Modal header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-4">
              <h2 className="font-semibold">
                Personuppgifter och familjerelationer
              </h2>

              <button
                type="button"
                className="text-xl text-slate-600"
                onClick={() => setForm(null)}
                aria-label="Stäng"
              >
                ×
              </button>
            </div>

            {/* Modal content */}
            <div className="space-y-6 p-5">
              <div className="grid gap-8 lg:grid-cols-2">
                {/* Personal details */}
                <section className="space-y-3">
                  <h3 className="font-semibold">
                    Personuppgifter
                  </h3>

                  <Grid>
                    <ModalField
                      label="Förnamn"
                      field="firstName"
                      form={form}
                      setForm={setForm}
                    />

                    <ModalField
                      label="Efternamn"
                      field="lastName"
                      form={form}
                      setForm={setForm}
                    />

                    <ModalField
                      label="Personnr"
                      field="personnummer"
                      form={form}
                      setForm={setForm}
                    />

                    <ModalField
                      label="Kön"
                      field="gender"
                      form={form}
                      setForm={setForm}
                      options={[
                        'Man',
                        'Kvinna',
                        'Ej fysisk person',
                      ]}
                    />

                    <ModalField
                      label="Postutdelningsadress"
                      field="address"
                      form={form}
                      setForm={setForm}
                    />

                    <ModalField
                      label="Postnr"
                      field="postalCode"
                      form={form}
                      setForm={setForm}
                    />

                    <ModalField
                      label="Ort"
                      field="city"
                      form={form}
                      setForm={setForm}
                    />

                    <ModalField
                      label="Land"
                      field="country"
                      form={form}
                      setForm={setForm}
                    />
                  </Grid>
                </section>

                {/* Attendance */}
                <section className="space-y-3">
                  <h3 className="font-semibold">
                    Kallelse / närvaro
                  </h3>

                  <div className="flex flex-wrap gap-3">
                    <Flag
                      label="Kallas till förrättning"
                      checked={form.called}
                      onChange={(called) =>
                        setForm((f) => ({
                          ...f,
                          called,
                        }))
                      }
                    />

                    <Flag
                      label="Kallelsebevis bifogas"
                      checked={form.proof}
                      onChange={(proof) =>
                        setForm((f) => ({
                          ...f,
                          proof,
                        }))
                      }
                    />
                  </div>

                  <Grid>
                    <ModalField
                      label="Närvaro"
                      field="presence"
                      form={form}
                      setForm={setForm}
                      options={presenceOptions}
                    />

                    <ModalField
                      label="Bilaga"
                      field="attachment"
                      form={form}
                      setForm={setForm}
                    />

                    <ModalField
                      label="Företrädare förnamn"
                      field="repFirst"
                      form={form}
                      setForm={setForm}
                    />

                    <ModalField
                      label="Företrädare efternamn"
                      field="repLast"
                      form={form}
                      setForm={setForm}
                    />

                    <ModalField
                      label="Företrädare adress"
                      field="repAddress"
                      form={form}
                      setForm={setForm}
                    />
                  </Grid>
                </section>
              </div>

              {/* Family hierarchy */}
              <section className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h3 className="font-semibold">
                  Familjehierarki
                </h3>

                <label className="block space-y-1">
                  <span className="block text-xs font-semibold">
                    Förälder / överordnad arvtagare
                  </span>

                  <select
                    className={control}
                    value={form.parentId ?? ''}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        parentId: e.target.value || null,
                      }))
                    }
                  >
                    <option value="">
                      Direkt arvtagare (nivå 1)
                    </option>

                    {availableParents.map(
                      ({ heir, number }) => (
                        <option
                          key={heir.id}
                          value={heir.id}
                        >
                          {number} – {heirName(heir) || 'Namnlös person'}
                        </option>
                      )
                    )}
                  </select>
                </label>

                <p className="text-xs text-slate-500">
                  Barn visas under vald person:
                  exempelvis 2.1, 2.2 och 2.2.1.
                </p>

                {/* Individual spouse */}
                <Flag
                  label="Personen har make / maka"
                  checked={!!form.spouse}
                  onChange={(checked) =>
                    setForm((f) => ({
                      ...f,
                      spouse: checked
                        ? {
                            ...newSpouse(),
                            ...(f.spouse ?? {}),
                          }
                        : null,
                    }))
                  }
                />

                {form.spouse && (
                  <Grid>
                    <SpouseField
                      label="Makes/makas förnamn"
                      field="firstName"
                      form={form}
                      setForm={setForm}
                    />

                    <SpouseField
                      label="Makes/makas efternamn"
                      field="lastName"
                      form={form}
                      setForm={setForm}
                    />

                    <SpouseField
                      label="Makes/makas personnummer"
                      field="personnummer"
                      form={form}
                      setForm={setForm}
                    />

                    <SpouseField
                      label="Makes/makas kön"
                      field="gender"
                      form={form}
                      setForm={setForm}
                      options={[
                        'Man',
                        'Kvinna',
                        'Annat',
                      ]}
                    />
                  </Grid>
                )}
              </section>

              {/* Additional flags */}
              <div className="flex flex-wrap gap-5">
                <Flag
                  label="Personen är avliden"
                  checked={form.deceased}
                  onChange={(deceased) =>
                    setForm((f) => ({
                      ...f,
                      deceased,
                    }))
                  }
                />

                <Flag
                  label="Inte längre dödsbodelägare"
                  checked={form.notEstateParty}
                  onChange={(notEstateParty) =>
                    setForm((f) => ({
                      ...f,
                      notEstateParty,
                    }))
                  }
                />
              </div>

              {/* Reasons */}
              <div className="flex flex-wrap gap-4">
                {[
                  'godkännande av testamente',
                  'arvsavstående',
                  'annat',
                ].map((reason) => (
                  <Flag
                    key={reason}
                    label={reason}
                    checked={(form.reasons ?? []).includes(
                      reason
                    )}
                    onChange={(checked) =>
                      setForm((f) => ({
                        ...f,
                        reasons: checked
                          ? [
                              ...(f.reasons ?? []),
                              reason,
                            ]
                          : (f.reasons ?? []).filter(
                              (item) => item !== reason
                            ),
                      }))
                    }
                  />
                ))}
              </div>

              {/* Heir types and relationship */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <h3 className="mb-2 font-semibold">
                    Typ av arvtagare
                  </h3>

                  <div className="space-y-2">
                    {heirTypes.map((type) => (
                      <Flag
                        key={type.value}
                        label={type.label}
                        checked={(form.types ?? []).includes(
                          type.value
                        )}
                        onChange={(checked) =>
                          setForm((f) => ({
                            ...f,
                            types: checked
                              ? [
                                  ...(f.types ?? []),
                                  type.value,
                                ]
                              : (f.types ?? []).filter(
                                  (item) =>
                                    item !== type.value
                                ),
                          }))
                        }
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <ModalField
                    label="Relation"
                    field="relation"
                    form={form}
                    setForm={setForm}
                    options={relations}
                  />

                  <p className="mt-3 text-xs text-slate-500">
                    Förhandsvisning av familjehierarkin
                  </p>

                  <div className="mt-2 max-h-40 space-y-1 overflow-y-auto rounded-md border border-slate-200 bg-slate-50 p-2 text-xs text-slate-600">
                    {tree.map(
                      ({ heir, number, depth }) => (
                        <div
                          key={heir.id}
                          style={{
                            paddingLeft: `${depth * 12}px`,
                          }}
                        >
                          {number}.{' '}
                          {heirName(heir) ||
                            'Namnlös person'}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="sticky bottom-0 flex justify-end gap-2 border-t bg-slate-50 p-4">
              <Button
                onClick={() => setForm(null)}
              >
                Avbryt
              </Button>

              <Button
                variant="primary"
                onClick={save}
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      )}
    </Page>
  );
}
