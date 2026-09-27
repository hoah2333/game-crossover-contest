import type { ArticleItem } from "@/app/lib/types";
import type { tracks } from "./tracks";

export type TrackKey = (typeof tracks)[number]["key"];
export interface TrackArticle {
  track: TrackKey;
  articles: ArticleItem[];
}
