import { wdModule } from "@hoah2333/wikidot-lib";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useParseFtml } from "./useParseFtml";

export const useGetSourceHtml = (sourcePage: string) => {
  const [source, setSource] = useState<string>("");
  const t = useTranslations();

  useEffect((): void => {
    const scpcn = wdModule(t("siteUrl"));
    void scpcn.getSource(sourcePage).then((page: string): void => {
      setSource(page);
    });
  }, [sourcePage, t]);

  const sourceHtml: string = useParseFtml(source);

  return sourceHtml;
};
