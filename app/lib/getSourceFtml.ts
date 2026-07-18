import { wdModule } from "@hoah2333/wikidot-lib";

const siteDomain = "https://scp-wiki-cn.wikidot.com";

export const getSourceFtml = async (sourcePage: string): Promise<string> => {
  const source = await wdModule(siteDomain).getSource(sourcePage);
  return source;
};
