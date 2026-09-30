"use client";

import { useEffect, useRef } from "react";
import { useGetUserInfo } from "@/app/lib/hooks/useGetUserInfo";

import type { RefObject } from "react";

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

const usernameFromUserHref = (href: string): string => {
  return /\/user:info\/(?<username>[^/?#]+)/u.exec(href)?.groups?.username ?? "";
};

const usernamesIn = (html: string): string[] => {
  const names = new Set<string>();
  for (const match of html.matchAll(/href="\/user:info\/(?<username>[^"?#]+)"/gu)) {
    const username = match.groups?.username ?? "";
    if (username !== "") {
      names.add(username);
    }
  }
  return [...names];
};

const UserInfoLink = ({
  username,
  html,
  rootRef,
}: {
  username: string;
  html: string;
  rootRef: RefObject<HTMLDivElement | null>;
}) => {
  const userInfo = useGetUserInfo(username);

  useEffect(() => {
    const root = rootRef.current;
    if (root === null || html === "") {
      return;
    }

    for (const link of root.querySelectorAll<HTMLAnchorElement>("a.wj-user-info-link")) {
      const href = link.getAttribute("href") ?? "";
      if (usernameFromUserHref(href) === username) {
        if (href.startsWith("/")) {
          link.href = `https://www.wikidot.com/${href}`;
        }

        const avatar = link.querySelector<HTMLImageElement>("img.wj-user-info-avatar");
        if (userInfo !== null && avatar !== null) {
          avatar.src = `http://www.wikidot.com/avatar.php?userid=${userInfo.wikidotId}`;
        }
      }
    }
  }, [html, rootRef, userInfo, username]);

  return null;
};

export const Rules = ({ html }: { html: string }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const usernames = usernamesIn(html);

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
    <>
      {usernames.map((username) => (
        <UserInfoLink key={username} username={username} html={html} rootRef={rootRef} />
      ))}
      <div
        ref={rootRef}
        className="prose max-w-full text-white prose-invert"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
};
