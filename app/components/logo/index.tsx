import SteamLogo from "@/public/steam-logo.svg";

import { getTranslations } from "next-intl/server";

export const Logo = async () => {
  const t = await getTranslations("scp");
  const url = await getTranslations();
  return (
    <a className="flex items-center gap-2" href={url("siteUrl")} target="_top">
      <div className="h-16 w-16">
        <SteamLogo />
      </div>
      <div className="text-white">
        <div className="text-2xl font-bold">{t("name")}</div>
        <div className="text-sm font-bold tracking-wide">{t("desciption")}</div>
      </div>
    </a>
  );
};
