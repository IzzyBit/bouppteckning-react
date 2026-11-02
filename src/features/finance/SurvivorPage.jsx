import { Page, Section } from '../../components/ui/Controls.jsx';
import { FinanceTable } from './FinanceTables.jsx';
<<<<<<< HEAD
export default function SurvivorPage() { return <Page title="Efterlevande makes egendom"><Section title="Efterlevande makens tillgångar"><FinanceTable kind="asset" path="survivorAssets"/></Section><Section title="Efterlevande makens skulder"><FinanceTable kind="debt" path="survivorDebts"/></Section></Page>; }
=======
export default function SurvivorPage() {
    return <Page title="Efterlevande makes egendom">
        <Section title="Efterlevande makens tillgångar">
            <FinanceTable kind="asset" path="survivorAssets" />
        </Section>
        <Section title="Efterlevande makens skulder">
            <FinanceTable kind="debt" path="survivorDebts" />
        </Section>
    </Page>;
}
>>>>>>> 7e794b9d2a2ddf3ad1a206a45ff016911fee9628
