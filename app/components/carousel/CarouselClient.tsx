"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { RatingTexts } from "@/app/components/rating/RatingTexts";
import { getVisibleTags } from "@/app/lib/getVisibleTags";
import { useReadingList } from "@/app/lib/hooks/useReadingList";
import { CarouselFrame } from "./CarouselFrame";

import type { ArticleItem } from "@/app/lib/types";

export const CarouselClient = ({ items }: { items: ArticleItem[] }) => {
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

  return (
    <CarouselFrame emblaRef={emblaRef} emblaApi={emblaApi}>
      {items.map((item) => (
        <CarouselCard item={item} key={item.slug} />
      ))}
    </CarouselFrame>
  );
};

const CarouselCard = ({ item }: { item: ArticleItem }) => {
  const t = useTranslations();

  const { isInReadingList, addToReadingList, removeFromReadingList } = useReadingList();

  return (
    <div className="flex min-w-0 shrink-0 grow-0 basis-full justify-center pl-4 lg:basis-1/3 lg:justify-start">
      <div className="group relative aspect-5/6 overflow-hidden">
        <a className="cursor-pointer" href={`${t("siteUrl")}/${item.slug}`} target="_blank" rel="noopener noreferrer">
          <Image
            className="object-cover"
            src={item.carouselBanner === "" ? "/no-image-5.6.png" : item.carouselBanner}
            alt={item.title}
            width={500}
            height={600}
          />
        </a>
        <div className="absolute bottom-0 left-0 flex h-2/3 w-full translate-y-full flex-col justify-between bg-dark-bg p-4 text-white transition-transform duration-300 group-focus-within:translate-y-0 group-hover:translate-y-0">
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
            <RatingTexts
              className="text-sm"
              rating={item.rating}
              ratingCount={item.ratingCount}
              postDate={item.postDate}
            />
            <div className="flex flex-wrap gap-2 text-sm">
              {getVisibleTags(item.tags)
                .slice(0, 10)
                .map((tag) => (
                  <a
                    className="cursor-pointer bg-white/10 p-1 transition-colors hover:bg-white/20"
                    href={`${t("siteUrl")}/system:page-tags/tag/${tag}#pages`}
                    key={tag}
                  >
                    {tag}
                  </a>
                ))}
              {getVisibleTags(item.tags).length > 10 && (
                <span className="bg-white/10 p-1">
                  {t("carousel.additionalTags", { count: getVisibleTags(item.tags).length - 10 })}
                </span>
              )}
            </div>
          </div>
          <div>
            <button
              className="cursor-pointer bg-green-1 px-4 py-2 text-sm transition-colors hover:bg-green-1-hover"
              onClick={() => {
                if (isInReadingList(item.slug)) {
                  removeFromReadingList(item.slug);
                } else {
                  addToReadingList(item.slug, item.title);
                }
              }}
            >
              {isInReadingList(item.slug) ? t("readingList.remove") : t("readingList.add")}
            </button>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 bg-dark-bg/50 px-4 py-2 text-sm text-white transition-transform duration-300 group-focus-within:-translate-y-4 group-hover:-translate-y-4">
          {t("carousel.createdBy", {
            authors:
              item.authors[0] +
              (item.authors.length > 1 ? t("carousel.authors", { count: item.authors.length - 1 }) : ""),
          })}
        </div>
      </div>
    </div>
  );
};
