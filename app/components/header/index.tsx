import { getTranslations } from "next-intl/server";
import { cacheLife } from "next/cache";
import { getSourceFtml } from "@/app/lib/getSourceFtml";
import { Header as HeaderClient } from "./HeaderClient";

export const Header = async () => {
  const t = await getTranslations();
  return <HeaderCache siteUrl={t("siteUrl")} />;
};

const HeaderCache = async ({ siteUrl }: { siteUrl: string }) => {
  "use cache";
  cacheLife("days");
  const topNavFtml: string = await getSourceFtml("nav:top", siteUrl);
  return <HeaderClient topNavFtml={topNavFtml} />;
};
