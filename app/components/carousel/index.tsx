import { connection } from "next/server";
import { parseContestArticlesFtml } from "@/app/lib/getContestArticles";
import { shuffle } from "@/app/lib/shuffle";
import { CarouselClient } from "./CarouselClient";

// 最多只能放 21 个图片
const MAX_ITEMS = 21;

export const Carousel = async () => {
  await connection();
  const carouselItems = await parseContestArticlesFtml();
  const items = shuffle(carouselItems, MAX_ITEMS);
  if (items.length === 0) {
    return <div className="h-20 sm:h-40" />;
  }
  return <CarouselClient items={items} />;
};
