import { connection } from "next/server";
import { parseContestArticlesFtml } from "@/app/lib/getContestArticles";
import { shuffle } from "@/app/lib/shuffle";
import { LowRatingClient } from "./LowRatingClient";

// 最多只能放 20 个低分作品
const MAX_ITEMS = 20;

export const LowRating = async () => {
  await connection();
  const articleItems = await parseContestArticlesFtml();
  const filteredArticleItems = articleItems
    .filter((item) => item.rating < 30)
    .toSorted((a, b) => a.rating - b.rating)
    .slice(0, MAX_ITEMS);
  if (filteredArticleItems.length === 0) {
    return null;
  }
  const items = shuffle(filteredArticleItems);

  return <LowRatingClient items={items} />;
};
