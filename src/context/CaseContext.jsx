<<<<<<< HEAD

import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useState,
} from 'react';

import { newEstateCase } from '../models/case.js';

const CaseContext = createContext(null);

function pathUpdate(obj, path, value) {
  const copy = Array.isArray(obj)
    ? [...obj]
    : { ...(obj ?? {}) };

  const [head, ...tail] = path;

  copy[head] = tail.length
    ? pathUpdate(obj?.[head], tail, value)
    : value;

  return copy;
}

function reducer(state, action) {
  switch (action.type) {
    case 'set':
      return pathUpdate(
        state,
        action.path,
        action.value
      );

    case 'append':
      return {
        ...state,
        [action.key]: [
          ...(state[action.key] ?? []),
          action.value,
        ],
      };

    case 'remove':
      return {
        ...state,
        [action.key]: (state[action.key] ?? [])
          .filter((_, index) => index !== action.index),
      };

    case 'replace':
      return action.value;

    case 'reset':
      return newEstateCase();

    default:
      return state;
  }
}

export function CaseProvider({ children }) {
  // Case information: React memory only.
  const [data, dispatch] = useReducer(
    reducer,
    undefined,
    newEstateCase
  );

  // Saved officials: React memory only.
  const [savedOfficials, setSavedOfficials] = useState([]);

  function clearAll() {
    dispatch({ type: 'reset' });
    setSavedOfficials([]);
  }

  const api = useMemo(() => ({
    data,
    savedOfficials,
    setSavedOfficials,

    set: (path, value) =>
      dispatch({
        type: 'set',
        path: Array.isArray(path)
          ? path
          : path.split('.'),
        value,
      }),

    append: (key, value) =>
      dispatch({
        type: 'append',
        key,
        value,
      }),

    remove: (key, index) =>
      dispatch({
        type: 'remove',
        key,
        index,
      }),

    replace: (value) =>
      dispatch({
        type: 'replace',
        value,
      }),

    reset: clearAll,
    clearAll,
    clearDraft: clearAll,
  }), [data, savedOfficials]);

  return (
    <CaseContext.Provider value={api}>
      {children}
    </CaseContext.Provider>
  );
}

export function useCase() {
  const context = useContext(CaseContext);

  if (!context) {
    throw new Error('useCase outside CaseProvider');
  }

  return context;
}
=======
import { createContext, useContext, useMemo, useReducer } from 'react';
import { drafts } from '../services/storage.js';
import { newEstateCase } from '../models/case.js';
const CaseContext = createContext(null);
const pathUpdate = (obj, path, value) => {
  const copy = Array.isArray(obj) ? [...obj] : { ...(obj ?? {}) };
  const [head, ...tail] = path;
  copy[head] = tail.length ? pathUpdate(obj?.[head], tail, value) : value;
  return copy;
};
function reducer(state, action) {
  switch (action.type) {
    case 'set': return pathUpdate(state, action.path, action.value);
    case 'append': return { ...state, [action.key]: [...state[action.key], action.value] };
    case 'remove': return { ...state, [action.key]: state[action.key].filter((_, i) => i !== action.index) };
    case 'replace': return action.value;
    case 'reset': return newEstateCase();
    default: return state;
  }
}
export function CaseProvider({ children }) {
  const [data, dispatch] = useReducer(reducer, undefined, () => drafts.load());
  const api = useMemo(() => ({
    data,
    set: (path, value) => dispatch({ type: 'set', path: Array.isArray(path) ? path : path.split('.'), value }),
    append: (key, value) => dispatch({ type: 'append', key, value }),
    remove: (key, index) => dispatch({ type: 'remove', key, index }),
    replace: value => dispatch({ type: 'replace', value }),
    reset: () => dispatch({ type: 'reset' }),
    save: () => drafts.save(data),
    clearDraft: () => drafts.clear()
  }), [data]);
  return <CaseContext.Provider value={api}>{children}</CaseContext.Provider>;
}
export function useCase() { const ctx = useContext(CaseContext); if (!ctx) throw new Error('useCase outside CaseProvider'); return ctx; }
>>>>>>> 7e794b9d2a2ddf3ad1a206a45ff016911fee9628
