import { notFound } from "next/navigation";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import ProductDetailPage from "@/sections/shop/ProductDetailPage";
import { getProductsFromResponse, getSingleProductFromResponse, type ApiProduct } from "@/lib/api-products";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Direct environment variable (Server side par crash nahi hoga)
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://suddhvedha-honey-backend.onrender.com";

  let product: ApiProduct | null = null;
  let recommendations: ApiProduct[] = [];

  try {
    console.log("🔍 Requesting Combo Product URL:", `${API_BASE_URL}/api/combo/products/details/${id}`);

    const comboRes = await fetch(`${API_BASE_URL}/api/combo/products/details/${id}`, {
      cache: "no-store",
    });

    if (comboRes.ok) {
      const comboResult = await comboRes.json();
      console.log("📦 Combo API Data:", comboResult);
      product = getSingleProductFromResponse(comboResult);
    }
  } catch (error) {
    console.error("❌ Failed to fetch combo product:", error);
  }

  if (!product) {
    try {
      console.log("🔍 Requesting Standard Product URL:", `${API_BASE_URL}/api/products/${id}`);

      const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        cache: "no-store",
      });

      if (res.ok) {
        const result = await res.json();
        console.log("📦 Standard API Data:", result);
        product = getSingleProductFromResponse(result);
      }
    } catch (error) {
      console.error("❌ Failed to fetch standard product:", error);
    }
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
      recommendations = allList.filter((item) => item._id !== id);
    }
  } catch (error) {
    console.error("❌ Failed to fetch recommendations:", error);
  }

  return (
    <>
      <Header />
      <ProductDetailPage product={product} recommendations={recommendations} />
      <Footer />
    </>
  );
}
