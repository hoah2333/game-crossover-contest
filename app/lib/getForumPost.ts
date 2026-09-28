import { wdModule } from "@hoah2333/wikidot-lib";

import type { ForumPostText } from "@hoah2333/wikidot-lib";

export const getForumPost = (id: number): Promise<ForumPostText | null> => {
  if (id <= 0) {
    return Promise.resolve(null);
  }
  return wdModule().getForumPost(id);
};
