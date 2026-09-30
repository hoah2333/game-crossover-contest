import { load as cheerLoad } from "cheerio";
import { cacheLife } from "next/cache";
import { cache } from "react";
import { getListpages } from "@/app/lib/getListPages";

import type { CheerioAPI } from "cheerio";
import type { Element } from "domhandler";
import type { ArticleItem } from "@/app/lib/types";

const getContestArticlesSource = async () => {
  "use cache";
  cacheLife({ stale: 60, revalidate: 300, expire: 3600 });

  const { status, body } = await getListpages({
    category: "*",
    order: "created_at",
    perPage: "250",
    separate: "false",
    tags: "+2026电子游戏竞赛 -竞赛 -中心",
    module_body: `[[div class="contest-item"]]
      [[span class="slug"]]%%fullname%%[[/span]]
      [[span class="title"]]%%title%%[[/span]]
      [[div class="preview"]]
      %%content{2}%%
      [[/div]]
      [[span class="rating"]]%%rating%%[[/span]]
      [[span class="rating-count"]]%%rating_votes%%[[/span]]
      [[span class="post-date"]]%%created_at%%[[/span]]
      [[span class="tags"]]%%tags%% %%_tags%%[[/span]]
      [[span class="author"]]%%created_by%%[[/span]]
      [[/div]]`,
  });
  if (status === "ok") {
    return body;
  }
  return null;
};

export const parseContestArticlesFtml = cache(async () => {
  const contestSource = await getContestArticlesSource();
  if (contestSource === null) {
    return [];
  }
  const contestDom: CheerioAPI = cheerLoad(contestSource);
  const contestItems: ArticleItem[] = contestDom("div.contest-item")
    .map((_, itemElement: Element) => {
      const itemDom = contestDom(itemElement);
      return {
        slug: itemDom.find("span.slug").text(),
        title: itemDom.find("span.title").text(),
        rating: Number(itemDom.find("span.rating").text()),
        ratingCount: Number(itemDom.find("span.rating-count").text()),
        postDate:
          Number(
            itemDom
              .find("span.post-date span.odate")
              .attr("class")
              ?.match(/time_(?<time>\d+)/v)?.groups?.time ?? "0",
          ) * 1000,
        tags: itemDom
          .find("span.tags")
          .text()
          .split(" ")
          .filter((tag) => tag !== ""),
        carouselBanner: itemDom.find("div.preview div.game-crossover-preview-carousel-banner").text().trim(),
        contestListBanner: itemDom.find("div.preview div.game-crossover-preview-contest-list-banner").text().trim(),
        images: itemDom
          .find("div.preview div.game-crossover-preview-image")
          .text()
          .trim()
          .split("\n")
          .map((image) => image.trim())
          .filter((image) => image !== ""),
        reviewId: Number(itemDom.find("div.preview div.game-crossover-preview-review").text().trim()),
        authors: [itemDom.find("span.author").text()],
      };
    })
    .toArray();
  return contestItems;
});
