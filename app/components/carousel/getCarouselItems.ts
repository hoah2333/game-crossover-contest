import { load as cheerLoad } from "cheerio";
import { getListpages } from "@/app/lib/getListPages";

import type { CheerioAPI } from "cheerio";
import type { Element } from "domhandler";
import type { CarouselItem } from "./types";

const getCarouselItemsSource = async () => {
  const { status, body } = await getListpages({
    category: "*",
    order: "created_at",
    perPage: "250",
    separate: "false",
    tags: "+9000 -竞赛 -中心",
    module_body: `[[div class="carousel-item"]]
      [[span class="slug"]]%%fullname%%[[/span]]
      [[span class="title"]]%%title%%[[/span]]
      [[span class="preview"]]%%content{2}%%[[/span]]
      [[span class="rating"]]%%rating%%[[/span]]
      [[span class="rating-count"]]%%rating_votes%%[[/span]]
      [[span class="post-date"]]%%created_at%%[[/span]]
      [[span class="tags"]]%%tags%%[[/span]]
      [[span class="author"]]%%created_by%%[[/span]]
      [[/div]]`,
  });
  if (status === "ok") {
    return body;
  }
  return null;
};

export const parseCarouselItemsFtml = async () => {
  const carouselSource = await getCarouselItemsSource();
  if (carouselSource === null) {
    return [];
  }
  const carouselDom: CheerioAPI = cheerLoad(carouselSource);
  const carouselItems: CarouselItem[] = carouselDom("div.carousel-item")
    .map((_, itemElement: Element) => {
      const itemDom = carouselDom(itemElement);
      return {
        slug: itemDom.find("span.slug").text(),
        title: itemDom.find("span.title").text(),
        description: itemDom.find("span.preview span.game-crossover-preview-description").text() ?? "",
        rating: Number(itemDom.find("span.rating").text() ?? "0"),
        ratingCount: Number(itemDom.find("span.rating-count").text() ?? "0"),
        postDate: Number(
          itemDom
            .find("span.post-date span.odate")
            .attr("class")
            ?.match(/time_(?<time>\d+)/v)?.groups?.time ?? "0",
        ),
        tags: itemDom
          .find("span.tags")
          .text()
          .split(" ")
          .filter((tag) => tag !== ""),
        image: itemDom.find("span.preview span.game-crossover-preview-image").text() ?? "",
        authors: [itemDom.find("span.author").text()],
      };
    })
    .toArray();
  return carouselItems;
};
