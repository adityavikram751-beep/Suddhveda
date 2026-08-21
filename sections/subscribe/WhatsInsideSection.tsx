"use client";

import Image from "next/image";
import { Box, BookOpen, Star, Layers, QrCode } from "lucide-react";

export default function WhatsInsideSection() {
    return (
        <section className="py-14 sm:py-20 bg-white border-y border-[#EADCC9]/60">
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 text-center">

                {/* Heading */}
                <h2 className="text-[34px] sm:text-[44px] md:text-[48px] font-serif font-bold text-[#593102] leading-tight tracking-tight">
                    WHAT&apos;S INSIDE EVERY DELIVERY?
                </h2>

                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#D49313] to-transparent mx-auto my-3.5 rounded-full" />

                <div className="mt-14 grid gap-8 lg:grid-cols-3 items-center">
                    {/* Left Column Badges */}
                    <div className="space-y-6 text-right hidden lg:block">
                        <div className="flex items-center gap-4 justify-end rounded-2xl bg-[#FFF8EF] border border-[#EADCC9] p-4 shadow-2xs hover:border-[#D49313] transition-all">
                            <div className="text-right">
                                <h4 className="font-bold text-base text-[#593102]">Premium Glass Jar</h4>
                                <p className="text-xs text-[#8D7F73]">Aesthetic airtight glass packaging</p>
                            </div>
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white border border-[#EADCC9] text-[#D49313]">
                                <Box size={22} />
                            </div>
                        </div>

                        <div className="flex items-center gap-4 justify-end rounded-2xl bg-[#FFF8EF] border border-[#EADCC9] p-4 shadow-2xs hover:border-[#D49313] transition-all">
                            <div className="text-right">
                                <h4 className="font-bold text-base text-[#593102]">Floral Source &amp; Harvest detail</h4>
                                <p className="text-xs text-[#8D7F73]">Know the exact origin &amp; batch</p>
                            </div>
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white border border-[#EADCC9] text-[#D49313]">
                                <Star size={22} />
                            </div>
                        </div>

                        <div className="flex items-center gap-4 justify-end rounded-2xl bg-[#FFF8EF] border border-[#EADCC9] p-4 shadow-2xs hover:border-[#D49313] transition-all">
                            <div className="text-right">
                                <h4 className="font-bold text-base text-[#593102]">Information Card</h4>
                                <p className="text-xs text-[#8D7F73]">Story &amp; tasting notes included</p>
                            </div>
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white border border-[#EADCC9] text-[#D49313]">
                                <BookOpen size={22} />
                            </div>
                        </div>
                    </div>

                    {/* Center Visual Graphic */}
                    <div className="relative mx-auto w-full max-w-[420px] h-[340px] sm:h-[420px] rounded-3xl bg-gradient-to-b from-[#FAF5EC] to-white border-2 border-[#EADCC9] flex items-center justify-center shadow-xl overflow-hidden group">
                        <div className="relative w-full h-full">
                            <Image
                                src="/subscriber.png"
                                alt="Inside Every Delivery"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                priority
                            />
                        </div>
                    </div>

                    {/* Right Column Badges */}
                    <div className="space-y-6 text-left hidden lg:block">
                        <div className="flex items-center gap-4 rounded-2xl bg-[#FFF8EF] border border-[#EADCC9] p-4 shadow-2xs hover:border-[#D49313] transition-all">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white border border-[#EADCC9] text-[#D49313]">
                                <Star size={22} />
                            </div>
                            <div>
                                <h4 className="font-bold text-base text-[#593102]">Suggested Uses</h4>
                                <p className="text-xs text-[#8D7F73]">Chef &amp; Ayurvedic recommendations</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 rounded-2xl bg-[#FFF8EF] border border-[#EADCC9] p-4 shadow-2xs hover:border-[#D49313] transition-all">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white border border-[#EADCC9] text-[#D49313]">
                                <Layers size={22} />
                            </div>
                            <div>
                                <h4 className="font-bold text-base text-[#593102]">Storage guide</h4>
                                <p className="text-xs text-[#8D7F73]">Tips to preserve raw freshness</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 rounded-2xl bg-[#FFF8EF] border border-[#EADCC9] p-4 shadow-2xs hover:border-[#D49313] transition-all">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white border border-[#EADCC9] text-[#D49313]">
                                <QrCode size={22} />
                            </div>
                            <div>
                                <h4 className="font-bold text-base text-[#593102]">QR code to learn more</h4>
                                <p className="text-xs text-[#8D7F73]">Scan for lab test reports</p>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Badges Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:hidden text-left mt-4 sm:mt-0">
                        <div className="flex items-center gap-3 rounded-2xl bg-[#FFF8EF] border border-[#EADCC9] p-3 sm:p-3.5">
                            <Box size={20} className="text-[#D49313] shrink-0" />
                            <div>
                                <h4 className="font-bold text-sm text-[#593102]">Premium Glass Jar</h4>
                                <p className="text-[11px] text-[#8D7F73]">Aesthetic airtight glass packaging</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-2xl bg-[#FFF8EF] border border-[#EADCC9] p-3 sm:p-3.5">
                            <Star size={20} className="text-[#D49313] shrink-0" />
                            <div>
                                <h4 className="font-bold text-sm text-[#593102]">Floral Source &amp; Harvest</h4>
                                <p className="text-[11px] text-[#8D7F73]">Know exact origin &amp; batch</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-2xl bg-[#FFF8EF] border border-[#EADCC9] p-3 sm:p-3.5">
                            <BookOpen size={20} className="text-[#D49313] shrink-0" />
                            <div>
                                <h4 className="font-bold text-sm text-[#593102]">Information Card</h4>
                                <p className="text-[11px] text-[#8D7F73]">Story &amp; tasting notes</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-2xl bg-[#FFF8EF] border border-[#EADCC9] p-3 sm:p-3.5">
                            <Star size={20} className="text-[#D49313] shrink-0" />
                            <div>
                                <h4 className="font-bold text-sm text-[#593102]">Suggested Uses</h4>
                                <p className="text-[11px] text-[#8D7F73]">Chef &amp; Ayurvedic tips</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-2xl bg-[#FFF8EF] border border-[#EADCC9] p-3 sm:p-3.5">
                            <Layers size={20} className="text-[#D49313] shrink-0" />
                            <div>
                                <h4 className="font-bold text-sm text-[#593102]">Storage Guide</h4>
                                <p className="text-[11px] text-[#8D7F73]">Tips to preserve raw freshness</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-2xl bg-[#FFF8EF] border border-[#EADCC9] p-3 sm:p-3.5">
                            <QrCode size={20} className="text-[#D49313] shrink-0" />
                            <div>
                                <h4 className="font-bold text-sm text-[#593102]">QR Code Report</h4>
                                <p className="text-[11px] text-[#8D7F73]">Scan for lab test reports</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
