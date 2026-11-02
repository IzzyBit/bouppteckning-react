import { useState } from 'react';
import Shell from '../components/layout/Shell.jsx';
import PersonPage from '../features/person/PersonPage.jsx';
import HeirsPage from '../features/heirs/HeirsPage.jsx';
import MeetingPage from '../features/meeting/MeetingPage.jsx';
import ClausesPage from '../features/clauses/ClausesPage.jsx';
import AssetsPage from '../features/finance/AssetsPage.jsx';
import DebtsPage from '../features/finance/DebtsPage.jsx';
import SurvivorPage from '../features/finance/SurvivorPage.jsx';
import SummaryPage from '../features/finance/SummaryPage.jsx';
import WordPage from '../features/word/WordPage.jsx';
const views = { 
    person: PersonPage, 
    heirs: HeirsPage, 
    meeting: MeetingPage, 
    clauses: ClausesPage, 
    assets: AssetsPage, 
    debts: DebtsPage, 
    survivor: SurvivorPage, 
    summary: SummaryPage, 
    word: WordPage 
};
export default function App() {
 const [page, setPage] = useState('person');
 const View = views[page] || PersonPage;
 return <Shell pageId={page} setPage={setPage}><View/></Shell>;
}
