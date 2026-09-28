"use client";

import { clsx } from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

import type { EmblaCarouselType } from "embla-carousel";
import type { EmblaViewportRefType } from "embla-carousel-react";
import type { ReactNode } from "react";

export const CarouselFrame = ({
  emblaRef,
  emblaApi,
  title = "",
  children,
}: {
  emblaRef: EmblaViewportRefType;
  emblaApi: EmblaCarouselType | undefined;
  title?: string;
  children: ReactNode;
}) => {
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  const t = useTranslations();

  const setupSnaps = useCallback((emblaApis: EmblaCarouselType) => {
    setScrollSnaps(emblaApis.scrollSnapList());
    setCurrentPage(emblaApis.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) {
      return () => {};
    }

    // oxlint-disable-next-line react/set-state-in-effect
    setupSnaps(emblaApi);
    emblaApi.on("reInit", setupSnaps);
    emblaApi.on("select", setupSnaps);

    return () => {
      emblaApi.off("reInit", setupSnaps);
      emblaApi.off("select", setupSnaps);
    };
  }, [emblaApi, setupSnaps]);

  return (
    <div className="-mx-16 flex flex-col gap-4">
      {title !== "" && <div className="ml-16 text-2xl font-bold text-white">{title}</div>}
      <div className="flex">
        <button
          className="cursor-pointer text-text-dark transition-colors hover:text-white"
          aria-label={t("carousel.previous")}
          title={t("carousel.previous")}
          onClick={() => emblaApi?.scrollPrev()}
        >
          <ChevronLeft className="size-16" />
        </button>
        <div className="min-w-0 flex-1 overflow-hidden" ref={emblaRef}>
          <div className="-ml-4 flex touch-pan-y touch-pinch-zoom">{children}</div>
        </div>
        <button
          className="cursor-pointer text-text-dark transition-colors hover:text-white"
          aria-label={t("carousel.next")}
          title={t("carousel.next")}
          onClick={() => emblaApi?.scrollNext()}
        >
          <ChevronRight className="size-16" />
        </button>
      </div>
      <div className="flex justify-center gap-2 text-white">
        {scrollSnaps.map((_, index) => (
          <button
            className="cursor-pointer"
            onClick={() => emblaApi?.scrollTo(index)}
            aria-label={t("carousel.gotoPage", { page: index + 1 })}
            title={t("carousel.gotoPage", { page: index + 1 })}
            // oxlint-disable-next-line react/no-array-index-key
            key={index}
          >
            <div className={clsx("h-2 w-4 rounded-full", currentPage === index ? "bg-blue-1" : "bg-border-1")} />
          </button>
        ))}
      </div>
    </div>
  );
};
