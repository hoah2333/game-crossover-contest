import "./rules.css";

import content from "./rules.ftml";

import { wdModule } from "@hoah2333/wikidot-lib";
import { cacheLife } from "next/cache";
import { parseFtml } from "@/app/lib/ftml";
import { getSourceFtml } from "@/app/lib/getSourceFtml";
import { Rules as RulesClient } from "./RulesClient";
import { usernamesIn } from "./usernames";

const registerPage = "fragment:2026-game-crossover-contest-register";
const registerSite = "https://scp-wiki-cn.wikidot.com";

const getRegisterTable = async () => {
  "use cache";
  cacheLife({ stale: 60, revalidate: 300, expire: 3600 });

  const registerFtml = await getSourceFtml(registerPage, registerSite);
  return parseFtml(registerFtml);
};

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
  const [rules, registerTable] = await Promise.all([parseFtml(content), getRegisterTable()]);
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
