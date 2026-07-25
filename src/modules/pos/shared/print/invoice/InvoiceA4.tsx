import type { Company } from "@/modules/company/company.types";
import type { PosSettings } from "@/modules/pos/settings/types/PosSettings";
import type { Transaction } from "@/modules/pos/transaction/types/transaction";

import InvoiceStyles from "./InvoiceStyles";

import Header from "./components/Header";
import ItemsTable from "./components/ItemsTable";
import Summary from "./components/Summary";
import Payment from "./components/Payment";
import Signature from "./components/Signature";
import Footer from "./components/Footer";

interface Props {
  company: Company;
  settings: PosSettings;
  transaction: Transaction;
}

export default function InvoiceA4({
  company,
  settings,
  transaction,
}: Props) {
  return (
    <>
      <InvoiceStyles />

      <div className="invoice-page p-10">

        <Header
          company={company}
          settings={settings}
          transaction={transaction}
        />

        <ItemsTable
          transaction={transaction}
        />

        <Summary
          transaction={transaction}
        />

        <Payment
          settings={settings}
          transaction={transaction}
        />

        <Signature
          settings={settings}
        />

        <Footer
          settings={settings}
        />

      </div>
    </>
  );
}