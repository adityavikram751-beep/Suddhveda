export type Product = {
  id: number | string;
  badge: string;
  image: string;
  title: string;
  subtitle: string;
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
  {
    id: 1,
    badge: "Best Seller",
    image: "/honneycart.png",
    title: "Natural Honey",
    subtitle: "NATURAL HONEY",
    weight: "500g - Dark - Medium",
    price: 750,
    oldPrice: 900,
    discount: "20% Off",
    rating: 4.8,
    reviews: 120,
    category: "Natural Honey",
    flavor: "Wild Forest",
  },
  {
    id: 2,
    badge: "Most Loved",
    image: "/honneycart.png",
    title: "Mustard Honey",
    subtitle: "MUSTARD HONEY",
    weight: "500g - Dark - Medium",
    price: 750,
    oldPrice: 900,
    discount: "20% Off",
    rating: 4.7,
    reviews: 120,
    category: "Mustered Honey",
    flavor: "Mustard",
  },
  {
    id: 3,
    badge: "Most Loved",
    image: "/honneycart.png",
    title: "Multiflora Honey",
    subtitle: "MULTIFLORA HONEY",
    weight: "500g - Dark - Medium",
    price: 750,
    oldPrice: 900,
    discount: "20% Off",
    rating: 4.9,
    reviews: 120,
    category: "Multiflora Honey",
    flavor: "Multiflora",
  },
  {
    id: 4,
    badge: "Litchi Honey",
    image: "/honneycart.png",
    title: "Litchi Honey",
    subtitle: "LITCHI HONEY",
    weight: "500g - Dark - Medium",
    price: 750,
    oldPrice: 900,
    discount: "20% Off",
    rating: 4.6,
    reviews: 120,
    category: "Litchi Honey",
    flavor: "Litchi",
  },
  {
    id: 5,
    badge: "Best Seller",
    image: "/honneycart.png",
    title: "Wild Forest Honey",
    subtitle: "WILD FOREST HONEY",
    weight: "250g - Amber - Medium",
    price: 520,
    oldPrice: 650,
    discount: "20% Off",
    rating: 4.5,
    reviews: 210,
    category: "Natural Honey",
    flavor: "Wild Forest",
  },
  {
    id: 6,
    badge: "New",
    image: "/honneycart.png",
    title: "Mustard Honey",
    subtitle: "MUSTARD HONEY",
    weight: "250g - Golden - Medium",
    price: 520,
    oldPrice: 650,
    discount: "20% Off",
    rating: 4.4,
    reviews: 76,
    category: "Mustered Honey",
    flavor: "Mustard",
  },
  {
    id: 7,
    badge: "Popular",
    image: "/honneycart.png",
    title: "Multiflora Honey",
    subtitle: "MULTIFLORA HONEY",
    weight: "250g - Light - Medium",
    price: 520,
    oldPrice: 650,
    discount: "20% Off",
    rating: 4.3,
    reviews: 143,
    category: "Multiflora Honey",
    flavor: "Multiflora",
  },
  {
    id: 8,
    badge: "Premium",
    image: "/honneycart.png",
    title: "Litchi Honey",
    subtitle: "LITCHI HONEY",
    weight: "500g - Dark - Medium",
    price: 750,
    oldPrice: 900,
    discount: "20% Off",
    rating: 4.8,
    reviews: 112,
    category: "Litchi Honey",
    flavor: "Litchi",
  },
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
