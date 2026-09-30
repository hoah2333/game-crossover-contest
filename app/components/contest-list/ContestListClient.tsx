"use client";

import Image from "next/image";

import { clsx } from "clsx";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { RatingTexts } from "@/app/components/rating/RatingTexts";
import { getDate } from "@/app/lib/getDate";
import { useReadingList } from "@/app/lib/hooks/useReadingList";

import type { ArticleItem } from "@/app/lib/types";
import type { TrackArticle, TrackKey } from "./types";

/** 每页显示的条目数 */
const PAGE_SIZE = 10;

export const ContestListClient = ({ trackArticles }: { trackArticles: TrackArticle[] }) => {
  const t = useTranslations();

  const [activeTrack, setActiveTrack] = useState<TrackKey | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [currentSize, setCurrentSize] = useState(PAGE_SIZE);

  const activeArticles = trackArticles.find((trackArticle) => trackArticle.track === activeTrack)?.articles ?? [];
  const selectedArticle = activeArticles.find((article) => article.slug === selectedSlug);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 text-white">
        {trackArticles.map((trackArticle) => {
          const isActiveTrack = activeTrack === trackArticle.track;
          const trackArticleCount = trackArticle.articles.length ?? 0;
          return (
            <button
              className={clsx(
                isActiveTrack ? "text-white" : "text-text-dark",
                "relative cursor-pointer py-3 transition-colors disabled:cursor-not-allowed disabled:opacity-50",
              )}
              onClick={() => {
                setActiveTrack((tr) => (tr === trackArticle.track ? null : trackArticle.track));
                setSelectedSlug(isActiveTrack ? null : trackArticle.articles[0].slug);
                setCurrentSize(PAGE_SIZE);
              }}
              aria-expanded={isActiveTrack}
              aria-controls={isActiveTrack ? "contest-list-content" : undefined}
              disabled={trackArticleCount === 0}
              key={trackArticle.track}
            >
              <span className="relative text-xl whitespace-nowrap">
                {t(`contestList.tabs.${trackArticle.track}`, { count: trackArticleCount })}
                <span
                  className={clsx(
                    "absolute -bottom-0.5 h-0.5 bg-blue-1 transition-all duration-200",
                    isActiveTrack ? "left-0 w-full" : "left-1/2 w-0",
                  )}
                />
              </span>
            </button>
          );
        })}
      </div>
      {activeTrack !== null && (
        <div id="contest-list-content" className="flex gap-3">
          <div className="flex min-w-0 flex-1 flex-col gap-4 text-white md:gap-2">
            {activeArticles.slice(0, currentSize).map((article) => (
              <ContestListRow
                articleItem={article}
                key={article.slug}
                isSelected={selectedSlug === article.slug}
                onSelect={() => {
                  setSelectedSlug(article.slug);
                }}
              />
            ))}
            {currentSize < activeArticles.length && (
              <button
                className="cursor-pointer bg-dark-bg p-1 text-sm transition-colors hover:bg-dark-bg-2"
                onClick={() => {
                  setCurrentSize(currentSize + PAGE_SIZE);
                }}
              >
                {t("contestList.more", { count: activeArticles.length - currentSize })}
              </button>
            )}
          </div>
          {selectedArticle && (
            <div className="sticky top-12 hidden w-90 shrink-0 self-start bg-dark-bg p-4 text-white lg:block">
              <ContestListPanel articleItem={selectedArticle} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ContestListRow = ({
  articleItem,
  isSelected,
  onSelect,
}: {
  articleItem: ArticleItem;
  isSelected: boolean;
  onSelect: () => void;
}) => {
  const t = useTranslations();

  return (
    <a
      className={clsx(
        "flex flex-col gap-2 transition-colors hover:bg-dark-bg-2 md:flex-row",
        isSelected ? "bg-dark-bg-2" : "bg-dark-bg",
      )}
      href={`${t("siteUrl")}/${articleItem.slug}`}
      onMouseEnter={onSelect}
      onFocus={onSelect}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="aspect-8/3 w-full shrink-0 overflow-hidden md:w-60">
        <Image
          className="size-full object-cover"
          src={articleItem.contestListBanner === "" ? "/no-image-8.3.png" : articleItem.contestListBanner}
          alt={articleItem.title}
          sizes="(min-width: 768px) 240px, 100vw"
          width={240}
          height={90}
        />
      </div>
      <div className="flex min-w-0 flex-1">
        <div className="flex min-w-0 flex-1 flex-col justify-between p-2">
          <div>
            <div className="truncate text-lg">{articleItem.title}</div>
            <div className="flex h-6 flex-wrap gap-2 overflow-hidden text-sm">
              {getVisibleTags(articleItem.tags).map((tag) => (
                <span key={tag} className="shrink-0">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="text-sm text-text-dark">{t("contestList.date", getDate(articleItem.postDate))}</div>
        </div>
        <div className="flex shrink-0 items-end justify-end px-4 py-2 text-right text-sm text-white">
          {t("carousel.createdBy", {
            authors:
              articleItem.authors[0] +
              (articleItem.authors.length > 1 ? t("carousel.authors", { count: articleItem.authors.length - 1 }) : ""),
          })}
        </div>
      </div>
    </a>
  );
};

const ContestListPanel = ({ articleItem }: { articleItem: ArticleItem }) => {
  const t = useTranslations();
  const { isInReadingList, addToReadingList, removeFromReadingList } = useReadingList();
  return (
    <div className="flex flex-col gap-2">
      <div className="text-xl">{articleItem.title}</div>
      <div className="flex text-sm text-white">
        {t("carousel.createdBy", {
          authors:
            articleItem.authors[0] +
            (articleItem.authors.length > 1 ? t("carousel.authors", { count: articleItem.authors.length - 1 }) : ""),
        })}
      </div>
      <div className="flex flex-col text-sm text-text-dark">
        <div>{t("contestList.overall")}</div>
        <RatingTexts
          rating={articleItem.rating}
          ratingCount={articleItem.ratingCount}
          postDate={articleItem.postDate}
        />
      </div>
      <div className="flex flex-wrap gap-2 text-sm">
        {getVisibleTags(articleItem.tags)
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
        {getVisibleTags(articleItem.tags).length > 10 && (
          <span className="bg-white/10 p-1">
            {t("carousel.additionalTags", { count: getVisibleTags(articleItem.tags).length - 10 })}
          </span>
        )}
      </div>
      <button
        className="cursor-pointer bg-green-1 px-4 py-2 text-sm transition-colors hover:bg-green-1-hover"
        onClick={() => {
          if (isInReadingList(articleItem.slug)) {
            removeFromReadingList(articleItem.slug);
          } else {
            addToReadingList(articleItem.slug, articleItem.title);
          }
        }}
      >
        {isInReadingList(articleItem.slug) ? t("readingList.remove") : t("readingList.add")}
      </button>
      <div>
        {articleItem.images.map((i) => (
          <Image src={i} alt={articleItem.title} sizes="328px" width={328} height={123} key={i} />
        ))}
      </div>
    </div>
  );
};

const getVisibleTags = (tags: string[]) => tags.filter((tag) => !(tag.startsWith("_") || tag === "9000"));
