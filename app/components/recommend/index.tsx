import { connection } from "next/server";
import { parseContestArticlesFtml } from "@/app/lib/getContestArticles";
import { getForumPost } from "@/app/lib/getForumPost";
import { shuffle } from "@/app/lib/shuffle";
import { RecommendClient } from "./RecommendClient";

import type { ArticleItem } from "@/app/lib/types";
import type { RecommendItem } from "./types";

// 最多只能放 8 个评测
const MAX_ITEMS = 8;

// TODO: 模拟评测，正式数据就绪后删除
const withMockReview = (article: ArticleItem): ArticleItem => {
  return { ...article, reviewId: 7_744_099 };
};

export const Recommend = async () => {
  await connection();
  const articleItems = await parseContestArticlesFtml();
  const filteredArticleItems = articleItems
    // TODO: 模拟评测，正式数据就绪后删除
    .map((i) => withMockReview(i))
    .filter((item) => item.reviewId > 0);
  const items = shuffle(filteredArticleItems, MAX_ITEMS);
  const reviewsSettled = await Promise.allSettled(items.map((item) => getForumPost(item.reviewId)));
  const recommendItem: RecommendItem[] = reviewsSettled
    .map((review, index) => {
      if (review.status === "fulfilled" && review.value !== null) {
        return { article: items[index], review: review.value };
      }
      return null;
    })
    .filter((review) => review !== null);
  if (recommendItem.length === 0) {
    return null;
  }
  return <RecommendClient items={recommendItem} />;
};
