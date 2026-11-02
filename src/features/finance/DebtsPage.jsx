import { useCase } from '../../context/CaseContext.jsx';
import { EstateCalculator } from '../../utils/calculations.js';
import { Page, Section, Check } from '../../components/ui/Controls.jsx';
import { FinanceTable, ExpenseTable, TotalStrip } from './FinanceTables.jsx';
export default function DebtsPage() {
<<<<<<< HEAD
 const {data}=useCase();const calc=new EstateCalculator(data);
 const total=calc.debtTotal(data.debts)+calc.assetTotal(data.expenses);
 return <Page title="Den avlidnes skulder" description={`Skulder per ${data.deceased.deathDate || 'dödsdagen'}`}>
  <div className="space-y-3"><Check path="debtsSeparatePrenup" label="All den avlidnes skulder ska vara enskilda enligt äktenskapsförord"/><Check path="debtsSeparateWill" label="All den avlidnes skulder ska vara enskilda enligt gåva eller testamente"/></div>
  <FinanceTable kind="debt" path="debts" includeAttachment/><TotalStrip value={total}/>
  <Section title="Avgående poster" subtitle="Endast rader med belopp skrivs ut i bouppteckningen."><ExpenseTable/></Section>
 </Page>;
=======
    const { data } = useCase(); const calc = new EstateCalculator(data);
    const total = calc.debtTotal(data.debts) + calc.assetTotal(data.expenses);
    return <Page title="Den avlidnes skulder" description={`Skulder per ${data.deceased.deathDate || 'dödsdagen'}`}>
        <div className="space-y-3">
            <Check path="debtsSeparatePrenup" label="All den avlidnes skulder ska vara enskilda enligt äktenskapsförord" />
            <Check path="debtsSeparateWill" label="All den avlidnes skulder ska vara enskilda enligt gåva eller testamente" />
        </div>
        <FinanceTable kind="debt" path="debts" includeAttachment />
        <TotalStrip value={total} />
        <Section title="Avgående poster" subtitle="Endast rader med belopp skrivs ut i bouppteckningen.">
            <ExpenseTable />
        </Section>
    </Page>;
>>>>>>> 7e794b9d2a2ddf3ad1a206a45ff016911fee9628
}
