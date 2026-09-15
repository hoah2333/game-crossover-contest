import SteamLogo from "@/public/steam-logo.svg";

import { getTranslations } from "next-intl/server";

export const Logo = async () => {
  const t = await getTranslations();
  return (
    <a className="flex items-center gap-2" href={t("siteUrl")} target="_top">
      <div className="size-16">
        <SteamLogo />
      </div>
      <div className="text-white">
        <div className="text-2xl font-bold">{t("scp.name")}</div>
        <div className="text-sm font-bold tracking-wide">{t("scp.desciption")}</div>
      </div>
    </a>
  );
};
