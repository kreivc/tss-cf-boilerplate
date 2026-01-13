import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { HERO_SLIDES } from "@/data/games";
import { m } from "@/paraglide/messages";

export function HeroSlider() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const scrollPrev = useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = useCallback(() => api?.scrollNext(), [api]);
  const scrollTo = useCallback((index: number) => api?.scrollTo(index), [api]);

  // Track current slide
  useEffect(() => {
    if (!api) return;

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
    if (!api || isPaused) return;

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
          {HERO_SLIDES.map((slide, index) => (
            <CarouselItem key={slide.id}>
              <div
                className={`relative mx-4 h-[300px] overflow-hidden rounded-2xl transition-all duration-500 sm:h-[400px] lg:h-[500px] ${current === index ? "breathing scale-100" : "scale-95 opacity-70"}
                `}
              >
                {/* Background Image Placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-gaming-primary/30 via-background to-gaming-secondary/30">
                  {/* Animated gradient background as placeholder */}
                  <div className="absolute inset-0 opacity-50">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--gaming-primary)_0%,_transparent_50%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--gaming-secondary)_0%,_transparent_50%)]" />
                  </div>
                </div>

                {/* Gradient Overlay */}
                <div className="gradient-overlay-strong absolute inset-0" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 lg:p-12">
                  {slide.badge && (
                    <Badge className="pulse-glow mb-3 w-fit border-none bg-gaming-primary text-white">
                      {slide.badge}
                    </Badge>
                  )}
                  <h2 className="mb-2 font-bold text-2xl tracking-tight sm:text-3xl lg:text-5xl">
                    {slide.title}
                  </h2>
                  <p className="mb-4 max-w-md text-muted-foreground text-sm sm:text-base lg:text-lg">
                    {slide.subtitle}
                  </p>
                  <div className="flex gap-3">
                    <a href={slide.ctaLink}>
                      <Button className="btn-gaming">{slide.ctaText}</Button>
                    </a>
                    <Button
                      className="glass border-glass-border"
                      variant="outline"
                    >
                      {m.learnMore?.() ?? "Learn More"}
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Arrows */}
        <Button
          className="glass absolute top-1/2 left-2 z-10 -translate-y-1/2 rounded-full hover:bg-gaming-primary/20"
          onClick={scrollPrev}
          size="icon"
          variant="ghost"
        >
          <ChevronLeftIcon className="size-5" />
        </Button>
        <Button
          className="glass absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-full hover:bg-gaming-primary/20"
          onClick={scrollNext}
          size="icon"
          variant="ghost"
        >
          <ChevronRightIcon className="size-5" />
        </Button>
      </Carousel>

      {/* Dots */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {HERO_SLIDES.map((_, index) => (
          <button
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              current === index
                ? "w-8 bg-gaming-primary"
                : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }
            `}
            key={index}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>
    </section>
  );
}

export default HeroSlider;
