import CustomerQrOrderPage from "@/modules/pos/qr-order/CustomerQrOrderPage";

export default async function PublicOrderPage({ params }: { params: Promise<{ companyId: string }> }) {
  const { companyId } = await params;
  return <CustomerQrOrderPage companyId={companyId} />;
}
