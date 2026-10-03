import { cacheLife } from "next/cache";
import { parseFtml } from "@/app/lib/ftml";
import { getSourceFtml } from "@/app/lib/getSourceFtml";

export const registerPage = "fragment:2026-game-crossover-contest-register";
export const registerSite = "https://scp-wiki-cn.wikidot.com";
export const rulesPage = "fragment:2026-game-crossover-contest-rules";

export const getCachedPageHtml = async (page: string) => {
  "use cache";
  cacheLife({ stale: 60, revalidate: 300, expire: 3600 });

  const ftml = await getSourceFtml(page, registerSite);
  return parseFtml(ftml);
};
