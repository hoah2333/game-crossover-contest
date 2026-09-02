import { load as cheerLoad } from "cheerio";
import { match } from "ts-pattern";

import type { CheerioAPI } from "cheerio";
import type { Element } from "domhandler";
import type { SideBar, SideBarBlock, SideBarRow } from "./types";

export const parseSideBar = (sideNav: string): SideBar => {
  const navDom: CheerioAPI = cheerLoad(sideNav);

  const sideBlocks: SideBarBlock[] = navDom("div.side-block")
    .map((_, sideBlockElement: Element): SideBarBlock => {
      const classes = navDom(sideBlockElement).attr("class")?.split(" ") ?? [];
      const type: "media" | "license" | "nav" = match(classes)
        .returnType<"media" | "license" | "nav">()
        .with(["side-block", "media"], () => "media")
        .with(["side-block", "license"], () => "license")
        .otherwise(() => "nav");

      return match(type)
        .returnType<SideBarBlock>()
        .with("media", () => ({
          type: "media",
          heading: navDom(sideBlockElement).find("div.heading").text(),
          links: navDom(sideBlockElement)
            .find("div.wj-image-container a")
            .map((__, a: Element) => ({
              src: navDom(a).find("img").attr("src") ?? "",
              href: navDom(a).attr("href") ?? "",
            }))
            .toArray(),
        }))
        .with("license", () => ({
          type: "license",
          src: navDom(sideBlockElement).find("div.wj-image-container a").find("img").attr("src") ?? "",
          href: navDom(sideBlockElement).find("div.wj-image-container a").attr("href") ?? "",
          text: navDom(sideBlockElement).find("span[style*='font-size']").text(),
          links: navDom(sideBlockElement)
            .find("span[style*='font-size'] a")
            .map((__, a: Element) => ({ name: navDom(a).text(), href: navDom(a).attr("href") ?? "" }))
            .toArray(),
        }))
        .otherwise(() => ({
          type: "nav",
          rows: navDom(sideBlockElement)
            .find("div")
            .map((__, div: Element) => {
              const divType = match(navDom(div).attr("class")?.split(" ") ?? [])
                .with(["heading"], () => "heading")
                .with(["wj-collapsible"], () => "collapsible")
                .with(["menu-item"], () => "item")
                .otherwise(() => "");

              return match(divType)
                .returnType<SideBarRow | null>()
                .with("heading", () => ({ type: "heading", name: navDom(div).text() }))
                .with("collapsible", () => ({
                  type: "heading",
                  name: navDom(div).find("details.wj-collapsible span.wj-collapsible-hide-text").text(),
                }))
                .with("item", () => ({
                  type: "item",
                  links: navDom(div)
                    .find("a")
                    .map((___, a: Element) => ({ name: navDom(a).text(), href: navDom(a).attr("href") ?? "" }))
                    .toArray(),
                }))
                .otherwise(() => null);
            })
            .toArray()
            .filter((row): row is SideBarRow => row !== null),

          collapsible:
            navDom(sideBlockElement).find("details.wj-collapsible").length > 0
              ? {
                  show: navDom(sideBlockElement)
                    .find("details.wj-collapsible span.wj-collapsible-show-text")
                    .text(),
                  hide: navDom(sideBlockElement)
                    .find("details.wj-collapsible span.wj-collapsible-hide-text")
                    .text(),
                }
              : false,
        }));
    })
    .toArray();

  return sideBlocks;
};
