import "./rules.css";

import { wdModule } from "@hoah2333/wikidot-lib";
import { cacheLife } from "next/cache";
import { connection } from "next/server";
import { getCachedPageHtml, registerPage, registerSite, rulesPage } from "@/app/lib/getCachedPageHtml";
import { Rules as RulesClient } from "./RulesClient";
import { usernamesIn } from "./usernames";

const USER_LOOKUP_CONCURRENCY = 2;

const getCachedUserId = async (username: string, siteUrl: string): Promise<number | null> => {
  "use cache";

  try {
    const info = await wdModule(siteUrl).getUserInfoByUsername(username);
    cacheLife({ stale: 36_000, revalidate: 86_400, expire: 604_800 });
    return info?.wikidotId ?? null;
  } catch {
    // 避免失败的用户名在每次刷新时再次并发请求 Crom API。
    cacheLife({ stale: 60, revalidate: 300, expire: 3600 });
    return null;
  }
};

const getUserIds = async (usernames: string[], siteUrl: string): Promise<Record<string, number>> => {
  const userIds: Record<string, number> = {};

  const processBatch = async (index: number): Promise<void> => {
    if (index >= usernames.length) {
      return;
    }

    const batch = usernames.slice(index, index + USER_LOOKUP_CONCURRENCY);
    const entries = await Promise.all(
      batch.map(async (username) => {
        const wikidotId = await getCachedUserId(username, siteUrl).catch(() => null);
        return [username, wikidotId] as const;
      }),
    );

    for (const [username, wikidotId] of entries) {
      if (wikidotId !== null) {
        userIds[username] = wikidotId;
      }
    }

    await processBatch(index + USER_LOOKUP_CONCURRENCY);
  };

  await processBatch(0);

  return userIds;
};

export const Rules = async () => {
  await connection();
  const [rules, registerTable] = await Promise.all([getCachedPageHtml(rulesPage), getCachedPageHtml(registerPage)]);
  const html = rules.replace('<div id="register-table"></div>', registerTable);
  const userIds = await getUserIds(usernamesIn(html), registerSite);

  return <RulesClient html={html} userIds={userIds} />;
};
