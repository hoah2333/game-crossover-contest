"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";

import { useTranslations } from "next-intl";
import { match, P } from "ts-pattern";
import { CarouselFrame } from "@/app/components/carousel/CarouselFrame";
import { Tooltip } from "@/app/components/tooltip";

import type { ArticleItem } from "@/app/lib/types";

export const LowRatingClient = ({ items }: { items: ArticleItem[] }) => {
  const t = useTranslations();
  const [emblaRef, emblaApi] = useEmblaCarousel({ slidesToScroll: "auto", align: "start", loop: true });

  return (
    <CarouselFrame emblaRef={emblaRef} emblaApi={emblaApi} title={t("lowRating.title")}>
      {items.map((item) => (
        <LowRatingCard item={item} key={item.slug} />
      ))}
    </CarouselFrame>
  );
};

const LowRatingCard = ({ item }: { item: ArticleItem }) => {
  const t = useTranslations();
  const bannerImage = match(item.images[0])
    .with(P.nullish, "", () => (item.carouselBanner === "" ? "/no-image-16.9.png" : item.carouselBanner))
    .otherwise(() => item.images[0]);
  return (
    <div className="flex min-w-0 shrink-0 grow-0 basis-1/2 flex-col pl-4 lg:basis-1/5">
      <Tooltip articleItem={item}>
        <a
          href={`${t("siteUrl")}/${item.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="aspect-video w-full shrink-0 overflow-hidden"
        >
          <Image
            className="size-full object-cover"
            src={bannerImage}
            alt={item.title}
            sizes="(min-width: 1024px) 600px, 100vw"
            width={600}
            height={338}
          />
        </a>
        <div className="flex shrink-0 items-end justify-end px-4 py-2 text-right text-sm text-white">
          {t("carousel.createdBy", {
            authors:
              item.authors[0] +
              (item.authors.length > 1 ? t("carousel.authors", { count: item.authors.length - 1 }) : ""),
          })}
        </div>
      </Tooltip>
    </div>
  );
};
