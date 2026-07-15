import { load as cheerLoad } from "cheerio";

import type { CheerioAPI } from "cheerio";
import type { Element } from "domhandler";
import type { TopBarItem, TopBarItemChild } from "./types";

export const parseTopBar = (topNav: string): TopBarItem[] => {
  const navDom: CheerioAPI = cheerLoad(topNav);
  if (navDom("div.top-bar").length === 0) {
    return [];
  }
  const topBarItems: TopBarItem[] = navDom("div.top-bar > ul > li")
    .map(
      (_, liElement: Element): TopBarItem => ({
        name: navDom(liElement).text(),
        children: navDom(liElement)
          .next()
          .find("li")
          .map(
            (__, innerLiElement: Element): TopBarItemChild => ({
              name: navDom(innerLiElement).text(),
              href: navDom(innerLiElement).find("a").attr("href") ?? "",
            }),
          )
          .toArray(),
      }),
    )
    .toArray();
  return topBarItems;
};
