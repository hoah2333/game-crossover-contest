import { wdModule } from "@hoah2333/wikidot-lib";

import type { UserInfo } from "@hoah2333/wikidot-lib";

export const getUserInfo = (id: number): Promise<UserInfo | null> => {
  if (id <= 0) {
    return Promise.resolve(null);
  }
  return wdModule().getUserInfo(id);
};
