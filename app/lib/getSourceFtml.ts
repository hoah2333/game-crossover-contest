import { wdModule } from "@hoah2333/wikidot-lib";

export const getSourceFtml = (sourcePage: string, siteUrl: string): Promise<string> => {
  const source = wdModule(siteUrl).getSource(sourcePage);
  return source;
};
