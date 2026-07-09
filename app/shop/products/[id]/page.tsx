import { notFound } from "next/navigation";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import TopBar from "@/components/layout/TopBar";
import ProductDetailPage from "@/sections/shop/ProductDetailPage";
import { allProducts } from "@/lib/shop-data";

export function generateStaticParams() {
  return allProducts.map((product) => ({
    id: product.id.toString(),
  }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = allProducts.find((item) => item.id.toString() === id);

  if (!product) {
    notFound();
  }

  return (
    <>
      <TopBar />
      <Header />
      <ProductDetailPage product={product} />
      <Footer />
    </>
  );
}
