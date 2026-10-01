import "./rules.css";

import content from "./rules.ftml";

import { cacheLife } from "next/cache";
import { parseFtml } from "@/app/lib/ftml";
import { getSourceFtml } from "@/app/lib/getSourceFtml";
import { Rules as RulesClient } from "./RulesClient";

const registerPage = "fragment:2026-game-crossover-contest-register";
const registerSite = "https://scp-wiki-cn.wikidot.com";

const getRegisterTable = async () => {
  "use cache";
  cacheLife({ stale: 60, revalidate: 300, expire: 3600 });

  const registerFtml = await getSourceFtml(registerPage, registerSite);
  return parseFtml(registerFtml);
};

export const Rules = async () => {
  const [rules, registerTable] = await Promise.all([parseFtml(content), getRegisterTable()]);
  const html = rules.replace('<div id="register-table"></div>', registerTable);

  return <RulesClient html={html} />;
};
