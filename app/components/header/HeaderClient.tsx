"use client";

import clsx from "clsx";

import { ChevronDown, Search } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import { useParseFtml } from "@/app/lib/hooks/useParseFtml";
import { siteDomain } from "@/app/lib/siteDomain";
import { parseTopBar } from "./parseTopBar";

import type { JSX, KeyboardEvent } from "react";
import type { DataState } from "@/app/types";

interface TopBarItem {
  name: string;
  children: TopBarItemChild[];
}
interface TopBarItemChild {
  name: string;
  href: string;
}

export const Header = ({ cnTopNavFtml }: { cnTopNavFtml: string }): JSX.Element => {
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
        <TopBar hoveringItemState={[hoveringItem, setHoveringItem]} cnTopNavFtml={cnTopNavFtml} />
      </div>
    </div>
  );
};

const TopBar = ({
  hoveringItemState,
  cnTopNavFtml,
}: {
  hoveringItemState: DataState<number | null>;
  cnTopNavFtml: string;
}): JSX.Element => {
  const cnTopNavHtml = useParseFtml(cnTopNavFtml);
  const cnTopNav = parseTopBar(cnTopNavHtml);

  const [hoveringItem, setHoveringItem] = hoveringItemState;
  const contentRef = useRef<HTMLDivElement>(null);
  const [panelHeight, setPanelHeight] = useState(0);

  useLayoutEffect((): void => {
    if (hoveringItem === null) {
      setPanelHeight(0);
      return;
    }
    setPanelHeight(contentRef.current?.scrollHeight ?? 0);
  }, [hoveringItem, cnTopNav]);

  return (
    <>
      <div className="flex items-start justify-between">
        <div className="flex gap-4 text-sm">
          {cnTopNav.map(
            (item: TopBarItem, index: number): JSX.Element => (
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
            ),
          )}
        </div>
        <SearchBar />
      </div>
      <div className="overflow-hidden transition-[height] duration-300 ease-out" style={{ height: panelHeight }}>
        <div ref={contentRef} className="columns-4 py-2">
          {hoveringItem !== null &&
            cnTopNav[hoveringItem]?.children.map(
              (child: TopBarItemChild): JSX.Element => (
                <a
                  key={`top-bar-child-${child.name}`}
                  className="flex w-full px-2 py-2 transition-colors hover:bg-white/30"
                  href={child.href.startsWith("/") ? `${siteDomain}${child.href}` : child.href}
                  target="_blank"
                  tabIndex={hoveringItem === null ? -1 : undefined}
                >
                  {child.name}
                </a>
              ),
            )}
        </div>
      </div>
    </>
  );
};

const SearchBar = () => {
  return (
    <div className="my-1 flex text-sm">
      <input
        className="w-80 border border-border-1 bg-dark-bg-2 p-2 placeholder:italic focus-within:border-blue-1 focus-visible:outline-none"
        name="search-bar"
        placeholder="搜索"
      />
      <button
        className="group flex cursor-pointer items-center bg-blue-1 p-2 transition-colors hover:bg-blue-2"
        onClick={() => {
          window.open(`${siteDomain}/search:crom`, "_blank", "noopener, noreferrer");
        }}
      >
        <Search className="transition-[scale] group-hover:scale-120" size="24" />
      </button>
    </div>
  );
};
