import { Page, Section } from '../../components/ui/Controls.jsx';
import { FinanceTable } from './FinanceTables.jsx';
export default function SurvivorPage() { return <Page title="Efterlevande makes egendom"><Section title="Efterlevande makens tillgångar"><FinanceTable kind="asset" path="survivorAssets"/></Section><Section title="Efterlevande makens skulder"><FinanceTable kind="debt" path="survivorDebts"/></Section></Page>; }
