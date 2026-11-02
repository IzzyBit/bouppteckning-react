import { useCase } from '../../context/CaseContext.jsx';
import { EstateCalculator } from '../../utils/calculations.js';
import { num } from '../../utils/format.js';
import { Page, Section, Grid, Field, Check } from '../../components/ui/Controls.jsx';
import { FinanceTable, TotalStrip, UndividedTable } from './FinanceTables.jsx';
export default function AssetsPage() {
 const {data}=useCase();const calc=new EstateCalculator(data);
 const total=calc.assetTotal(data.assets)+data.undivided.reduce((s,r)=>s+num(r.value)-num(r.deduction),0);
 return <Page title="Den avlidnes tillgångar" description={`Tillgångar per ${data.deceased.deathDate || 'dödsdagen'}`}>
  <div className="space-y-3"><Check path="assetsSeparatePrenup" label="All den avlidnes tillgångar ska vara enskild enligt äktenskapsförord"/><Check path="assetsSeparateWill" label="All den avlidnes tillgångar ska vara enskild enligt gåva eller testamente"/></div>
  <FinanceTable kind="asset" path="assets" includeAttachment/><TotalStrip value={total}/>
  <Section title="Andel i oskiftat dödsbo"><Grid><Field label="Andel i oskiftat dödsbo efter" path="undividedAfter"/><Field label="Andel (%)" type="number" path="undividedShare"/></Grid><div className="mt-4"><UndividedTable/></div></Section>
 </Page>;
}
