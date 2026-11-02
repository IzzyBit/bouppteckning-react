<<<<<<< HEAD
import { useState } from 'react';

import { useCase } from '../../context/CaseContext.jsx';
import { newOfficial } from '../../models/case.js';

import { getShownDocuments } from '../../utils/documentAttachments.js';
import { officialDetails } from '../../utils/savedOfficials.js';

import {
    Page,
    Grid,
    Field,
    Section,
    Button,
    TableBox,
    Head,
    Th,
    Td,
    CellInput,
    Check,
    InlineList,
} from '../../components/ui/Controls.jsx';

export default function MeetingPage() {
    const {
        data,
        set,
        append,
        remove,
        savedOfficials,
        setSavedOfficials,
    } = useCase();

    const saved = savedOfficials;
    const [selectedId, setSelectedId] = useState('');

    const shownDocuments = getShownDocuments(
        data.documents ?? {}
    );

    const change = (index, key, value) => {
        set(['officials', index, key], value);
    };

    // Store officials in React memory only.
    function updateSaved(next) {
        setSavedOfficials(next);
    }
    // Save or update an official
    function saveOfficial(official) {
        const details = officialDetails(official);

        const name = `${details.firstName} ${details.lastName}`
            .trim()
            .toLowerCase();

        if (!name) return;

        const existing = saved.find(
            (person) =>
                `${person.firstName} ${person.lastName}`
                    .trim()
                    .toLowerCase() === name
        );

        if (existing) {
            updateSaved(
                saved.map((person) =>
                    person.id === existing.id
                        ? { ...person, ...details }
                        : person
                )
            );
        } else {
            updateSaved([
                ...saved,
                {
                    id: crypto.randomUUID(),
                    ...details,
                },
            ]);
        }
    }

    // Load a saved official into the current case
    function loadOfficial() {
        const person = saved.find(
            (person) => person.id === selectedId
        );

        if (!person) return;

        const { id, ...details } = person;

        append('officials', {
            ...newOfficial(),
            ...details,
        });
    }

    // Delete an official from the saved register
    function deleteSavedOfficial() {
        if (!selectedId) return;

        updateSaved(
            saved.filter((person) => person.id !== selectedId)
        );

        setSelectedId('');
    }

    return (
        <Page
            title="Uppgifter om förrättning"
            description="Ange förrättningsort, datum, förrättningsmän och uppvisade handlingar."
        >
            {/* Meeting information */}
            <Grid cols={4}>
                <Field
                    label="Förrättningsort"
                    path="meeting.location"
                />

                <Field
                    label="Förrättningsdag"
                    type="date"
                    path="meeting.date"
                />

                <Field
                    label="Ärendenummer"
                    path="meeting.caseNumber"
                />

                <Field
                    label="Bouppgivare"
                    path="meeting.declarant"
                    placeholder="Namn på den som uppger boet"
                />
            </Grid>

            {/* Saved officials */}
            <Section
                title="Sparade förrättningsmän"
                subtitle="Återanvänd tidigare sparade förrättningsmän."
            >
                <div className="flex flex-wrap items-center gap-3">
                    <select
                        className="min-w-64 flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                        value={selectedId}
                        onChange={(e) => setSelectedId(e.target.value)}
                    >
                        <option value="">
                            Välj förrättningsman
                        </option>

                        {saved.map((person) => (
                            <option
                                key={person.id}
                                value={person.id}
                            >
                                {person.firstName} {person.lastName}
                                {person.title ? ` – ${person.title}` : ''}
                            </option>
                        ))}
                    </select>

                    <Button
                        variant="primary"
                        disabled={!selectedId}
                        onClick={loadOfficial}
                    >
                        Hämta uppgifter
                    </Button>

                    <Button
                        variant="danger"
                        disabled={!selectedId}
                        onClick={deleteSavedOfficial}
                    >
                        Ta bort sparad
                    </Button>
                </div>
            </Section>

            {/* Officials for current case */}
            <Section title="Förrättningsmän">
                <TableBox>
                    <Head>
                        {[
                            'Nr',
                            'Förnamn',
                            'Efternamn',
                            'Titel / företag',
                            'Adress',
                            'Postnr',
                            'Ort',
                            'Åtgärder',
                        ].map((heading) => (
                            <Th key={heading}>
                                {heading}
                            </Th>
                        ))}
                    </Head>

                    <tbody>
                        {data.officials.map((official, index) => (
                            <tr key={index}>
                                <Td>{index + 1}</Td>

                                <Td>
                                    <CellInput
                                        value={official.firstName}
                                        onChange={(value) =>
                                            change(index, 'firstName', value)
                                        }
                                    />
                                </Td>

                                <Td>
                                    <CellInput
                                        value={official.lastName}
                                        onChange={(value) =>
                                            change(index, 'lastName', value)
                                        }
                                    />
                                </Td>

                                {[
                                    'title',
                                    'address',
                                    'postalCode',
                                    'city',
                                ].map((key) => (
                                    <Td key={key}>
                                        <CellInput
                                            value={official[key]}
                                            onChange={(value) =>
                                                change(index, key, value)
                                            }
                                        />
                                    </Td>
                                ))}

                                <Td>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => saveOfficial(official)}
                                        >
                                            Spara
                                        </Button>

                                        <Button
                                            variant="danger"
                                            onClick={() =>
                                                remove('officials', index)
                                            }
                                        >
                                            ×
                                        </Button>
                                    </div>
                                </Td>
                            </tr>
                        ))}
                    </tbody>
                </TableBox>

                <div className="mt-3">
                    <Button
                        onClick={() =>
                            append('officials', newOfficial())
                        }
                    >
                        + Lägg till förrättningsman
                    </Button>
                </div>
            </Section>

            {/* Presented documents */}
            <Section title="Uppvisade handlingar för bouppteckning">
                <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
                    {/* Previous estate inventory */}
                    <Check
                        path="documents.prev"
                        label="Bouppteckning efter tidigare avliden"
                    />

                    <Grid>
                        <Field
                            label="Tidigare avlidens namn"
                            path="documents.prevName"
                        />

                        <Field
                            label="Upprättad"
                            type="date"
                            path="documents.prevDate"
                        />
                    </Grid>

                    {/* Will */}
                    <Check
                        path="documents.will"
                        label="Testamente"
                    />

                    <Field
                        label="Testamente – anteckning"
                        path="documents.willNote"
                    />

                    {/* Power of attorney */}
                    <Check
                        path="documents.power"
                        label="Fullmakt eller annan behörighetshandling har uppvisats"
                    />

                    <Field
                        label="Fullmakt – anteckning"
                        path="documents.powerNote"
                    />

                    {/* Prenuptial agreement */}
                    <Check
                        path="documents.prenup"
                        label="Äktenskapsförord"
                    />

                    <Grid>
                        <Field
                            label="Upprättat"
                            type="date"
                            path="documents.prenupDate"
                        />

                        <Field
                            label="Registrerat"
                            type="date"
                            path="documents.prenupRegistered"
                        />
                    </Grid>
                </div>
            </Section>

            {/* Custom presented documents */}
            <Section title="Egna uppvisade handlingar">
                <InlineList path="documents.custom" />
            </Section>

            {/* Automatically numbered attachments */}
            <Section
                title="Bilageförteckning"
                subtitle="Bilagorna numreras automatiskt enligt ordningen i Word-dokumentet."
            >
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                    {shownDocuments.length > 0 ? (
                        <ol className="divide-y divide-slate-100">
                            {shownDocuments.map((document) => (
                                <li
                                    key={document.key}
                                    className="flex items-start gap-4 py-3 first:pt-0 last:pb-0"
                                >
                                    <span className="min-w-20 shrink-0 rounded-md bg-slate-100 px-2 py-1 text-center text-xs font-semibold text-slate-700">
                                        {document.attachmentLabel}
                                    </span>

                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-slate-800">
                                            {document.title}
                                        </p>

                                        {document.text !== document.title && (
                                            <p className="mt-1 text-xs text-slate-500">
                                                {document.text}
                                            </p>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ol>
                    ) : (
                        <p className="text-sm text-slate-500">
                            Inga bilagor registrerade. Markera en uppvisad
                            handling ovan för att skapa en bilagehänvisning.
                        </p>
                    )}
                </div>

                {shownDocuments.length > 0 && (
                    <p className="mt-2 text-xs text-slate-500">
                        Totalt {shownDocuments.length} bilagor.
                        Numreringen uppdateras automatiskt när
                        handlingar läggs till eller tas bort.
                    </p>
                )}
            </Section>
        </Page>
    );
=======
import { useCase } from '../../context/CaseContext.jsx';
import { newOfficial } from '../../models/case.js';
import { Page, Grid, Field, Section, Button, TableBox, Head, Th, Td, CellInput, Check, InlineList } from '../../components/ui/Controls.jsx';
export default function MeetingPage() {
    const { data, set, append, remove } = useCase();
    const change = (i, key, value) => set(['officials', i, key], value);
    return <Page title="Uppgifter om förrättning" description="Ange förrättningsort, datum, förrättningsmän och uppvisade handlingar.">
        <Grid cols={4}><Field label="Förrättningsort" path="meeting.location" />
            <Field label="Förrättningsdag" type="date" path="meeting.date" />
            <Field label="Ärendenummer" path="meeting.caseNumber" />
            <Field label="Bouppgivare" path="meeting.declarant" placeholder="Namn på den som uppger boet" />
        </Grid>
        <Section title="Förrättningsmän">
            <TableBox>
                <Head>{['Nr', 'Namn', 'Titel / företag', 'Adress', 'Postnr', 'Ort', ''].map(x => <Th key={x}>{x}</Th>)}</Head>
                <tbody>{data.officials.map((o, i) => <tr key={i}>
                    <Td>{i + 1}</Td>
                    <Td><CellInput value={[o.firstName, o.lastName].filter(Boolean).join(' ')} onChange={value => { const parts = value.trim().split(/\s+/); set(['officials', i], { ...o, firstName: parts.shift() || '', lastName: parts.join(' ') }) }} /></Td>
                    {['title', 'address', 'postalCode', 'city'].map(key => <Td key={key}><CellInput value={o[key]} onChange={v => change(i, key, v)} /></Td>)}
                    <Td>
                        <Button variant="danger" onClick={() => remove('officials', i)}>×</Button>
                    </Td></tr>)}
                </tbody>
            </TableBox>
            <div className="mt-3">
                <Button onClick={() => append('officials', newOfficial())}>+ Lägg till förrättningsman</Button>
            </div>
        </Section>
        <Section title="Uppvisade handlingar för bouppteckning">
            <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
                <Check path="documents.prev" label="Bouppteckning efter tidigare avliden" />
                <Grid>
                    <Field label="Tidigare avlidens namn" path="documents.prevName" />
                    <Field label="Upprättad" type="date" path="documents.prevDate" />
                </Grid>
                <Check path="documents.will" label="Testamente har uppvisats / åberopats" />
                <Field label="Testamente – anteckning" path="documents.willNote" />
                <Check path="documents.power" label="Fullmakt eller annan behörighetshandling har uppvisats" />
                <Field label="Fullmakt – anteckning" path="documents.powerNote" />
                <Check path="documents.prenup" label="Äktenskapsförord" />
                <Grid>
                    <Field label="Upprättat" type="date" path="documents.prenupDate" />
                    <Field label="Registrerat" type="date" path="documents.prenupRegistered" />
                </Grid>
            </div>
        </Section>
        <InlineList title="Egna uppvisade handlingar" path="documents.custom" />
    </Page>;
>>>>>>> 7e794b9d2a2ddf3ad1a206a45ff016911fee9628
}
