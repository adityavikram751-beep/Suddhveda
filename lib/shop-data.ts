export type Product = {
  id: number | string;
  badge: string;
  image: string;
  title: string;
  subtitle: string;
  tasteProfile?: string;
  shortDescription?: string;
  weight: string;
  price: number;
  oldPrice: number;
  discount: string;
  rating: number;
  reviews: number;
  category: string;
  flavor: string;
};

export const allProducts: Product[] = [
 
  

];

export const categories = [
  "All Honey",
  "Natural Honey",
  "Mustered Honey",
  "Multiflora Honey",
  "Litchi Honey",
];

export function getCategoryHref(category: string) {
  return `/shop/products?category=${encodeURIComponent(category)}`;
}
