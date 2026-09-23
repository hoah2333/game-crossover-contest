import { array, minLength, object, pipe, string } from "valibot";

import type { InferOutput } from "valibot";

const readingItemSchema = object({ slug: pipe(string(), minLength(1)), title: pipe(string(), minLength(1)) });
export type ReadingListItem = InferOutput<typeof readingItemSchema>;

export const readingListSchema = array(readingItemSchema);

export const addToReadingList = (slug: string, title: string, readingList: ReadingListItem[]) => {
  if (readingList.some((item) => item.slug === slug) || slug === "" || title === "") {
    return readingList;
  }
  return [{ slug, title }, ...readingList];
};

export const removeFromReadingList = (slug: string, readingList: ReadingListItem[]) => {
  return readingList.filter((item) => item.slug !== slug);
};
