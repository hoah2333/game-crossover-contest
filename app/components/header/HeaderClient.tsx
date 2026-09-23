"use client";

import { clsx } from "clsx";
import { ChevronDown, Search, Star, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLayoutEffect, useRef, useState } from "react";
import { useReadingList } from "@/app/lib/hooks/useReadingList";

import type { JSX, KeyboardEvent } from "react";
import type { DataState } from "@/app/types";
import type { TopBarItem, TopBarItemChild, TopBar as TopBarType } from "./types";

export const Header = ({ topNav }: { topNav: TopBarType }): JSX.Element => {
  const [hoveringItem, setHoveringItem] = useState<number | null>(null);

  return (
    <div
      className="sticky top-0 z-10 w-full max-w-none bg-dark-bg"
      onBlur={(event) => {
        if (event.currentTarget.contains(event.relatedTarget)) {
          return;
        }
        setHoveringItem(null);
      }}
    >
      <div className="mx-auto w-full max-w-pc text-white">
        <TopBar hoveringItemState={[hoveringItem, setHoveringItem]} topNav={topNav} />
      </div>
    </div>
  );
};

const TopBar = ({
  hoveringItemState,
  topNav,
}: {
  hoveringItemState: DataState<number | null>;
  topNav: TopBarType;
}): JSX.Element => {
  const [hoveringItem, setHoveringItem] = hoveringItemState;
  const contentRef = useRef<HTMLDivElement>(null);
  const [measuredHeight, setMeasuredHeight] = useState(0);
  const panelHeight = hoveringItem === null ? 0 : measuredHeight;

  const t = useTranslations();

  useLayoutEffect((): void => {
    if (hoveringItem === null) {
      return;
    }
    setMeasuredHeight(contentRef.current?.scrollHeight ?? 0);
  }, [hoveringItem]);

  return (
    <>
      <div className="flex items-start justify-between">
        <div className="flex gap-4 text-sm">
          {topNav.map((item: TopBarItem, index: number): JSX.Element => (
            <button
              key={`top-bar-item-${item.name}`}
              className={clsx(
                hoveringItem === index ? "text-blue-1" : "text-white",
                "group relative flex cursor-pointer items-center gap-1 py-3 transition-colors",
              )}
              onClick={(): void => {
                setHoveringItem(index);
              }}
              tabIndex={0}
              onKeyDown={(event: KeyboardEvent<HTMLButtonElement>): void => {
                if (event.key === "Enter" || event.key === " ") {
                  setHoveringItem(index);
                }
              }}
            >
              <span className="relative whitespace-nowrap">
                {item.name}
                <span
                  className={clsx(
                    "absolute -bottom-1 h-1 bg-blue-1 transition-all duration-200",
                    hoveringItem === index ? "left-0 w-full" : "left-1/2 w-0",
                  )}
                />
              </span>
              <ChevronDown size="14" className="transition-transform group-hover:translate-y-1" />
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <SearchBar />
          <ReadingList />
        </div>
      </div>
      <div className="overflow-hidden transition-[height] duration-300 ease-out" style={{ height: panelHeight }}>
        <div ref={contentRef} className="columns-4 py-2">
          {hoveringItem !== null &&
            topNav[hoveringItem]?.children.map((child: TopBarItemChild): JSX.Element => (
              <a
                key={`top-bar-child-${child.name}`}
                className="flex w-full px-2 py-2 transition-colors hover:bg-white/30"
                href={child.href.startsWith("/") ? `${t("siteUrl")}${child.href}` : child.href}
                target="_blank"
                tabIndex={hoveringItem === null ? -1 : undefined}
              >
                {child.name}
              </a>
            ))}
        </div>
      </div>
    </>
  );
};

const SearchBar = () => {
  const t = useTranslations();
  return (
    <div className="my-1 flex text-sm">
      <input
        className="w-80 border border-border-1 bg-dark-bg-2 p-2 placeholder:italic focus-within:border-blue-1 focus-visible:outline-none"
        name="search-bar"
        placeholder={t("searchBar.search")}
      />
      <button
        className="group flex cursor-pointer items-center bg-blue-1 p-2 transition-colors hover:bg-blue-2"
        onClick={() => {
          window.open(`${t("siteUrl")}/search:crom`, "_blank", "noopener, noreferrer");
        }}
      >
        <Search className="transition-[scale] group-hover:scale-120" size="24" />
      </button>
    </div>
  );
};

const ReadingList = () => {
  const t = useTranslations();
  const { readingList, removeFromReadingList } = useReadingList();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button
        className="flex cursor-pointer items-center gap-1 px-2 py-3 transition-colors hover:bg-white/20"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <Star /> {t("readingList.readingList")} ({readingList.length})
      </button>
      {isOpen && (
        <div className="fixed top-12 right-0 w-max max-w-100 bg-dark-bg px-4 py-2 opacity-100 transition-opacity starting:opacity-0">
          <div className="text-center text-lg text-blue-3">{t("readingList.readingList")}</div>
          {readingList.length === 0 && <div>{t("readingList.empty")}</div>}
          {readingList.map((item) => (
            <div
              className="flex h-auto items-center justify-between gap-10 overflow-hidden transition-[height] [interpolate-size:allow-keywords] starting:h-0"
              key={item.slug}
            >
              <a
                className="hover:underline"
                href={`${t("siteUrl")}/${item.slug}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.title}
              </a>
              <button
                className="cursor-pointer"
                onClick={() => {
                  removeFromReadingList(item.slug);
                }}
              >
                <X size="16" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
