"use client";

import { CardCategoria } from "@/features/pos/components/CardCategoria";
import { CardService } from "@/features/pos/components/CardService";
import { SearchItem } from "@/features/pos/components/SearchItem";
import useEmblaCarousel from "embla-carousel-react";


export function ServicesCard() {

    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: false,
        duration: 30,
        align: "start",
        slidesToScroll: 5,
        breakpoints: {
            "(min-width: 768px)": {
                slidesToScroll: 6,
            },
        }
    });


    function scrollPrev() {
        emblaApi?.scrollPrev();
    }

    function scrollNext() {
        emblaApi?.scrollNext();
    }

    return (
        <div className="flex-1 flex flex-col gap-3 rounded-b-md border border-gray-300 border-t-0">
            <div className="px-4">
                <SearchItem />
            </div>
            <div className="overflow-auto custom-scrollbar flex gap-2 px-4">
                {
                    Array.from({ length: 5 }).map((_, idx) => (
                        <div key={idx}>
                            <CardCategoria />
                        </div>
                    ))
                }
            </div>
            <hr className="" />
            <div className="grid grid-cols-4 auto-rows-max gap-3 h-[calc(100vh-350px)] px-4 overflow-auto custom-scrollbar">
                <CardService />
                <CardService />
                <CardService />
                <CardService />
                <CardService />
                <CardService />
            </div>
        </div>
    )
}