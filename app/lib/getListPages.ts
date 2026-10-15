import { wdModule } from "@hoah2333/wikidot-lib";
import { getTranslations } from "next-intl/server";

import type { AjaxResponse } from "@hoah2333/wikidot-lib";

export const getListpages = async (
  params: Record<string, string>,
  siteUrl?: string,
): Promise<Pick<AjaxResponse, "status" | "body">> => {
  const url = siteUrl ?? (await getTranslations())("siteUrl");
  const { status, body } = await wdModule(url).getListpages(params);
  return { status, body };
};
