import "./rules.css";

import { connection } from "next/server";
import { parseFtml } from "@/app/lib/ftml";
import { getSourceFtml } from "@/app/lib/getSourceFtml";
import { Rules as RulesClient } from "./RulesClient";
import content from "./rules.ftml";

const registerPage = "scp-9785";
const registerSite = "https://hoah-lab.wikidot.com";

export const Rules = async () => {
  await connection();
  const [rules, registerFtml] = await Promise.all([
    parseFtml(content),
    getSourceFtml(registerPage, registerSite),
  ]);
  const registerTable = await parseFtml(registerFtml);
  const html = rules.replace('<div id="register-table"></div>', registerTable);

  return <RulesClient html={html} />;
};
