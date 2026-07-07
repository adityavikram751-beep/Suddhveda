"use client";

import Image from "next/image";
import { FiUsers, FiDroplet } from "react-icons/fi";
import { GiBee } from "react-icons/gi";

export default function ImpactSection() {
  return (
    <section
      className="
      relative
      overflow-hidden
      bg-[#FFF8EF]
      border-t
      border-[#F2DFC9]
      pt-18 pb-18      "
    >
      {/* Honeycomb */}
      <Image
        src="/cartfour.png"
        alt=""
        width={400}
        height={340}
        className="
          absolute
          left-0
          top-10
          w-[400px]
          xl:w-[400px]
          h-auto
          pointer-events-none
          select-none
          z-16
        "
      />

      <div className="max-w-[1450px] mx-auto px-8">

        {/* Heading */}
        <div className="text-center ">

        <h2
  className="
    text-[46px]
    md:text-[40px]
    lg:text-[46px]
    font-medium
    text-[#6B2E08]
    leading-none
  "
>
  Every Drop Creates

  <span
    className="
      block
      mt-3
      text-[#D89A1B]
    "
  >
    A Difference
  </span>
</h2>

          {/* Divider */}
          <div className="flex items-center justify-center mt-5">

            <div className="w-24 h-px bg-[#E6D1B3]" />

            <Image
              src="/vector 3.png"
              alt=""
              width={24}
              height={24}
              className="mx-4"
            />

            <div className="w-24 h-px bg-[#E6D1B3]" />

          </div>

          <p
  className="
    mt-5
    max-w-[760px]
    mx-auto
    text-[#B08F74]
    text-[20px]
    leading-8
  "
>
  Every Purchase supports ethical beekeeping,
  thriving bee colonies, and a more sustainable future.
</p>
        </div>

        {/* Main Layout */}
        <div
          className="
          mt--8
          grid
          lg:grid-cols-[370px_1fr_280px]
          gap-10
          items-center
          relative
          "
        >
          {/* LEFT STATS */}
<div className="flex flex-col justify-between h-full py-6">

  {/* Happy Customers */}
  <div className="text-center">

    <div
      className="
      w-[88px]
      h-[88px]
      mx-auto
      rounded-full
      border
      border-[#E9C98D]
      flex
      items-center
      justify-center
      "
    >
      <FiUsers
        size={42}
        className="text-[#6B4A2A]"
      />
    </div>

    <h3
      className="
      mt-6
      text-[58px]
      font-bold
      leading-none
      text-[#C98A16]
      "
    >
      20,000+
    </h3>

    <h4
       className="
       mt-3
       text-[28px]
       font-medium
       text-[#6B2E08]
       "
    >
      Happy Customers
    </h4>

    <Image
  src="/four header.png"
  alt=""
  width={180}
  height={24}
  className="mx-auto mt-5 w-[200px] h-auto"
/>

    <p
      className="
      mt-5
      text-[18px]
      leading-7
      text-[#B08F74]
      "
    >
      Families who trust us for
      <br />
      their wellness
    </p>

  </div>

  {/* Bees Protected */}
  <div className="text-center mt-20">

    <div
      className="
      w-[88px]
      h-[88px]
      mx-auto
      rounded-full
      border
      border-[#E9C98D]
      flex
      items-center
      justify-center
      "
    >
      <GiBee
        size={42}
        className="text-[#6B4A2A]"
      />
    </div>

    <h3
      className="
      mt-6
      text-[58px]
      font-medium
      leading-none
      text-[#C98A16]
      "
    >
      7M+
    </h3>

    <h4
      className="
      mt-3
      text-[28px]
      font-medium
      text-[#6B2E08]
      "
    >
      Bees Protected
    </h4>

    <Image
  src="/four header.png"
  alt=""
  width={180}
  height={24}
  className="mx-auto mt-5 w-[200px] h-auto"
/>
    <p
      className="
      mt-5
      text-[18px]
      leading-7
      text-[#B08F74]
      "
    >
      We protect and nurture
      <br />
      millions of bees every day
    </p>

  </div>

</div>
{/* ================= CENTER IMAGE ================= */}
<div className="relative flex justify-center items-end h-[720px]">
  {/* Glow */}
  <div
  className="
    absolute
    w-[760px]
    h-[760px]
    rounded-full
    bg-[#FFF2DB]
    blur-[150px]
    opacity-90
  "
/>
  {/* Left Vertical Line */}
  <div
    className="
      hidden
      absolute
      left-0
      top-1/2
      -translate-y-1/2
      w-px
      h-[320px]
      bg-[#EBDCC8]
    "
  />

  {/* Right Vertical Line */}
  <div
    className="
      hidden
      absolute
      right-0
      top-1/2
      -translate-y-1/2
      w-px
      h-[220px]
      bg-[#EBDCC8]
    "
  />

  {/* Honey Image */}
  <Image
  src="/fourtsection.png"
  alt="Honey"
  width={650}
  height={720}
  priority
  className="
    relative
    z-20
    w-[620px]
    xl:w-[650px]
    h-auto
    object-contain
  "
/>

</div>

{/* ================= RIGHT STATS ================= */}
<div className="flex flex-col justify-between h-full py-6">

  {/* Healthy Colonies */}
  <div className="text-center">

    <div
      className="
      w-[88px]
      h-[88px]
      mx-auto
      rounded-full
      border
      border-[#E9C98D]
      flex
      items-center
      justify-center
      "
    >
      <FiDroplet
        size={42}
        className="text-[#6B4A2A]"
      />
    </div>

    <h3
      className="
      mt-6
      text-[58px]
      font-bold
      leading-none
      text-[#C98A16]
      "
    >
      1,250+
    </h3>

    <h4
      className="
      mt-3
      text-[28px]
      font-medium
      text-[#6B2E08]
      "
    >
      Healthy Bee Colonies
    </h4>

    <Image
  src="/four header.png"
  alt=""
  width={180}
  height={24}
  className="mx-auto mt-5 w-[200px] h-auto"
/>

    <p
      className="
      mt-5
      text-[18px]
      leading-7
      text-[#B08F74]
      "
    >
      Sustained and cared for across
      <br />
      thriving locations
    </p>

  </div>

  {/* Pure Honey */}
  <div className="text-center mt-20">

    <div
      className="
      w-[88px]
      h-[88px]
      mx-auto
      rounded-full
      border
      border-[#E9C98D]
      flex
      items-center
      justify-center
      "
    >
      <FiDroplet
        size={42}
        className="text-[#6B4A2A]"
      />
    </div>

    <h3
      className="
      mt-6
      text-[58px]
      font-bold
      leading-none
      text-[#C98A16]
      "
    >
      99.9%
    </h3>

    <h4
      className="
      mt-3
      text-[28px]
      font-medium
      text-[#6B2E08]
      "
    >
      Pure & Natural
    </h4>

    <Image
  src="/four header.png"
  alt=""
  width={180}
  height={24}
  className="mx-auto mt-5 w-[200px] h-auto"
/>
    <p
      className="
      mt-5
      text-[18px]
      leading-7
      text-[#B08F74]
      "
    >
      Unadulterated honey,
      <br />
      just as nature intended
    </p>

  </div>

</div>
</div>

{/* Bottom Glow */}
<div
  className="
    absolute
    left-1/2
    bottom-[-180px]
    -translate-x-1/2
    w-[900px]
    h-[320px]
    rounded-full
    bg-[#F8EFD9]
    blur-[130px]
    opacity-70
    pointer-events-none
  "
/>

{/* Bottom Decorative Line
<div
  className="
    absolute
    bottom-0
    left-0
    w-full
    h-px
    bg-gradient-to-r
    from-transparent
    via-[#EAD7BE]
    to-transparent
  "
/> */}
</div>
</section>
);
}