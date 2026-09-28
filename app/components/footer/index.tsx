import { getTranslations } from "next-intl/server";
import { Logo } from "@/app/components/logo";

import type { ReactNode } from "react";

export const Footer = () => {
  return (
    <div className="mt-4 flex w-full justify-center gap-40 bg-dark-bg py-10 text-text-dark">
      <FooterLeft />
      <FooterRight />
    </div>
  );
};

const FooterLeft = async () => {
  const t = await getTranslations("footer");
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

const FooterRight = async () => {
  const t = await getTranslations("footer");
  return <div>{t("sponsers")}</div>;
};
