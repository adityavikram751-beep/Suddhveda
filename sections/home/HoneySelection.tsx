"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/Productcard";
import { allProducts } from "@/lib/shop-data";

const products = [
  {
    badge: "Best Seller",
    image: "/honneycart.png",
    title: "Natural Honey",
    subtitle: "Raw • Unfiltered • Wilderness",
    weight: "500g • Dark • Medium",
    price: 750,
    oldPrice: 900,
    discount: "20% Off",
    rating: 4,
    reviews: 120,
  },
  {
    badge: "Rich Aroma",
    image: "/honneycart.png",
    title: "Mustard Honey",
    subtitle: "Raw • Unfiltered • Wilderness",
    weight: "500g • Dark • Medium",
    price: 750,
    oldPrice: 900,
    discount: "20% Off",
    rating: 4,
    reviews: 120,
  },
  {
    badge: "Most Loved",
    image: "/honneycart.png",
    title: "Multiflora Honey",
    subtitle: "Raw • Unfiltered • Wilderness",
    weight: "500g • Dark • Medium",
    price: 750,
    oldPrice: 900,
    discount: "20% Off",
    rating: 4,
    reviews: 120,
  },
  {
    badge: "Litchi Honey",
    image: "/honneycart.png",
    title: "Litchi Honey",
    subtitle: "Raw • Unfiltered • Wilderness",
    weight: "500g • Dark • Medium",
    price: 750,
    oldPrice: 900,
    discount: "20% Off",
    rating: 4,
    reviews: 120,
  },
  {
    badge: "Best Seller",
    image: "/honneycart.png",
    title: "Natural Honey",
    subtitle: "Raw • Unfiltered • Wilderness",
    weight: "500g • Dark • Medium",
    price: 750,
    oldPrice: 900,
    discount: "20% Off",
    rating: 4,
    reviews: 120,
  },
  {
    badge: "Rich Aroma",
    image: "/honneycart.png",
    title: "Mustard Honey",
    subtitle: "Raw • Unfiltered • Wilderness",
    weight: "500g • Dark • Medium",
    price: 750,
    oldPrice: 900,
    discount: "20% Off",
    rating: 4,
    reviews: 120,
  },
  {
    badge: "Most Loved",
    image: "/honneycart.png",
    title: "Multiflora Honey",
    subtitle: "Raw • Unfiltered • Wilderness",
    weight: "500g • Dark • Medium",
    price: 750,
    oldPrice: 900,
    discount: "20% Off",
    rating: 4,
    reviews: 120,
  },
  {
    badge: "Litchi Honey",
    image: "/honneycart.png",
    title: "Litchi Honey",
    subtitle: "Raw • Unfiltered • Wilderness",
    weight: "500g • Dark • Medium",
    price: 750,
    oldPrice: 900,
    discount: "20% Off",
    rating: 4,
    reviews: 120,
  },
];


export default function HoneySelection() {
  const router = useRouter();

  return (
    <section
    className="
    relative
    mt-2
    bg-[#FFF7ED]
    overflow-hidden
    pt-2
    pb-14
    "
  >

      

    

<div className="max-w-[1450px] mx-auto px-6 lg:px-10 pt-10">
        {/* Heading */}
        <div className="text-center mb-8">

          <h2
            className="
            text-[34px]
            md:text-[44px]
            lg:text-[56px]
            font-bold
            leading-tight
            text-[#2D3A1B]
            "
          >
            Nature&apos;s Finest Honey Selection
          </h2>

          <p
            className="
            mt-2
            max-w-[760px]
            mx-auto
            text-[#B09077]
            text-[16px]
            lg:text-[18px]
            leading-7
            "
          >
            From wildflower meadows to mustard fields,
            experience honey in its purest
            and most authentic form.
          </p>

        </div>
        {/* Product Grid */}
        <div
          className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-x-6
          gap-y-8
          md:gap-x-7
          md:gap-y-9
          mt-8
          items-stretch
          "
        >
          {products.map((product, index) => (
            <ProductCard
              key={index}
              badge={product.badge}
              image={product.image}
              title={product.title}
              subtitle={product.subtitle}
              weight={product.weight}
              price={product.price}
              oldPrice={product.oldPrice}
              discount={product.discount}
              rating={product.rating}
              reviews={product.reviews}
              onOpenDetails={() =>
                router.push(`/shop/products/${allProducts[index].id}`)
              }
            />
          ))}
        </div>

      </div>
    </section>
  );
}