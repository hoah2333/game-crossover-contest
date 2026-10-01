import "./rules.css";

import content from "./rules.ftml";

import { connection } from "next/server";
import { parseFtml } from "@/app/lib/ftml";
import { getSourceFtml } from "@/app/lib/getSourceFtml";
import { Rules as RulesClient } from "./RulesClient";

const registerPage = "fragment:2026-game-crossover-contest-register";
const registerSite = "https://scp-wiki-cn.wikidot.com";

export const Rules = async () => {
  await connection();
  const [rules, registerFtml] = await Promise.all([parseFtml(content), getSourceFtml(registerPage, registerSite)]);
  const registerTable = await parseFtml(registerFtml);
  const html = rules.replace('<div id="register-table"></div>', registerTable);

  return <RulesClient html={html} />;
};
