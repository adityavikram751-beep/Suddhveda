import { notFound } from "next/navigation";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import ProductDetailPage from "@/sections/shop/ProductDetailPage";
import { getProductsFromResponse, getSingleProductFromResponse, type ApiProduct } from "@/lib/api-products";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://sltwdpp8-3000.inc1.devtunnels.ms";

const FETCH_HEADERS = {
  "X-Tunnel-Skip-Anti-Phishing-Page": "true",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let product: ApiProduct | null = null;
  let recommendations: ApiProduct[] = [];

  try {
    console.log("🔍 Requesting Combo Product URL:", `${API_BASE_URL}/api/combo/products/details/${id}`);

    const comboRes = await fetch(`${API_BASE_URL}/api/combo/products/details/${id}`, {
      cache: "no-store",
      headers: FETCH_HEADERS,
    });

    if (comboRes.ok) {
      const comboResult = await comboRes.json();
      console.log("📦 Combo API Data fetched successfully");
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
        headers: FETCH_HEADERS,
      });

      if (res.ok) {
        const result = await res.json();
        console.log("📦 Standard API Data fetched successfully");
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
      headers: FETCH_HEADERS,
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
