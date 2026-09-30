import { wdModule } from "@hoah2333/wikidot-lib";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useParseFtml } from "./useParseFtml";

export const useGetSourceHtml = (sourcePage: string, sourceSite = "") => {
  const [source, setSource] = useState<string>("");
  const t = useTranslations();

  useEffect((): void => {
    const site = wdModule(sourceSite === "" ? t("siteUrl") : sourceSite);
    void site.getSource(sourcePage).then((page: string): void => {
      setSource(page);
    });
  }, [sourcePage, sourceSite, t]);

  const sourceHtml: string = useParseFtml(source);

  return sourceHtml;
};
