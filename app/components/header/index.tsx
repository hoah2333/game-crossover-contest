import { getTranslations } from "next-intl/server";
import { cacheLife } from "next/cache";
import { parseFtml } from "@/app/lib/ftml";
import { getSourceFtml } from "@/app/lib/getSourceFtml";
import { Header as HeaderClient } from "./HeaderClient";
import { parseMobileTopBar, parseTopBar } from "./parseTopBar";

export const Header = async () => {
  const t = await getTranslations();
  return <HeaderCache siteUrl={t("siteUrl")} />;
};

const HeaderCache = async ({ siteUrl }: { siteUrl: string }) => {
  "use cache";
  cacheLife("days");
  const topNavFtml: string = await getSourceFtml("nav:top", siteUrl);
  const topNavHtml = await parseFtml(topNavFtml);
  const topNav = parseTopBar(topNavHtml);
  const mobileTopNav = parseMobileTopBar(topNavHtml);
  return <HeaderClient topNav={topNav} mobileTopNav={mobileTopNav} />;
};
