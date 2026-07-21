import zhCN from "@/translation/zh-CN.json";

import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { match } from "ts-pattern";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  const messages = match(locale)
    .with("zh-CN", () => zhCN)
    .otherwise(() => zhCN);

  return { locale, messages };
});
