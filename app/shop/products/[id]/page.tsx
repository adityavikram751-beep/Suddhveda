import { notFound } from "next/navigation";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import ProductDetailPage from "@/sections/shop/ProductDetailPage";
import { getProductsFromResponse, getSingleProductFromResponse, type ApiProduct } from "@/lib/api-products";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.shuddhvedahoney.com";

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

  const FETCH_OPTIONS: RequestInit = {
    next: { revalidate: 60 },
    headers: FETCH_HEADERS,
  };

  // Fetch combo, standard, all products (recommendations), and lab reports concurrently in parallel
  const [comboSettled, standardSettled, recSettled, labSettled] = await Promise.allSettled([
    fetch(`${API_BASE_URL}/api/combo/products/details/${id}`, FETCH_OPTIONS).then((r) =>
      r.ok ? r.json() : null
    ),
    fetch(`${API_BASE_URL}/api/products/${id}`, FETCH_OPTIONS).then((r) =>
      r.ok ? r.json() : null
    ),
    fetch(`${API_BASE_URL}/api/products`, FETCH_OPTIONS).then((r) =>
      r.ok ? r.json() : null
    ),
    fetch(`${API_BASE_URL}/api/admin/lab-report/all`, FETCH_OPTIONS).then((r) =>
      r.ok ? r.json() : null
    ),
  ]);

  let product: ApiProduct | null = null;
  if (comboSettled.status === "fulfilled" && comboSettled.value) {
    product = getSingleProductFromResponse(comboSettled.value);
  }
  if (!product && standardSettled.status === "fulfilled" && standardSettled.value) {
    product = getSingleProductFromResponse(standardSettled.value);
  }

  // Agar product fetch nahi hua tabhi notFound() hoga
  if (!product) {
    console.error("⚠️ Product is null, redirecting to 404.");
    notFound();
  }

  let allProducts: ApiProduct[] = [];
  let recommendations: ApiProduct[] = [];
  if (recSettled.status === "fulfilled" && recSettled.value) {
    allProducts = getProductsFromResponse(recSettled.value);
    recommendations = allProducts.filter((item) => item._id !== id);
  }

  let labReports: any[] = [];
  if (labSettled.status === "fulfilled" && labSettled.value) {
    const labResult = labSettled.value;
    labReports = Array.isArray(labResult)
      ? labResult
      : labResult?.data || labResult?.reports || [];
  }

  return (
    <>
      <Header />
      <ProductDetailPage
        product={product}
        recommendations={recommendations}
        allProducts={allProducts}
        initialLabReports={labReports}
      />
      <Footer />
    </>
  );
}
