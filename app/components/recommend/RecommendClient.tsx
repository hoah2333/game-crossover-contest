"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";

import { useTranslations } from "next-intl";
import { match, P } from "ts-pattern";
import { CarouselFrame } from "@/app/components/carousel/CarouselFrame";
import { Tooltip } from "@/app/components/tooltip";
import { getDate } from "@/app/lib/getDate";

import type { RecommendItem } from "./types";

export const RecommendClient = ({ items }: { items: RecommendItem[] }) => {
  const t = useTranslations();
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: true });

  return (
    <CarouselFrame emblaRef={emblaRef} emblaApi={emblaApi} title={t("recommend.title")}>
      {items.map((item) => (
        <RecommendCard item={item} key={item.article.slug} />
      ))}
    </CarouselFrame>
  );
};

const RecommendCard = ({ item }: { item: RecommendItem }) => {
  const t = useTranslations();
  const recommender = item.review.createdBy;
  const bannerImage = match(item.article.images[0])
    .with(P.nullish, "", () =>
      item.article.carouselBanner === "" ? "/carousel-banner.png" : item.article.carouselBanner,
    )
    .otherwise(() => item.article.images[0]);
  return (
    <div className="flex min-w-0 shrink-0 grow-0 basis-full bg-dark-bg pl-4">
      <Tooltip articleItem={item.article}>
        <div className="flex flex-col lg:flex-row">
          <a
            href={`${t("siteUrl")}/${item.article.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="aspect-video w-full shrink-0 overflow-hidden lg:basis-1/2"
          >
            <Image
              className="size-full object-cover"
              src={bannerImage}
              alt={item.article.title}
              sizes="(min-width: 1024px) 600px, 100vw"
              width={600}
              height={338}
            />
          </a>
          <div className="flex flex-col justify-between p-4 text-white lg:basis-1/2">
            <div className="flex flex-col gap-2">
              <a
                href={`${t("siteUrl")}/${item.article.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl font-bold"
              >
                {item.article.title}
              </a>
              <div className="line-clamp-6 max-h-34 overflow-hidden">{item.review.textContent}</div>
              <a
                className="-mt-2 flex w-full justify-center bg-dark-bg p-2 text-sm text-text-dark transition-colors hover:text-white"
                href={`${t("siteUrl")}/forum/t-${item.review.threadId}#post-${item.review.postId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("recommend.readFull")}
              </a>
            </div>
            <div className="flex gap-2 text-text-dark">
              {recommender && (
                <Image
                  src={`http://www.wikidot.com/avatar.php?userid=${recommender.wikidotId}`}
                  alt={`the Avatar of ${recommender.displayName}`}
                  width={40}
                  height={40}
                  className="size-10"
                />
              )}
              <div className="flex flex-col">
                <div className="font-bold text-white">
                  {recommender === null ? t("recommend.unknownUser") : recommender.displayName}
                </div>
                <div className="text-sm">{t("contestList.date", getDate(item.review.createdAt))}</div>
              </div>
            </div>
          </div>
        </div>
      </Tooltip>
    </div>
  );
};
