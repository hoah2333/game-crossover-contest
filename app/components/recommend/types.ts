import type { ForumPostText } from "@hoah2333/wikidot-lib";
import type { ArticleItem } from "@/app/lib/types";

export interface RecommendItem {
  article: ArticleItem;
  review: ForumPostText;
}
