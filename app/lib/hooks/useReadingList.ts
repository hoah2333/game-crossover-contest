import useLocalStorageState from "use-local-storage-state";

import { safeParse } from "valibot";
import {
  addToReadingList as _addToReadingList,
  removeFromReadingList as _removeFromReadingList,
  readingListSchema,
} from "@/app/lib/readingList";

import type { ReadingListItem } from "@/app/lib/readingList";

export const useReadingList = () => {
  const [readingList, setReadingList] = useLocalStorageState<ReadingListItem[]>("readingList", {
    defaultValue: [],
    serializer: {
      stringify: (value) => JSON.stringify(value),
      parse: (value) => {
        const result = safeParse(readingListSchema, JSON.parse(value));
        if (result.success) {
          return result.output;
        }
        return [];
      },
    },
  });

  const isInReadingList = (slug: string) => {
    return readingList.some((item) => item.slug === slug);
  };

  const addToReadingList = (slug: string, title: string) => {
    setReadingList((rl) => _addToReadingList(slug, title, rl));
  };

  const removeFromReadingList = (slug: string) => {
    setReadingList((rl) => _removeFromReadingList(slug, rl));
  };

  return { readingList, isInReadingList, addToReadingList, removeFromReadingList };
};
