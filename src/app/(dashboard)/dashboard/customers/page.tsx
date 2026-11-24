import { CustomersTable } from "@/components/dashboard/customers-table";
import { generateCustomers } from "@/lib/sample-data";

export const metadata = { title: "Customers" };

export default function CustomersPage() {
  const customers = generateCustomers();
  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
        <p className="text-sm text-muted-foreground">Search, filter, sort and paginate. Sample data only.</p>
      </div>
      <CustomersTable data={customers} />
    </>
  );
}
