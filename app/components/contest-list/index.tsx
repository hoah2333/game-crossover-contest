import { getTranslations } from "next-intl/server";
import { connection } from "next/server";
import { parseContestArticlesFtml } from "@/app/lib/getContestArticles";
import { shuffle } from "@/app/lib/shuffle";
import { ContestListClient } from "./ContestListClient";
import { tracks } from "./tracks";

export const ContestList = async () => {
  await connection();
  const t = await getTranslations();
  const articles = await parseContestArticlesFtml();
  const trackArticles = tracks.map((track) => {
    const matched = articles.filter((article) => article.tags.includes(t(`trackTags.${track.key}`)));
    return { track: track.key, articles: shuffle(matched) };
  });

  if (trackArticles.reduce((acc, curr) => acc + curr.articles.length, 0) === 0) {
    return null;
  }

  return <ContestListClient trackArticles={trackArticles} />;
};
