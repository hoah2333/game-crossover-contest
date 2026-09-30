import { wdModule } from "@hoah2333/wikidot-lib";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import type { UserInfoByUsername } from "@hoah2333/wikidot-lib";

export const useGetUserInfo = (username: string) => {
  const [userInfo, setUserInfo] = useState<UserInfoByUsername | null>(null);
  const t = useTranslations();

  useEffect((): void => {
    const site = wdModule(t("siteUrl"));
    void site.getUserInfoByUsername(username).then((info: UserInfoByUsername | null): void => {
      setUserInfo(info);
    });
  }, [username, t]);

  return userInfo;
};
