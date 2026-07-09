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
];

export default function HoneySelection() {
  const router = useRouter();

  return (
    <section
    className="
    relative
    mt-18
    bg-[#FFF7ED]
    overflow-hidden
    pt-2
    pb-14
    "
  >

      {/* Honey Drip */}
      <Image
        src="/nature.png"
        alt=""
        width={180}
        height={220}
        className="
        absolute
        left-0
        top-0
        w-[150px]
        lg:w-[180px]
        h-auto
        pointer-events-none
        select-none
        z-10
        "
      />

      {/* Bee */}
      <Image
        src="/madhu.png"
        alt=""
        width={42}
        height={42}
        className="
        absolute
        left-[140px]
        top-[110px]
        z-20
        "
      />

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
            text-[#6B2E08]
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
          gap-4
          md:gap-5
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
