import { useState } from 'react';
import { pages } from '../../config/navigation.js';
import { useCase } from '../../context/CaseContext.jsx';
import { Button } from '../ui/Controls.jsx';
import { ArrowLeft, ArrowRight, FileText, Menu, Plus, Save, X } from 'lucide-react';
export default function Shell({ pageId, setPage, children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [message, setMessage] = useState('');
  const { save, reset, clearDraft } = useCase();
  const page = pages.find(p => p.id === pageId);
  const navigate = dir => setPage(pages[Math.max(0, Math.min(pages.length - 1, pages.findIndex(p => p.id === pageId) + dir))].id);
  const newCase = () => {
    if (!window.confirm('Starta ett nytt ärende? Osparade uppgifter rensas.')) return;
<<<<<<< HEAD
    clearDraft(); reset(); setPage('person'); setMessage('Nytt ärende skapat.');
  };
  const saveDraft = () => { try { save(); setMessage('Utkast sparat för den här webbläsarsessionen.'); } catch { setMessage('Det gick inte att spara utkastet.'); } };
  return <div className="flex min-h-screen flex-col bg-slate-50">
    <header className="sticky top-0 z-30 flex min-h-16 flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-4 py-2 shadow-sm">
      <button className="mr-1 rounded p-2 text-slate-600 lg:hidden" aria-label="Visa navigering" onClick={() => setMenuOpen(!menuOpen)}><Menu size={20}/></button>
      <div className="mr-auto flex items-center gap-2">
        <FileText className="text-brand" size={21}/>
        <span className="font-semibold tracking-tight">Bouppteckning</span>
        <span className="hidden rounded bg-brand-soft px-2 py-1 text-xs text-brand sm:inline">BOU03</span>
      </div>
      <Button onClick={newCase}><Plus size={15}/> 
        Nytt
      </Button>
      <Button onClick={saveDraft}><Save size={15}/> 
        Spara
      </Button>
      <span className="mx-1 hidden h-6 w-px bg-slate-200 sm:block"/>
      <Button onClick={() => navigate(-1)} disabled={pageId === pages[0].id}>
        <ArrowLeft size={15}/> 
=======
    clearDraft();
    reset();
    setPage('person');
    setMessage('Nytt ärende skapat.');
  };
  const saveDraft = () => {
    try {
      save();
      setMessage('Utkast sparat för den här webbläsarsessionen.');
    } catch {
      setMessage('Det gick inte att spara utkastet.');
    }
  };
  return <div className="flex min-h-screen flex-col bg-slate-50">
    <header className="sticky top-0 z-30 flex min-h-16 flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-4 py-2 shadow-sm">
      <button className="mr-1 rounded p-2 text-slate-600 lg:hidden" aria-label="Visa navigering" onClick={() => setMenuOpen(!menuOpen)}><Menu size={20} /></button>
      <div className="mr-auto flex items-center gap-2">
        <FileText className="text-brand" size={21} />
        <span className="font-semibold tracking-tight">Bouppteckning</span>
        <span className="hidden rounded bg-brand-soft px-2 py-1 text-xs text-brand sm:inline">BOU03</span>
      </div>
      <Button onClick={newCase}><Plus size={15} /> Nytt</Button>
      <Button onClick={saveDraft}><Save size={15} /> Spara</Button>
      <span className="mx-1 hidden h-6 w-px bg-slate-200 sm:block" />
      <Button onClick={() => navigate(-1)} disabled={pageId === pages[0].id}>
        <ArrowLeft size={15} />
>>>>>>> 7e794b9d2a2ddf3ad1a206a45ff016911fee9628
        <span className="hidden sm:inline">Föregående</span>
      </Button>
      <Button onClick={() => navigate(1)} disabled={pageId === pages.at(-1).id}>
        <span className="hidden sm:inline">Nästa</span>
<<<<<<< HEAD
        <ArrowRight size={15}/>
      </Button>
      <Button variant="primary" onClick={() => setPage('word')}><FileText size={15}/> 
        Word
      </Button>
    </header>
    {message && <div role="status" className="flex items-center justify-between border-b border-blue-200 bg-blue-50 px-5 py-2 text-sm text-blue-900">
      {message}
      <button aria-label="Stäng meddelande" onClick={() => setMessage('')}><X size={16}/></button>
      </div>
    }
    <div className="flex flex-1 overflow-hidden">
      {menuOpen && <button className="fixed inset-0 z-20 bg-slate-900/30 lg:hidden" aria-label="Stäng navigering" onClick={() => setMenuOpen(false)}/>}
      <aside className={`${menuOpen ? 'fixed inset-y-16 left-0 z-20 w-72 shadow-xl' : 'hidden'} lg:block lg:w-68 shrink-0 border-r border-slate-200 bg-white`}>
        <nav aria-label="Dokumentöversikt" className="sticky top-16 overflow-auto p-3 lg:max-h-[calc(100vh-4rem)]">
          <h2 className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">Dokumentöversikt</h2>
          {[...new Set(pages.map(p => p.group))].map(group => 
            <div key={group} className="mb-5">
            <p className="mb-1 px-3 text-xs font-semibold text-slate-500">{group}</p>
            <div className="space-y-0.5">
            {pages.filter(p => p.group === group).map(p => 
              <button key={p.id} onClick={() => 
                { setPage(p.id); setMenuOpen(false); }} className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${p.id === pageId ? 'bg-brand-soft font-semibold text-brand' : 'text-slate-600 hover:bg-slate-100'}`}>{p.label}
              </button>)}
            </div>
          </div>)}
=======
        <ArrowRight size={15} />
      </Button>
      <Button variant="primary" onClick={() => setPage('word')}><FileText size={15} /> Word</Button>
    </header>
    {message && <div role="status" className="flex items-center justify-between border-b border-blue-200 bg-blue-50 px-5 py-2 text-sm text-blue-900">{message}
      <button aria-label="Stäng meddelande" onClick={() => setMessage('')}><X size={16} /></button>
    </div>}
    <div className="flex flex-1 overflow-hidden">
      {menuOpen && <button className="fixed inset-0 z-20 bg-slate-900/30 lg:hidden" aria-label="Stäng navigering" onClick={() => setMenuOpen(false)} />}
      <aside className={`${menuOpen ? 'fixed inset-y-16 left-0 z-20 w-72 shadow-xl' : 'hidden'} lg:block lg:w-68 shrink-0 border-r border-slate-200 bg-white`}>
        <nav aria-label="Dokumentöversikt" className="sticky top-16 overflow-auto p-3 lg:max-h-[calc(100vh-4rem)]">
          <h2 className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">Dokumentöversikt</h2>
          {[...new Set(pages.map(p => p.group))].map(group =>
            <div key={group} className="mb-5">
              <p className="mb-1 px-3 text-xs font-semibold text-slate-500">{group}</p>
              <div className="space-y-0.5">{pages.filter(p => p.group === group).map(p => <button key={p.id} onClick={() => {
                setPage(p.id); setMenuOpen(false);
              }} className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${p.id === pageId ? 'bg-brand-soft font-semibold text-brand' : 'text-slate-600 hover:bg-slate-100'}`}>
                {p.label}</button>)}
              </div>
            </div>)
          }
>>>>>>> 7e794b9d2a2ddf3ad1a206a45ff016911fee9628
        </nav>
      </aside>
      <main className="min-w-0 flex-1">
        <div className="border-b border-blue-200 bg-blue-50 px-5 py-2 text-xs font-semibold text-brand sm:px-8">{page?.group} — {page?.label}</div>
        <div className="p-5 sm:p-8">{children}</div>
      </main>
    </div>
  </div>;
}
