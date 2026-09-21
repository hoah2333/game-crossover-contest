import { connection } from "next/server";
import { CarouselClient } from "./CarouselClient";
import { parseCarouselItemsFtml } from "./getCarouselItems";
import { mockCarouselItems } from "./mockItems";

import type { CarouselItem } from "./types";

// 最多只能放 21 个图片
const MAX_ITEMS = 21;

export const Carousel = async () => {
  // await parseCarouselItemsFtml()
  await connection();
  const items = pickCarouselItems(mockCarouselItems);
  if (items.length === 0) {
    return null;
  }
  return <CarouselClient items={items} />;
};

const pickCarouselItems = (items: CarouselItem[]): CarouselItem[] => {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const current = shuffled[index];
    const swap = shuffled[swapIndex];
    if (current !== undefined && swap !== undefined) {
      shuffled[index] = swap;
      shuffled[swapIndex] = current;
    }
  }
  return shuffled.slice(0, MAX_ITEMS);
};
