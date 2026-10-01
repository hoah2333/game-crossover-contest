"use client";

import { useEffect, useRef } from "react";
import { usernameFromUserHref } from "./usernames";

const showTab = (event: Event) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  const tab = event.target.closest("wj-tabs-button");
  const panelId = tab?.getAttribute("aria-controls") ?? "";
  const tabs = tab?.closest("wj-tabs");
  if (!tab || !tabs || panelId === "") {
    return;
  }

  const panel = tabs.querySelector<HTMLElement>(`#${CSS.escape(panelId)}.wj-tabs-panel`);
  if (!panel) {
    return;
  }

  for (const button of tabs.querySelectorAll("wj-tabs-button")) {
    const selected = button === tab;
    button.setAttribute("aria-selected", String(selected));
    button.setAttribute("tabindex", selected ? "0" : "-1");
  }

  for (const item of tabs.querySelectorAll<HTMLElement>(".wj-tabs-panel")) {
    const selected = item === panel;
    item.hidden = !selected;
  }
};

const applyUserLinks = (root: HTMLElement, userIds: Record<string, number>) => {
  for (const link of root.querySelectorAll<HTMLAnchorElement>("a.wj-user-info-link")) {
    const href = link.getAttribute("href") ?? "";
    const username = usernameFromUserHref(href);
    if (username !== "") {
      if (href.startsWith("/")) {
        link.href = `https://www.wikidot.com/${href}`;
      }

      const wikidotId = userIds[username];
      const avatar = link.querySelector<HTMLImageElement>("img.wj-user-info-avatar");
      if (wikidotId !== undefined && avatar !== null) {
        avatar.src = `http://www.wikidot.com/avatar.php?userid=${wikidotId}`;
      }
    }
  }
};

export const Rules = ({ html, userIds }: { html: string; userIds: Record<string, number> }) => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (root !== null && html !== "") {
      applyUserLinks(root, userIds);
    }
  }, [html, userIds]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return () => {};
    }

    root.addEventListener("click", showTab);
    return () => {
      root.removeEventListener("click", showTab);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="prose max-w-full text-white prose-invert"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
