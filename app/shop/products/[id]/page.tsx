import { notFound } from "next/navigation";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import TopBar from "@/components/layout/TopBar";
import ProductDetailPage from "@/sections/shop/ProductDetailPage";
import { getProductsFromResponse, getSingleProductFromResponse, type ApiProduct } from "@/lib/api-products";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Direct environment variable (Server side par crash nahi hoga)
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://sltwdpp8-3000.inc1.devtunnels.ms";

  let product: ApiProduct | null = null;
  let recommendations: ApiProduct[] = [];

  try {
    console.log("🔍 Requesting URL:", `${API_BASE_URL}/api/products/${id}`);

    const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      cache: "no-store",
    });

    console.log("📡 Response status:", res.status);

    if (res.ok) {
      const result = await res.json();
      console.log("📦 API Data:", result);
      product = getSingleProductFromResponse(result);
    } else {
      console.error("❌ API server error with status:", res.status);
    }
  } catch (error) {
    console.error("❌ Failed to fetch product:", error);
  }

  // Agar product fetch nahi hua tabhi notFound() hoga
  if (!product) {
    console.error("⚠️ Product is null, redirecting to 404.");
    notFound();
  }

  try {
    const recRes = await fetch(`${API_BASE_URL}/api/products`, {
      cache: "no-store",
    });

    if (recRes.ok) {
      const recResult = await recRes.json();
      const allList = getProductsFromResponse(recResult);
      recommendations = allList
        .filter((item) => item._id !== id)
        .slice(0, 4);
    }
  } catch (error) {
    console.error("❌ Failed to fetch recommendations:", error);
  }

  return (
    <>
      <TopBar />
      <Header />
      <ProductDetailPage product={product} recommendations={recommendations} />
      <Footer />
    </>
  );
}
