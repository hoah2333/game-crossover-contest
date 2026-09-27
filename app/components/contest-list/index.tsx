import { connection } from "next/server";
import { parseContestArticlesFtml } from "@/app/lib/getContestArticles";
import { shuffle } from "@/app/lib/shuffle";
import { ContestListClient } from "./ContestListClient";
import { tracks } from "./tracks";

import type { ArticleItem } from "@/app/lib/types";

// TODO: 模拟赛道标签，正式数据就绪后删除
const withMockTrackTag = (article: ArticleItem): ArticleItem => {
  const { tag } = tracks[Math.floor(Math.random() * tracks.length)];
  return { ...article, tags: [...article.tags, tag] };
};

export const ContestList = async () => {
  await connection();
  const articles = await parseContestArticlesFtml();
  // TODO: 模拟赛道标签，正式数据就绪后删除
  const contestArticles = articles.map((article) => withMockTrackTag(article));
  const trackArticles = tracks.map((track) => {
    const matched = contestArticles.filter((article) => article.tags.includes(track.tag));
    return { track: track.key, articles: shuffle(matched) };
  });

  if (trackArticles.reduce((acc, curr) => acc + curr.articles.length, 0) === 0) {
    return null;
  }

  return <ContestListClient trackArticles={trackArticles} />;
};
