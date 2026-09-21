import { getTranslations } from "next-intl/server";
import { cacheLife } from "next/cache";
import { getSourceFtml } from "@/app/lib/getSourceFtml";
import { SideBar as SideBarClient } from "./SideBarClient";

export const SideBar = async () => {
  const t = await getTranslations();
  return <SideBarCache siteUrl={t("siteUrl")} />;
};

const SideBarCache = async ({ siteUrl }: { siteUrl: string }) => {
  "use cache";
  cacheLife("days");
  const sideNavFtml: string = await getSourceFtml("nav:side", siteUrl);
  return <SideBarClient sideNavFtml={sideNavFtml} />;
};
