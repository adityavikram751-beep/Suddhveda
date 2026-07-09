import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import TopBar from "@/components/layout/TopBar";
import ProductListing from "@/sections/shop/ProductListing";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      <TopBar />
      <Header />
      <ProductListing
        initialCategory={params.category ?? "All Honey"}
        initialSearch={params.search ?? ""}
      />
      <Footer />
    </>
  );
}
