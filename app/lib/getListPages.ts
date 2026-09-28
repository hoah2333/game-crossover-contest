import { wdModule } from "@hoah2333/wikidot-lib";
import { getTranslations } from "next-intl/server";

import type { AjaxResponse } from "@hoah2333/wikidot-lib";

export const getListpages = async (
  params: Record<string, string>,
): Promise<Pick<AjaxResponse, "status" | "body">> => {
  const t = await getTranslations();
  const { status, body } = await wdModule(t("siteUrl")).getListpages(params);
  return { status, body };
};
