import { useEffect, useRef, useState } from 'react';
import { renderAsync } from 'docx-preview';
import { useCase } from '../../context/CaseContext.jsx';
import { Page, Button } from '../../components/ui/Controls.jsx';
import { generateWordDocument } from '../../services/word.js';
export default function WordPage() {
<<<<<<< HEAD
 const {data}=useCase();
 const previewRef=useRef(null);
 const [blob,setBlob]=useState(null);
 const [status,setStatus]=useState('Dokumentet är ännu inte genererat.');
 const [loading,setLoading]=useState(false);
 const generate=async()=>{
  try {
   setLoading(true); setStatus('Genererar dokument ...');
   const output=await generateWordDocument(data);
   if (!previewRef.current) return;
   previewRef.current.replaceChildren();
   await renderAsync(output,previewRef.current,undefined,{inWrapper:true,breakPages:true,renderHeaders:true,renderFooters:true});
   setBlob(output);setStatus('Dokumentet är genererat och kan laddas ner.');
  } catch (err) { console.error(err);setStatus('Kunde inte generera dokumentet: '+err.message);setBlob(null); }
  finally {setLoading(false);}
 };
 const download=()=>{
  if (!blob)return;
  const name=[data.deceased.firstName,data.deceased.lastName].filter(Boolean).join('_').replace(/[^a-zA-Z0-9åäöÅÄÖ_-]/g,'_')||'bouppteckning';
  const href=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=href;a.download=`Bouppteckning_${name}.docx`;document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(href),1000);
 };
 // Once data changes, a previous preview no longer represents the current form.
 useEffect(()=>{setBlob(null);setStatus('Ärendet har ändrats. Generera dokumentet igen för att få aktuella uppgifter.');},[data]);
 return <Page title="Word-dokument" description="Skapa, förhandsgranska och ladda ner en bouppteckning som .docx.">
  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Dokumentet följer upplägget i den ursprungliga bouppteckningsmallen: personuppgifter, arvingar, handlingar, att-satser, tillgångar, skulder, sammanställning och underskrifter. Kontrollera innehållet före användning.</div>
  <div className="flex flex-wrap gap-2"><Button variant="primary" onClick={generate} disabled={loading}>{loading?'Genererar ...':'Skapa / uppdatera bouppteckning'}</Button><Button onClick={download} disabled={!blob}>Ladda ner Word</Button></div>
  <p role="status" className="rounded border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">{status}</p>
  <div className="word-preview min-h-[450px] rounded-lg bg-slate-300 p-5 sm:p-8" ref={previewRef}><p className="text-center text-sm text-slate-700">Word-förhandsvisningen visas här.</p></div>
 </Page>;
=======
    const { data } = useCase();
    const previewRef = useRef(null);
    const [blob, setBlob] = useState(null);
    const [status, setStatus] = useState('Dokumentet är ännu inte genererat.');
    const [loading, setLoading] = useState(false);
    const generate = async () => {
        try {
            setLoading(true); setStatus('Genererar dokument ...');
            const output = await generateWordDocument(data);
            if (!previewRef.current) return;
            previewRef.current.replaceChildren();
            await renderAsync(output, previewRef.current, undefined, { 
                inWrapper: true, 
                breakPages: true, 
                renderHeaders: true, 
                renderFooters: true 
            });
            setBlob(output); 
            setStatus('Dokumentet är genererat och kan laddas ner.');
        } catch (err) { 
            console.error(err); 
            setStatus('Kunde inte generera dokumentet: ' + err.message); setBlob(null); 
        }
        finally { setLoading(false); }
    };
    const download = () => {
        if (!blob) return;
        const name = [data.deceased.firstName, data.deceased.lastName].filter(Boolean).join('_').replace(/[^a-zA-Z0-9åäöÅÄÖ_-]/g, '_') || 'bouppteckning';
        const href = URL.createObjectURL(blob);
        const a = document.createElement('a'); 
        a.href = href; 
        a.download = `Bouppteckning_${name}.docx`; 
        document.body.appendChild(a); 
        a.click(); 
        a.remove();
        setTimeout(() => URL.revokeObjectURL(href), 1000);
    };
    // Once data changes, a previous preview no longer represents the current form.
    useEffect(() => { 
        setBlob(null); 
        setStatus('Ärendet har ändrats. Generera dokumentet igen för att få aktuella uppgifter.'); 
    }, [data]);
    return <Page title="Word-dokument" description="Skapa, förhandsgranska och ladda ner en bouppteckning som .docx.">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            Dokumentet följer upplägget i den ursprungliga bouppteckningsmallen: personuppgifter, arvingar, handlingar, att-satser, tillgångar, skulder, sammanställning och underskrifter. Kontrollera innehållet före användning.
        </div>
        <div className="flex flex-wrap gap-2">
            <Button variant="primary" onClick={generate} disabled={loading}>
                {loading ? 'Genererar ...' : 'Skapa / uppdatera bouppteckning'}
            </Button>
            <Button onClick={download} disabled={!blob}>Ladda ner Word</Button>
        </div>
        <p role="status" className="rounded border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">{status}</p>
        <div className="word-preview min-h-[450px] rounded-lg bg-slate-300 p-5 sm:p-8" ref={previewRef}>
            <p className="text-center text-sm text-slate-700">Word-förhandsvisningen visas här.</p>
        </div>
    </Page>;
>>>>>>> 7e794b9d2a2ddf3ad1a206a45ff016911fee9628
}
