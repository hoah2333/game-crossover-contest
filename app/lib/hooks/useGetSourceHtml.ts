import { wdModule } from "@hoah2333/wikidot-lib";
import { useEffect, useState } from "react";
import { useParseFtml } from "./useParseFtml";

const siteDomain = "https://scp-wiki-cn.wikidot.com";

export const useGetSourceHtml = (sourcePage: string) => {
  const [source, setSource] = useState<string>("");

  useEffect((): void => {
    const scpcn = wdModule(siteDomain);
    void scpcn.getSource(sourcePage).then((page: string): void => {
      setSource(page);
    });
  }, [sourcePage]);

  const sourceHtml: string = useParseFtml(source);

  return sourceHtml;
};
