import "./rules.css";

import { wdModule } from "@hoah2333/wikidot-lib";
import { cacheLife } from "next/cache";
import { connection } from "next/server";
import { getCachedPageHtml, registerPage, registerSite, rulesPage } from "@/app/lib/getCachedPageHtml";
import { Rules as RulesClient } from "./RulesClient";
import { usernamesIn } from "./usernames";

const getCachedUserId = async (username: string, siteUrl: string): Promise<number | null> => {
  "use cache";
  cacheLife({ stale: 36_000, revalidate: 86_400, expire: 604_800 });

  const info = await wdModule(siteUrl).getUserInfoByUsername(username);
  if (info === null) {
    return null;
  }
  return info.wikidotId;
};

export const Rules = async () => {
  await connection();
  const [rules, registerTable] = await Promise.all([getCachedPageHtml(rulesPage), getCachedPageHtml(registerPage)]);
  const html = rules.replace('<div id="register-table"></div>', registerTable);
  const entries = await Promise.all(
    usernamesIn(html).map(async (username) => {
      const wikidotId = await getCachedUserId(username, registerSite).catch(() => null);
      return [username, wikidotId] as const;
    }),
  );
  const userIds: Record<string, number> = {};
  for (const [username, wikidotId] of entries) {
    if (wikidotId !== null) {
      userIds[username] = wikidotId;
    }
  }

  return <RulesClient html={html} userIds={userIds} />;
};
