import { Page } from "../../../components/SiteChrome";
import OrderStatus from "../../../components/OrderStatus";

export const metadata = { title: "Payment complete", robots: { index: false, follow: false } };

export default function Success({ searchParams }) {
  return (
    <Page narrow>
      <OrderStatus order={searchParams?.order || ""} error={searchParams?.error || ""} />
    </Page>
  );
}
