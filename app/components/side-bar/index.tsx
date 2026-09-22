import { getTranslations } from "next-intl/server";
import { cacheLife } from "next/cache";
import { parseFtml } from "@/app/lib/ftml";
import { getSourceFtml } from "@/app/lib/getSourceFtml";
import { parseSideBar } from "./parseSideBar";
import { SideBar as SideBarClient } from "./SideBarClient";

export const SideBar = async () => {
  const t = await getTranslations();
  return <SideBarCache siteUrl={t("siteUrl")} />;
};

const SideBarCache = async ({ siteUrl }: { siteUrl: string }) => {
  "use cache";
  cacheLife("days");
  const sideNavFtml: string = await getSourceFtml("nav:side", siteUrl);
  const sideNavHtml = await parseFtml(sideNavFtml);
  const sideNav = parseSideBar(sideNavHtml);
  return <SideBarClient sideNav={sideNav} />;
};
