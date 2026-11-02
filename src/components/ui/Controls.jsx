<<<<<<< HEAD

import { useCase } from '../../context/CaseContext.jsx';
import AutoDateField from './AutoDateField.jsx';

const inputClass =
  'w-full min-w-0 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100';

// Buttons
=======
import { useCase } from '../../context/CaseContext.jsx';
const inputClass = 'w-full min-w-0 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100';
>>>>>>> 7e794b9d2a2ddf3ad1a206a45ff016911fee9628
export function Button({
  children,
  variant = 'default',
  className = '',
  ...props
}) {
  const styles = {
    default: 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
    primary: 'border-brand bg-brand text-white hover:bg-blue-700',
<<<<<<< HEAD
    danger: 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100',
  };

  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors disabled:opacity-40 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// Layout
export function Section({ title, children, subtitle }) {
  return (
    <section className="min-w-0">
      <div className="mb-4 border-b border-slate-200 pb-2">
        <h2 className="text-base font-semibold text-slate-800">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-1 text-sm text-slate-500">
            {subtitle}
          </p>
        )}
      </div>

      {children}
    </section>
  );
}

export function Page({ title, description, children }) {
  return (
    <div className="mx-auto max-w-6xl space-y-7 pb-12">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold text-slate-900">
          {title}
        </h1>

        {description && (
          <p className="text-sm text-slate-500">
            {description}
          </p>
        )}
      </header>

      {children}
    </div>
  );
}

export function Grid({ children, cols = 2 }) {
  return (
    <div
      className={`grid grid-cols-1 gap-x-4 gap-y-3 ${
        cols === 4
          ? 'lg:grid-cols-4 sm:grid-cols-2'
          : 'sm:grid-cols-2'
      }`}
    >
      {children}
    </div>
  );
}

// Form fields
export function Field({
  label,
  path,
  type = 'text',
  options,
  placeholder = '',
  rows,
  ...props
}) {
  const { data, set } = useCase();

  const keys = path.split('.');
  const value = keys.reduce((o, key) => o?.[key], data) ?? '';

  const setValue = (newValue) => set(path, newValue);

  // Custom date picker with segmented date input
  if (type === 'date' && !options) {
    return (
      <AutoDateField
        label={label}
        value={value}
        onChange={setValue}
      />
    );
  }

  const common = {
    id: path,
    value,
    onChange: (e) => setValue(e.target.value),
    className: inputClass,
    ...props,
  };

  return (
    <label className="block min-w-0 space-y-1">
      <span className="block text-xs font-semibold text-slate-700">
        {label}
      </span>

      {options ? (
        <select {...common}>
          <option value="">Välj</option>

          {options.map((x) => (
            <option
              key={typeof x === 'string' ? x : x.value}
              value={typeof x === 'string' ? x : x.value}
            >
              {typeof x === 'string' ? x : x.label}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          {...common}
          rows={rows || 3}
          placeholder={placeholder}
        />
      ) : (
        <input
          {...common}
          type={type}
          placeholder={placeholder}
        />
      )}
    </label>
  );
}

// Checkboxes
export function Check({ label, path }) {
  const { data, set } = useCase();

  const checked =
    path.split('.').reduce((o, key) => o?.[key], data) ?? false;

  return (
    <label className="flex items-start gap-2 text-sm text-slate-700">
      <input
        type="checkbox"
        className="mt-1 accent-blue-700"
        checked={!!checked}
        onChange={(e) => set(path, e.target.checked)}
      />

      <span>{label}</span>
    </label>
  );
}

export function CheckArray({ label, path, value }) {
  const { data, set } = useCase();

  const list =
    path.split('.').reduce((o, key) => o?.[key], data) ?? [];

  return (
    <label className="flex items-start gap-2 text-sm text-slate-700">
      <input
        type="checkbox"
        className="mt-1 accent-blue-700"
        checked={list.includes(value)}
        onChange={(e) =>
          set(
            path,
            e.target.checked
              ? [...list, value]
              : list.filter((x) => x !== value)
          )
        }
      />

      <span>{label}</span>
    </label>
  );
}

// Radio buttons
export function Radio({ label, path, options }) {
  const { data, set } = useCase();

  const value =
    path.split('.').reduce((o, key) => o?.[key], data) ?? '';

  return (
    <fieldset>
      <legend className="mb-1 text-xs font-semibold text-slate-700">
        {label}
      </legend>

      <div className="flex flex-wrap gap-4">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center gap-1.5 text-sm"
          >
            <input
              type="radio"
              name={path}
              className="accent-blue-700"
              checked={value === option}
              onChange={() => set(path, option)}
            />

            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

// Table components
export function TableBox({ children }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="min-w-[690px] w-full text-left text-sm">
        {children}
      </table>
    </div>
  );
}

export function Head({ children }) {
  return (
    <thead className="bg-slate-100 text-xs font-semibold text-slate-700">
      <tr>{children}</tr>
    </thead>
  );
}

export function Th({ children }) {
  return (
    <th className="border-b border-slate-200 px-3 py-2 whitespace-nowrap">
      {children}
    </th>
  );
}

export function Td({ children, ...props }) {
  return (
    <td
      className="border-b border-slate-100 px-2 py-2 align-middle"
      {...props}
    >
      {children}
    </td>
  );
}

export function CellInput({
  value,
  onChange,
  type = 'text',
  options,
  ...props
}) {
  if (options) {
    return (
      <select
        className={inputClass}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      type={type}
      step={type === 'number' ? '0.01' : undefined}
      className={inputClass}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      {...props}
    />
  );
}

// Dynamic inline lists
export function InlineList({
  path,
  title,
  initial = () => ({ enabled: true, text: '' }),
}) {
  const { data, set } = useCase();

  const arr =
    path.split('.').reduce((o, key) => o?.[key], data) ?? [];

  const update = (idx, patch) => {
    set(
      path,
      arr.map((x, i) =>
        i === idx ? { ...x, ...patch } : x
      )
    );
  };

  return (
    <div className="space-y-3">
      {title && (
        <h3 className="font-medium">
          {title}
        </h3>
      )}

      {arr.map((x, i) => (
        <div
          key={i}
          className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3"
        >
          <input
            type="checkbox"
            className="mt-3 accent-blue-700"
            checked={x.enabled}
            onChange={(e) =>
              update(i, { enabled: e.target.checked })
            }
          />

          <textarea
            rows="2"
            aria-label="Text"
            className={inputClass}
            value={x.text}
            onChange={(e) =>
              update(i, { text: e.target.value })
            }
          />

          <Button
            variant="danger"
            onClick={() =>
              set(
                path,
                arr.filter((_, index) => index !== i)
              )
            }
          >
            Ta bort
          </Button>
        </div>
      ))}

      <Button
        onClick={() => set(path, [...arr, initial()])}
      >
        + Lägg till
      </Button>
    </div>
  );
=======
    danger: 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
  };
  return <button type="button" className={
    `inline-flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors disabled:opacity-40 ${styles[variant]} ${className}`
  } {...props}>{children}</button>;
}
export function Section({ title, children, subtitle }) {
  return <section className="min-w-0">
    <div className="mb-4 border-b border-slate-200 pb-2">
      <h2 className="text-base font-semibold text-slate-800">{title}</h2>{
        subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      }</div>{children}
  </section>;
}
export function Page({ title, description, children }) {
  return <div className="mx-auto max-w-6xl space-y-7 pb-12">
    <header className="space-y-1">
      <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
      {description && <p className="text-sm text-slate-500">{description}</p>}
    </header>{children}
  </div>;
}
export function Grid({ children, cols = 2 }) {
  return <div className={
    `grid grid-cols-1 gap-x-4 gap-y-3 ${cols === 4 ? 'lg:grid-cols-4 sm:grid-cols-2' : 'sm:grid-cols-2'
    }`
  }>{children}
  </div>;
}
export function Field({ label, path, type = 'text', options, placeholder = '', rows, ...props }) {
  const { data, set } = useCase();
  const keys = path.split('.');
  const value = keys.reduce((o, key) => o?.[key], data) ?? '';
  const common = { id: path, value, onChange: e => set(path, e.target.value), className: inputClass, ...props };
  return <label className="block min-w-0 space-y-1">
    <span className="block text-xs font-semibold text-slate-700">{label}</span>
    {options ? <select {...common}>
      <option value="">Välj</option>{options.map(x => <option key={typeof x === 'string' ? x : x.value} value={typeof x === 'string' ? x : x.value}>
        {typeof x === 'string' ? x : x.label}
      </option>)
      }</select> : type === 'textarea' ? <textarea {...common}
        rows={rows || 3}
        placeholder={placeholder} /> : <input {...common}
          type={type}
          placeholder={placeholder} />
    }</label>;
}
export function Check({ label, path }) {
  const { data, set } = useCase();
  const checked = path.split('.').reduce((o, key) => o?.[key], data) ?? false;
  return <label className="flex items-start gap-2 text-sm text-slate-700">
    <input type="checkbox" className="mt-1 accent-blue-700" checked={!!checked} onChange={e => set(path, e.target.checked)} />
    <span>{label}</span>
  </label>;
}
export function CheckArray({ label, path, value }) {
  const { data, set } = useCase();
  const list = path.split('.').reduce((o, key) => o?.[key], data) ?? [];
  return <label className="flex items-start gap-2 text-sm text-slate-700">
    <input type="checkbox" className="mt-1 accent-blue-700" checked={
      list.includes(value)
    } onChange={e => set(path, e.target.checked ? [...list, value] : list.filter(x => x !== value))} />
    <span>{label}</span>
  </label>;
}
export function Radio({ label, path, options }) {
  const { data, set } = useCase();
  const value = path.split('.').reduce((o, key) => o?.[key], data) ?? '';
  return <fieldset><legend className="mb-1 text-xs font-semibold text-slate-700">{label}</legend>
    <div className="flex flex-wrap gap-4">{options.map(option => <label key={option} className="flex items-center gap-1.5 text-sm">
      <input type="radio" name={path} className="accent-blue-700" checked={value === option} onChange={() => set(path, option)} />
      {option}</label>)}
    </div>
  </fieldset>;
}
export function TableBox({ children }) {
  return <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
    <table className="min-w-[690px] w-full text-left text-sm">{children}</table>
  </div>;
}
export function Head({ children }) {
  return <thead className="bg-slate-100 text-xs font-semibold text-slate-700">
    <tr>{children}</tr>
  </thead>;
}
export function Th({ children }) {
  return <th className="border-b border-slate-200 px-3 py-2 whitespace-nowrap">{children}</th>;
}
export function Td({ children, ...props }) {
  return <td className="border-b border-slate-100 px-2 py-2 align-middle" {...props}>{children}</td>;
}
export function CellInput({ value, onChange, type = 'text', options }) {
  return options ? <select className={inputClass} value={value ?? ''} onChange={e => onChange(e.target.value)}>
    {options.map(o => <option key={o} value={o}>{o}</option>)}
  </select> : <input type={type} step={type === 'number' ? '0.01' : undefined}
    className={inputClass}
    value={value ?? ''}
    onChange={e => onChange(e.target.value)}
  />;
}
export function InlineList({ path, title, initial = () => ({ enabled: true, text: '' }) }) {
  const { data, set } = useCase();
  const arr = path.split('.').reduce((o, key) => o?.[key], data) ?? [];
  const update = (idx, patch) => set(path, arr.map((x, i) => i === idx ? { ...x, ...patch } : x));
  return <div className="space-y-3">{title && <h3 className="font-medium">{title}</h3>}{arr.map((x, i) => <div key={i}
    className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3">
    <input type="checkbox" className="mt-3 accent-blue-700" checked={x.enabled} onChange={e => update(i,
      { enabled: e.target.checked })} />
    <textarea rows="2" aria-label="Text"
      className={inputClass}
      value={x.text}
      onChange={e => update(i, {
        text: e.target.value
      })} />
    <Button variant="danger" onClick={() => set(path, arr.filter((_, index) => index !== i))}>Ta bort</Button>
  </div>)
  }<Button onClick={() => set(path, [...arr, initial()])}>+ Lägg till</Button>
  </div>;
>>>>>>> 7e794b9d2a2ddf3ad1a206a45ff016911fee9628
}
