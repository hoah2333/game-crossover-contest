"use client";

import { clsx } from "clsx";
import { useTranslations } from "next-intl";
import { useState } from "react";

import Image from "next/image";
import type { ArticleItem } from "@/app/lib/types";
import type { TrackArticle, TrackKey } from "./types";

export const ContestListClient = ({ trackArticles }: { trackArticles: TrackArticle[] }) => {
  const t = useTranslations();

  const [activeTrack, setActiveTrack] = useState<TrackKey | null>(null);
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
        <div id="contest-list-content" className="flex flex-col gap-2 text-white">
          {trackArticles
            .find((trackArticle) => trackArticle.track === activeTrack)
            ?.articles.map((article) => <ContestListRow articleItem={article} key={article.slug} />) ?? null}
        </div>
      )}
    </div>
  );
};

const ContestListRow = ({ articleItem }: { articleItem: ArticleItem }) => {
  const t = useTranslations();
  const date = getDate(articleItem.postDate);
  return (
    <a
      className="flex gap-2 bg-dark-bg transition-colors hover:bg-dark-bg-2"
      href={`${t("siteUrl")}/${articleItem.slug}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="aspect-8/3 w-60 shrink-0 overflow-hidden">
        <Image
          className="size-full object-cover"
          src={articleItem.image === "" ? "/contest-list-banner.png" : articleItem.image}
          alt={articleItem.title}
          width={240}
          height={90}
        />
      </div>
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
        <div className="text-sm text-text-dark">{t("contestList.date", date)}</div>
      </div>
      <div className="w-30 shrink-0 text-right">{articleItem.authors[0]}</div>
    </a>
  );
};

const getVisibleTags = (tags: string[]) => tags.filter((tag) => !(tag.startsWith("_") || tag === "9000"));

const formatter = new Intl.DateTimeFormat("zh-CN", {
  timeZone: "Asia/Shanghai",
  year: "numeric",
  month: "numeric",
  day: "numeric",
});

const getDate = (timestamp: number) => {
  const parts = formatter.formatToParts(new Date(timestamp));
  return {
    year: parts.find((part) => part.type === "year")?.value ?? "",
    month: parts.find((part) => part.type === "month")?.value ?? "",
    day: parts.find((part) => part.type === "day")?.value ?? "",
  };
};
