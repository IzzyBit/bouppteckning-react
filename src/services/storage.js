import { normalizeCase } from '../models/case.js';
const STORAGE_KEY = 'bouppteckningDraft';
export class DraftRepository {
  load() {
    try { return normalizeCase(JSON.parse(sessionStorage.getItem(STORAGE_KEY))); }
    catch (error) { console.warn('Could not load draft', error); return normalizeCase(null); }
  }
  save(data) { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
  clear() { sessionStorage.removeItem(STORAGE_KEY); }
}
export const drafts = new DraftRepository();
