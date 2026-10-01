import { wdModule } from "@hoah2333/wikidot-lib";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import type { UserInfoByUsername } from "@hoah2333/wikidot-lib";

const userInfoCache = new Map<string, Promise<UserInfoByUsername | null>>();

const loadUserInfo = (siteUrl: string, username: string): Promise<UserInfoByUsername | null> => {
  const key = `${siteUrl}\n${username}`;
  const cached = userInfoCache.get(key);
  if (cached !== undefined) {
    return cached;
  }

  const request = wdModule(siteUrl)
    .getUserInfoByUsername(username)
    .then(
      (info) => info,
      () => {
        userInfoCache.delete(key);
        return null;
      },
    );
  userInfoCache.set(key, request);
  return request;
};

export const useGetUserInfo = (username: string) => {
  const [userInfo, setUserInfo] = useState<UserInfoByUsername | null>(null);
  const siteUrl = useTranslations()("siteUrl");

  useEffect(() => {
    let current = true;
    void loadUserInfo(siteUrl, username).then((info) => {
      if (current) {
        setUserInfo(info);
      }
    });
    return () => {
      current = false;
    };
  }, [siteUrl, username]);

  return userInfo;
};
