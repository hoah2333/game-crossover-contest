import { wdModule } from "@hoah2333/wikidot-lib";
import { cacheLife } from "next/cache";

import type { ForumPostText } from "@hoah2333/wikidot-lib";

export const getForumPost = async (id: number): Promise<ForumPostText | null> => {
  "use cache";
  cacheLife({ stale: 60, revalidate: 300, expire: 3600 });

  if (id <= 0) {
    return null;
  }
  const post = await wdModule().getForumPost(id);
  return post;
};
