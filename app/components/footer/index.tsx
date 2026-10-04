import { load as cheerLoad } from "cheerio";
import { getTranslations } from "next-intl/server";
import { connection } from "next/server";
import { Suspense } from "react";
import { Logo } from "@/app/components/logo";
import { getCachedPageHtml, rulesPage } from "@/app/lib/getCachedPageHtml";

import type { ReactNode } from "react";

export const Footer = () => (
  <div className="mt-4 flex w-full flex-col items-center justify-center gap-10 bg-dark-bg py-10 text-text-dark lg:flex-row lg:items-start lg:gap-40">
    <FooterLeft />
    <Suspense fallback={null}>
      <FooterRight />
    </Suspense>
  </div>
);

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

const sponsersIn = (html: string): string[] => {
  const dom = cheerLoad(html);
  const block = dom("div.sponser");
  block.find("br").replaceWith("\n");
  return block
    .text()
    .split("\n")
    .map((name) => name.trim())
    .filter((name) => name !== "");
};

const FooterRight = async () => {
  await connection();
  const t = await getTranslations("footer");
  const sponsers = sponsersIn(await getCachedPageHtml(rulesPage));
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
