"use client";

import { clsx } from "clsx";
import { ChevronDown, Search, Star, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLayoutEffect, useRef, useState } from "react";
import { useReadingList } from "@/app/lib/hooks/useReadingList";

import type { JSX, KeyboardEvent } from "react";
import type { DataState } from "@/app/types";
import type { TopBarItem, TopBarItemChild, TopBar as TopBarType } from "./types";

export const Header = ({ topNav, mobileTopNav }: { topNav: TopBarType; mobileTopNav: TopBarType }): JSX.Element => {
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
        <div className="max-[580px]:hidden">
          <TopBar hoveringItemState={[hoveringItem, setHoveringItem]} topNav={topNav} />
        </div>
        <div className="min-[580px]:hidden">
          <TopBar hoveringItemState={[hoveringItem, setHoveringItem]} topNav={mobileTopNav} />
        </div>
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
      <div className="flex flex-col items-end justify-between px-1 lg:flex-row lg:items-start">
        <div className="flex flex-wrap gap-x-2 pl-1 text-sm lg:gap-x-4 xl:pl-0">
          {topNav.map((item: TopBarItem, index: number): JSX.Element => (
            <button
              key={`top-bar-item-${item.name}`}
              className={clsx(
                hoveringItem === index ? "text-blue-1" : "text-white",
                "group relative flex cursor-pointer items-center gap-1 py-3 transition-colors",
              )}
              onClick={(): void => {
                setHoveringItem((i) => (i === index ? null : index));
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
              <ChevronDown size="14" className="hidden transition-transform group-hover:translate-y-1 xs:block" />
            </button>
          ))}
        </div>
        <div className="flex w-full flex-1 flex-col justify-end gap-2 md:w-auto md:flex-row">
          <SearchBar />
          <ReadingList />
        </div>
      </div>
      <div
        className={clsx(
          "absolute top-full left-0 w-full overflow-hidden bg-dark-bg transition-[height] duration-300 ease-out",
          panelHeight === 0 ? "pointer-events-none" : "pointer-events-auto",
        )}
        style={{ height: panelHeight }}
      >
        <div ref={contentRef} className="mx-auto w-full max-w-pc columns-1 py-2 sm:columns-4">
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
    <div className="my-1 flex shrink-0 justify-end text-sm">
      <input
        className="w-full max-w-80 border border-border-1 bg-dark-bg-2 p-2 placeholder:italic focus-within:border-blue-1 focus-visible:outline-none"
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
    <div className="flex shrink-0 justify-end">
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
