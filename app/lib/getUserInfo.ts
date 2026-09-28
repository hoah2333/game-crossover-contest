import { wdModule } from "@hoah2333/wikidot-lib";

import type { UserInfoByUsername } from "@hoah2333/wikidot-lib";

export const getUserInfo = (id: number): Promise<UserInfoByUsername | null> => {
  if (id <= 0) {
    return Promise.resolve(null);
  }
  return wdModule().getUserInfoByUsername(undefined, id.toString());
};
