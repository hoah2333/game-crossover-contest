import Image from "next/image";

import { clsx } from "clsx";
import { getTranslations } from "next-intl/server";

export const Logo = async ({ className }: { className?: string }) => {
  const t = await getTranslations();
  return (
    <a className={clsx("flex items-center gap-2", className)} href={t("siteUrl")} target="_top">
      <div className="size-16">
        <Image src="/logo.png" alt="logo" width={64} height={64} />
      </div>
      <div>
        <div className="text-2xl font-bold">{t("scp.name")}</div>
        <div className="text-sm font-bold tracking-wide">{t("scp.desciption")}</div>
      </div>
    </a>
  );
};
