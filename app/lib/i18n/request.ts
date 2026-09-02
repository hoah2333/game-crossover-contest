import zhCN from "@/translation/zh-CN.json";

import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { locale } from "next/root-params";
import { match } from "ts-pattern";
import { routing } from "./routing";

export default getRequestConfig(async () => {
  const paramValue = await locale();
  if (!hasLocale(routing.locales, paramValue)) {
    notFound();
  }

  const messages = match(locale)
    .with("zh-CN", () => zhCN)
    .otherwise(() => zhCN);

  return { locale: paramValue, messages };
});
