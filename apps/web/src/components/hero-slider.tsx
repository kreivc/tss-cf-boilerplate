"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const BANNERS = ["/banner_1.jpeg", "/banner_2.jpeg", "/banner_3.jpeg"];

export function HeroSlider() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const scrollPrev = useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = useCallback(() => api?.scrollNext(), [api]);
  const scrollTo = useCallback((index: number) => api?.scrollTo(index), [api]);

  // Track current slide
  useEffect(() => {
    if (!api) {
      return;
    }

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Auto-play
  useEffect(() => {
    if (!api || isPaused) {
      return;
    }

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [api, isPaused]);

  return (
    <section
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <Carousel
        className="w-full"
        opts={{
          loop: true,
          align: "center",
        }}
        setApi={setApi}
      >
        <CarouselContent>
          {BANNERS.map((src, index) => (
            <CarouselItem key={src}>
              <div
                className={`relative mx-4 aspect-[2.75/1] overflow-hidden rounded-2xl transition-all duration-500 ${current === index ? "scale-100" : "scale-95 opacity-70"}`}
              >
                <img
                  alt={`Banner ${index + 1}`}
                  className="h-full w-full object-cover"
                  height={1187}
                  src={src}
                  width={3264}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Arrows */}
        <button
          className="absolute top-1/2 left-2 z-10 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm hover:bg-black/50"
          onClick={scrollPrev}
          type="button"
        >
          <ChevronLeftIcon className="size-5" />
        </button>
        <button
          className="absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm hover:bg-black/50"
          onClick={scrollNext}
          type="button"
        >
          <ChevronRightIcon className="size-5" />
        </button>
      </Carousel>

      {/* Dots */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {BANNERS.map((_, index) => (
          <button
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              current === index
                ? "w-8 bg-gaming-primary"
                : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            // biome-ignore lint/suspicious/noArrayIndexKey: <we need to use the index for the key>
            key={index}
            onClick={() => scrollTo(index)}
            type="button"
          />
        ))}
      </div>
    </section>
  );
}

export default HeroSlider;
