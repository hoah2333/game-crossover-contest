"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";

import { clsx } from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { match, P } from "ts-pattern";

import type { EmblaCarouselType } from "embla-carousel";
import type { ReactNode } from "react";
import type { CarouselItem } from "./types";

export const CarouselClient = ({ items }: { items: CarouselItem[] }) => {
  // oxlint-disable-next-line react/hook-use-state
  const [autoplayState] = useState(
    // oxlint-disable-next-line react/capitalized-calls
    Autoplay({
      delay: 5000,
      stopOnMouseEnter: true,
      rootNode: (emblaRoot) => emblaRoot.parentElement?.parentElement ?? null,
    }),
  );
  const [emblaRef, emblaApi] = useEmblaCarousel({ slidesToScroll: "auto", align: "start", loop: true }, [
    autoplayState,
  ]);
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
    <div className="flex flex-col gap-4">
      <div className="flex">
        <button
          className="cursor-pointer text-white hover:bg-white/30"
          aria-label={t("carousel.previous")}
          title={t("carousel.previous")}
          onClick={() => emblaApi?.scrollPrev()}
        >
          <ChevronLeft className="size-10" />
        </button>
        <div className="min-w-0 flex-1 overflow-hidden" ref={emblaRef}>
          <div className="-ml-4 flex touch-pan-y touch-pinch-zoom">
            {items.map((item) => {
              return <CarouselCard item={item} key={item.slug} />;
            })}
          </div>
        </div>
        <button
          className="cursor-pointer text-white hover:bg-white/30"
          aria-label={t("carousel.next")}
          title={t("carousel.next")}
          onClick={() => emblaApi?.scrollNext()}
        >
          <ChevronRight className="size-10" />
        </button>
      </div>
      <div className="flex justify-center gap-2 text-white">
        {scrollSnaps.map((_, index) => {
          return (
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
          );
        })}
      </div>
    </div>
  );
};

const CarouselCard = ({ item }: { item: CarouselItem }) => {
  const t = useTranslations();
  const [now, setNow] = useState(0);

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    setNow(Date.now());
  }, []);

  return (
    <div className="flex min-w-0 shrink-0 grow-0 basis-full justify-center pl-4 lg:basis-1/3 lg:justify-start">
      <div className="group relative aspect-5/6 overflow-hidden">
        <a className="cursor-pointer" href={`${t("siteUrl")}/${item.slug}`} target="_blank" rel="noopener noreferrer">
          <Image className="object-cover" src={item.image} alt={item.title} width={500} height={600} />
        </a>
        <div className="absolute bottom-0 left-0 flex h-1/2 w-full translate-y-full flex-col justify-between bg-dark-bg p-4 text-white transition-transform duration-300 group-focus-within:translate-y-0 group-hover:translate-y-0">
          <div className="flex flex-col gap-2">
            <div className="text-2xl">
              <a
                className="cursor-pointer"
                href={`${t("siteUrl")}/${item.slug}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.title}
              </a>
            </div>
            <div className="flex gap-2 text-sm">
              {item.ratingCount <= 15
                ? match(item.postDate > now - 24 * 60 * 60 * 1000 * 15)
                    .returnType<ReactNode>()
                    .with(true, () => <div className="text-[#70b590]">最新发布</div>)
                    .with(false, () => <div className="text-[#929396]">冷门作品</div>)
                    .exhaustive()
                : match(item.rating / item.ratingCount)
                    .returnType<ReactNode>()
                    .with(P.number.lt(0.35), () => <div className="text-[#be5d30]">多半差评</div>)
                    .with(P.number.gte(0.35).and(P.number.lt(0.65)), () => (
                      <div className="text-[#ad9872]">褒贬不一</div>
                    ))
                    .with(P.number.gte(0.65), () => <div className="text-[#5197c3]">多半好评</div>)
                    .otherwise(() => (
                      // 这个 otherwise 应该是 0/0 的情况
                      <div className="text-[#929396]">冷门作品</div>
                    ))}
              ({item.ratingCount})
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              {item.tags.map((tag) => (
                <a
                  className="cursor-pointer bg-white/10 p-1 transition-colors hover:bg-white/20"
                  href={`${t("siteUrl")}/system:page-tags/tag/${tag}#pages`}
                  key={tag}
                >
                  {tag}
                </a>
              ))}
            </div>
          </div>
          <div>
            <button className="cursor-pointer bg-green-1 px-4 py-2 transition-colors hover:bg-green-1-hover">
              添加至阅读列表
            </button>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 bg-dark-bg/50 px-4 py-2 text-sm text-white transition-transform duration-300 group-focus-within:-translate-y-4 group-hover:-translate-y-4">
          由 {item.authors[0]} {item.authors.length > 1 ? `等${item.authors.length}人` : ""}创作
        </div>
      </div>
    </div>
  );
};
