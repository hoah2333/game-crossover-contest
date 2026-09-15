import { getTranslations } from "next-intl/server";
import { Logo } from "@/app/components/logo";

import type { _Translator } from "next-intl";
import type { ReactNode } from "react";

export const Footer = async () => {
  const t = await getTranslations("footer");
  return (
    <div className="flex w-dvw justify-center gap-40 bg-dark-bg py-10 text-white">
      <FooterLeft t={t} />
      <FooterRight t={t} />
    </div>
  );
};

const FooterLeft = ({ t }: { t: _Translator }) => {
  return (
    <div className="max-w-70">
      <Logo />
      <div className="text-sm">{t.rich("license", { link: licenceLink })}</div>
    </div>
  );
};

const licenceLink = (chunks: ReactNode) => (
  <a
    className="hover:underline"
    href="http://creativecommons.org/licenses/by-sa/3.0/"
    target="_blank"
    rel="noopener noreferrer"
  >
    {chunks}
  </a>
);

const FooterRight = ({ t }: { t: _Translator }) => {
  return <div>{t("sponsers")}</div>;
};
