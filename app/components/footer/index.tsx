import { getTranslations } from "next-intl/server";
import { Logo } from "@/app/components/logo";

import type { ReactNode } from "react";

export const Footer = () => {
  return (
    <div className="mt-4 flex w-full flex-col items-center justify-center gap-10 bg-dark-bg py-10 text-text-dark lg:flex-row lg:items-start lg:gap-40">
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
      <div className="mt-2 text-sm">{t.rich("license", { link: licenceLink })}</div>
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
  const sponsers = [
    "SisterTan_Greasy",
    "Kcorena",
    "ColorlessL",
    "four_clovers",
    "woodenwolf",
    "Penrose Sowhat",
    "DOG_Momizi",
    "HiloHiroa",
    "Zhong XY",
    "HERE IS A BUTTERFLY",
  ] as const;
  return (
    <div className="flex flex-col gap-2">
      <div>{t("sponsers")}</div>
      <div className="columns-2 sm:columns-4">
        {sponsers.map((sponser) => (
          <a
            className="block hover:underline"
            href={`https://www.wikidot.com/user:info/${sponser.toLowerCase().replaceAll(/ |_/gv, "-")}`}
            target="_blank"
            rel="noopener noreferrer"
            key={sponser}
          >
            {sponser}
          </a>
        ))}
      </div>
    </div>
  );
};
