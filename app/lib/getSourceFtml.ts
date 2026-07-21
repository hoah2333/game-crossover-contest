import { wdModule } from "@hoah2333/wikidot-lib";
import { getTranslations } from "next-intl/server";

export const getSourceFtml = async (sourcePage: string): Promise<string> => {
  const t = await getTranslations();
  const source = await wdModule(t("siteUrl")).getSource(sourcePage);
  return source;
};
